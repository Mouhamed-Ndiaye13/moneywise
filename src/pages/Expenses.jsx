import React from "react";
import { Bar } from "react-chartjs-2";
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

// --- DATA ---
const data = {
  labels: [
    "Jan", "Fev", "Mars", "Avril", "Mai", "Juin",
    "Juil", "Aout", "Sept", "Oct", "Nov", "Dec",
  ],
  datasets: [
    {
      label: "Monthly Comparison",
      data: [250, 50, 10, 50, 0, 250, 100, 50, 150, 100, 50, 200],
      backgroundColor: "#1D7874",
      borderWidth: 0,
      // remove fixed barThickness; use responsive controls below
      maxBarThickness: 40,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
      borderRadius: 6,
    },
  ],
};

// --- OPTIONS (responsive friendly) ---
const options = {
  responsive: true,
  maintainAspectRatio: false, // we control height via parent
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Comparaison Mensuelle" },
    tooltip: { mode: "index", intersect: false },
  },
  interaction: {
    mode: "nearest",
    intersect: false,
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 12,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { drawBorder: false },
    },
  },
  elements: {
    bar: {
      borderRadius: 6,
    },
  },
};

// --- ExpenseCard (no fixed width) ---
function ExpenseCard({ icon, title, amount, change, isIncrease, items }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 w-full hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2 rounded-lg">
            <span className="text-lg">{icon}</span>
          </div>
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
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

// --- MAIN COMPONENT ---
export default function Expenses() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-600 mb-4 text-center md:text-left">
        Expenses Comparison
      </h1>

      {/* GRAPH WRAPPER: full width, controlled height */}
      <div className="w-full mt-6 p-4 bg-white shadow rounded-lg mx-auto overflow-x-auto">
        {/* Use an inner div to set height — canvas will stretch to it */}
        <div style={{ width: "100%", height: 320 }}>
          <Bar data={data} options={options} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-600 mt-10 mb-6 text-center md:text-left">
        Expenses Breakdown
      </h2>

      {/* CARDS GRID: responsive columns, no fixed widths */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ExpenseCard
          title="Housing"
          amount={250}
          change={15}
          isIncrease={true}
          items={[
            { name: "House Rent", price: 230 },
            { name: "Parking", price: 20 },
          ]}
        />
        <ExpenseCard
          title="Food"
          amount={350}
          change={8}
          isIncrease={false}
          items={[
            { name: "Grocery", price: 230 },
            { name: "Restaurant bill", price: 120 },
          ]}
        />
        <ExpenseCard
          title="Transportation"
          amount={50}
          change={12}
          isIncrease={false}
          items={[
            { name: "Taxi Fare", price: 30 },
            { name: "Metro Card bill", price: 20 },
          ]}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5">
        <ExpenseCard
          title="Entertainment"
          amount={250}
          change={15}
          isIncrease={true}
          items={[
            { name: "Movies", price: 180 },
            { name: "Concerts", price: 70 },
          ]}
        />
        <ExpenseCard
          title="Shopping"
          amount={350}
          change={8}
          isIncrease={false}
          items={[
            { name: "Clothes", price: 200 },
            { name: "Accessories", price: 150 },
          ]}
        />
        <ExpenseCard
          title="Other"
          amount={50}
          change={12}
          isIncrease={false}
          items={[
            { name: "Taxi Fare", price: 30 },
            { name: "Metro Card bill", price: 20 },
          ]}
        />
      </div>
    </div>
  );
}
