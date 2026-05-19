import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

function Users() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const createUser = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("User created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "staff",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">
          Create Login User
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new staff or admin account for the system.
        </p>

        <form
          onSubmit={createUser}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />

          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            disabled={loading}
            className="md:col-span-2 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-cyan-600 disabled:bg-slate-300"
          >
            {loading ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Users;