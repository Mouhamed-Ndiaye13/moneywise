import { useState } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const full_name = `${prenom} ${nom}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, avatar_url: "" }, // ici on peut ajouter d'autres metadata
        },
      });

      if (error) throw error;

      alert("Compte créé avec succès ✅ Vérifie ton email pour confirmer !");
      navigate("/login"); // ou directement dashboard si tu veux login automatique
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Inscription
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Prénom"
            className="w-full p-3 border rounded-lg"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nom"
            className="w-full p-3 border rounded-lg"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Création..." : "Créer un compte"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">ou</div>

        <button
          onClick={() => navigate("/login")}
          className="w-full border py-2 rounded-lg hover:bg-gray-50"
        >
          Connexion avec Google
        </button>

        <p className="text-center text-gray-600 mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
