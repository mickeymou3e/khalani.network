import type { AppProps } from "next/app";
import Head from "next/head";
import "./style.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Khalani Arcadia Faucet | Claim Your Testnet Tokens Now!</title>
        <meta
          name="description"
          content="Claim your testnet tokens for Khalani Arcadia using this faucet. Click to get started!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />{" "}
      </Head>
      <Component {...pageProps} />
    </>
  );
}
