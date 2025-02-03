import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

// Dynamically import CodeEditor with no SSR
const CodeEditor = dynamic(() => import("../components/CodeEditor"), {
  ssr: false,
});

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      console.log(
        "Checking authentication token:",
        token ? "exists" : "not found"
      );

      if (!token) {
        console.log("No token found, redirecting to login...");
        router.push("/login");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="editor-container">
        <CodeEditor />
      </div>
    </Layout>
  );
}
