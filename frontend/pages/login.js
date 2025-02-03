import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { login } from "../lib/api";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login...");
      const response = await login(credentials);
      console.log("Login response:", response);

      if (response?.token) {
        // Store token and user data
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        console.log("Redirecting to editor...");
        // Force a hard navigation to ensure proper page reload
        window.location.href = "/";
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Code Editor</title>
      </Head>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Welcome Back</h1>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="secondary-button"
            disabled={isLoading}
          >
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}
