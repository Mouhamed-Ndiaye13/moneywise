// src/pages/Goals.jsx
import React, { useState, useEffect, useContext } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { supabase } from "../supabase";
import { SearchContext } from "../contexts/SearchContext";
import { sendNotification } from "../utils/notifications";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend
);

export default function Goals() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(20000);
  const [showModal, setShowModal] = useState(false);
  const [goalInput, setGoalInput] = useState(monthlyGoal);
  const { searchQuery } = useContext(SearchContext);

  const [user, setUser] = useState(null);

  // Récupération de l'utilisateur courant
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
    };
    fetchUser();
  }, []);

  

  // Récupération des transactions
  useEffect(() => {
    if (!user) return;
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });
      if (!error && data) setTransactions(data);
    };
    fetchTransactions();
  }, [user]);

  // Récupération de l'objectif du mois depuis Supabase
  useEffect(() => {
    if (!user) return;
    const fetchGoal = async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("goal")
        .eq("user_id", user.id)
        .eq("month", new Date().getMonth() + 1)
        .single();
      if (!error && data) {
        setMonthlyGoal(data.goal);
        setGoalInput(data.goal);
      }
    };
    fetchGoal();
  }, [user]);

  // Filtrage des transactions du mois et selon le search
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      new Date(tx.date).getMonth() === new Date().getMonth()
  );

  const totalSaved = filteredTransactions.reduce(
    (acc, tx) => acc + parseFloat(tx.amount),
    0
  );

  // Doughnut chart dynamique
  const gaugeData = {
    datasets: [
      {
        data: [totalSaved, Math.max(monthlyGoal - totalSaved, 0)],
        backgroundColor: ["#0D9488", "#E5E7EB"],
        borderWidth: 0,
        cutout: "80%",
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const gaugeOptions = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
  };

  // Line chart
  const daysInMonth = Array.from({ length: new Date().getDate() }, (_, i) => i + 1);
  const lineData = {
    labels: daysInMonth.map((d) => `Day ${d}`),
    datasets: [
      {
        label: "Revenus du mois",
        data: daysInMonth.map(
          (d) =>
            filteredTransactions
              .filter((tx) => new Date(tx.date).getDate() === d)
              .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
        ),
        borderColor: "#0D9488",
        backgroundColor: "rgba(13,148,136,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const lineOptions = { responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } };

  // Sauvegarde de l'objectif
  const saveGoal = async () => {
    if (!user) return;
    const goalValue = parseFloat(goalInput);
    if (isNaN(goalValue)) return;

    const { error } = await supabase
      .from("goals")
      .upsert(
        [{ user_id: user.id, month: new Date().getMonth() + 1, goal: goalValue }],
        { onConflict: ["user_id", "month"] }
      );
    if (!error) {
      setMonthlyGoal(goalValue);
      setShowModal(false);
    } else {
      alert("Erreur lors de la sauvegarde de l'objectif : " + error.message);
    }
  };

  // après calcul de totalSaved
useEffect(() => {
  if (user && totalSaved >= monthlyGoal) {
    sendNotification(user.id, "🎉 Vous avez atteint votre objectif du mois !", "success");
  }
}, [totalSaved, monthlyGoal, user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">Goals</h1>
      <p className="text-gray-500 mt-2 mb-6">Vue de vos soldes de comptes.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Doughnut chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md relative">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Savings Goal</h2>
          <Doughnut data={gaugeData} options={gaugeOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm">Target Achieved</p>
            <p className="text-2xl font-bold text-teal-600">${totalSaved}</p>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>This month Target</span>
            <span>${monthlyGoal}</span>
          </div>

          <div className="mt-4 flex justify-center relative z-10">
  <button
    type="button"
    onClick={() => setShowModal(true)}
    className="cursor-pointer border border-teal-600 text-teal-600 px-4 py-1 rounded-lg hover:bg-teal-50 transition"
  >
    Adjust Goal
  </button>
</div>
        </div>

        {/* Line chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Saving Summary</h2>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Modal pour définir l'objectif */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Définir votre objectif du mois</h3>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-4"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={saveGoal}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
