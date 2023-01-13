package zone.cogni.reveal.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import zone.cogni.reveal.model.FeedbackModel;
import zone.cogni.reveal.model.SignupModel;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EmailController {
  private final EmailService emailService;

  @PostMapping(path = "/api/feedback")
  public ResponseEntity<?> sendMailFeedback(@RequestBody FeedbackModel feedbackModel, HttpServletRequest request) {
    emailService.sendFeedbackMail(feedbackModel, request);
    return ResponseEntity.ok(HttpStatus.OK);
  }


  @PostMapping(path = "/api/signup")
  public ResponseEntity<?> sendMailSignup(@RequestBody SignupModel signupModel, HttpServletRequest request) {
    emailService.sendSignupMail(signupModel, request);
    return ResponseEntity.ok(HttpStatus.OK);
  }
}
