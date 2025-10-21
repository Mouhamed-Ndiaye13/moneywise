import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: "Revenu",
    amount: "",
    category: "",
    description: "",
    date: "",
    status: "Complete",
    receipt: "",
  });

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const getCurrentUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user || null;
      if (!currentUser) {
        alert("Utilisateur non connecté");
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    };
    getCurrentUser();
  }, [navigate]);

  const addTransaction = async () => {
    if (!user) return;

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: user.id, // UUID Supabase
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
      },
    ]);

    if (error) alert("Erreur : " + error.message);
    else navigate("/transactions"); // retourne à la liste
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ajouter une transaction</h2>
      <form className="space-y-3">
        <select
          value={newTransaction.type}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, type: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Revenu">Revenu</option>
          <option value="Dépense">Dépense</option>
        </select>
        <input
          type="text"
          placeholder="Catégorie"
          value={newTransaction.category}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, category: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, description: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, date: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Reçu"
          value={newTransaction.receipt}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, receipt: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Montant"
          value={newTransaction.amount}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, amount: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
      </form>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => navigate("/transactions")}
          className="px-4 py-2 border rounded"
        >
          Annuler
        </button>
        <button
          onClick={addTransaction}
          className="px-4 py-2 text-white rounded bg-emerald-500 hover:bg-emerald-600"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;
