import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products";
import POS from "./pages/pos";
import Customers from "./pages/customers";
import Reports from "./pages/reports";
import Orders from "./pages/orders";
import Invoice from "./pages/invoice";
import Users from "./pages/users";;


import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<DashboardLayout />}
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="pos"
          element={<POS />}
        />

        <Route
          path="customers"
          element={<Customers />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route path="orders" 
         element={<Orders />} 
        />

        <Route path="users" 
          element={<Users />} 
        />

      </Route>

    </Routes>
  );
}

export default App;