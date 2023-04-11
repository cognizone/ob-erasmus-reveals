package zone.cogni.reveal.model;

import lombok.Data;

@Data
public class SignInModel {
  public String language;
  public String email;

  public String getTemplate() {
    return "signin_" + language;
  }
}
