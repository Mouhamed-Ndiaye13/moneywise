// src/components/Navbar.jsx
import { useState, useEffect, useContext } from "react";
import { FaBell, FaSearch, FaBars } from "react-icons/fa";
import { SearchContext } from "../contexts/SearchContext";
import { supabase } from "../supabase";

export default function Navbar({ setSidebarOpen, user }) {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // --- Fonction pour récupérer les notifications depuis Supabase
  const fetchNotifications = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Erreur fetch notifications :", error);
    else setNotifications(data || []);
  };

  // --- useEffect pour fetch initial et Realtime
  useEffect(() => {
    if (!user) return;

    // Fetch initial
    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // --- Toggle dropdown et marquer comme lu
  const handleToggleDropdown = async () => {
    setDropdownOpen(!dropdownOpen);

    // Marquer les notifications comme lues uniquement si on ouvre
    if (!dropdownOpen && user) {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) console.error("Erreur mise à jour notifications :", error);
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-green-500 flex items-center justify-between px-4 md:px-6 shadow-md z-50 w-full">
      {/* Hamburger mobile */}
      <button className="md:hidden p-2 mr-4" onClick={() => setSidebarOpen(true)}>
        <FaBars className="text-gray-700 text-xl" />
      </button>

      {/* Date */}
      <div className="text-white font-medium hidden md:block">{today}</div>

      {/* Right: Search + Notifications */}
      <div className="flex items-center space-x-4 justify-end">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition bg-white relative"
            onClick={handleToggleDropdown}
          >
            <FaBell className="text-green-400 text-lg" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <h3 className="px-4 py-2 font-semibold text-gray-700 border-b">
                Notifications
              </h3>
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm text-center">
                  Aucune notification
                </p>
              ) : (
                <ul className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`px-4 py-3 border-b text-sm ${
                        notif.type === "success"
                          ? "text-green-600"
                          : notif.type === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {notif.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
