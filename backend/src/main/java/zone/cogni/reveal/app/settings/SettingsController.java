package zone.cogni.reveal.app.settings;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SettingsController {
  @Value("${cognizone.proxy.url}")
  private String elasticProxyUrl;
  @Value("${cognizone.elastic.index.name}")
  private String index;

  @GetMapping("/api/settings")
  public Map<String, Object> getSettings() {
    return Map.of(
      "elasticProxyUrl", elasticProxyUrl,
      "index", index);
  }
}