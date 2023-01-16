package zone.cogni.reveal.email;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import zone.cogni.reveal.model.FeedbackModel;
import zone.cogni.reveal.model.SignupModel;


@RestController
@RequiredArgsConstructor
public class EmailController {
  private final EmailService emailService;

  @PostMapping(path = "/api/feedback")
  public ResponseEntity<?> sendMailFeedback(@RequestBody FeedbackModel feedbackModel) {
    String baseUrl = String.valueOf(ServletUriComponentsBuilder.fromCurrentContextPath().build());
    emailService.sendFeedbackMail(feedbackModel, baseUrl);
    return ResponseEntity.ok(HttpStatus.OK);
  }


  @PostMapping(path = "/api/signup")
  public ResponseEntity<?> sendMailSignup(@RequestBody SignupModel signupModel) {
    String baseUrl = String.valueOf(ServletUriComponentsBuilder.fromCurrentContextPath().build());
    emailService.sendSignupMail(signupModel, baseUrl);
    return ResponseEntity.ok(HttpStatus.OK);
  }
}
