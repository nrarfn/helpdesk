import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import LoadingPage from "../pages/LoadingPage";
import { Session, User } from "@supabase/supabase-js";

interface UserWithRole extends User {
  role?: string;
}

const SessionContext = createContext<{
  session: Session | null;
  user: UserWithRole | null;
}>({
  session: null,
  user: null,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };
export const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setUser({ ...session.user, role: profile?.role });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, user }}>
      {isLoading ? <LoadingPage /> : children}
    </SessionContext.Provider>
  );
};
