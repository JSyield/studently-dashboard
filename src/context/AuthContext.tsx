
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { getSession, signIn, signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type UserRole = 'admin' | 'user';

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRoles: UserRole[];
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const { toast } = useToast();

  // Function to fetch user roles
  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_roles', { user_id: userId });
      
      if (error) {
        console.error("Error fetching user roles:", error);
        return;
      }
      
      if (data) {
        setUserRoles(data.map(r => r.role));
      }
    } catch (err) {
      console.error("Unexpected error during role fetch:", err);
    }
  };

  useEffect(() => {
    async function loadSession() {
      try {
        const { session, error } = await getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          await fetchUserRoles(session.user.id);
        }
      } catch (err) {
        console.error("Unexpected error during session fetch:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      
      if (session?.user) {
        await fetchUserRoles(session.user.id);
      } else {
        setUserRoles([]);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      setSession(data.session);
      
      if (data.session?.user) {
        await fetchUserRoles(data.session.user.id);
      }
      
      toast({
        title: "Welcome back",
        description: "You have been successfully logged in",
      });
      return { success: true };
    } catch (err) {
      console.error("Unexpected error during login:", err);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setSession(null);
      setUserRoles([]);
      toast({
        title: "Signed out successfully",
      });
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        userRoles,
        isAdmin: userRoles.includes('admin'),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
