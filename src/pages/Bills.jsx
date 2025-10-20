
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
      logo: "https://cdn.worldvectorlogo.com/logos/figma-1.svg",
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

  // Filtrage
  const filteredBills = bills.filter(
    (b) => filterStatus === "Tous" || b.status === filterStatus
  );

  // Changer le statut en "Payé"
  const markAsPaid = (id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, status: "Payé" } : bill
      )
    );
  };

  // Redirection vers ajout
  const handleAddBill = () => {
    window.location.href = "/add-bill";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
          Upcoming Bills
        </h2>
        <button
          onClick={handleAddBill}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Ajouter une facture
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
                <img
                  src={bill.logo}
                  alt={bill.name}
                  className="w-10 h-10 object-contain"
                />
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
            <div className="flex flex-col sm:flex-row items-center gap-4">
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
            </div>
          </div>
        ))}
      </div>

      {/* Bouton Load More */}
      <div className="flex justify-center mt-8">
        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
          Load More
        </button>
      </div>
    </div>
  );
};

export default Bills;
