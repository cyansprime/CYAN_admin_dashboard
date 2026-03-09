import z from "zod";

export const contentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  format: z.string(),
  duration: z.string(),
  channels: z.array(z.string()),
  status: z.string(),
  publishDate: z.string(),
  reach: z.number(),
  engagement: z.number(),
});
