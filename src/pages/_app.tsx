import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Y</title>
        <meta
          name="Y - Emote Away"
          content="Express yourself with nothing but emoticons"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
