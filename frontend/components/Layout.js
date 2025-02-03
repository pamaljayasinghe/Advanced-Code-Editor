import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Head>
        <title>Advanced Code Editor</title>
        <meta
          name="description"
          content="Real-time collaborative code editor"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
}
