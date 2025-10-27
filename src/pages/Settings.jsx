import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaBell, FaMoon } from "react-icons/fa";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState("clair");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // 🔹 Charger infos utilisateur
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
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    };
    fetchUser();
  }, []);

  // 🔹 Upload d'image
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = `${user.id}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Erreur d'upload : " + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    setAvatarUrl(data.publicUrl);

    await supabase.auth.updateUser({
      data: { avatar_url: data.publicUrl },
    });
    await supabase.storage.from("avatars").remove([oldFileName]);

  };

  // 🔹 Mise à jour du profil
  
  const handleUpdateProfile = async () => {
    setLoadingUpdate(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password: password || undefined,
        data: {
          full_name: displayName,
          avatar_url: avatarUrl,
          theme,
          notifications_enabled: notifications,
        },
      });

      if (error) throw error;
      setMessage("✅ Profil mis à jour avec succès !");
      setPassword("");
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoadingUpdate(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (!user) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen p-8 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-10 animate-fadeIn">
        {/* 🧑 Header */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={avatarUrl || "https://i.pravatar.cc/150"}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-emerald-400 shadow-lg object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition">
              <FaCamera className="text-white text-sm" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-3">{displayName || "Utilisateur"}</h2>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* ✅ Message */}
        {message && (
          <div
            className={`text-center p-3 rounded-lg font-medium ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            } transition-all duration-300`}
          >
            {message}
          </div>
        )}

        {/* ⚙️ Formulaire principal */}
        <div className="bg-white shadow-xl rounded-3xl p-8 space-y-6 transition-transform hover:scale-[1.01]">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Informations du compte
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={<FaUser />}
              label="Nom complet"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nom complet"
            />
            <InputField
              icon={<FaEnvelope />}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
            />
            <InputField
              icon={<FaLock />}
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Nouveau mot de passe"
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* 🌙 Préférences */}
        <div className="bg-white shadow-xl rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Préférences
          </h3>
          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FaBell className="text-emerald-500" />
                Notifications
              </label>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 text-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 🔘 Bouton de sauvegarde */}
        <div className="flex justify-center">
          <button
            onClick={handleUpdateProfile}
            disabled={loadingUpdate}
            className={`bg-green-500 hover:bg-emerald-600 text-white px-10 py-3 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
              loadingUpdate ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingUpdate ? "Mise à jour..." : " Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Composant réutilisable pour champs
const InputField = ({ icon, label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl p-3 transition-shadow duration-300 focus-within:shadow-lg">
      <span className="text-gray-500 text-lg">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none"
      />
    </div>
  </div>
);
