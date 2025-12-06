import { z } from "zod";

export const keywordSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string(),
});

export type Keyword = z.infer<typeof keywordSchema>;

export const keywordArraySchema = z.array(keywordSchema);
