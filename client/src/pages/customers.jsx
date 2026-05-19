import { useEffect, useState } from "react";
import API from "../services/api";

const emptyForm = {
  name: "",
  phone: "",
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const addCustomer = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) return;

    try {
      setSaving(true);

      await API.post("/customers", {
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      setForm(emptyForm);
      await loadCustomers();
    } catch (error) {
      console.log(error);
      alert("Failed to add customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* FORM */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-950">Add Customer</h2>
          <p className="mt-1 text-sm text-slate-500">
            Save customer details for faster checkout and order history.
          </p>
        </div>

        <form
          onSubmit={addCustomer}
          className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            placeholder="Customer name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <button
            disabled={saving}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Customer List
            </h2>
            <p className="text-sm text-slate-500">
              {customers.length} customer{customers.length === 1 ? "" : "s"} saved
            </p>
          </div>

          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
            Directory
          </span>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-700">
              No customers found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first customer to build the directory.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col gap-3 px-6 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                    {customer.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div>
                    <p className="font-bold text-slate-800">
                      {customer.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Customer ID #{customer.id}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${customer.phone}`}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
                >
                  {customer.phone}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;