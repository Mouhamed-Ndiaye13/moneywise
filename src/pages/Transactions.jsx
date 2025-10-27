// src/pages/Transactions.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("Tous");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
useEffect(() => {
  const fetchTransactions = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUser(user);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) console.error(error);
    else setTransactions(data || []);

    setLoading(false);
  };

  fetchTransactions();

  // Écoute les changements de session correctement
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


const filteredTransactions = transactions.filter((t) => {
  const typeMatch = filterType === "Tous" || t.type === filterType;
  const categoryMatch =
    !filterCategory ||
    (t.category && t.category.toLowerCase().includes(filterCategory.toLowerCase()));
  return typeMatch && categoryMatch;
});


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-og mb-3 sm:mb-0">
          Historique des transactions
        </h2>
        <button
          onClick={() => navigate("/add-transaction")}
          className="bg-og text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
        >
          + Ajouter une transaction
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 outline-none bg-og text-white"
        >
          <option value="Tous">Tous les types</option>
          <option value="Revenu">Revenu</option>
          <option value="Dépense">Dépense</option>
        </select>
        <input
          type="text"
          placeholder="Filtrer par catégorie..."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 flex-1 outline-none bg-white text-black"
        />
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="text-center p-6 text-gray-500">Chargement...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center p-6 text-gray-400">
            Aucune transaction trouvée.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Type</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Description</th>
                <th className="p-4">Reçu</th>
                <th className="p-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b hover:bg-gray-50 transition text-gray-700"
                >
                  <td className="p-4">{t.date}</td>
                  <td className="p-4 text-emerald-600 font-medium">{t.status}</td>
                  <td
                    className={`p-4 font-medium ${
                      t.type === "Revenu" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="p-4">{t.category}</td>
                  <td className="p-4">{t.description}</td>
                  <td className="p-4">{t.receipt}</td>
                  <td className="p-4 text-right font-semibold">${t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
