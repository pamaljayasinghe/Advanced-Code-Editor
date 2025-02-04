import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Code Editor</title>
        <meta name="description" content="Online collaborative code editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <main>{children}</main>
    </>
  );
}
