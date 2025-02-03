import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { checkAuth } from "../lib/auth";

const CodeEditor = dynamic(() => import("../components/CodeEditor"), {
  ssr: false,
});

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = checkAuth();
    if (!auth) {
      router.push("/login");
    }
    setIsAuthenticated(auth);
  }, []);

  return (
    <Layout>
      <div className="editor-container">
        {isAuthenticated && <CodeEditor />}
      </div>
    </Layout>
  );
}
