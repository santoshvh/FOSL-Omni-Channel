import type { ShippingMethod } from "@fosl/contracts";
import { formatCurrency, cn } from "../lib/utils";
import { Label } from "./input";

export function ShippingMethodSelector({
  methods,
  selectedId,
  onSelect,
  vendorName,
}: {
  methods: ShippingMethod[];
  selectedId?: string;
  onSelect: (id: string) => void;
  vendorName: string;
}) {
  if (methods.length === 0) {
    return (
      <p className="text-sm text-amber-700">
        No shipping methods available for {vendorName}. Contact the vendor.
      </p>
    );
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-700">
        Shipping from {vendorName}
      </legend>
      {methods.map((method) => (
        <label
          key={method.id}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-md border p-3 transition-colors",
            selectedId === method.id
              ? "border-primary bg-primary-muted"
              : "border-slate-200 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name={`shipping-${method.vendorId}`}
              value={method.id}
              checked={selectedId === method.id}
              onChange={() => onSelect(method.id)}
              className="h-4 w-4 text-primary-dark"
            />
            <div>
              <p className="text-sm font-medium">{method.name}</p>
              <p className="text-xs text-slate-500">
                {method.zone} · {method.estimatedDays}
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold">
            {formatCurrency(method.priceCents)}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
