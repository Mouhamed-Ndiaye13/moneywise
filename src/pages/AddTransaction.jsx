import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTransaction, setNewTransaction] = useState({
    type: "Revenu",
    amount: "",
    category: "",
    description: "",
    date: "",
    status: "Complete",
    receipt: "",
    account_id: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Utilisateur non connecté");
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: accountsData, error: accountsError } = await supabase
        .from("accounts")
        .select("id, name, balance")
        .eq("user_id", session.user.id);

      if (accountsError) console.error(accountsError);
      else setAccounts(accountsData || []);

      setLoading(false);
    };
    getUser();
  }, [navigate]);

  const handleAddTransaction = async () => {
    if (!newTransaction.account_id) return alert("Sélectionner un compte !");
    if (!newTransaction.amount) return alert("Saisir un montant !");

    const { error: insertError } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        account_id: newTransaction.account_id,
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        date: newTransaction.date,
        status: "Complete",
        receipt: newTransaction.receipt,
      },
    ]);

    if (insertError) {
      console.error("Erreur insertion transaction :", insertError);
      return alert("Erreur ajout transaction : " + insertError.message);
    }

    const { error: rpcError } = await supabase.rpc("update_account_balance", {
      p_account_id: newTransaction.account_id,
      p_amount: parseFloat(newTransaction.amount),
      p_type: newTransaction.type,
    });

    if (rpcError) {
      console.error("Erreur mise à jour balance :", rpcError);
      alert("Erreur mise à jour balance : " + rpcError.message);
      return;
    }

    alert("Transaction ajoutée avec succès ✅");
    navigate("/transactions");
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Chargement...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-og mb-6">
          Ajouter une transaction
        </h2>

        <form className="space-y-4">
          {/* Type de transaction */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Type de transaction
            </label>
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
            >
              <option value="Revenu">Revenu</option>
              <option value="Dépense">Dépense</option>
            </select>
          </div>

          {/* Compte */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Compte associé
            </label>
            <select
              value={newTransaction.account_id}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  account_id: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
            >
              <option value="">-- Choisir un compte --</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.balance} €)
                </option>
              ))}
            </select>
          </div>

          {/* Autres champs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Catégorie
              </label>
              <input
                type="text"
                placeholder="Ex: Salaire, Nourriture..."
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Montant
              </label>
              <input
                type="number"
                placeholder="Ex: 100.00"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Détails supplémentaires..."
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Date de la transaction
            </label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Lien du reçu (facultatif)
            </label>
            <input
              type="text"
              placeholder="https://exemple.com/recu"
              value={newTransaction.receipt}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  receipt: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-white"
            />
          </div>
        </form>

        {/* Boutons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/transactions")}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-white"
          >
            Annuler
          </button>
          <button
            onClick={handleAddTransaction}
            className="px-5 py-2 rounded-lg bg-og hover:bg-emerald-600 text-white shadow transition"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
