import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Layout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r animate-slideIn">
        <nav className="p-4 space-y-2">
          <Link to="/students">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Users className="h-4 w-4" />
              Students
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}