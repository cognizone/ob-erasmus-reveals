package zone.cogni.reveal.email;

import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.Map;

@Data
public class EmailProperties {
  private Map<String, String> subject;
  private String fromAddress;
  private String fromDescription;
  private String fromEmail;
  @ToString.Exclude
  private String password;
  @NotNull
  private Smtp smtp;

  public String getSubject(String language) {
    //in case of invalid language we should choose en
    return subject.getOrDefault(language, subject.get("en"));
  }

  @Data
  public static class Smtp {
    @NotBlank
    private String host;
    @Positive
    private int port;
    private String auth;
    private Starttls starttls;
    private SocketFactory socketFactory;
  }

  @Data
  public static class SocketFactory {
    private String clazz;
  }

  @Data
  public static class Starttls {
    private String enable;
  }
}
