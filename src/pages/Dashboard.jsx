import React from "react";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import CountUp from "react-countup";
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

// Exemple de données
const balance = 12500.75;
const goalsProgress = 70;
const upcomingBills = [
  { name: "Electricity", due: "2025-10-20", amount: 80 },
  { name: "Internet", due: "2025-10-22", amount: 40 },
];
const lastTransactions = [
  { desc: "Salary", type: "Revenu", amount: 2000, date: "2025-10-01" },
  { desc: "Groceries", type: "Dépense", amount: 150, date: "2025-10-02" },
  { desc: "Freelance", type: "Revenu", amount: 500, date: "2025-10-03" },
  { desc: "Rent", type: "Dépense", amount: 600, date: "2025-10-05" },
  { desc: "Gym", type: "Dépense", amount: 50, date: "2025-10-06" },
];

// Graphiques
const barData = {
  labels: ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"],
  datasets: [
    { label: "Revenus", data: [2000, 1500, 1800, 2200], backgroundColor: "#10b981" },
    { label: "Dépenses", data: [1200, 1300, 1100, 1400], backgroundColor: "#ef4444" },
  ],
};
const pieData = {
  labels: ["Alimentation", "Loyer", "Transport", "Loisirs", "Autres"],
  datasets: [
    {
      label: "Répartition des dépenses",
      data: [500, 600, 200, 150, 100],
      backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"],
    },
  ],
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Accueil / Vue d’ensemble</h1>

      {/* Cartes d'info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-500 shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
          <h2 className="text-white text-sm font-medium">Total Balance</h2>
          <p className="text-white text-2xl font-bold">
            $<CountUp end={balance} duration={1.5} separator="," />
          </p>
          <p className="text-green-100 mt-1 text-sm">Compte principal</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
          <h2 className="text-gray-500 text-sm font-medium">Goals</h2>
          <p className="text-gray-800 text-2xl font-bold">{goalsProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${goalsProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
          <h2 className="text-gray-500 text-sm font-medium">Upcoming Bills</h2>
          {upcomingBills.map((bill, idx) => (
            <p key={idx} className="text-gray-800 mt-1 hover:text-green-500 transition-colors">
              {bill.name} - ${bill.amount} ({bill.due})
            </p>
          ))}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
          <h2 className="text-gray-500 text-sm font-medium">Dernières Transactions</h2>
          {lastTransactions.map((tx, idx) => (
            <p
              key={idx}
              className={`mt-1 font-medium ${
                tx.type === "Revenu" ? "text-green-500" : "text-red-500"
              } hover:underline cursor-pointer`}
            >
              {tx.desc} - ${tx.amount} ({tx.date})
            </p>
          ))}
          <Link
            to="/transactions"
            className="text-blue-500 text-sm mt-2 inline-block hover:underline"
          >
            Voir tout
          </Link>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
          <h2 className="text-gray-500 text-sm mb-4 font-medium">Revenus vs Dépenses (hebdo)</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
          <h2 className="text-gray-500 text-sm mb-4 font-medium">Répartition des dépenses</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
