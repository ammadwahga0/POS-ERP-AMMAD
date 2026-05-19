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

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (error) {
      console.log(error);
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

    await API.delete(`/products/${id}`);
    loadProducts();
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

    if (!form.name || !form.price || !form.stock) return;

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editing) {
      await API.put(`/products/${editing.id}`, payload);
      setEditing(null);
    } else {
      await API.post("/products", payload);
    }

    setForm(emptyForm);
    loadProducts();
  };

  const filtered = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="space-y-6">
      {/* FORM */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-950">
            {editing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep your inventory pricing and stock levels updated.
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />

          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-cyan-500/20">
              {editing ? "Update Product" : "Add Product"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
        />
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Product List</h2>
            <p className="text-sm text-slate-500">
              {filtered.length} product{filtered.length === 1 ? "" : "s"} found
            </p>
          </div>

          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
            Inventory
          </span>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-700">No products found</p>
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
                  const isLowStock = product.stock <= 5;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Product ID #{product.id}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-700">
                        Rs {product.price}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
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
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
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