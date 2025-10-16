// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Pages principales
// import Settings from "./pages/Settings";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import Transactions from "./pages/Transactions";
// import Balances from "./pages/Balances";
// import Bills from "./pages/Bills";
// import Goals from "./pages/Goals";
// import Expenses from "./pages/Expenses";

// // Pages d’authentification
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Routes publiques */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />

//         {/* Routes protégées */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="transactions" element={<Transactions />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="balances" element={<Balances />} />
//           <Route path="bills" element={<Bills />} />
//           <Route path="expenses" element={<Expenses />} />
//           <Route path="goals" element={<Goals />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

import Expenses from "./pages/Expenses";

export default function App() {
  return (
    <div>
      <Expenses />
    </div>
  );
}

