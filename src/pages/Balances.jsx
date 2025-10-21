import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./Balances.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Balances = () => {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    bank: "",
    number: "",
    balance: "",
    type: "",
    color: "#10b981",
    logo: ""
  });
  const [loading, setLoading] = useState(false);

  // ✅ Récupérer les comptes de l'utilisateur connecté
  const fetchAccounts = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (error) console.error("Erreur fetching accounts:", error.message);
    else setAccounts(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ✅ Ajouter un compte
  const addAccount = async () => {
    if (!newAccount.name || !newAccount.bank || !newAccount.balance)
      return alert("Remplir tous les champs !");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Utilisateur non connecté");

    const { error } = await supabase.from("accounts").insert([
      {
        ...newAccount,
        user_id: user.id, // 🔑 Obligatoire pour passer la policy RLS
        balance: parseFloat(newAccount.balance),
      },
    ]);

    if (error) {
      console.error("Erreur ajout compte :", error);
      return alert("Erreur ajout compte : " + error.message);
    }

    setNewAccount({
      name: "",
      bank: "",
      number: "",
      balance: "",
      type: "",
      color: "#10b981",
      logo: ""
    });
    setShowModal(false);
    fetchAccounts();
  };

  // ✅ Supprimer un compte
  const removeAccount = async (id) => {
    const { error } = await supabase.from("accounts").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression compte :", error);
      return alert("Erreur suppression compte : " + error.message);
    }
    fetchAccounts();
  };

  return (
    <div className="flex-1 w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800">Balances</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-white px-4 py-2 rounded-lg transition"
          style={{ backgroundColor: "#10b981" }}
        >
          Ajouter un compte
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="balances-grid">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="balance-card bg-white rounded-xl shadow p-5 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  {acc.logo && (
                    <img
                      src={acc.logo}
                      alt={acc.bank}
                      className="w-10 h-10 object-contain rounded-full"
                    />
                  )}
                  <h3 className="font-semibold text-gray-800">{acc.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{acc.bank}</span>
              </div>
              <p className="text-gray-600 text-sm">{acc.number}</p>
              <p className="text-2xl font-bold mt-2">
                ${acc.balance.toLocaleString()}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => removeAccount(acc.id)}
                  className="text-red-500 hover:underline"
                >
                  Supprimer
                </button>
                <button
                  className="text-white px-3 py-1 rounded-lg text-sm"
                  style={{ backgroundColor: acc.color }}
                >
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PieChart */}
      <div className="bg-white rounded-2xl shadow-sm mt-10 p-5 border w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Répartition des soldes
        </h3>
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
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

      {/* Modal Ajouter Compte */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Ajouter un compte</h3>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Nom du compte"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Banque"
                value={newAccount.bank}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, bank: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Numéro du compte"
                value={newAccount.number}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, number: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Balance"
                value={newAccount.balance}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, balance: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="URL logo banque"
                value={newAccount.logo}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, logo: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={newAccount.type}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, type: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Type de compte</option>
                <option value="Card">Carte</option>
                <option value="Bank">Banque</option>
                <option value="Cash">Espèces</option>
              </select>
              <div className="flex items-center gap-2">
                <label>Couleur :</label>
                <input
                  type="color"
                  value={newAccount.color}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, color: e.target.value })
                  }
                />
              </div>
            </form>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Annuler
              </button>
              <button
                onClick={addAccount}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: "#10b981" }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balances;
