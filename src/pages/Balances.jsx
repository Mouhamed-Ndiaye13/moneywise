import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
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
  const [user, setUser] = useState(null);

  // 🔐 Récupération de l’utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Erreur user:", error.message);
      else if (data?.user) {
        setUser(data.user);
        fetchAccounts(data.user.id);
      }
    };
    fetchUser();
  }, []);

  // 🔄 Charger les comptes
  const fetchAccounts = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: true });

    if (error) console.error("Erreur fetching accounts:", error.message);
    else setAccounts(data || []);
    setLoading(false);
  };

  // ➕ Ajouter un compte
  const addAccount = async () => {
    if (!newAccount.name || !newAccount.bank || !newAccount.balance)
      return alert("Remplis tous les champs obligatoires !");
    if (!user) return alert("Aucun utilisateur connecté !");

    const { error } = await supabase.from("accounts").insert([
      {
        user_id: user.id,
        name: newAccount.name,
        bank: newAccount.bank,
        number: newAccount.number,
        balance: parseFloat(newAccount.balance),
        type: newAccount.type,
        color: newAccount.color,
        logo: newAccount.logo
      }
    ]);

    if (error) {
      console.error("Erreur ajout compte :", error);
      return alert("Erreur ajout compte : " + error.message);
    }

    setShowModal(false);
    setNewAccount({
      name: "",
      bank: "",
      number: "",
      balance: "",
      type: "",
      color: "#10b981",
      logo: ""
    });
    fetchAccounts(user.id);
  };

  // 🗑️ Supprimer un compte
  const removeAccount = async (id) => {
    const { error } = await supabase.from("accounts").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression compte :", error);
      return alert("Erreur suppression compte : " + error.message);
    }
    if (user) fetchAccounts(user.id);
  };

  return (
    <div className="flex-1 w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h2 className="text-3xl font-bold text-green-400">Balance</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + Ajouter un compte
        </button>
      </div>

      {/* Liste des comptes */}
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : accounts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Aucun compte ajouté pour l’instant.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-xl shadow hover:shadow-lg p-5 transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {acc.logo && (
                    <img
                      src={acc.logo}
                      alt={acc.bank}
                      className="w-10 h-10 rounded-full border object-contain"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{acc.name}</h3>
                    <p className="text-sm text-gray-500">{acc.bank}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-2">{acc.number}</p>
              <p className="text-2xl font-bold mt-3 text-gray-800">
                ${acc.balance.toLocaleString()}
              </p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => removeAccount(acc.id)}
                  className="text-red-500 hover:underline"
                >
                  Supprimer
                </button>
                <span
                  className="text-white text-sm px-3 py-1 rounded-lg"
                  style={{ backgroundColor: acc.color }}
                >
                  {acc.type || "Type inconnu"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diagramme */}
      {accounts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mt-10 p-5 border w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Répartition des soldes
          </h3>
          <div className="flex justify-center">
            <PieChart width={400} height={350}>
              <Pie
                data={accounts}
                dataKey="balance"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Ajouter un compte
            </h3>

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
                placeholder="Solde initial"
                value={newAccount.balance}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, balance: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="URL du logo"
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
                <option value="Carte">Carte</option>
                <option value="Banque">Banque</option>
                <option value="Espèces">Espèces</option>
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

            <div className="flex justify-end mt-5 gap-2">
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
