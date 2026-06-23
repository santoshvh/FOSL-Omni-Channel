"use client";

import { useState } from "react";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@fosl/ui";
import { ImageUploadField } from "@/components/image-upload-field";
import type { ProductType } from "@fosl/contracts";

const productTypes: { value: ProductType; label: string; description: string }[] = [
  {
    value: "physical",
    label: "Physical",
    description: "Shipped goods — weight, dimensions, shipping zones required",
  },
  {
    value: "digital",
    label: "Digital",
    description: "Downloadable files or license keys — instant delivery",
  },
  {
    value: "lead_gen",
    label: "Lead gen",
    description: "Capture leads via form — optional payment",
  },
];

export default function NewProductPage() {
  const [type, setType] = useState<ProductType>("physical");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add product</h1>
          <p className="text-slate-600">Native catalog — not synced from external store</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {productTypes.map((pt) => (
              <label
                key={pt.value}
                className={`flex cursor-pointer gap-3 rounded-md border p-4 ${
                  type === pt.value ? "border-primary bg-primary-muted" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="productType"
                  value={pt.value}
                  checked={type === pt.value}
                  onChange={() => setType(pt.value)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{pt.label}</p>
                  <p className="text-sm text-slate-500">{pt.description}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Product title *</Label>
              <Input id="title" placeholder="e.g. Wireless Bluetooth Headphones" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" placeholder="e.g. WBH-001" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} className="mt-1" placeholder="Product description for storefront" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input id="price" type="number" step="0.01" placeholder="89.99" className="mt-1" />
                <p className="mt-1 text-xs text-slate-500">Stored in cents on the ledger.</p>
              </div>
              <div>
                <Label htmlFor="inventory">{type === "digital" ? "License seats" : "Inventory"} *</Label>
                <Input id="inventory" type="number" placeholder={type === "digital" ? "9999" : "100"} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input id="category" placeholder="e.g. Electronics" className="mt-1" />
            </div>
            <ImageUploadField onUploaded={setImageUrl} />
            {imageUrl && (
              <p className="text-xs text-slate-500">Image URL: {imageUrl}</p>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              Publish to operator storefronts immediately
            </label>
          </CardContent>
        </Card>

        {type === "physical" && (
          <Card>
            <CardHeader>
              <CardTitle>Physical — shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input id="weight" type="number" step="0.01" placeholder="0.45" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="hsCode">HS code</Label>
                  <Input id="hsCode" placeholder="8518.30" className="mt-1" />
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Configure shipping zones after saving, or{" "}
                <Link href="/vendor/shipping" className="text-primary-dark hover:underline">
                  set up shipping now
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        )}

        {type === "digital" && (
          <Card>
            <CardHeader>
              <CardTitle>Digital delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">Upload file *</Label>
                <Input id="file" type="file" className="mt-1" accept=".pdf,.zip,.mp4" />
                <p className="mt-1 text-xs text-slate-500">Max 50 MB. Converted to secure download link.</p>
              </div>
              <div>
                <Label htmlFor="downloadLimit">Download limit per purchase</Label>
                <Input id="downloadLimit" type="number" placeholder="3" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        )}

        {type === "lead_gen" && (
          <Card>
            <CardHeader>
              <CardTitle>Lead capture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input id="webhook" type="url" placeholder="https://crm.example.com/leads" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="notifyEmail">Notification email *</Label>
                <Input id="notifyEmail" type="email" placeholder="sales@vendor.com" className="mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Allow paid lead (Stripe checkout optional)
              </label>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button>Save product</Button>
          <Button variant="outline" asChild>
            <Link href="/vendor/catalog">Cancel</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
