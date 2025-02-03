import Link from "next/link";
import { useRouter } from "next/router";
import { getUser } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (router.pathname === "/login" || router.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        Code Editor
      </Link>

      <div className="navbar-menu">
        {user ? (
          <>
            <span style={{ color: "var(--text-light)" }}>{user.name}</span>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
