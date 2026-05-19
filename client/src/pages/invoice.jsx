import { useLocation, useNavigate } from "react-router-dom";

function Invoice() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  const printInvoice = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            No invoice data found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please complete a checkout to generate an invoice.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const date = new Date().toLocaleString();
  const items = order.items || [];

  return (
    <div className="flex min-h-screen justify-center bg-slate-100 p-4 print:bg-white print:p-0">
      {/* RECEIPT */}
      <div className="print-area w-full max-w-[380px] rounded-2xl bg-white p-5 text-sm font-mono shadow-xl shadow-slate-200/80 print:w-[320px] print:rounded-none print:p-3 print:shadow-none">
        {/* STORE HEADER */}
        <div className="border-b border-dashed border-slate-300 pb-3 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white print:hidden">
            AP
          </div>

          <h1 className="text-lg font-black tracking-wide text-slate-950">
            AMMAD POS STORE
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Rehman Park Narang Mandi
          </p>

          <p className="text-xs text-slate-500">Tel: 0306-7482717</p>
        </div>

        {/* ORDER INFO */}
        <div className="mt-3 space-y-1 text-xs text-slate-700">
          <div className="flex justify-between gap-3">
            <span>Date</span>
            <span className="text-right">{date}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Invoice ID</span>
            <span>#{order.id}</span>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="mt-3 border-t border-dashed border-slate-300 pt-3 text-xs">
          <p className="font-black text-slate-950">Customer</p>

          <p className="mt-1 text-slate-700">
            {order.customer?.name || "Walk-in Customer"}
          </p>

          {order.customer?.phone && (
            <p className="text-slate-500">{order.customer.phone}</p>
          )}
        </div>

        {/* ITEMS */}
        <div className="mt-3 border-t border-dashed border-slate-300 pt-3">
          <div className="mb-2 flex text-[11px] font-black uppercase text-slate-500">
            <span className="w-1/2">Item</span>
            <span className="w-1/6 text-center">Qty</span>
            <span className="w-1/3 text-right">Amount</span>
          </div>

          {items.length === 0 ? (
            <p className="py-3 text-center text-xs text-slate-500">
              No items found
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => {
                const quantity = Number(item.quantity || item.qty || 0);
                const price = Number(item.price || 0);
                const lineTotal = price * quantity;

                return (
                  <div key={index} className="flex text-xs text-slate-800">
                    <div className="w-1/2 pr-2">
                      {item.product?.name || item.name || "Unknown Product"}
                      <p className="text-[11px] text-slate-500">
                        Rs {price} each
                      </p>
                    </div>

                    <div className="w-1/6 text-center">{quantity}</div>

                    <div className="w-1/3 text-right font-bold">
                      Rs {lineTotal}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOTAL */}
        <div className="mt-3 border-t border-dashed border-slate-300 pt-3">
          <div className="flex justify-between text-base font-black text-slate-950">
            <span>Total</span>
            <span>Rs {order.total}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 border-t border-dashed border-slate-300 pt-3 text-center text-xs text-slate-600">
          <p className="font-bold text-slate-950">Thank you for shopping!</p>
          <p>Visit Again</p>
          <p>Ammad POS Store</p>
        </div>

        {/* BUTTONS */}
        <div className="no-print mt-5 flex gap-3">
          <button
            onClick={printInvoice}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            Print
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-cyan-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;