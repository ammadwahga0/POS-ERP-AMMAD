import { Outlet, NavLink, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-72 min-h-screen bg-slate-950 text-white p-5 shadow-2xl">
        <h1 className="text-xl font-bold mb-8">POS ERP</h1>

        <nav className="space-y-2">
          <NavLink className="nav-item" to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink className="nav-item" to="/dashboard/products">
            Products
          </NavLink>

          <NavLink className="nav-item" to="/dashboard/pos">
            POS
          </NavLink>

          <NavLink className="nav-item" to="/dashboard/customers">
            Customers
          </NavLink>

          <NavLink className="nav-item" to="/dashboard/orders">
            Orders
          </NavLink>

          <NavLink className="nav-item" to="/dashboard/users">
            Users
          </NavLink>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-8">
        <header className="mb-8 rounded-2xl border border-white/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Dashboard
            </h2>
            <p className="text-sm text-slate-500">
              Manage your POS system
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email || "Logged in"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-600 text-sm font-black text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;