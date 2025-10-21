
import React, { useState } from "react";

const Bills = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      name: "Figma",
      description:
        "Figma - Yearly Plan. For advanced security and more flexible controls.",
      amount: 150,
      dueDate: "2025-05-15",
      lastCharge: "2024-05-14",
      status: "À venir",
      // logo: "https://cdn.worldvectorlogo.com/logos/figma-1.svg",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",

    },
    {
      id: 2,
      name: "Adobe",
      description:
        "Adobe Inc - Yearly Plan. For professional creative tools and design systems.",
      amount: 559,
      dueDate: "2025-06-16",
      lastCharge: "2024-06-17",
      status: "À venir",
      logo: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg",
    },
    {
      id: 3,
      name: "Netflix",
      description: "Netflix - Monthly Subscription.",
      amount: 20,
      dueDate: "2025-10-30",
      lastCharge: "2025-09-30",
      status: "Payé",
      logo: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("Tous");

  // Modal Ajouter Facture
  const [showModal, setShowModal] = useState(false);
  const [newBill, setNewBill] = useState({
    name: "",
    description: "",
    amount: "",
    dueDate: "",
    status: "À venir",
    logo: "",
  });

  const filteredBills = bills.filter(
    (b) => filterStatus === "Tous" || b.status === filterStatus
  );

  const markAsPaid = (id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, status: "Payé" } : bill
      )
    );
  };

  const addBill = () => {
    setBills([
      ...bills,
      { ...newBill, id: Date.now(), amount: parseFloat(newBill.amount) },
    ]);
    setShowModal(false);
    setNewBill({
      name: "",
      description: "",
      amount: "",
      dueDate: "",
      status: "À venir",
      logo: "",
    });
  };

  const removeBill = (id) => setBills(bills.filter((b) => b.id !== id));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
          Factures
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-white px-4 py-2 rounded-lg transition"
          style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}
        >
           Ajouter une facture
        </button>
      </div>

      {/* Filtre */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 outline-none"
        >
          <option value="Tous">Toutes les factures</option>
          <option value="À venir">À venir</option>
          <option value="Payé">Payées</option>
        </select>
      </div>

      {/* Liste des factures */}
      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <div
            key={bill.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between p-4"
          >
            {/* Logo + Description */}
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-xl w-16 h-16 flex items-center justify-center">
                {bill.logo && (
                  <img
                    src={bill.logo}
                    alt={bill.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {bill.name} - {bill.description.split(".")[0]}
                </h3>
                <p className="text-sm text-gray-500">
                  Dernier paiement : {bill.lastCharge}
                </p>
              </div>
            </div>

            {/* Détails à droite */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
              <div className="text-center">
                <p className="text-sm text-gray-500">Échéance</p>
                <p className="font-semibold text-gray-700">
                  {new Date(bill.dueDate).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bill.status === "Payé"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {bill.status}
              </div>
              <div className="font-bold text-gray-800">${bill.amount}</div>
              {bill.status !== "Payé" && (
                <button
                  onClick={() => markAsPaid(bill.id)}
                  className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Marquer comme payé
                </button>
              )}
              <button
                onClick={() => removeBill(bill.id)}
                className="text-red-500 hover:underline"
              >
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
              <input
                type="text"
                placeholder="Nom de la facture"
                value={newBill.name}
                onChange={(e) =>
                  setNewBill({ ...newBill, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={newBill.description}
                onChange={(e) =>
                  setNewBill({ ...newBill, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Montant"
                value={newBill.amount}
                onChange={(e) =>
                  setNewBill({ ...newBill, amount: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Date d’échéance"
                value={newBill.dueDate}
                onChange={(e) =>
                  setNewBill({ ...newBill, dueDate: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="URL logo"
                value={newBill.logo}
                onChange={(e) =>
                  setNewBill({ ...newBill, logo: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={newBill.status}
                onChange={(e) =>
                  setNewBill({ ...newBill, status: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="À venir">À venir</option>
                <option value="Payé">Payé</option>
              </select>
            </form>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Annuler
              </button>
              <button
                onClick={addBill}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: "hsla(158, 64%, 52%, 1.00)" }}
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

export default Bills;
