"use client";

import { useState } from "react";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { Plus, Trash2 } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  methods: { id: string; name: string; priceCents: number }[];
}

const initialZones: Zone[] = [
  {
    id: "z1",
    name: "US Domestic",
    methods: [
      { id: "m1", name: "Standard (5–7 days)", priceCents: 599 },
      { id: "m2", name: "Express (2–3 days)", priceCents: 1299 },
    ],
  },
];

export default function VendorShippingPage() {
  const [zones, setZones] = useState(initialZones);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Shipping configuration</h1>
            <p className="text-slate-600">
              Native catalog vendors — mirrors synced shipping shape from Shopify/WooCommerce
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add zone
          </Button>
        </div>

        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <CardTitle>{zone.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {zone.methods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-wrap items-end gap-4 rounded-md border border-slate-100 p-4"
                >
                  <div className="flex-1">
                    <Label>Method name</Label>
                    <Input defaultValue={method.name} className="mt-1" />
                  </div>
                  <div className="w-32">
                    <Label>Rate (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={(method.priceCents / 100).toFixed(2)}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Preview: {formatCurrency(method.priceCents)}
                  </p>
                  <Button variant="ghost" size="icon" aria-label="Remove method">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add method
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button>Save shipping rules</Button>
      </div>
    </HubShell>
  );
}
