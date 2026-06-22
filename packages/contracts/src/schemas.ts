import { z } from "zod";

export const productTypeSchema = z.enum(["physical", "digital", "lead_gen"]);

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().max(1000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to be contacted" }),
  }),
});

export const checkoutContactSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  marketingOptIn: z.boolean().optional(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  line1: z.string().min(3, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/region is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(32),
  discountType: z.enum(["fixed", "percentage"]),
  discountValue: z.number().positive(),
  scope: z.enum(["storefront", "vendor", "product", "collection"]),
  expiresAt: z.string(),
  maxRedemptions: z.number().int().positive().optional(),
});

export const roleSwitchSchema = z.object({
  role: z.enum(["operator", "vendor", "creator"]),
});
