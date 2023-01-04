package zone.cogni.reveal.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
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
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Optional;
import java.util.Properties;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

  private final TemplateEngine templateEngine;
  @Value("${mail.fromAddress}")
  private String fromAddress;
  @Value("${mail.fromDescription}")
  private String fromDescription;
  @Value("${mail.fromEmail}")
  private String fromEmail;
  @Value("${mail.password}")
  private String password;
  @Value("${mail.smtp.host}")
  private String smtpHost;
  @Value("${mail.smtp.port}")
  private String smtpPort;
  @Value("${mail.smtp.auth}")
  private String smtpAuth;
  @Value("${mail.smtp.starttls.enable}")
  private String starttlsEnable;
  @Value("${mail.smtp.socketFactory.port}")
  private String socketFactoryPort;
  @Value("${mail.smtp.socketFactory.class}")
  private String socketFactoryClass;
  @Value("${reveals.url.completeProfile}")
  private String completeProfile;
  @Value("${reveals.url.endorse}")
  private String endorse;

  public void sendMessage(String email,
                          String subject,
                          String user,
                          String templateName,
                          String id,
                          Optional<String> message) throws MessagingException,
    IOException {
    Properties props = new Properties();
    props.put("mail.smtp.host", smtpHost);
    props.put("mail.smtp.port", smtpPort);
    props.put("mail.smtp.auth", smtpAuth);
    props.put("mail.smtp.starttls.enable", starttlsEnable);
    props.put("mail.smtp.socketFactory.port", socketFactoryPort);
    props.put("mail.smtp.socketFactory.class", socketFactoryClass);

    log.info("mail.smtp.host {}, " +
      "mail.smtp.port {}, " +
      "mail.smtp.auth {}, " +
      "mail.smtp.starttls.enable {}," +
      "mail.smtp.socketFactory.por {}," +
      "mail.smtp.socketFactory.class {}", smtpHost, smtpPort, smtpAuth, starttlsEnable, socketFactoryPort, socketFactoryClass);

    Authenticator auth = new Authenticator() {
      @Override
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(fromEmail, password);
      }
    };

    Session session = Session.getInstance(props, auth);

    sendEmail(session, email, subject, user, templateName, id, message);
  }

  public void sendEmail(Session session,
                        String email,
                        String subject,
                        String user,
                        String templateName,
                        String id,
                        Optional<String> message) throws IOException, MessagingException {
    log.info("Sending email to {}, subject {}", email, subject);

    String body = templateEngine.process(templateName, getContext(id, email, user, message));
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
    DataSource fds = new FileDataSource(new ClassPathResource("static/img/reveals_logo.png").getFile().getAbsolutePath());
    messageBodyPartImage.setDataHandler(new DataHandler(fds));
    messageBodyPartImage.setHeader("Content-ID", "<logo>");
    multipart.addBodyPart(messageBodyPartImage);

    // put everything together
    mimeMessage.setContent(multipart);
    // send message
    Transport.send(mimeMessage);
  }

  private Context getContext(String id, String email, String user, Optional<String> message) {
    Context context = new Context();
    context.setVariable("imageName", "logo");
    if (id.equalsIgnoreCase("feedback")) {
      // in case of feedback we have a message that we need to send from one user to the other
      context.setVariable("url", endorse + email);
      context.setVariable("user", user);
      context.setVariable("message", message.get());
    } else if (id.equalsIgnoreCase("signup")) {
      context.setVariable("url", completeProfile + email);
    } else {
      throw new RuntimeException("The id provided is not valid , id = " + id);
    }
    return context;
  }

  private Message setMimeMessage(Message mimeMessage, String email, String subject) throws MessagingException,
    UnsupportedEncodingException {
    mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
    mimeMessage.setSubject(subject);
    mimeMessage.setFrom(new InternetAddress(fromAddress, fromDescription));
    mimeMessage.setReplyTo(InternetAddress.parse(fromAddress, false));
    mimeMessage.setSentDate(new Date());
    mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email, false));
    return mimeMessage;
  }
}

