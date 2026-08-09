import { defineConfig } from "checkly";
import { Frequency, UrlAssertionBuilder, UrlMonitor } from "checkly/constructs";
import { baseChecklyConfig, urlMonitorDefaults } from "./index";

const base = baseChecklyConfig({
  projectName: "example.com",
  logicalId: "example.com",
  repoUrl: "https://github.com/hugoh/example.com",
});

defineConfig({
  ...base,
  checks: {
    ...base.checks,
    frequency: 1440,
    locations: ["us-east-1"],
  },
});

new UrlMonitor("example-com-XXXXXXXX", {
  ...urlMonitorDefaults,
  name: "example.com",
  locations: ["us-east-1"],
  frequency: Frequency.EVERY_24H,
  request: {
    url: "https://example.com/",
    ipFamily: "IPv4",
    assertions: [UrlAssertionBuilder.statusCode().equals(200)],
  },
});
