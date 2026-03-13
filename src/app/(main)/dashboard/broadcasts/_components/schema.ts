import z from "zod";

export const broadcastSchema = z.object({
  id: z.string(),
  title: z.string(),
  channel: z.string(),
  type: z.string(),
  audience: z.string(),
  audienceSize: z.number(),
  status: z.string(),
  scheduledAt: z.string(),
  openRate: z.string(),
  clickRate: z.string(),
  audioPath: z.string().optional(),
  approvalStatus: z.string().optional(),
});
