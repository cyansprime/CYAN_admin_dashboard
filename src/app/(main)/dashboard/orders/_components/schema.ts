import z from "zod";

export const orderSchema = z.object({
  id: z.string(),
  customer: z.string(),
  contactPerson: z.string(),
  variety: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  totalAmount: z.number(),
  destination: z.string(),
  port: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
  orderDate: z.string(),
  shipDate: z.string(),
  eta: z.string(),
});
