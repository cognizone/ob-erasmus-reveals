package settings;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(SettingsController.class)
public class SettingsConfiguration {
}