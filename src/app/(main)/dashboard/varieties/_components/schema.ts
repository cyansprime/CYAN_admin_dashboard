import z from "zod";

export const varietySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  maturity: z.string(),
  yieldPotential: z.string(),
  traits: z.array(z.string()),
  status: z.string(),
  generation: z.string(),
  region: z.string(),
  releaseYear: z.string(),
});
