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
import React from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
      borderWidth: 1,
      barThickness: 20,
      borderRadius: 6,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Comparaison Mensuelle" },
  },
};

function ExpenseCard({ icon, title, amount, change, isIncrease, items }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 w-full md:w-[300px]">
      {/* Header */}
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
        <span
          className={`flex items-center ${
            isIncrease ? "" : ""
          }`}
        >
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
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <h1 className="text-2xl font-bold text-gray-600 mb-4">
        Expenses Comparison
      </h1>
      <div className="w-full md:w-[1000px] h-[350px] mt-6 p-4 bg-white shadow rounded-lg mx-auto">
        <Bar data={data} options={options} />
      </div>

      <h2 className="text-2xl font-bold text-gray-600 mt-10 mb-6">
        Expenses Breakdown
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
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
      <div className="grid gap-6 md:grid-cols-3 mt-5">
        <ExpenseCard
          title="Entertainent"
          amount={250}
          change={15}
          isIncrease={true}
          items={[
            { name: "House Rent", price: 230 },
            { name: "Parking", price: 20 },
          ]}
        />
        <ExpenseCard
          title="Shopping"
          amount={350}
          change={8}
          isIncrease={false}
          items={[
            { name: "Grocery", price: 230 },
            { name: "Restaurant bill", price: 120 },
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
