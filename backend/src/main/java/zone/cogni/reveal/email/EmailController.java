package zone.cogni.reveal.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import zone.cogni.reveal.model.FeedbackModel;
import zone.cogni.reveal.model.SignInModel;
import zone.cogni.reveal.model.SignupModel;


@RestController
@RequiredArgsConstructor
@Slf4j
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
    try {
      emailService.sendSignupMail(signupModel, baseUrl);
      return ResponseEntity.ok(HttpStatus.OK);
    }
    catch (Exception e) {
      log.error("Failed sign up for user with email {}", signupModel.getEmail());
      return ResponseEntity.ok(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(path = "/api/signin")
  public ResponseEntity<?> sendMailSignIn(@RequestBody SignInModel signInModel) {
    String baseUrl = String.valueOf(ServletUriComponentsBuilder.fromCurrentContextPath().build());
    try {
      emailService.sendSignInMail(signInModel, baseUrl);
      return ResponseEntity.ok(HttpStatus.OK);
    }
    catch (Exception e) {
      log.error("Failed sign in for user with email {}", signInModel.getEmail());
      return ResponseEntity.ok(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
