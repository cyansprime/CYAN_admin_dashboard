import z from "zod";

export const recentOrderSchema = z.object({
  id: z.string(),
  customer: z.string(),
  variety: z.string(),
  quantity: z.string(),
  destination: z.string(),
  status: z.string(),
  date: z.string(),
});
