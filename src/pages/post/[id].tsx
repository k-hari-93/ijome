import Head from "next/head";
import { useRouter } from "next/router";

export default function PostPage() {
  const r = useRouter();

  return (
    <>
      <Head>
        <title>Post Page</title>
      </Head>
      <main className="flex h-auto justify-center">
        <div>Post View</div>
      </main>
    </>
  );
}
