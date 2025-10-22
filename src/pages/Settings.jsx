import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Récupère les infos de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      setUser(user);
      setEmail(user.email || "");
      setDisplayName(user.user_metadata?.full_name || "");
    };
    fetchUser();
  }, []);

  // Mettre à jour le profil
  const handleUpdateProfile = async () => {
    setLoadingUpdate(true);
    try {
      const updates = {
        full_name: displayName,
      };

      const { error: updateMetaError } = await supabase.auth.updateUser({
        email,
        password: password || undefined,
        data: updates,
      });

      if (updateMetaError) throw updateMetaError;

      setMessage("Profil mis à jour avec succès ✅");
      setPassword("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingUpdate(false);
      setTimeout(() => setMessage(""), 5000); // disparition message après 5s
    }
  };

  if (!user) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl space-y-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-green-400 text-center mb-4 animate-slideDown">
          Paramètres du compte
        </h1>

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center shadow-md transition-all duration-500 ease-in-out animate-pulse">
            {message}
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-3xl p-8 space-y-6 transform transition-transform duration-500 hover:scale-[1.02]">
          {/* Formulaire infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Nom complet</label>
              <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-2 transition-shadow duration-300 focus-within:shadow-lg">
                <FaUser className="text-gray-500 text-xl" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Email</label>
              <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-2 transition-shadow duration-300 focus-within:shadow-lg">
                <FaEnvelope className="text-gray-500 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-600 font-medium mb-1">Mot de passe</label>
              <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-2 transition-shadow duration-300 focus-within:shadow-lg">
                <FaLock className="text-gray-500 text-xl" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleUpdateProfile}
              disabled={loadingUpdate}
              className={`bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md transform hover:scale-105 ${loadingUpdate ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loadingUpdate ? "Mise à jour..." : "Mettre à jour le profil"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
