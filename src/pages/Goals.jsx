import { Doughnut, Line } from "react-chartjs-2";
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

// Enregistrement des éléments nécessaires de Chart.js
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
  // --- Données du graphique Doughnut (Gauge)
  const gaugeData = {
    datasets: [
      {
        data: [12500, 7500], // Atteint vs restant
        backgroundColor: ["#0D9488", "#E5E7EB"], // Vert et gris
        borderWidth: 0,
        cutout: "80%",
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const gaugeOptions = {
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  // --- Données du graphique linéaire (Line chart)
  const lineData = {
    labels: ["May 01", "May 05", "May 10", "May 15", "May 20", "May 25", "May 30"],
    datasets: [
      {
        label: "This month",
        data: [3000, 1500, 2500, 4000, 3500, 4200, 3800],
        borderColor: "#0D9488",
        backgroundColor: "rgba(13, 148, 136, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Same period last month",
        data: [2500, 1800, 2000, 3000, 2800, 3200, 3100],
        borderColor: "#9CA3AF",
        backgroundColor: "rgba(156, 163, 175, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // --- Données des catégories
  const categories = [
    { name: "Housing", amount: 250.0 },
    { name: "Food", amount: 250.0 },
    { name: "Transportation", amount: 250.0 },
  ];

  // --- Rendu du composant
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">Goals</h1>
      <p className="text-gray-500 mt-2 mb-6">Vue de vos soldes de comptes.</p>

      {/* Diagrammes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Diagramme Doughnut */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Savings Goal</h2>

          <div className="relative">
            <Doughnut data={gaugeData} options={gaugeOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-gray-500 text-sm">Target Achieved</p>
              <p className="text-2xl font-bold text-teal-600">$12,500</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>This month Target</span>
            <span>$20,000</span>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="border border-teal-600 text-teal-600 px-4 py-1 rounded-lg hover:bg-teal-50 transition">
              Adjust Goal
            </button>
          </div>
        </div>

        {/* Diagramme Linéaire */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Saving Summary</h2>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Cartes des catégories */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Expenses Goals by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center">
            <div className="text-gray-600 font-medium mb-2">{cat.name}</div>
            <p className="text-xl font-bold text-gray-800">${cat.amount.toFixed(2)}</p>
            <button className="mt-3 border border-teal-600 text-teal-600 px-3 py-1 rounded-lg hover:bg-teal-50 transition text-sm">
              Adjust
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
