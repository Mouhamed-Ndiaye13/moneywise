import { FaBell, FaSearch, FaBars } from "react-icons/fa";

export default function Navbar({ setSidebarOpen }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-green-500 flex items-center justify-between px-4 md:px-6 shadow-md z-50 w-100">
      {/* Hamburger mobile */}
      <button className="md:hidden p-2 mr-4" onClick={() => setSidebarOpen(true)}>
        <FaBars className="text-gray-700 text-xl" />
      </button>
      <div></div>

      {/* Right: Search + Notification */}
      <div className="flex items-center space-x-4 justify-end ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition bg-white">
          <FaBell className="text-green-400 text-lg" />
        </button>
      </div>
    </div>
  );
}
