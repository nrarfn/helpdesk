import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import LoadingPage from "@/pages/LoadingPage";

const RootRedirect = () => {
  const { session, user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && user) {
      // User sudah login, redirect ke dashboard yang sesuai
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else if (session === null) {
      // Tidak ada session, redirect ke login
      navigate("/auth", { replace: true });
    }
    // Jika session masih loading, tidak melakukan apa-apa (tetap loading)
  }, [session, user, navigate]);

  // Tampilkan loading saat menunggu redirect
  return <LoadingPage />;
};

export default RootRedirect;