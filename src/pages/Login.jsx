import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          Connexion
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg "
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

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-green-400 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Se connecter
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">ou</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded-lg flex items-center justify-center hover:bg-green-700"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5 mr-2" />
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
