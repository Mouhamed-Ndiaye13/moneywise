import React, { useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Revenu", amount: 160, category: "Salaire", description: "Salaire mensuel", date: "2023-04-17", status: "Complete", receipt: "8C52d5DKDJ5" },
    { id: 2, type: "Dépense", amount: 80, category: "Courses", description: "Achat supermarché", date: "2023-04-20", status: "Complete", receipt: "9B41d2DKDJ5" },
    { id: 3, type: "Revenu", amount: 200, category: "Freelance", description: "Projet web", date: "2023-04-21", status: "Complete", receipt: "4C12x8DKDJ5" },
  ]);

  // Filtres
  const [filterType, setFilterType] = useState("Tous");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal Ajouter Transaction
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "Revenu",
    amount: "",
    category: "",
    description: "",
    date: "",
    status: "Complete",
    receipt: "",
  });

  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === "Tous" || t.type === filterType;
    const categoryMatch = !filterCategory || t.category.toLowerCase().includes(filterCategory.toLowerCase());
    return typeMatch && categoryMatch;
  });

  const addTransaction = () => {
    setTransactions([...transactions, { ...newTransaction, id: Date.now(), amount: parseFloat(newTransaction.amount) }]);
    setShowModal(false);
    setNewTransaction({
      type: "Revenu",
      amount: "",
      category: "",
      description: "",
      date: "",
      status: "Complete",
      receipt: "",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
          Transactions History
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-white px-4 py-2 rounded-lg transition"
          style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}
        >
           Ajouter une transaction
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 outline-none"
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
          className="border border-gray-300 rounded-lg p-2 flex-1 outline-none"
        />
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
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
              <tr key={t.id} className="border-b hover:bg-gray-50 transition text-gray-700">
                <td className="p-4">{t.date}</td>
                <td className="p-4 text-emerald-600 font-medium">{t.status}</td>
                <td className={`p-4 font-medium ${t.type === "Revenu" ? "text-emerald-600" : "text-red-500"}`}>{t.type}</td>
                <td className="p-4">{t.category}</td>
                <td className="p-4">{t.description}</td>
                <td className="p-4">{t.receipt}</td>
                <td className="p-4 text-right font-semibold">${t.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter Transaction */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Ajouter une transaction</h3>
            <form className="space-y-3">
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Revenu">Revenu</option>
                <option value="Dépense">Dépense</option>
              </select>
              <input
                type="text"
                placeholder="Catégorie"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Reçu"
                value={newTransaction.receipt}
                onChange={(e) => setNewTransaction({ ...newTransaction, receipt: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Montant"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </form>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                Annuler
              </button>
              <button onClick={addTransaction} className="px-4 py-2 text-white rounded" style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
