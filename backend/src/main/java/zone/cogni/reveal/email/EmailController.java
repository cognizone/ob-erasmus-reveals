package zone.cogni.reveal.email;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.context.Context;
import zone.cogni.reveal.model.FeedbackModel;
import zone.cogni.reveal.model.SignupModel;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EmailController {
  private final EmailService emailService;
  private final EmailProperties emailProperties;

  @PostMapping(path = "/api/feedback")
  public ResponseEntity<?> sendMailFeedback(@RequestBody ObjectNode body, HttpServletRequest request) {
    ObjectMapper mapper = new ObjectMapper();
    ObjectReader reader = mapper.readerFor(new TypeReference<FeedbackModel>() {
    });

    try {
      FeedbackModel feedbackModel = reader.readValue(body);
      String subject = emailProperties.getSubject().get(feedbackModel.getLanguage());

      feedbackModel.getEmails().forEach(email -> {
        try {
          emailService.sendMessage(email, subject,
            feedbackModel.getTemplate(),
            getContextForFeedback(email,feedbackModel, request));
          log.info("Email to {}, subject {} send successfully", email, subject);
        }
        catch (Exception e) {
          log.info("Failed to send email to {}, subject {}", email, subject);
        }
      });
      return ResponseEntity.ok(HttpStatus.OK);
    }
    catch (IOException e) {
      log.error("Could not ready body {}", e.getMessage());
      return ResponseEntity.ok(HttpStatus.BAD_GATEWAY);
    }
  }


  @PostMapping(path = "/api/signup")
  public ResponseEntity<?> sendMailSignup(@RequestBody ObjectNode body, HttpServletRequest request) throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    ObjectReader reader = mapper.readerFor(new TypeReference<SignupModel>() {
    });
    SignupModel signupModel = reader.readValue(body);
    String subject = emailProperties.getSubject().get(signupModel.getLanguage());

    try {
      emailService.sendMessage(signupModel.getEmail(), subject, signupModel.getTemplate(),
        getContextForSignup(signupModel.getEmail(), request));
      log.info("Email to {}, subject {} send successfully", signupModel.getEmail(), subject);
    }
    catch (Exception e) {
      log.info("Failed to send email to {}, subject {}", signupModel.getEmail(), subject);
      return ResponseEntity.ok(HttpStatus.BAD_GATEWAY);
    }
    return ResponseEntity.ok(HttpStatus.OK);
  }

  private Context getContextForFeedback(String email,FeedbackModel feedbackModel, HttpServletRequest request) {
    Context context = new Context();
    context.setVariable("imageName", "logo");
    context.setVariable("url",
      "http://" + request.getServerName() + ":" + request.getServerPort()
        + "/endorse-skills"
        + "?email=" + email +
        "&feedbackRequestId=" + feedbackModel.getId());
    context.setVariable("user",  feedbackModel.fullName());
    context.setVariable("message", feedbackModel.getMessage());
    return context;
  }

  private Context getContextForSignup(String email, HttpServletRequest request) {
    Context context = new Context();
    context.setVariable("imageName", "logo");
    context.setVariable("url",
      "http://" + request.getServerName() + ":" + request.getServerPort() +
      "/complete-profile?email=" + email);
    return context;
  }
}
