import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const emptyForm = {
  name: "",
  price: "",
  stock: "",
};

function Products() {
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await API.delete(`/products/${id}`);
      await loadProducts();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const startEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const productName = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!productName) {
      alert("Product name is required");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be 0 or more");
      return;
    }

    const nameExists = products.some(
      (product) =>
        product.name.trim().toLowerCase() === productName.toLowerCase() &&
        product.id !== editing?.id
    );

    if (nameExists) {
      alert(
        "Product name already exists. Edit the existing product or delete it first."
      );
      return;
    }

    const payload = {
      name: productName,
      price,
      stock,
    };

    try {
      setSaving(true);

      if (editing) {
        await API.put(`/products/${editing.id}`, payload);
        setEditing(null);
      } else {
        await API.post("/products", payload);
      }

      setForm(emptyForm);
      await loadProducts();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );

  const lowStockCount = products.filter(
    (product) => Number(product.stock || 0) <= 5
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
          <p className="text-sm font-bold text-slate-500">Products</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {products.length}
          </p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
          <p className="text-sm font-bold text-slate-500">Total Stock</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {totalStock}
          </p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
          <p className="text-sm font-bold text-slate-500">Low Stock</p>
          <p className="mt-2 text-3xl font-black text-red-600">
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            {editing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Product names must be unique. Edit the existing item if it already exists.
          </p>
        </div>

        <form
          onSubmit={saveProduct}
          className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3 xl:grid-cols-4"
        >
          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <input
            type="number"
            min="1"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <input
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <div className="flex gap-3">
            <button
              disabled={saving}
              className="flex-1 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Product"
                : "Add Product"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SEARCH */}
      <div className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
        />
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Product List
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {filtered.length} product{filtered.length === 1 ? "" : "s"} found
            </p>
          </div>

          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
            Inventory
          </span>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-bold text-slate-700">No products found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const isLowStock = Number(product.stock || 0) <= 5;

                  return (
                    <tr key={product.id} className="transition hover:bg-cyan-50/40">
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-800">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                          Product ID #{product.id}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700">
                        Rs {product.price}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            isLowStock
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;