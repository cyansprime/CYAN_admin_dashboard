import z from "zod";

export const customerSchema = z.object({
  id: z.string(),
  company: z.string(),
  contactPerson: z.string(),
  email: z.string(),
  country: z.string(),
  region: z.string(),
  totalOrders: z.number(),
  totalVolume: z.string(),
  totalRevenue: z.number(),
  lastOrder: z.string(),
  status: z.string(),
  tier: z.string(),
});
