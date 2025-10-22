import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBill, setNewBill] = useState({
    name: "",
    description: "",
    amount: "",
    due_date: "",
    status: "À venir",
    logo: "",
    account_id: "", // lien avec un compte
  });

  // 🔸 Récupérer les factures
  const fetchBills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .order("due_date", { ascending: true });
    if (error) console.error("Erreur fetching bills :", error);
    else setBills(data || []);
    setLoading(false);
  };

  // 🔸 Récupérer les comptes
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("*");
    if (error) console.error("Erreur fetching accounts :", error);
    else setAccounts(data || []);
  };

  useEffect(() => {
    fetchBills();
    fetchAccounts();
  }, []);

// 🔸 Ajouter une facture
const addBill = async () => {
  if (!newBill.name || !newBill.amount || !newBill.due_date || !newBill.account_id) {
    return alert("Nom, montant, date et compte sont obligatoires !");
  }

  // Vérifie que l'utilisateur est bien connecté
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return alert("Utilisateur non connecté !");
  }

  // ✅ Insérer la facture avec user_id
  const { error } = await supabase.from("bills").insert([
    {
      ...newBill,
      amount: parseFloat(newBill.amount),
      status: "À venir",
      user_id: user.id, // 🔥 Clé indispensable
    },
  ]);

  if (error) return alert("Erreur ajout facture : " + error.message);

  setNewBill({
    name: "",
    description: "",
    amount: "",
    due_date: "",
    status: "À venir",
    logo: "",
    account_id: "",
  });
  setShowModal(false);
  fetchBills();
};

  // 🔸 Supprimer une facture
  const removeBill = async (id) => {
    const bill = bills.find((b) => b.id === id);
    if (!bill) return;

    if (bill.status === "Payé") {
      return alert("Impossible de supprimer une facture déjà payée !");
    }

    const { error } = await supabase.from("bills").delete().eq("id", id);
    if (error) return alert("Erreur suppression facture : " + error.message);
    fetchBills();
  };

  // 🔸 Marquer comme payé (et mettre à jour le solde du compte)
  const markAsPaid = async (bill) => {
    if (!bill.account_id || bill.account_id === "") {
      return alert("Erreur : Cette facture n'a pas de compte lié. Veuillez choisir un compte avant de la marquer comme payée.");
    }

    // Mise à jour du solde du compte
    const { error: accountError } = await supabase.rpc("update_account_balance", {
      p_account_id: bill.account_id,
      p_amount: bill.amount,
      p_type: "Dépense", // diminue la balance
    });
    if (accountError) return alert("Erreur mise à jour balance : " + accountError.message);

    // Marquer la facture comme payée
    const { error } = await supabase.from("bills").update({ status: "Payé" }).eq("id", bill.id);
    if (error) return alert("Erreur mise à jour facture : " + error.message);

    fetchBills();
  };

  if (loading) return <p className="text-center mt-6">Chargement...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">Factures</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-white px-4 py-2 rounded-lg transition"
          style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}
        >
          Ajouter une facture
        </button>
      </div>

      {/* Liste des factures */}
      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-xl w-16 h-16 flex items-center justify-center">
                {bill.logo && <img src={bill.logo} alt={bill.name} className="w-10 h-10 object-contain" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {bill.name} - {bill.description?.split(".")[0]}
                </h3>
                <p className="text-sm text-gray-500">Montant : ${bill.amount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
              <div className="text-center">
                <p className="text-sm text-gray-500">Échéance</p>
                <p className="font-semibold text-gray-700">
                  {new Date(bill.due_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${bill.status === "Payé" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {bill.status}
              </div>
              {bill.status !== "Payé" && (
                <button onClick={() => markAsPaid(bill)} className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition">
                  Marquer comme payé
                </button>
              )}
              <button onClick={() => removeBill(bill.id)} className="text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajouter Facture */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Ajouter une facture</h3>
            <form className="space-y-3">
              <input type="text" placeholder="Nom de la facture" value={newBill.name} onChange={(e) => setNewBill({ ...newBill, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Description" value={newBill.description} onChange={(e) => setNewBill({ ...newBill, description: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Montant" value={newBill.amount} onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="date" placeholder="Date d’échéance" value={newBill.due_date} onChange={(e) => setNewBill({ ...newBill, due_date: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="URL logo" value={newBill.logo} onChange={(e) => setNewBill({ ...newBill, logo: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <select value={newBill.account_id} onChange={(e) => setNewBill({ ...newBill, account_id: e.target.value })} className="w-full border px-3 py-2 rounded">
                <option value="">-- Choisir un compte --</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.balance} €)
                  </option>
                ))}
              </select>
            </form>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Annuler</button>
              <button onClick={addBill} className="px-4 py-2 text-white rounded" style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
