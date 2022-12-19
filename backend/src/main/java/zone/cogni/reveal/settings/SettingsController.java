package zone.cogni.reveal.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SettingsController {
  @Value("${reveals.proxy.url}")
  private final String elasticProxyUrl;
  @Value("${reveals.elastic.index}")
  private final String index;

  @GetMapping("/api/settings")
  public Map<String, Object> getSettings() {
    return Map.of(
      "elasticProxyUrl", elasticProxyUrl,
      "index", index);
  }
}