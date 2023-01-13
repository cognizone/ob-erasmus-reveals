package zone.cogni.reveal.email;

import lombok.Data;
import lombok.ToString;

import java.util.Map;

@Data
@ToString
public class EmailProperties {
  private Map<String, String> subject;
  private String fromAddress;
  private String fromDescription;
  private String fromEmail;
  @ToString.Exclude
  private String password;
  private Smtp smtp;

  public String getSubject(String language) {
    return getSubject().get(language);
  }
}

@Data
class Smtp {
  private String host;
  private String auth;
  private int port;
  private Starttls starttls;
  private SocketFactory socketFactory;
}

@Data
class SocketFactory {
  private String clazz;
}

@Data
class Starttls {
  private boolean enable;
}
