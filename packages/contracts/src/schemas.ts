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

export const connectIntegrationSchema = z.object({
  vendorId: z.string().min(1).optional(),
  platform: z.enum(["shopify", "woocommerce"]),
  storeUrl: z.string().min(1),
  syncShipping: z.boolean().default(true),
  syncIntervalMinutes: z.number().int().min(15).optional(),
  accessToken: z.string().optional(),
  consumerKey: z.string().optional(),
  consumerSecret: z.string().optional(),
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

export const updateOrderSchema = z.object({
  status: z
    .enum(["processing", "shipped", "delivered", "cancelled", "refunded", "lead_received"])
    .optional(),
  lineUpdates: z
    .array(
      z.object({
        orderLineId: z.string(),
        trackingNumber: z.string().optional(),
        downloadUrl: z.string().optional(),
        leadStatus: z.string().optional(),
      })
    )
    .optional(),
});

const secretField = z.string().optional();

export const platformSettingsPatchSchema = z.object({
  database: z
    .object({
      host: z.string().min(1).optional(),
      port: z.number().int().positive().optional(),
      database: z.string().min(1).optional(),
      username: z.string().min(1).optional(),
      password: secretField,
    })
    .optional(),
  appUrls: z
    .object({
      hub: z.string().url().optional(),
      storefront: z.string().url().optional(),
      admin: z.string().url().optional(),
    })
    .optional(),
  auth: z
    .object({
      enabled: z.boolean().optional(),
      authUrl: z.string().url().optional(),
      authSecret: secretField,
    })
    .optional(),
  apiMocking: z.object({ enabled: z.boolean().optional() }).optional(),
  storefront: z
    .object({
      subscriptionState: z
        .enum(["trial", "active", "past_due", "grace_period", "suspended", "cancelled", "enterprise"])
        .optional(),
    })
    .optional(),
  jobs: z.object({ payoutJobSecret: secretField }).optional(),
  featureFlags: z
    .object({
      marketplace: z.boolean().optional(),
      referralTree: z.boolean().optional(),
      leadGen: z.boolean().optional(),
      bigcommerce: z.boolean().optional(),
    })
    .optional(),
  autoDeploy: z
    .object({
      enabled: z.boolean().optional(),
      branch: z.string().min(1).optional(),
      githubRepo: z.string().optional(),
      webhookUrl: z.string().optional(),
      deployHub: z.boolean().optional(),
      deployStorefront: z.boolean().optional(),
      deployAdmin: z.boolean().optional(),
      webhookSecret: secretField,
    })
    .optional(),
  fileStorage: z
    .object({
      provider: z.enum(["local", "s3"]).optional(),
      localUploadDir: z.string().min(1).optional(),
      s3Bucket: z.string().optional(),
      s3Region: z.string().optional(),
      s3PublicUrlPrefix: z.string().optional(),
      s3AccessKey: secretField,
      s3SecretKey: secretField,
    })
    .optional(),
  email: z
    .object({
      provider: z.enum(["postmark", "resend", "console"]).optional(),
      fromAddress: z.string().email().optional(),
      postmarkServerToken: secretField,
      resendApiKey: secretField,
    })
    .optional(),
  stripe: z
    .object({
      connectEnabled: z.boolean().optional(),
      secretKey: secretField,
      publishableKey: secretField,
      webhookSecret: secretField,
    })
    .optional(),
});
