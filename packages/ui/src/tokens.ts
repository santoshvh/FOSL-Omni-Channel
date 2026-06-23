/** FOSL design tokens — primary yellow from Logo_FOSL.svg */
export const tokens = {
  colors: {
    primary: "#FED318",
    primaryDark: "#E5BC00",
    primaryLight: "#FFF4B8",
    primaryForeground: "#231F20",
    success: "#27AE60",
    warning: "#E67E22",
    error: "#E74C3C",
    muted: "#64748B",
    background: "#F8F9FB",
    card: "#FFFFFF",
    border: "#E8ECF0",
    ink: "#231F20",
  },
  fontFamily: {
    sans: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
    display: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
} as const;

export const productTypeLabels = {
  physical: "Physical",
  digital: "Digital",
  lead_gen: "Lead gen",
} as const;

export const productTypeColors = {
  physical: "bg-primary-muted text-ink",
  digital: "bg-slate-100 text-slate-800",
  lead_gen: "bg-amber-50 text-amber-900",
} as const;

export const roleLabels = {
  admin: "Admin",
  operator: "Operator",
  vendor: "Vendor",
  creator: "Creator",
  customer: "Customer",
} as const;
