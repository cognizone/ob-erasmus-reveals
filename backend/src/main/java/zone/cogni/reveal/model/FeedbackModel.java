package zone.cogni.reveal.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class FeedbackModel {
  @JsonProperty("@id")
  public String id;
  public String message;
  public String language;
  public List<String> emails;
  public User user;

  public String fullName() {
    return user.getFirstName() +" "+ user.getLastName();
  }

  public String getTemplate() {
    return "feedback_" + language;
  }
}
