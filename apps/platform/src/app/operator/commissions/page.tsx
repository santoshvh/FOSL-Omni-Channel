"use client";

import { useState } from "react";
import { HubShell } from "@/components/hub-shell";
import { AlertBanner, Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

const PLATFORM_FEE = 5;

const initialOverrides = [
  { sku: "WBH-001", creatorPct: 12 },
  { sku: "ECM-101", creatorPct: 15 },
];

function validateNoLoss(creator: number, operator: number) {
  const total = PLATFORM_FEE + creator + operator;
  if (total > 100) {
    return `Total allocation ${total}% exceeds 100%. Vendor would receive a negative share.`;
  }
  if (100 - total < 0) return "Vendor share cannot be negative.";
  return null;
}

export default function OperatorCommissionsPage() {
  const [creator, setCreator] = useState(10);
  const [operator, setOperator] = useState(15);
  const [saved, setSaved] = useState(false);
  const [overrides, setOverrides] = useState(initialOverrides);
  const [sku, setSku] = useState("");
  const [overridePct, setOverridePct] = useState("");
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const error = validateNoLoss(creator, operator);
  const vendorShare = 100 - PLATFORM_FEE - creator - operator;

  function handleSave() {
    if (error) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function addOverride() {
    const pct = Number(overridePct);
    if (!sku.trim()) {
      setOverrideError("SKU is required.");
      return;
    }
    if (!pct || pct < 0 || pct > 100) {
      setOverrideError("Enter a creator commission between 0 and 100.");
      return;
    }
    if (PLATFORM_FEE + pct + operator > 100) {
      setOverrideError("Override would violate no-loss rule with current operator margin.");
      return;
    }
    setOverrides((o) => [...o.filter((x) => x.sku !== sku.trim()), { sku: sku.trim(), creatorPct: pct }]);
    setSku("");
    setOverridePct("");
    setOverrideError(null);
  }

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Commission rules</h1>
          <p className="text-slate-600">Global rules with per-product overrides · no-loss validation</p>
        </div>

        {error && (
          <AlertBanner variant="error" title="No-loss validation failed">
            {error} Reduce creator or operator commission before saving.
          </AlertBanner>
        )}

        {saved && (
          <AlertBanner variant="info" title="Rules saved">
            Global commission rules updated. Per-product overrides unchanged.
          </AlertBanner>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Global storefront rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500">
              Applied to all products unless a per-SKU override exists. Platform fee is deducted first.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="creator">Creator commission (% of base) *</Label>
                <Input
                  id="creator"
                  type="number"
                  min={0}
                  max={100}
                  value={creator}
                  onChange={(e) => setCreator(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-slate-500">Paid to referring creator on attributed sales.</p>
              </div>
              <div>
                <Label htmlFor="operator">Operator margin (% of base) *</Label>
                <Input
                  id="operator"
                  type="number"
                  min={0}
                  max={100}
                  value={operator}
                  onChange={(e) => setOperator(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-slate-500">Your margin after platform fee and creator share.</p>
              </div>
            </div>
            <dl className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <dt>Platform fee</dt>
                <dd>{PLATFORM_FEE}%</dd>
              </div>
              <div className="flex justify-between">
                <dt>Creator</dt>
                <dd>{creator}%</dd>
              </div>
              <div className="flex justify-between">
                <dt>Operator</dt>
                <dd>{operator}%</dd>
              </div>
              <div className="mt-1 flex justify-between border-t border-slate-200 pt-1 font-medium">
                <dt>Vendor remainder</dt>
                <dd className={vendorShare < 0 ? "text-red-600" : "text-green-700"}>{vendorShare}%</dd>
              </div>
            </dl>
            <Button onClick={handleSave} disabled={!!error}>
              Save global rules
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Per-product overrides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overrides.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">Creator %</th>
                    <th className="pb-2 text-right">Vendor remainder</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {overrides.map((o) => (
                    <tr key={o.sku}>
                      <td className="py-2 font-mono">{o.sku}</td>
                      <td className="py-2">{o.creatorPct}%</td>
                      <td className="py-2 text-right">{100 - PLATFORM_FEE - o.creatorPct - operator}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div>
              <Label htmlFor="sku">Product SKU *</Label>
              <Input id="sku" placeholder="WBH-001" className="mt-1" value={sku} onChange={(e) => setSku(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="override">Creator commission override (%) *</Label>
              <Input
                id="override"
                type="number"
                placeholder="12"
                className="mt-1"
                value={overridePct}
                onChange={(e) => setOverridePct(e.target.value)}
              />
            </div>
            {overrideError && <p className="text-xs text-red-600">{overrideError}</p>}
            <Button variant="outline" onClick={addOverride}>
              Add override
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attribution model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <select className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm" defaultValue="last_click">
              <option value="last_click">Last click (active)</option>
              <option disabled>First click (coming soon)</option>
              <option disabled>Linear (coming soon)</option>
            </select>
            <p className="text-xs text-slate-500">30-day attribution window · last referring creator wins.</p>
          </CardContent>
        </Card>
      </div>
    </HubShell>
  );
}
