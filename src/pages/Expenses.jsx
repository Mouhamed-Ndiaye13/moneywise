import React, { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { supabase } from "../supabase";
import { SearchContext } from "../contexts/SearchContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- ExpenseCard component ---
function ExpenseCard({ title, amount, change, isIncrease, items }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 w-full hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <p className="text-gray-800 font-bold">${amount}</p>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>Compare to last month</span>
        <span className={`flex items-center ${isIncrease ? "text-green-600" : "text-red-500"}`}>
          {change}% {isIncrease ? "↑" : "↓"}
        </span>
      </div>

      <div className="border-t pt-3 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-700">
            <span>{item.name}</span>
            <span className="font-medium">${item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Expenses() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: true });
      if (error) console.error(error);
      else setTransactions(data || []);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  // --- Filtrer uniquement les dépenses ---
  const expenses = transactions
    .filter(t => t.type === "Dépense")
    .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- Préparer les données pour le graphique ---
  const monthlyData = Array(12).fill(0); // Jan-Dec
  expenses.forEach(exp => {
    const month = new Date(exp.date).getMonth(); // 0-11
    monthlyData[month] += parseFloat(exp.amount);
  });

  const barData = {
    labels: ["Jan", "Fev", "Mars", "Avril", "Mai", "Juin",
             "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Dépenses mensuelles",
        data: monthlyData,
        backgroundColor: "#1D7874",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Comparaison Mensuelle" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", intersect: false },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
  };

  // --- Calculer total par catégorie pour les cartes ---
  const categoryMap = {};
  expenses.forEach(e => {
    if (!categoryMap[e.category]) categoryMap[e.category] = 0;
    categoryMap[e.category] += parseFloat(e.amount);
  });

  const expenseCards = Object.keys(categoryMap).map(cat => ({
    title: cat,
    amount: categoryMap[cat],
    change: Math.floor(Math.random() * 20), // pour l'exemple
    isIncrease: Math.random() > 0.5,
    items: expenses.filter(e => e.category === cat).map(e => ({ name: e.description, price: e.amount })),
  }));

  if (loading) return <p className="text-center text-gray-500 mt-10">Chargement...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-og mb-4 text-center md:text-left">
        Expenses Comparison
      </h1>

      <div className="w-full mt-6 p-4 bg-white shadow rounded-lg mx-auto overflow-x-auto" style={{ height: 320 }}>
        <Bar data={barData} options={barOptions} />
      </div>

      <h2 className="text-2xl font-bold text-og mt-10 mb-6 text-center md:text-left">
        Expenses Breakdown
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {expenseCards.map((card, i) => (
          <ExpenseCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
}
