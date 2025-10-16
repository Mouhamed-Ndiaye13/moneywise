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

const data = {
  labels: ["Jan", "Fev", "Mars", "Avril", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Monthly Comparaison",
      data: [250, 50, 10, 50, 0, 250, 100, 50, 150, 100, 50, 200],
      backgroundColor: "#1D7874",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
      borderWidth: 1,
      barThickness: 20,     
      maxBarThickness: 60,
      borderRadius: { topLeft: 5, topRight: 5 }, 
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Comparaison Mensuelle" },
  },
};

export default function Expenses() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-500">Expenses Comparaison</h1>
      <div className=" w-[1000px] h-[350px] mt-6 p-4 bg-white shadow rounded-lg">
        <Bar data={data} options={options} />
      </div>
      <div className="border-t-[100px]">
        <h1 className="text-2xl font-bold text-gray-500">Expenses Comparaison</h1>
    </div>

    </div>
  );
}
