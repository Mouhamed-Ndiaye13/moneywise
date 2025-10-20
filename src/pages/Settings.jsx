import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";

export default function Settings() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async () => {
    try {
      if (displayName !== user.displayName || photoURL !== user.photoURL) {
        await updateProfile(user, { displayName, photoURL });
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      if (password) {
        await updatePassword(user, password);
      }
      setMessage("Profil mis à jour avec succès ✅");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center rounded-xl" >
      <div className="w-full max-w-3xl space-y-8">

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center">
          Paramètres du compte
        </h1>

        {message && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-3 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Carte profil */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 space-y-6">
          
          {/* Photo de profil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {user?.photoURL ? (
                <img src={photoURL} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-400 dark:text-gray-300 text-7xl" />
              )}
            </div>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="URL photo de profil"
              className="w-full md:w-1/2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Formulaire infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-300 font-medium mb-1">Nom complet</label>
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500 dark:text-gray-400 text-xl" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-300 font-medium mb-1">Email</label>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-500 dark:text-gray-400 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-600 dark:text-gray-300 font-medium mb-1">Mot de passe</label>
              <div className="flex items-center space-x-3">
                <FaLock className="text-gray-500 dark:text-gray-400 text-xl" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bouton mise à jour */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleUpdateProfile}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Mettre à jour le profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
