import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const emailRouter = createTRPCRouter({
  generateEmail: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        recipient: z.string(),
        requirements: z.string(),
      }),
    )
    .query(async ({ ctx, input: { subject, recipient, requirements } }) => {
      const completion = await ctx.api.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Make me an email with this subject: ${subject}, for this recipient: ${recipient}, with these requirements: ${requirements}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message.content;
    }),
});
