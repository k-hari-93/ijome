import Head from "next/head";
import { api } from "~/utils/api";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import PostView from "~/components/postview";
import { generateSSGHelpers } from "~/server/utils/ssgHelper";

const SinglePostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data: fullPost, isLoading } = api.posts.getPostById.useQuery({
    postId,
  });

  if (isLoading) return <LoadingPage />;

  if (!fullPost) return <div>No post with this id!!</div>;

  return (
    <>
      <Head>
        <title>{`${fullPost.post.content} - @${fullPost.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...fullPost}></PostView>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelpers();

  const postId = context.params?.id;

  if (typeof postId !== "string") {
    throw new Error("no id");
  }

  await helpers.posts.getPostById.prefetch({ postId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
