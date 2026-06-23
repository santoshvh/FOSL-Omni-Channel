"use client";

import { useState } from "react";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";
import type { ProductType } from "@fosl/contracts";

export default function OperatorProductNewPage() {
  const [type, setType] = useState<ProductType>("physical");

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/operator/catalog" className="text-sm text-primary-dark hover:underline">
          ← Catalog
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add storefront product</h1>
          <p className="text-slate-600">Operator-native listing on /products</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product type</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(["physical", "digital", "lead_gen"] as ProductType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
                  type === t ? "border-primary bg-primary-muted" : "border-slate-200"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor *</Label>
            <select id="vendor" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option>Acme Audio Co.</option>
              <option>Bright Labs</option>
            </select>
          </div>
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" step="0.01" className="mt-1" />
          </div>
          {type === "physical" && (
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" className="mt-1" />
            </div>
          )}
          {type === "digital" && (
            <div>
              <Label>Download file</Label>
              <Input type="file" className="mt-1" />
            </div>
          )}
          {type === "lead_gen" && (
            <div>
              <Label htmlFor="webhook">Lead webhook URL</Label>
              <Input id="webhook" placeholder="https://crm.example.com/leads" className="mt-1" />
            </div>
          )}
          <Button asChild>
            <Link href="/operator/catalog">Publish to storefront</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
