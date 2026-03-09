import z from "zod";

export const inventorySchema = z.object({
  id: z.string(),
  variety: z.string(),
  varietyName: z.string(),
  batchDate: z.string(),
  quantity: z.number(),
  unit: z.string(),
  warehouse: z.string(),
  germination: z.string(),
  purity: z.string(),
  moisture: z.string(),
  status: z.string(),
  expiryDate: z.string(),
});
