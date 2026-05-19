import { useEffect, useState } from "react";
import API from "../services/api";

function Analytics() {

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStock: [],
  });

  const load = async () => {
    const res = await API.get("/analytics");
    setStats(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2>Revenue</h2>
        <h1 className="text-2xl font-bold">
          Rs {stats.totalSales}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2>Orders</h2>
        <h1 className="text-2xl font-bold">
          {stats.totalOrders}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2>Products</h2>
        <h1 className="text-2xl font-bold">
          {stats.totalProducts}
        </h1>
      </div>

      <div className="col-span-3 bg-white p-6 rounded-xl shadow-sm">

        <h2 className="font-bold mb-3">
          Low Stock
        </h2>

        {(stats.lowStock || []).map((p) => (
          <div key={p.id}>
            {p.name} - {p.stock}
          </div>
        ))}

      </div>

    </div>
  );
}

export default Analytics;