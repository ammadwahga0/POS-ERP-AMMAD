import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Order History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Click any order to view full details.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-5 py-3">
            <p className="text-xs font-bold uppercase text-emerald-600">
              Total Revenue
            </p>
            <p className="text-xl font-black text-emerald-700">
              Rs {totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* ORDERS */}
      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-700">No orders found</p>
          <p className="mt-1 text-sm text-slate-500">
            Completed sales will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black text-slate-900">
                    Order #{order.id}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {order.customer?.name || "Walk-in Customer"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-emerald-600">
                    Rs {order.total}
                  </p>

                  <p className="text-xs font-semibold text-slate-400">
                    {order.items?.length || 0} item
                    {(order.items?.length || 0) === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(order.items || []).slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                  >
                    {item.product?.name || `Product #${item.productId}`} x
                    {item.quantity}
                  </span>
                ))}

                {(order.items?.length || 0) > 3 && (
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Order #{selectedOrder.id}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder.customer?.name || "Walk-in Customer"}
                  {selectedOrder.customer?.phone
                    ? ` • ${selectedOrder.customer.phone}`
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="mb-4 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Items
                  </p>
                  <p className="text-lg font-black text-slate-900">
                    {selectedOrder.items?.length || 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Customer
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedOrder.customer?.name || "Walk-in"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Total
                  </p>
                  <p className="text-lg font-black text-emerald-600">
                    Rs {selectedOrder.total}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(selectedOrder.items || []).map((item, index) => {
                      const quantity = Number(item.quantity || 0);
                      const price = Number(item.price || 0);

                      return (
                        <tr key={index}>
                          <td className="px-4 py-4 font-bold text-slate-800">
                            {item.product?.name ||
                              item.name ||
                              `Product #${item.productId}`}
                          </td>

                          <td className="px-4 py-4 text-center">
                            {quantity}
                          </td>

                          <td className="px-4 py-4 text-right">
                            Rs {price}
                          </td>

                          <td className="px-4 py-4 text-right font-black text-slate-900">
                            Rs {price * quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">
                  Grand Total
                </span>

                <span className="text-2xl font-black text-emerald-600">
                  Rs {selectedOrder.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;