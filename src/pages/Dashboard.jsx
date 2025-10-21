import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import CountUp from "react-countup";
import { supabase } from "../supabase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      if (!currentUser) { setLoading(false); return; }
      setUser(currentUser);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("date", { ascending: false });

      if (error) console.error(error);
      else setTransactions(data || []);
      setLoading(false);
    };
    fetchUserAndTransactions();
  }, []);

  // Calculs dynamiques
  const totalBalance = transactions.reduce((acc, t) =>
    t.type === "Revenu" ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount), 0
  );

  const lastTransactions = transactions.slice(0, 5);

  const revenues = transactions.filter(t => t.type === "Revenu");
  const expenses = transactions.filter(t => t.type === "Dépense");

  const barData = {
    labels: ["Revenus", "Dépenses"],
    datasets: [
      {
        label: "Montant",
        data: [revenues.reduce((a, t) => a + parseFloat(t.amount), 0),
               expenses.reduce((a, t) => a + parseFloat(t.amount), 0)],
        backgroundColor: ["#10b981", "#ef4444"],
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: [...new Set(expenses.map(e => e.category))],
    datasets: [
      {
        label: "Répartition des dépenses",
        data: [...new Set(expenses.map(e => e.category))].map(
          cat => expenses.filter(e => e.category === cat)
                         .reduce((a, t) => a + parseFloat(t.amount), 0)
        ),
        backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500 mt-2 md:mt-0">
          Bienvenue, {user?.email || "Utilisateur"}
        </p>
      </header>

      {loading ? <p className="text-center text-gray-500">Chargement...</p> : (
        <>
          {/* Cartes d'info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-400 to-green-500 shadow-lg rounded-xl p-6 hover:scale-105 transform transition-transform">
              <h2 className="text-white text-sm font-medium">Total Balance</h2>
              <p className="text-white text-2xl font-bold">
                $<CountUp end={totalBalance} duration={1.5} separator="," />
              </p>
              <p className="text-green-100 mt-1 text-sm">Compte principal</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transform transition-transform">
              <h2 className="text-gray-500 text-sm font-medium">Dernières Transactions</h2>
              <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {lastTransactions.map((tx, idx) => (
                  <li
                    key={idx}
                    className={`flex justify-between items-center p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer ${
                      tx.type === "Revenu" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <span className="font-medium">{tx.description}</span>
                    <span className={`${tx.type === "Revenu" ? "text-green-600" : "text-red-600"} font-semibold`}>
                      ${tx.amount}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/transactions"
                className="text-blue-500 text-sm mt-2 inline-block hover:underline"
              >
                Voir tout
              </Link>
            </div>

            {/* Graphiques simplifiés */}
            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transform transition-transform">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Revenus vs Dépenses</h2>
              <Bar data={barData} />
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transform transition-transform">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Répartition des dépenses</h2>
              <Pie data={pieData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
