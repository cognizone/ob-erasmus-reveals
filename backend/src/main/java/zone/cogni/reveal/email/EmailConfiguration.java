package zone.cogni.reveal.email;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.thymeleaf.TemplateEngine;

@Configuration
@Import(EmailController.class)
public class EmailConfiguration {

  @Bean
  public EmailService emailService(TemplateEngine templateEngine) {
    return new EmailService(templateEngine, emailProperties());
  }

  @Bean
  @ConfigurationProperties(prefix = "mail")
  public EmailProperties emailProperties() {
    return new EmailProperties();
  }
}

