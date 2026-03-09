import z from "zod";

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  channels: z.array(z.string()),
  status: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  spent: z.number(),
  reach: z.number(),
  leads: z.number(),
  conversion: z.string(),
});
