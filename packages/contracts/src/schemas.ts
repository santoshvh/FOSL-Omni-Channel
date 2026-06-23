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

export const createOrderLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  shippingMethodId: z.string().optional(),
});

export const createOrderSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  lines: z.array(createOrderLineSchema).min(1, "Cart is empty"),
  shippingCents: z.number().int().nonnegative().default(0),
  taxCents: z.number().int().nonnegative().default(0),
  shipping: shippingAddressSchema.optional(),
  storefrontPath: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
});

export const paymentIntentBodySchema = z.object({
  amountCents: z.number().int().min(50),
  email: z.string().email().optional(),
  lines: z.array(createOrderLineSchema).optional(),
});

export const referralClickSchema = z.object({
  slug: z.string().min(1),
  productId: z.string().optional(),
});

export const commissionPayoutJobSchema = z.object({
  creatorId: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
