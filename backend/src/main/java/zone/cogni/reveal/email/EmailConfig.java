package zone.cogni.reveal.email;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "mail")
@Import({EmailService.class, EmailController.class})
public class EmailConfig {
  private Map<String,String> subject;

  public Map<String, String> getSubject() {
    return subject;
  }

  public void setSubject(Map<String, String> subject) {
    this.subject = subject;
  }
}

