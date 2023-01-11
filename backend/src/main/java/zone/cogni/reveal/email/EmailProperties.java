package zone.cogni.reveal.email;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;

@Setter
@Getter
@ConfigurationProperties(prefix = "mail")
public class EmailProperties {
  private Map<String, String> subject;
  private String fromAddress;
  private String fromDescription;
  private String fromEmail;
  private String password;
  private Map<String, String> smtp;
}
