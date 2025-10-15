import { useNavigate, Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { 
  FaHome, 
  FaWallet, 
  FaExchangeAlt, 
  FaFileInvoice, 
  FaChartPie, 
  FaBullseye, 
  FaCog, 
  FaSignOutAlt, 
  FaTimes 
} from "react-icons/fa";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const menuItems = [
    { name: "Overview", icon: <FaHome />, path: "/" },
    { name: "Balances", icon: <FaWallet />, path: "/balances" },
    { name: "Transactions", icon: <FaExchangeAlt />, path: "/transactions" },
    { name: "Bills", icon: <FaFileInvoice />, path: "/bills" },
    { name: "Expenses", icon: <FaChartPie />, path: "/expenses" },
    { name: "Goals", icon: <FaBullseye />, path: "/goals" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-gray-200 transform md:translate-x-0 transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button mobile */}
        <div className="flex justify-end md:hidden p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-white text-xl" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 py-4 text-2xl font-bold text-white mt-16 md:mt-0 bg-green-500 text-center shadow-md">
          MoneyWise
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 space-y-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 my-2 rounded-md text-white hover:bg-gray-700 transition ${
                location.pathname === item.path
                  ? "bg-green-500 text-white"
                  : "text-gray-300"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout button (fixed at bottom) */}
        <div className="absolute bottom-0 w-full px-6 py-4 bg-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-medium transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}
