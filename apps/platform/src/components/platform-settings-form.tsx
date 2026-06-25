"use client";

import { useEffect, useState } from "react";
import type { PlatformSettings } from "@fosl/contracts";
import { FOSL_DEPLOY_BRANCH } from "@fosl/contracts";
import {
  AlertBanner,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  SetupGuide,
} from "@fosl/ui";
import { Loader2, Rocket, Save } from "lucide-react";
import {
  authSetupGuide,
  databaseSetupGuide,
  postmarkEmailGuide,
  resendEmailGuide,
  s3StorageGuide,
  stripeSetupGuide,
} from "@/lib/settings-guides";

type SecretFields = {
  databasePassword: string;
  authSecret: string;
  payoutJobSecret: string;
  postmarkServerToken: string;
  resendApiKey: string;
  s3AccessKey: string;
  s3SecretKey: string;
  webhookSecret: string;
  stripeSecretKey: string;
  stripePublishableKey: string;
  stripeWebhookSecret: string;
};

const emptySecrets: SecretFields = {
  databasePassword: "",
  authSecret: "",
  payoutJobSecret: "",
  postmarkServerToken: "",
  resendApiKey: "",
  s3AccessKey: "",
  s3SecretKey: "",
  webhookSecret: "",
  stripeSecretKey: "",
  stripePublishableKey: "",
  stripeWebhookSecret: "",
};

export function PlatformSettingsForm() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [secrets, setSecrets] = useState<SecretFields>(emptySecrets);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/settings");
      const json = (await res.json()) as { data?: PlatformSettings; source?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load settings.");
      setSettings(json.data ?? null);
      setSource(json.source ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload = {
        database: {
          ...settings.database,
          password: secrets.databasePassword || undefined,
        },
        appUrls: settings.appUrls,
        auth: {
          ...settings.auth,
          authSecret: secrets.authSecret || undefined,
        },
        apiMocking: settings.apiMocking,
        storefront: settings.storefront,
        jobs: {
          payoutJobSecret: secrets.payoutJobSecret || undefined,
        },
        featureFlags: settings.featureFlags,
        autoDeploy: {
          ...settings.autoDeploy,
          webhookSecret: secrets.webhookSecret || undefined,
        },
        fileStorage: {
          ...settings.fileStorage,
          s3AccessKey: secrets.s3AccessKey || undefined,
          s3SecretKey: secrets.s3SecretKey || undefined,
        },
        email: {
          ...settings.email,
          postmarkServerToken: secrets.postmarkServerToken || undefined,
          resendApiKey: secrets.resendApiKey || undefined,
        },
        stripe: {
          ...settings.stripe,
          secretKey: secrets.stripeSecretKey || undefined,
          publishableKey: secrets.stripePublishableKey || undefined,
          webhookSecret: secrets.stripeWebhookSecret || undefined,
        },
      };

      const res = await fetch("/api/v1/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        data?: PlatformSettings;
        source?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      setSettings(json.data ?? null);
      setSource(json.source ?? null);
      setSecrets(emptySecrets);
      setMessage(json.message ?? "Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeploy() {
    setDeploying(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/v1/settings/deploy", { method: "POST" });
      const json = (await res.json()) as { data?: PlatformSettings; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Deploy failed.");
      setSettings(json.data ?? null);
      setMessage(json.data?.autoDeploy.lastDeployMessage ?? "Deploy triggered.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deploy failed.");
    } finally {
      setDeploying(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading platform settings…</p>;
  }

  if (!settings) {
    return <p className="text-sm text-red-600">{error ?? "Settings unavailable."}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform settings</h1>
          <p className="text-slate-600">
            Single source of truth for database, URLs, auth, payments, and feature flags
          </p>
          {source && <p className="mt-1 text-xs text-slate-400">Data source: {source}</p>}
        </div>
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save all
        </Button>
      </div>

      {message && <AlertBanner variant="success" title="Saved">{message}</AlertBanner>}
      {error && <AlertBanner variant="error" title="Error">{error}</AlertBanner>}

      <Card>
        <CardHeader>
          <CardTitle>Database</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SetupGuide
            title={databaseSetupGuide.title}
            steps={databaseSetupGuide.steps}
            terms={databaseSetupGuide.terms}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="db-host">MySQL host</Label>
              <Input
                id="db-host"
                className="mt-1"
                value={settings.database.host}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    database: { ...settings.database, host: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="db-port">Port</Label>
              <Input
                id="db-port"
                type="number"
                className="mt-1"
                value={settings.database.port}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    database: { ...settings.database, port: Number(e.target.value) || 3306 },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="db-name">Database</Label>
              <Input
                id="db-name"
                className="mt-1"
                value={settings.database.database}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    database: { ...settings.database, database: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="db-user">Username</Label>
              <Input
                id="db-user"
                className="mt-1"
                value={settings.database.username}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    database: { ...settings.database, username: e.target.value },
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="db-password">
                Password {settings.database.passwordConfigured && "(configured)"}
              </Label>
              <Input
                id="db-password"
                type="password"
                className="mt-1"
                placeholder="Leave blank to keep current"
                value={secrets.databasePassword}
                onChange={(e) => setSecrets({ ...secrets, databasePassword: e.target.value })}
              />
              <p className="mt-1 text-xs text-slate-500">
                Saved to `.fosl-runtime.json` as `DATABASE_URL` on save. Restart dev servers after saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App URLs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["hub", "Platform URL"],
              ["storefront", "Storefront URL"],
              ["admin", "Admin URL (usually platform + /admin)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={`url-${key}`}>{label}</Label>
              <Input
                id={`url-${key}`}
                className="mt-1"
                value={settings.appUrls[key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appUrls: { ...settings.appUrls, [key]: e.target.value },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.auth.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  auth: { ...settings.auth, enabled: e.target.checked },
                })
              }
            />
            Enable Hub route protection (Auth.js)
          </label>
          <SetupGuide
            title={authSetupGuide.title}
            steps={authSetupGuide.steps}
            terms={authSetupGuide.terms}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="auth-url">Auth URL (Hub base)</Label>
              <Input
                id="auth-url"
                className="mt-1"
                value={settings.auth.authUrl}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    auth: { ...settings.auth, authUrl: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="auth-secret">
                Auth secret {settings.auth.secretConfigured && "(configured)"}
              </Label>
              <Input
                id="auth-secret"
                type="password"
                className="mt-1"
                placeholder="Leave blank to keep current"
                value={secrets.authSecret}
                onChange={(e) => setSecrets({ ...secrets, authSecret: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API mocking</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.apiMocking.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  apiMocking: { enabled: e.target.checked },
                })
              }
            />
            Enable MSW browser mocking in development (storefront + platform)
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storefront</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="subscription-state">Operator subscription state</Label>
            <select
              id="subscription-state"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:max-w-xs"
              value={settings.storefront.subscriptionState}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  storefront: {
                    ...settings.storefront,
                    subscriptionState: e.target.value as PlatformSettings["storefront"]["subscriptionState"],
                  },
                })
              }
            >
              {(
                ["trial", "active", "past_due", "grace_period", "suspended", "cancelled", "enterprise"] as const
              ).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Controls the subscription banner on the storefront.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="payout-secret">
              Payout job secret {settings.jobs.payoutJobSecretConfigured && "(configured)"}
            </Label>
            <Input
              id="payout-secret"
              type="password"
              className="mt-1 sm:max-w-md"
              placeholder="Leave blank to keep current"
              value={secrets.payoutJobSecret}
              onChange={(e) => setSecrets({ ...secrets, payoutJobSecret: e.target.value })}
            />
            <p className="mt-1 text-xs text-slate-500">
              Required for `POST /api/v1/payouts/commissions` in production.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto deploy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.autoDeploy.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoDeploy: { ...settings.autoDeploy, enabled: e.target.checked },
                })
              }
            />
            Enable deploy on push to target branch
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="deploy-branch">Target branch</Label>
              <Input
                id="deploy-branch"
                className="mt-1 bg-slate-50"
                readOnly
                value={FOSL_DEPLOY_BRANCH}
              />
              <p className="mt-1 text-xs text-slate-500">
                Production deploys use this branch until the two-app refactor is merged to master.
              </p>
            </div>
            <div>
              <Label htmlFor="github-repo">GitHub repository</Label>
              <Input
                id="github-repo"
                className="mt-1"
                placeholder="org/repo"
                value={settings.autoDeploy.githubRepo}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoDeploy: { ...settings.autoDeploy, githubRepo: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="deploy-webhook">Deploy webhook URL (ICDSoft / sureapp)</Label>
            <Input
              id="deploy-webhook"
              className="mt-1"
              placeholder="https://..."
              value={settings.autoDeploy.webhookUrl}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoDeploy: { ...settings.autoDeploy, webhookUrl: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="webhook-secret">Webhook secret (leave blank to keep current)</Label>
            <Input
              id="webhook-secret"
              type="password"
              className="mt-1"
              value={secrets.webhookSecret}
              onChange={(e) => setSecrets({ ...secrets, webhookSecret: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  settings.autoDeploy.deployHub && settings.autoDeploy.deployAdmin
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoDeploy: {
                      ...settings.autoDeploy,
                      deployHub: e.target.checked,
                      deployAdmin: e.target.checked,
                    },
                  })
                }
              />
              Platform
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoDeploy.deployStorefront}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoDeploy: {
                      ...settings.autoDeploy,
                      deployStorefront: e.target.checked,
                    },
                  })
                }
              />
              Storefront
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" onClick={() => void handleDeploy()} disabled={deploying}>
              {deploying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="mr-2 h-4 w-4" />
              )}
              Deploy now
            </Button>
            {settings.autoDeploy.lastDeployAt && (
              <p className="text-xs text-slate-500">
                Last deploy: {new Date(settings.autoDeploy.lastDeployAt).toLocaleString()} ·{" "}
                <span className="capitalize">{settings.autoDeploy.lastDeployStatus}</span>
                {settings.autoDeploy.lastDeployMessage
                  ? ` — ${settings.autoDeploy.lastDeployMessage}`
                  : ""}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">
            Local saves files on disk and serves them from the Hub. S3 uploads to your bucket and
            returns the public URL (prefix or default S3 URL).
          </p>
          <div>
            <Label htmlFor="storage-provider">Provider</Label>
            <select
              id="storage-provider"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              value={settings.fileStorage.provider}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  fileStorage: {
                    ...settings.fileStorage,
                    provider: e.target.value as "local" | "s3",
                  },
                })
              }
            >
              <option value="local">Local directory</option>
              <option value="s3">Amazon S3</option>
            </select>
          </div>
          {settings.fileStorage.provider === "local" ? (
            <div>
              <Label htmlFor="upload-dir">Upload directory</Label>
              <Input
                id="upload-dir"
                className="mt-1"
                value={settings.fileStorage.localUploadDir}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fileStorage: { ...settings.fileStorage, localUploadDir: e.target.value },
                  })
                }
              />
              <p className="mt-1 text-xs text-slate-500">Relative to Hub app cwd.</p>
            </div>
          ) : (
            <>
              <SetupGuide
                title={s3StorageGuide.title}
                steps={s3StorageGuide.steps}
                terms={s3StorageGuide.terms}
              />
              <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="s3-bucket">S3 bucket</Label>
                <Input
                  id="s3-bucket"
                  className="mt-1"
                  value={settings.fileStorage.s3Bucket}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      fileStorage: { ...settings.fileStorage, s3Bucket: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="s3-region">Region</Label>
                <Input
                  id="s3-region"
                  className="mt-1"
                  value={settings.fileStorage.s3Region}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      fileStorage: { ...settings.fileStorage, s3Region: e.target.value },
                    })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="s3-prefix">Public URL prefix</Label>
                <Input
                  id="s3-prefix"
                  className="mt-1"
                  placeholder="https://cdn.example.com/"
                  value={settings.fileStorage.s3PublicUrlPrefix}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      fileStorage: { ...settings.fileStorage, s3PublicUrlPrefix: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="s3-key">Access key {settings.fileStorage.s3AccessKeyConfigured && "(configured)"}</Label>
                <Input
                  id="s3-key"
                  type="password"
                  className="mt-1"
                  placeholder="Leave blank to keep"
                  value={secrets.s3AccessKey}
                  onChange={(e) => setSecrets({ ...secrets, s3AccessKey: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="s3-secret">Secret key {settings.fileStorage.s3SecretConfigured && "(configured)"}</Label>
                <Input
                  id="s3-secret"
                  type="password"
                  className="mt-1"
                  placeholder="Leave blank to keep"
                  value={secrets.s3SecretKey}
                  onChange={(e) => setSecrets({ ...secrets, s3SecretKey: e.target.value })}
                />
              </div>
            </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email-provider">Provider</Label>
              <select
                id="email-provider"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={settings.email.provider}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: {
                      ...settings.email,
                      provider: e.target.value as "postmark" | "resend" | "console",
                    },
                  })
                }
              >
                <option value="console">Console (dev)</option>
                <option value="postmark">Postmark</option>
                <option value="resend">Resend</option>
              </select>
            </div>
            <div>
              <Label htmlFor="from-address">From address</Label>
              <Input
                id="from-address"
                type="email"
                className="mt-1"
                value={settings.email.fromAddress}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, fromAddress: e.target.value },
                  })
                }
              />
            </div>
          </div>
          {settings.email.provider === "postmark" && (
            <>
              <SetupGuide
                title={postmarkEmailGuide.title}
                steps={postmarkEmailGuide.steps}
                terms={postmarkEmailGuide.terms}
              />
              <div>
                <Label htmlFor="postmark-token">
                Postmark server token {settings.email.postmarkServerTokenConfigured && "(configured)"}
              </Label>
              <Input
                id="postmark-token"
                type="password"
                className="mt-1"
                placeholder="Leave blank to keep current"
                value={secrets.postmarkServerToken}
                onChange={(e) => setSecrets({ ...secrets, postmarkServerToken: e.target.value })}
              />
              </div>
            </>
          )}
          {settings.email.provider === "resend" && (
            <>
              <SetupGuide
                title={resendEmailGuide.title}
                steps={resendEmailGuide.steps}
                terms={resendEmailGuide.terms}
              />
              <div>
                <Label htmlFor="resend-key">
                Resend API key {settings.email.resendApiKeyConfigured && "(configured)"}
              </Label>
              <Input
                id="resend-key"
                type="password"
                className="mt-1"
                placeholder="Leave blank to keep current"
                value={secrets.resendApiKey}
                onChange={(e) => setSecrets({ ...secrets, resendApiKey: e.target.value })}
              />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stripe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <SetupGuide
            title={stripeSetupGuide.title}
            steps={stripeSetupGuide.steps}
            terms={stripeSetupGuide.terms}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.stripe.connectEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stripe: { ...settings.stripe, connectEnabled: e.target.checked },
                })
              }
            />
            Stripe Connect enabled for vendor payouts
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="stripe-secret">
                Secret key {settings.stripe.secretKeyConfigured && "(configured)"}
              </Label>
              <Input
                id="stripe-secret"
                type="password"
                className="mt-1"
                placeholder="sk_test_…"
                value={secrets.stripeSecretKey}
                onChange={(e) => setSecrets({ ...secrets, stripeSecretKey: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="stripe-publishable">
                Publishable key {settings.stripe.publishableKeyConfigured && "(configured)"}
              </Label>
              <Input
                id="stripe-publishable"
                type="password"
                className="mt-1"
                placeholder="pk_test_…"
                value={secrets.stripePublishableKey}
                onChange={(e) => setSecrets({ ...secrets, stripePublishableKey: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="stripe-webhook">
                Webhook secret {settings.stripe.webhookConfigured && "(configured)"}
              </Label>
              <Input
                id="stripe-webhook"
                type="password"
                className="mt-1"
                placeholder="whsec_…"
                value={secrets.stripeWebhookSecret}
                onChange={(e) => setSecrets({ ...secrets, stripeWebhookSecret: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              ["marketplace", "Master marketplace (fosl.com)"],
              ["referralTree", "Creator referral tree (2-level)"],
              ["leadGen", "Lead-gen product type"],
              ["bigcommerce", "BigCommerce integration (beta)"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={settings.featureFlags[key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    featureFlags: { ...settings.featureFlags, [key]: e.target.checked },
                  })
                }
              />
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
