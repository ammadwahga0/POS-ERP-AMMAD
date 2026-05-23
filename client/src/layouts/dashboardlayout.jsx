import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    [
      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
      isActive
        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
        : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-md",
    ].join(" ");

  const navItems = [
    ["Dashboard", "/dashboard"],
    ["Products", "/dashboard/products"],
    ["POS", "/dashboard/pos"],
    ["Customers", "/dashboard/customers"],
    ["Orders", "/dashboard/orders"],
    ["Users", "/dashboard/users"],
    ['Manual', '/dashboard/manual']
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#f8fafc,_#eef6ff)] text-slate-900">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-72 border-r border-white/70 bg-white/75 p-5 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
          <div className="mb-10 flex items-center gap-3 rounded-3xl bg-white p-3 shadow-lg shadow-cyan-900/5">
            <img
              src={logo}
              alt="Ammad POS Store"
              className="h-12 w-12 rounded-2xl object-cover shadow-md"
            />

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-950">
                POS ERP
              </h1>
              <p className="text-xs font-semibold text-slate-400">
                Ammad POS Store
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(([label, to]) => (
              <NavLink
                key={to}
                end={to === "/dashboard"}
                className={navLinkClass}
                to={to}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-500 transition group-hover:bg-cyan-50 group-hover:text-cyan-600">
                  {label.charAt(0)}
                </span>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 lg:p-8">
          <header className="mb-8 flex items-center justify-between rounded-3xl border border-white/80 bg-white/75 px-6 py-5 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Dashboard
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Manage your POS system
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-800">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-slate-500">
                  {user?.email || "Logged in"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-md shadow-red-900/5 transition hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="animate-[fadeIn_0.35s_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;