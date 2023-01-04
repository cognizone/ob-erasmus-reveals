package zone.cogni.reveal.email;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@Slf4j
public class EmailController {
  private final EmailService emailService;
  private final EmailConfig emailConfig;

  public EmailController(EmailService emailService, EmailConfig emailConfig) {
    this.emailService = emailService;
    this.emailConfig = emailConfig;
  }

  @PostMapping(path = "/api/sendmail")
  public ResponseEntity<?> sendmail(HttpServletRequest request,
                                    @RequestParam String user,
                                    @RequestParam String email,
                                    @RequestParam String id,
                                    @RequestParam(required = false) String language,
                                    @RequestParam(required = false) String message) {

    if (StringUtils.isBlank(language)) {
      language = "en";
    }
    String subject = emailConfig.getSubject().get(language);
    String templateName = id + "_" + language;
    try {
      emailService.sendMessage(email, subject, user, templateName, id, Optional.of(message));
      log.info("Email to {}, subject {} send successfully", email, subject);
      return ResponseEntity.ok(HttpStatus.OK);
    }
    catch (Exception e) {
      log.info("Failed to send email to {}, subject {}", email, subject);
      return ResponseEntity.ok(HttpStatus.BAD_GATEWAY);
    }
  }
}
