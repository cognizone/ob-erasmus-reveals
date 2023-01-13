package zone.cogni.reveal.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.util.UriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import zone.cogni.reveal.model.FeedbackModel;
import zone.cogni.reveal.model.SignupModel;

import javax.activation.DataHandler;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

@RequiredArgsConstructor
@Slf4j
public class EmailService {
  private final TemplateEngine templateEngine;
  private final EmailProperties emailProperties;

  public void sendFeedbackMail(FeedbackModel feedbackModel, HttpServletRequest request) {
    String subject = emailProperties.getSubject(feedbackModel.getLanguage());
    feedbackModel.getEmails().forEach(email -> {
      try {
        sendMessage(email, subject, feedbackModel.getTemplate(), getContextForFeedback(email, feedbackModel, request));
        log.info("Message sent with email to {}, subject {}", email, subject);
      }
      catch (Exception e) {
        log.error("Failed to send email to {}, subject {} - {}", email, subject, e);
      }
    });
  }

  public void sendSignupMail(SignupModel signupModel, HttpServletRequest request) {
    String subject = emailProperties.getSubject(signupModel.getLanguage());
    try {
      sendMessage(signupModel.getEmail(), subject, signupModel.getTemplate(), getContextForSignup(signupModel.getEmail(), request));
      log.info("Message sent with email to {}, subject {}", signupModel.getEmail(), subject);
    }
    catch (Exception e) {
      log.error("Failed to send email to {}, subject {} - {}", signupModel.getEmail(), subject, e);
    }
  }

  private void sendMessage(String email, String subject, String templateName, Context context) throws MessagingException, IOException {
    Properties props = new Properties();
    props.put("mail.smtp.host", emailProperties.getSmtp().getHost());
    props.put("mail.smtp.port", emailProperties.getSmtp().getPort());
    props.put("mail.smtp.auth", emailProperties.getSmtp().getAuth());
    props.put("mail.smtp.starttls.enable", emailProperties.getSmtp().getStarttls().isEnable());
    props.put("mail.smtp.socketFactory.class", emailProperties.getSmtp().getSocketFactory().getClazz());

    log.info(emailProperties.getSmtp().toString());

    Authenticator auth = new Authenticator() {
      @Override
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(emailProperties.getFromEmail(), emailProperties.getPassword());
      }
    };

    Session session = Session.getInstance(props, auth);

    sendEmail(session, email, subject, templateName, context);
  }

  public void sendEmail(Session session, String email, String subject, String templateName, Context context) throws IOException, MessagingException {
    log.info("Sending email to {}, subject {}", email, subject);

    String body = templateEngine.process(templateName, context);
    Message mimeMessage = new MimeMessage(session);
    setMimeMessage(mimeMessage, email, subject);

    // adds an inline image with a content id , in this case it is adding the logo
    MimeMultipart multipart = new MimeMultipart("related");
    // first part adding the html template
    BodyPart messageBodyPartHtml = new MimeBodyPart();
    messageBodyPartHtml.setContent(body, "text/html; charset=UTF-8");
    multipart.addBodyPart(messageBodyPartHtml);

    // second part adding the inline image
    BodyPart messageBodyPartImage = new MimeBodyPart();
    InputStream logoStream = new ClassPathResource("static/img/reveals_logo.png").getInputStream();
    ByteArrayDataSource ds = new ByteArrayDataSource(logoStream, "image/jpg");

    messageBodyPartImage.setDataHandler(new DataHandler(ds));
    messageBodyPartImage.setHeader("Content-ID", "<logo>");
    multipart.addBodyPart(messageBodyPartImage);

    // put everything together
    mimeMessage.setContent(multipart);
    // send message
    Transport.send(mimeMessage);
  }

  private Message setMimeMessage(Message mimeMessage, String email, String subject) throws MessagingException,
    UnsupportedEncodingException {
    mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
    mimeMessage.setSubject(subject);
    mimeMessage.setFrom(new InternetAddress(emailProperties.getFromAddress(), emailProperties.getFromDescription()));
    mimeMessage.setReplyTo(InternetAddress.parse(emailProperties.getFromAddress(), false));
    mimeMessage.setSentDate(new Date());
    mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email, false));
    return mimeMessage;
  }

  private Context getContextForFeedback(String email, FeedbackModel feedbackModel, HttpServletRequest request) {
    Context context = new Context();
    context.setVariable("imageName", "logo");
    context.setVariable("url",
      UriComponentsBuilder.newInstance()
        .scheme("http")
        .host(request.getServerName())
        .port(8080)
        .path("/endorse-skills")
        .queryParam("email", email)
        .queryParam("feedbackRequestId", feedbackModel.getId()).build());
    context.setVariable("user", feedbackModel.fullName());
    context.setVariable("message", feedbackModel.getMessage());
    return context;
  }

  private Context getContextForSignup(String email, HttpServletRequest request) {
    Context context = new Context();
    context.setVariable("imageName", "logo");
    context.setVariable("url",
      UriComponentsBuilder.newInstance()
        .scheme("http")
        .host(request.getServerName())
        .port(8080)
        .path("/complete-profile")
        .queryParam("email", email)
        .build());
    return context;
  }
}

