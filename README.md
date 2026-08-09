# checkly-config

Shared Checkly ([checklyhq.com](https://www.checklyhq.com)) monitoring-as-code config
for hugoh's repos — the constants and builders that would otherwise be copy-pasted
into every repo's `checkly.config.ts` and `__checks__/**/*.check.ts`, plus a
composite GitHub Action to deploy them.

## Package

No build step, no package registry — Bun runs TypeScript directly, and consumers
install this as a Bun git dependency pinned to a tag:

```json
{
  "dependencies": {
    "@hugoh/checkly-config": "github:hugoh/checkly-config#v1.0.0"
  }
}
```

Renovate tracks and bumps the pinned tag the same way it tracks any other dependency.

### Exports

- `DEFAULT_ALERT_CHANNEL_ID` — the account's shared email alert channel ID.
- `urlMonitorDefaults` — spread into a `UrlMonitor` construct: `activated`,
  `alertEscalationPolicy`, `retryStrategy`, `degradedResponseTime`, `maxResponseTime`.
- `baseChecklyConfig({ projectName, logicalId, repoUrl, runLocation? })` — spread
  into `defineConfig(...)`: `checks.alertChannels`, `checks.checkMatch`,
  `cli.reporters`, `cli.retries`.

```ts
// checkly.config.ts
import { defineConfig } from "checkly";
import { baseChecklyConfig } from "@hugoh/checkly-config";

export default defineConfig({
  ...baseChecklyConfig({
    projectName: "example.com",
    logicalId: "example.com",
    repoUrl: "https://github.com/hugoh/example.com",
  }),
});
```

```ts
// __checks__/resources/url-monitors/example-com.check.ts
import { Frequency, UrlAssertionBuilder, UrlMonitor } from "checkly/constructs";
import { urlMonitorDefaults } from "@hugoh/checkly-config";

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
```

## `deploy` action

Installs dependencies and runs `checkly deploy`.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: hugoh/checkly-config/deploy@<pinned-sha> # vX.Y.Z
        with:
          checkly-api-key: ${{ secrets.CHECKLY_API_KEY }}
          checkly-account-id: ${{ vars.CHECKLY_ACCOUNT_ID }}
```

Pass `preview: "true"` to run `checkly deploy --preview` instead (used on
`pull_request`, where you don't want to actually apply changes).

## hk validation

There's no offline `checkly validate` command — `checkly deploy --preview`
(network + Checkly API credentials) is the closest thing. That's wired in as an
opt-in `hk` step in [`hk-config`](https://github.com/hugoh/hk-config)'s `checkly`
group (`...Base.checkly`), not here, so consumers get it through the same
`hk-config` import they already have — see that repo's `base.pkl` for the step
definition.
