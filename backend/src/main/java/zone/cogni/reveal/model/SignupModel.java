package zone.cogni.reveal.model;

import lombok.Data;

@Data
public class SignupModel {
  public String email;
  public String language;

  public String getTemplate() {
    return "signup_" + language;
  }
}
