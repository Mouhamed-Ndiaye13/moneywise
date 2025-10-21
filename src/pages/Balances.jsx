import React, { useState } from "react";
import "./Balances.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Balances = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Credit Card", bank: "Master Card", number: "3388 4556 8860 8***", balance: 25000, type: "Card", color: "#f87171" },
    { id: 2, name: "Checking", bank: "AB Bank Ltd", number: "693 456 69 9****", balance: 25000, type: "Bank", color: "#60a5fa" },
    { id: 3, name: "Savings", bank: "Brac Bank Ltd", number: "133 456 886 8****", balance: 25000, type: "Bank", color: "hsla(158, 64%, 52%, 1.00)" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    bank: "",
    number: "",
    balance: "",
    type: "",
    color: "hsla(158, 64%, 52%, 1.00)"
  });

  const addAccount = () => {
    setAccounts([...accounts, { ...newAccount, id: Date.now(), balance: parseFloat(newAccount.balance) }]);
    setShowModal(false);
    setNewAccount({
      name: "",
      bank: "",
      number: "",
      balance: "",
      type: "",
      color: "hsla(158, 64%, 52%, 1.00)"
    });
  };

  const removeAccount = (id) => setAccounts(accounts.filter(acc => acc.id !== id));

  return (
    <div className="flex-1 w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800">Balances</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-white px-4 py-2 rounded-lg transition"
          style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}
        >
          Ajouter un compte
        </button>
      </div>

      {/* Cards grid */}
      <div className="balances-grid">
        {accounts.map(acc => (
          <div key={acc.id} className="balance-card bg-white rounded-xl shadow p-5 border hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{acc.name}</h3>
              <span className="text-sm text-gray-500">{acc.bank}</span>
            </div>
            <p className="text-gray-600 text-sm">{acc.number}</p>
            <p className="text-2xl font-bold mt-2">${acc.balance.toLocaleString()}</p>
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => removeAccount(acc.id)} className="text-green-500 hover:underline">Remove</button>
              <button className="text-white px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: acc.color }}>Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* PieChart */}
      <div className="bg-white rounded-2xl shadow-sm mt-10 p-5 border w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition des soldes</h3>
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie data={accounts} dataKey="balance" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {accounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Modal Ajouter Compte */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Ajouter un compte</h3>
            <form className="space-y-3">
              <input type="text" placeholder="Nom du compte" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Banque" value={newAccount.bank} onChange={e => setNewAccount({ ...newAccount, bank: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Numéro du compte" value={newAccount.number} onChange={e => setNewAccount({ ...newAccount, number: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Balance" value={newAccount.balance} onChange={e => setNewAccount({ ...newAccount, balance: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <select value={newAccount.type} onChange={e => setNewAccount({ ...newAccount, type: e.target.value })} className="w-full border px-3 py-2 rounded">
                <option value="">Type de compte</option>
                <option value="Card">Carte</option>
                <option value="Bank">Banque</option>
                <option value="Cash">Espèces</option>
              </select>
              <div className="flex items-center gap-2">
                <label>Couleur :</label>
                <input type="color" value={newAccount.color} onChange={e => setNewAccount({ ...newAccount, color: e.target.value })} />
              </div>
            </form>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Annuler</button>
              <button onClick={addAccount} className="px-4 py-2 text-white rounded" style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Balances;
