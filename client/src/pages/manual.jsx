function Manual() {
  const sections = [
    {
      title: "Dashboard",
      text: "View total revenue, orders, products, customers, low stock items, and recent sales activity.",
    },
    {
      title: "Products",
      text: "Add products with name, price, and stock. Edit products when prices or stock change. Low stock products are highlighted.",
    },
    {
      title: "POS",
      text: "Select a customer or keep Walk-in Customer. Click products to add them to cart, adjust quantity, then press Checkout to create an order.",
    },
    {
      title: "Invoice",
      text: "After checkout, the invoice page opens automatically. You can print the receipt for the customer.",
    },
    {
      title: "Customers",
      text: "Save customer names and phone numbers so you can attach customers to orders during checkout.",
    },
    {
      title: "Orders",
      text: "See all completed orders. Click any order to view full details including products, quantity, price, and total.",
    },
    {
      title: "Users",
      text: "Create login accounts for people who need access to the system.",
    },
    {
      title: "Logout",
      text: "Use the Logout button from the top-right profile area to safely exit the system.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur-2xl">
        <h1 className="text-2xl font-black tracking-tight text-slate-950">
          User Manual
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Quick guide for using Ammad POS ERP.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-black text-cyan-700">
              {index + 1}
            </div>

            <h2 className="text-lg font-black text-slate-950">
              {section.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {section.text}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6">
        <h2 className="text-lg font-black text-cyan-900">
          Basic Workflow
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          {["Add Products", "Add Customers", "Sell in POS", "Print Invoice"].map(
            (step, index) => (
              <div
                key={step}
                className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm"
              >
                {index + 1}. {step}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Manual;