import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si un utilisateur est connecté
    const getUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erreur auth:", error.message);
      } else {
        setUser(data.session?.user || null);
      }
      setLoading(false);
    };

    getUser();

    // Écoute les changements de session (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg font-medium">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
