import { SignInButton, useUser } from "@clerk/nextjs";
import { type RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function Home() {
  const CreatePostWizard = () => {
    const { user } = useUser();
    const [input, setInput] = useState("");
    const ctx = api.useContext();

    if (!user) return null;

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        void ctx.posts.getAll.invalidate();
      },
      onError: ({ data }) => {
        const errorMessage = data?.zodError?.fieldErrors?.content;
        if (errorMessage?.[0]) toast.error(errorMessage[0]);
        else toast.error("Failed to post. Please try again later.");
      },
    });

    return (
      <div className="flex w-full gap-3">
        <Image
          src={user.imageUrl}
          alt="Profile Picture"
          className="h-12 w-12 rounded-full"
          width={48}
          height={48}
        />
        <input
          placeholder="Type some emojis!!"
          className="grow bg-transparent outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input !== "") mutate({ content: input });
            }
          }}
          disabled={isPosting}
        />
        {input !== "" && !isPosting && (
          <button
            disabled={input.length === 0}
            onClick={() => mutate({ content: input })}
          >
            Post
          </button>
        )}
        {isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={25} />
          </div>
        )}
      </div>
    );
  };

  type PostWithUser = RouterOutputs["posts"]["getAll"][number];

  const PostView = (props: PostWithUser) => {
    const { post, author } = props;
    return (
      <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
        <Image
          src={author.profileImage}
          alt={`${author.username}'s profile picture`}
          className="h-12 w-12 rounded-full"
          width={48}
          height={48}
        />
        <div className="flex flex-col">
          <div className="flex gap-1 text-slate-100">
            <Link href={`/@${author.username}`}>
              <span>{`@${author.username}`}</span>
            </Link>
            <span className="font-thin">·</span>
            <Link href={`/post/${post.id}`}>
              <span className="font-thin">
                {dayjs(post.createdAt).fromNow()}
              </span>
            </Link>
          </div>
          <span>{post.content}</span>
        </div>
      </div>
    );
  };

  const Feed = () => {
    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

    if (postsLoading) return <LoadingPage />;

    if (!data) return <div>Something went wrong</div>;

    return (
      <div className="flex flex-col">
        {data.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))}
      </div>
    );
  };

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded) return <div></div>;

  return (
    <main className="flex h-auto justify-center">
      <div className="w-full border-x border-slate-400 md:max-w-2xl">
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </div>
    </main>
  );
}
