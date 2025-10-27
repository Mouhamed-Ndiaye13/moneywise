import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import CountUp from "react-countup";
import { supabase } from "../supabase";
import { SearchContext } from "../contexts/SearchContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { Wallet, CreditCard, FileText } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend,
  LabelList,
} from "recharts";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [bills, setBills] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { searchQuery } = useContext(SearchContext);
  const [filteredBills, setFilteredBills] = useState([]);

  useEffect(() => {
    setFilteredBills(
      bills.filter((bill) =>
        bill.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, bills]);

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      if (!currentUser) { setLoading(false); return; }
      setUser(currentUser);

      const [{ data: txData }, { data: accData }, { data: billsData }] = await Promise.all([
        supabase.from("transactions").select("*").eq("user_id", currentUser.id).order("date", { ascending: false }),
        supabase.from("accounts").select("*").eq("user_id", currentUser.id),
        supabase.from("bills").select("*").eq("user_id", currentUser.id).order("due_date", { ascending: true })
      ]);

      setTransactions(txData || []);
      setAccounts(accData || []);
      setBills(billsData || []);
      setLoading(false);
    };
    fetchUserAndData();
  }, []);

  const totalBalance = accounts.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0);
  const lastTransactions = transactions.slice(0, 5);
  const revenues = transactions.filter(t => t.type === "Revenu");
  const expenses = transactions.filter(t => t.type === "Dépense");

  const dataRechart = [
    {
      name: "Revenus",
      montant: revenues.reduce((a, t) => a + parseFloat(t.amount || 0), 0),
      fill: "#10b981",
    },
    {
      name: "Dépenses",
      montant: expenses.reduce((a, t) => a + parseFloat(t.amount || 0), 0),
      fill: "#ef4444",
    },
  ];

  const pieData = {
    labels: [...new Set(expenses.map(e => e.category))],
    datasets: [
      {
        label: "Répartition des dépenses",
        data: [...new Set(expenses.map(e => e.category))].map(
          cat => expenses.filter(e => e.category === cat)
                         .reduce((a, t) => a + parseFloat(t.amount || 0), 0)
        ),
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h1 className="text-4xl font-bold text-og flex items-center gap-2">
          <Wallet className="text-og w-8 h-8" />
          Dashboard
        </h1>
        <p className="text-og mt-2 md:mt-0">
          Bonjour, <span className="font-semibold text-gray-700">{user?.email || "Utilisateur"}</span>
        </p>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Solde total */}
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium">Solde total</h2>
            <CreditCard className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-3xl font-bold mt-2">
            $<CountUp end={totalBalance} duration={1.5} separator="," />
          </p>
          <p className="text-green-100 text-sm mt-1">Tous comptes</p>
        </motion.div>

        {/* Revenus vs Dépenses (Recharts) */}
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 col-span-1 sm:col-span-2 lg:col-span-1">
          <h2 className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="text-blue-500 w-4 h-4" /> Revenus vs Dépenses
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRechart} barSize={60} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 13 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <ReTooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                    color: "#fff",
                  }}
                  formatter={(value) => [`$${value}`, "Montant"]}
                />
                <ReLegend verticalAlign="top" height={30} />
                <Bar dataKey="montant" radius={[10, 10, 0, 0]}>
                  <LabelList dataKey="montant" position="top" formatter={(v) => `$${v}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Répartition */}
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 ">
          <h2 className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="text-purple-500 w-4 h-4" /> Répartition des dépenses
          </h2>
          <Pie data={pieData} />
        </motion.div>

        {/* Dernières transactions */}
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-gray-600 text-sm font-semibold mb-3">Dernières Transactions</h2>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {lastTransactions.map((tx, idx) => (
              <li
                key={idx}
                className={`flex justify-between items-center p-2 rounded-md text-sm ${
                  tx.type === "Revenu" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                <span className="font-medium">{tx.description}</span>
                <span className="font-bold">${tx.amount}</span>
              </li>
            ))}
          </ul>
          <Link to="/transactions" className="text-blue-500 text-xs mt-3 inline-block hover:underline">
            Voir tout
          </Link>
        </motion.div>
      </div>

      {/* Section Factures */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
      >
        <h2 className="text-gray-600 text-sm font-semibold mb-3">Factures à venir</h2>
        {filteredBills.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">Aucune facture trouvée.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredBills.map((bill) => (
              <li
                key={bill.id}
                className={`flex justify-between items-center py-2 ${
                  bill.status === "Payé"
                    ? "text-green-700 bg-green-50 rounded-md px-2"
                    : "text-yellow-700 bg-yellow-50 rounded-md px-2"
                }`}
              >
                <div>
                  <p className="font-semibold">{bill.name}</p>
                  <p className="text-xs text-gray-500">
                    Échéance : {bill.due_date ? new Date(bill.due_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${bill.amount}</p>
                  <p className="text-xs">{bill.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>
            Total factures : ${bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)}
          </span>
          <Link to="/bills" className="text-blue-500 hover:underline">
            Voir toutes les factures
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
