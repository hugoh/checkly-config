import {
  AlertChannel,
  AlertEscalationBuilder,
  RetryStrategyBuilder,
} from "checkly/constructs";

export const DEFAULT_ALERT_CHANNEL_ID = 269260;

export const urlMonitorDefaults = {
  activated: true,
  alertEscalationPolicy: AlertEscalationBuilder.runBasedEscalation(
    1,
    { amount: 0, interval: 5 },
    { enabled: false, percentage: 10 },
  ),
  retryStrategy: RetryStrategyBuilder.noRetries(),
  degradedResponseTime: 3000,
  maxResponseTime: 5000,
};

type BaseChecklyConfigOptions = {
  projectName: string;
  logicalId: string;
  repoUrl: string;
  runLocation?: string;
};

export function baseChecklyConfig({
  projectName,
  logicalId,
  repoUrl,
  runLocation = "us-east-1",
}: BaseChecklyConfigOptions) {
  return {
    projectName,
    logicalId,
    repoUrl,
    checks: {
      alertChannels: [AlertChannel.fromId(DEFAULT_ALERT_CHANNEL_ID)],
      checkMatch: "**/__checks__/**/*.check.ts",
    },
    cli: {
      runLocation,
      reporters: ["list"],
      retries: 0,
    },
  };
}
