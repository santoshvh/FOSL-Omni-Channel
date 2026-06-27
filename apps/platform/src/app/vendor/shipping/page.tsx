"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { Plus, Trash2 } from "lucide-react";

type ShippingMethod = {
  id: string;
  vendorId: string;
  name: string;
  priceCents: number;
  estimatedDays: string;
  zone: string;
};

export default function VendorShippingPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newZone, setNewZone] = useState("US Domestic");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/vendor/shipping");
      const json = (await res.json()) as { data?: ShippingMethod[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load shipping methods.");
      setMethods(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shipping methods.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const zones = useMemo(() => {
    const grouped = new Map<string, ShippingMethod[]>();
    for (const method of methods) {
      const list = grouped.get(method.zone) ?? [];
      list.push(method);
      grouped.set(method.zone, list);
    }
    return [...grouped.entries()];
  }, [methods]);

  async function addMethod(zone: string) {
    const res = await fetch("/api/v1/vendor/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zone,
        name: "Standard shipping",
        priceCents: 599,
        estimatedDays: "5–7 business days",
      }),
    });
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Unable to add method.");
      return;
    }
    await load();
  }

  async function updateMethod(id: string, patch: Partial<ShippingMethod>) {
    const res = await fetch(`/api/v1/vendor/shipping/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Unable to save method.");
      return;
    }
    await load();
  }

  async function removeMethod(id: string) {
    const res = await fetch(`/api/v1/vendor/shipping/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Unable to delete method.");
      return;
    }
    await load();
  }

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Shipping configuration</h1>
            <p className="text-slate-600">Rates used at storefront checkout for your physical products</p>
          </div>
          <div className="flex gap-2">
            <Input
              value={newZone}
              onChange={(e) => setNewZone(e.target.value)}
              placeholder="Zone name"
              className="w-40"
            />
            <Button onClick={() => addMethod(newZone.trim() || "Default")}>
              <Plus className="mr-2 h-4 w-4" />
              Add method
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading shipping methods…</p>
        ) : zones.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500">
            No shipping methods configured. Add one to enable physical checkout rates.
          </div>
        ) : (
          zones.map(([zone, zoneMethods]) => (
            <Card key={zone}>
              <CardHeader>
                <CardTitle>{zone}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {zoneMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex flex-wrap items-end gap-4 rounded-md border border-slate-100 p-4"
                  >
                    <div className="flex-1">
                      <Label>Method name</Label>
                      <Input
                        defaultValue={method.name}
                        className="mt-1"
                        onBlur={(e) => {
                          if (e.target.value !== method.name) {
                            void updateMethod(method.id, { name: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="w-32">
                      <Label>Rate (USD)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={(method.priceCents / 100).toFixed(2)}
                        className="mt-1"
                        onBlur={(e) => {
                          const cents = Math.round(parseFloat(e.target.value) * 100);
                          if (!Number.isNaN(cents) && cents !== method.priceCents) {
                            void updateMethod(method.id, { priceCents: cents });
                          }
                        }}
                      />
                    </div>
                    <div className="w-40">
                      <Label>Delivery</Label>
                      <Input
                        defaultValue={method.estimatedDays}
                        className="mt-1"
                        onBlur={(e) => {
                          if (e.target.value !== method.estimatedDays) {
                            void updateMethod(method.id, { estimatedDays: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm text-slate-500">
                      Preview: {formatCurrency(method.priceCents)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove method"
                      onClick={() => removeMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </HubShell>
  );
}
