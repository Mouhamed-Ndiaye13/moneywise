import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const Balances = () => {
  const [accounts, setAccounts] = useState([
    
    {
      id: 1,
      name: "Credit Card",
      bank: "Master Card",
      number: "3388 4556 8860 8***",
      balance: 25000,
      type: "Card",
      color: "#f87171",
    },
    {
      id: 2,
      name: "Checking",
      bank: "AB Bank Ltd",
      number: "693 456 69 9****",
      balance: 25000,
      type: "Bank",
      color: "#60a5fa",
    },
    {
      id: 3,
      name: "Savings",
      bank: "Brac Bank Ltd",
      number: "133 456 886 8****",
      balance: 25000,
      type: "Bank",
      color: "#34d399",
    },
  ]);

  const [selectedAccount, setSelectedAccount] = useState(null);

  const addAccount = () => {
    const newAccount = {
      id: accounts.length + 1,
      name: `New Account ${accounts.length + 1}`,
      bank: "My Bank",
      number: "0000 0000 0000 ****",
      balance: 10000,
      type: "Cash",
      color: "#fbbf24",
    };
    setAccounts([...accounts, newAccount]);
  };

  const removeAccount = (id) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  return (
    // IMPORTANT: we use `flex-1 w-full min-h-screen` so this component
    // takes all the available width/height next to your sidebar.
    <div className="flex-1 w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800">Balances</h2>
        <button
          onClick={addAccount}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Ajouter un compte
        </button>
      </div>

      {/* Cards grid - full width */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{acc.name}</h3>
                <span className="text-sm text-gray-500">{acc.bank}</span>
              </div>

              <p className="text-gray-600 text-sm mb-1">{acc.number}</p>
              <p className="text-2xl font-bold text-gray-800 mb-3">
                ${acc.balance.toLocaleString()}
              </p>

              <div className="flex justify-between">
                <button
                  onClick={() => removeAccount(acc.id)}
                  className="text-emerald-600 hover:underline"
                >
                  Remove
                </button>
                <button
                  onClick={() => setSelectedAccount(acc)}
                  style={{ backgroundColor: acc.color }}
                  className="text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart section — now full width (removed max-w and mx-auto) */}
      <div className="bg-white rounded-2xl shadow-sm mt-10 p-5 border border-gray-100 w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Répartition des soldes
        </h3>

        {/* Chart container: center the chart but keep the section full width */}
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={accounts}
              dataKey="balance"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {accounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Modal Details */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Détails du compte</h3>
            <p>
              <strong>Nom :</strong> {selectedAccount.name}
            </p>
            <p>
              <strong>Banque :</strong> {selectedAccount.bank}
            </p>
            <p>
              <strong>Numéro :</strong> {selectedAccount.number}
            </p>
            <p>
              <strong>Balance :</strong> ${selectedAccount.balance.toLocaleString()}
            </p>
            <p>
              <strong>Type :</strong> {selectedAccount.type}
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balances;
