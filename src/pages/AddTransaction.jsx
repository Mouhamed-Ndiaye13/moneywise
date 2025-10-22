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

  // 🔹 On récupère l'utilisateur dès le chargement
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Utilisateur non connecté");
        navigate("/login");
        return;
      }
      setUser(session.user);

      // 🔹 Récupérer les comptes de l'utilisateur
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

  // 🔹 Ajouter la transaction et mettre à jour le solde
  const handleAddTransaction = async () => {
    if (!newTransaction.account_id) return alert("Sélectionner un compte !");
    if (!newTransaction.amount) return alert("Saisir un montant !");

    // 1️⃣ Insérer la transaction
    const { error: insertError } = await supabase.from("transactions").insert([{
      user_id: user.id,
      account_id: newTransaction.account_id,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      status: "Complete",
      receipt: newTransaction.receipt,
    }]);

    if (insertError) {
      console.error("Erreur insertion transaction :", insertError);
      return alert("Erreur ajout transaction : " + insertError.message);
    }

    // 2️⃣ Mettre à jour le solde du compte via RPC
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

  if (loading) return <p className="text-center mt-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-emerald-600">Ajouter une transaction</h2>
      <form className="space-y-3">
        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Revenu">Revenu</option>
          <option value="Dépense">Dépense</option>
        </select>

        <select
          value={newTransaction.account_id}
          onChange={(e) => setNewTransaction({ ...newTransaction, account_id: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Choisir un compte --</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.balance} €)
            </option>
          ))}
        </select>

        <input type="text" placeholder="Catégorie" value={newTransaction.category}
          onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input type="text" placeholder="Description" value={newTransaction.description}
          onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input type="date" value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input type="number" placeholder="Montant" value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input type="text" placeholder="Lien du reçu (facultatif)" value={newTransaction.receipt}
          onChange={(e) => setNewTransaction({ ...newTransaction, receipt: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </form>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={() => navigate("/transactions")} className="px-4 py-2 border rounded">Annuler</button>
        <button onClick={handleAddTransaction} className="px-4 py-2 text-white rounded bg-emerald-500 hover:bg-emerald-600">
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;
