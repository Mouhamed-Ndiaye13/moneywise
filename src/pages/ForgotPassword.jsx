import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Email de réinitialisation envoyé !");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          Réinitialiser le mot de passe
        </h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Envoyer le lien
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          <Link to="/login" className="text-green-400 font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
