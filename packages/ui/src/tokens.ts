/** FOSL design tokens — primary #2E75B6 per architecture doc */
export const tokens = {
  colors: {
    primary: "#2E75B6",
    primaryForeground: "#FFFFFF",
    success: "#27AE60",
    warning: "#E67E22",
    error: "#E74C3C",
    muted: "#64748B",
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
  },
  fontFamily: {
    sans: "Inter, system-ui, -apple-system, sans-serif",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
} as const;

export const productTypeLabels = {
  physical: "Physical",
  digital: "Digital",
  lead_gen: "Lead gen",
} as const;

export const productTypeColors = {
  physical: "bg-blue-100 text-blue-800",
  digital: "bg-purple-100 text-purple-800",
  lead_gen: "bg-amber-100 text-amber-800",
} as const;

export const roleLabels = {
  admin: "Admin",
  operator: "Operator",
  vendor: "Vendor",
  creator: "Creator",
  customer: "Customer",
} as const;
