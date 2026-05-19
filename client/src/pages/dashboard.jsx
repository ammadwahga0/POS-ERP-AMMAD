import { useEffect, useState } from "react";
import API from "../services/api";

const statCards = [
  {
    label: "Revenue",
    key: "totalRevenue",
    prefix: "Rs ",
    accent: "from-emerald-500 to-teal-500",
    text: "text-emerald-600",
  },
  {
    label: "Orders",
    key: "totalOrders",
    accent: "from-blue-500 to-cyan-500",
    text: "text-blue-600",
  },
  {
    label: "Products",
    key: "totalProducts",
    accent: "from-violet-500 to-fuchsia-500",
    text: "text-violet-600",
  },
  {
    label: "Customers",
    key: "totalCustomers",
    accent: "from-amber-500 to-orange-500",
    text: "text-orange-600",
  },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await API.get("/analytics");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 rounded-2xl bg-white shadow-sm border border-slate-100"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-80 rounded-2xl bg-white shadow-sm border border-slate-100" />
          <div className="h-80 rounded-2xl bg-white shadow-sm border border-slate-100" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
        Unable to load dashboard analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${card.accent} opacity-10 transition-opacity group-hover:opacity-20`}
            />

            <div
              className={`mb-5 h-2 w-14 rounded-full bg-gradient-to-r ${card.accent}`}
            />

            <p className="text-sm font-medium text-slate-500">
              {card.label}
            </p>

            <h2 className={`mt-3 text-3xl font-black tracking-tight ${card.text}`}>
              {card.prefix || ""}
              {stats[card.key] ?? 0}
            </h2>

            <p className="mt-3 text-xs font-medium text-slate-400">
              Updated from live analytics
            </p>
          </div>
        ))}
      </div>

      {/* LOW STOCK + RECENT ORDERS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* LOW STOCK */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Low Stock Products
              </h2>
              <p className="text-sm text-slate-500">
                Items that may need restocking soon
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              {(stats.lowStock || []).length} Alert
            </span>
          </div>

          {(stats.lowStock || []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-700">
                Stock levels look good
              </p>
              <p className="mt-1 text-sm text-slate-500">
                No low stock items right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Product ID #{item.id}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT ORDERS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Recent Orders
              </h2>
              <p className="text-sm text-slate-500">
                Latest sales activity
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              Live
            </span>
          </div>

          {(stats.recentOrders || []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-700">
                No recent orders
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New orders will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-slate-500">
                      {order.customer?.name || "Walk-in customer"}
                    </p>
                  </div>

                  <span className="text-lg font-black text-emerald-600">
                    Rs {order.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;