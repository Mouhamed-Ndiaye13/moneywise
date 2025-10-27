import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/dashboard");
    };
    checkUser();
  }, [navigate]);

  // Connexion par email + mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
      
        email,
        password,
      });

      if (error) throw error;
      alert("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Google OAuth
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/dashboard", // correspond exactement à ce que tu as mis dans Supabase + Google
        },
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          Connexion
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg bg-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 border rounded-lg bg-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-green-400 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"}`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">ou</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded-lg flex items-center justify-center hover:bg-red-500"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5 mr-2"
          />
          Connexion avec Google
        </button>

        <p className="text-center text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-green-400 font-semibold hover:underline">
            Inscription
          </Link>
        </p>
      </div>
    </div>
  );
}
