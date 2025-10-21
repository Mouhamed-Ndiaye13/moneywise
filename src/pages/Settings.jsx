import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [message, setMessage] = useState("");

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
      setPhotoURL(user.user_metadata?.avatar_url || "");
    };
    fetchUser();
  }, []);

  // Mettre à jour le profil
  const handleUpdateProfile = async () => {
    try {
      // Mise à jour des métadonnées utilisateur
      const updates = {
        full_name: displayName,
        avatar_url: photoURL,
      };

      const { error: updateMetaError } = await supabase.auth.updateUser({
        email,
        password: password || undefined, // si vide, ne change pas
        data: updates,
      });

      if (updateMetaError) throw updateMetaError;
      setMessage("Profil mis à jour avec succès ✅");
      setPassword(""); // effacer le mot de passe après mise à jour
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!user) return <div className="p-6">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center rounded-xl">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Paramètres du compte
        </h1>

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
            {message}
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-3xl p-8 space-y-6">
          {/* Photo de profil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {photoURL ? (
                <img src={photoURL} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-400 text-7xl" />
              )}
            </div>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="URL photo de profil"
              className="w-full md:w-1/2 p-2 rounded-lg border border-gray-300"
            />
          </div>

          {/* Formulaire infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Nom complet</label>
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500 text-xl" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Email</label>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-500 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-600 font-medium mb-1">Mot de passe</label>
              <div className="flex items-center space-x-3">
                <FaLock className="text-gray-500 text-xl" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleUpdateProfile}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Mettre à jour le profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
