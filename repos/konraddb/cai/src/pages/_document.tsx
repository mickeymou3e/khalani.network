import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

type Props = {
  nonce?: string;
};

const CustomDocument = ({ nonce }: Props) => (
  <Html lang="en">
    <Head nonce={nonce} />
    <body>
      <Main />
      <NextScript nonce={nonce} />
    </body>
  </Html>
);

CustomDocument.getInitialProps = async (context: DocumentContext) => {
  const initialProps = await Document.getInitialProps(context);
  return {
    ...initialProps,
    // x-nonce header set in middleware.ts
    nonce: context.req?.headers["x-nonce"],
  };
};

export default CustomDocument;
