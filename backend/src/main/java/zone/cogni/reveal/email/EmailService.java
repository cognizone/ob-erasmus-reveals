package zone.cogni.reveal.email;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.util.UriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import zone.cogni.reveal.model.FeedbackModel;
import zone.cogni.reveal.model.SignInModel;
import zone.cogni.reveal.model.SignupModel;

import javax.activation.DataHandler;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;

@RequiredArgsConstructor
@Slf4j
public class EmailService {
  private final TemplateEngine templateEngine;
  private final EmailProperties emailProperties;

  public void sendFeedbackMail(FeedbackModel feedbackModel, String baseUrl) {
    String subject = emailProperties.getSubject(feedbackModel.getLanguage());
    feedbackModel.getEmails().forEach(email -> {
      try {
        sendEmail(email, subject, feedbackModel.getTemplate(), getContextForFeedback(email, feedbackModel, baseUrl));
      }
      catch (Exception e) {
        log.error("Failed to send email to {}, with subject {}", email, subject);
      }
      log.info("Message sent with email to {}, subject {}", email, subject);
    });
  }

  public void sendSignupMail(SignupModel signupModel, String baseUrl) throws MessagingException, UnsupportedEncodingException {
    String subject = emailProperties.getSubject(signupModel.getLanguage());
    sendEmail(signupModel.getEmail(), subject, signupModel.getTemplate(), getContextForSignup(signupModel.getEmail(), baseUrl));
    log.info("Message sent with email to {}, subject {}", signupModel.getEmail(), subject);
  }

  public void sendSignInMail(SignInModel signInModel, String baseUrl) throws MessagingException, UnsupportedEncodingException {
    String subject = emailProperties.getSubject(signInModel.getLanguage());
    sendEmail(signInModel.getEmail(), subject, signInModel.getTemplate(), getContextForSignIn(signInModel, baseUrl));
    log.info("Message sent with email to {}, subject {}", signInModel.getEmail(), subject);
  }

  private void sendEmail(String email, String subject, String templateName, Context context) throws MessagingException, UnsupportedEncodingException {
    Session session = initSession();

    log.info("Sending email to {}, subject {}", email, subject);

    String body = templateEngine.process(templateName, context);
    Message mimeMessage = setMimeMessage(session, email, subject);
    // first part adding the html template
    Multipart multipart = addHtmlTemplate(body);
    // second part adding the inline image
    addLogo(multipart);
    // put everything together
    mimeMessage.setContent(multipart);
    // send message
    Transport.send(mimeMessage);
  }

  private Session initSession() {
    Authenticator auth = new Authenticator() {
      @Override
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(emailProperties.getFromEmail(), emailProperties.getPassword());
      }
    };
    return Session.getInstance(initProperties(), auth);
  }

  private Properties initProperties() {
    Properties properties = new Properties();
    EmailProperties.Smtp smtp = emailProperties.getSmtp();
    properties.put("mail.smtp.host", smtp.getHost());
    properties.put("mail.smtp.port", smtp.getPort());
    // optional properties
    if (StringUtils.isNotBlank(smtp.getAuth())) {
      properties.put("mail.smtp.auth", smtp.getAuth());
    }
    if (null != smtp.getStarttls() && StringUtils.isNotBlank(smtp.getStarttls().getEnable())) {
      properties.put("mail.smtp.starttls.enable", smtp.getStarttls().getEnable());
    }
    if (null != smtp.getSocketFactory() && StringUtils.isNotBlank(smtp.getSocketFactory().getClazz())) {
      properties.put("mail.smtp.socketFactory.class", smtp.getSocketFactory().getClazz());
    }
    log.info(emailProperties.toString());
    return properties;
  }

  private Message setMimeMessage(Session session, String email, String subject) throws MessagingException, UnsupportedEncodingException {
    Message mimeMessage = new MimeMessage(session);
    mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
    mimeMessage.setSubject(subject);
    mimeMessage.setFrom(new InternetAddress(emailProperties.getFromAddress(), emailProperties.getFromDescription()));
    mimeMessage.setReplyTo(InternetAddress.parse(emailProperties.getFromAddress(), false));
    mimeMessage.setSentDate(new Date());
    mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email, false));
    return mimeMessage;
  }

  private MimeMultipart addHtmlTemplate(String body) throws MessagingException {
    // adds an inline image with a content id , in this case it is adding the logo
    MimeMultipart multipart = new MimeMultipart("related");
    BodyPart messageBodyPartHtml = new MimeBodyPart();
    messageBodyPartHtml.setContent(body, "text/html; charset=UTF-8");
    multipart.addBodyPart(messageBodyPartHtml);
    return multipart;
  }

  @SneakyThrows
  private void addLogo(Multipart multipart) {
    BodyPart messageBodyPartImage = new MimeBodyPart();
    InputStream logoStream = new ClassPathResource("static/img/reveals_logo.png").getInputStream();
    ByteArrayDataSource ds = new ByteArrayDataSource(logoStream, "image/png");

    messageBodyPartImage.setDataHandler(new DataHandler(ds));
    messageBodyPartImage.setHeader("Content-ID", "<logo>");
    multipart.addBodyPart(messageBodyPartImage);
  }

  private Context getContextForFeedback(String email, FeedbackModel feedbackModel, String baseUrl) {
    String url = UriComponentsBuilder
      .fromHttpUrl(baseUrl)
      .path("/endorse-skills")
      .queryParam("feedbackRequestId", feedbackModel.getId())
      .queryParam("email", email)
      .build()
      .toUriString();
    Context context = initContext(url);
    context.setVariable("user", feedbackModel.fullName());
    context.setVariable("message", feedbackModel.getMessage());
    return context;
  }

  private Context getContextForSignup(String email, String baseUrl) {
    String url = UriComponentsBuilder
      .fromHttpUrl(baseUrl)
      .path("/complete-profile")
      .queryParam("email", email)
      .build()
      .toUriString();
    return initContext(url);
  }

  private Context getContextForSignIn(SignInModel signInModel, String baseUrl) throws UnsupportedEncodingException {
    String url = UriComponentsBuilder
      .fromHttpUrl(baseUrl)
      .path("/profile")
      .path("/" + URLEncoder.encode(signInModel.getEmail(), StandardCharsets.UTF_8.toString()))
      .path("/token")
      .path("/" + UUID.randomUUID())
      .build()
      .toUriString();
    return initContext(url);
  }

  private Context initContext(String url) {
    Context context = new Context();
    context.setVariable("url", url);
    context.setVariable("imageName", "logo");
    return context;
  }

}

