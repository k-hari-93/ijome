import Head from "next/head";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";

import { prisma } from "../server/db";
import { appRouter } from "../server/api/root";
import superjson from "superjson";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUserName.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Profile Page</title>
        <meta name="Y" content="Nothing to see here" />
      </Head>
      <main className="flex h-auto justify-center">
        <div>{data.username}</div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("no slug");
  }

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUserName.prefetch({ username });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
