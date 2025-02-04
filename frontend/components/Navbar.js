import { useRouter } from "next/router";
import { handleLogout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  if (router.pathname === "/login" || router.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Code Editor</div>
      <div className="navbar-menu">
        {user && <span className="navbar-username">{user.name}</span>}
        <button className="navbar-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
