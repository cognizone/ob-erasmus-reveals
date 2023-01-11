package zone.cogni.reveal.app.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupModel {
  public String email;
  public String language;

  public String getTemplate() {
    return "signup_" + language;
  }
}
