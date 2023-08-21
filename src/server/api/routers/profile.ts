import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import filterUserFieldsForClient from "~/server/utils/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = (
        await clerkClient.users.getUserList({
          username: [input.username],
        })
      ).map(filterUserFieldsForClient);

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return user;
    }),
});
