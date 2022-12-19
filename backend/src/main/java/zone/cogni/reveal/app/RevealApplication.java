package zone.cogni.reveal.app;

import cogni.zone.vinzclortho.EnableVinzClorthoProxy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import zone.cogni.reveal.settings.SettingsConfiguration;

@SpringBootApplication
@EnableVinzClorthoProxy
@Import(SettingsConfiguration.class)
public class RevealApplication {
  public static void main(String[] args) {
    SpringApplication.run(RevealApplication.class, args);
  }

}
