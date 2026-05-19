import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadPOSData = async () => {
      setLoading(true);
      await Promise.all([loadProducts(), loadCustomers()]);
      setLoading(false);
    };

    loadPOSData();
  }, []);

  const getCartQty = (productId) => {
    return cart.find((item) => item.id === productId)?.qty || 0;
  };

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    const existingQty = getCartQty(product.id);
    if (existingQty >= product.stock) return;

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const inc = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.qty < item.stock
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  const dec = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer("");
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const checkout = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      setCheckingOut(true);

      const res = await API.post("/orders", {
        cart,
        total,
        customerId: selectedCustomer || null,
      });

      setCart([]);
      await loadProducts();

      navigate("/dashboard/invoice", {
        state: {
          order: res.data,
        },
      });
    } catch (error) {
      console.log(error);
      alert("Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
      {/* LEFT - PRODUCTS */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tap products to add them to the current sale.
              </p>
            </div>

            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 lg:w-72"
            >
              <option value="">Walk-in Customer</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <p className="font-semibold text-slate-700">
                No products available
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add products before starting a sale.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const inCart = getCartQty(product.id);
                const isOut = product.stock <= 0;
                const isMaxed = inCart >= product.stock;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={isOut || isMaxed}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${
                      isOut || isMaxed
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                        : "border-slate-100 bg-white hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-850">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-xl font-black text-emerald-600">
                          Rs {product.price}
                        </p>
                      </div>

                      {inCart > 0 && (
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                          {inCart} added
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          product.stock <= 5
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {isOut ? "Out of stock" : `${product.stock} in stock`}
                      </span>

                      <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-600">
                        {isMaxed ? "Max added" : "Add"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT - CART */}
      <aside className="rounded-2xl border border-slate-100 bg-white shadow-sm xl:sticky xl:top-6 xl:self-start">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Cart</h2>
              <p className="mt-1 text-sm text-slate-500">
                {itemCount} item{itemCount === 1 ? "" : "s"} in sale
              </p>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[440px] overflow-y-auto px-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-semibold text-slate-700">No items in cart</p>
              <p className="mt-1 text-sm text-slate-500">
                Select products to start checkout.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Rs {item.price} each
                      </p>
                    </div>

                    <p className="font-black text-slate-900">
                      Rs {Number(item.price) * item.qty}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => dec(item.id)}
                        className="h-9 w-10 bg-slate-50 text-lg font-bold text-red-600 transition hover:bg-red-50"
                      >
                        -
                      </button>

                      <span className="flex h-9 w-12 items-center justify-center text-sm font-bold text-slate-800">
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => inc(item.id)}
                        disabled={item.qty >= item.stock}
                        className="h-9 w-10 bg-slate-50 text-lg font-bold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      Stock {item.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-6">
          <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Total</span>
              <span>{itemCount} items</span>
            </div>

            <div className="mt-3 text-3xl font-black tracking-tight">
              Rs {total}
            </div>
          </div>

          <button
            onClick={checkout}
            disabled={cart.length === 0 || checkingOut}
            className="w-full rounded-xl bg-cyan-600 p-4 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {checkingOut ? "Processing..." : "Checkout"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default POS;