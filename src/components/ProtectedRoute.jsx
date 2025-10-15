import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg font-medium">
          Chargement...
        </div>
      </div>
    );
  }

  // Si pas connecté → redirection vers /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté → on affiche la page protégée
  return children;
}
