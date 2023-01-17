package zone.cogni.reveal.email;

import lombok.Data;
import lombok.ToString;

import java.util.Map;

@Data
public class EmailProperties {
  private Map<String, String> subject;
  private String fromAddress;
  private String fromDescription;
  private String fromEmail;
  @ToString.Exclude
  private String password;
  private Smtp smtp;

  public String getSubject(String language) {
    //in case of invalid language we should choose en
    return subject.getOrDefault(language, subject.get("en"));
  }

  @Data
  static class Smtp {
    private String host;
    private String auth;
    private int port;
    private Starttls starttls;
    private SocketFactory socketFactory;
  }

  @Data
  static class SocketFactory {
    private String clazz;
  }

  @Data
  static class Starttls {
    private String enable;
  }
}
