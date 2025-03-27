import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";

// Definizione del tipo di utente
export interface User {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
}

// Interfaccia del contesto di autenticazione
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  pendingVerification: boolean;
  setPendingVerification: (pending: boolean) => void;
}

// Creazione del contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contesto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verifica la sessione utente all'avvio dell'app
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const supaUser = session.user;
        setUser({
          id: supaUser.id,
          email: supaUser.email!,
          verified: supaUser.email_confirmed_at !== null,
        });
      }
      setLoading(false);
    };

    checkUser();

    // Ascolta i cambiamenti dello stato di autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const supaUser = session.user;
        setUser({
          id: supaUser.id,
          email: supaUser.email!,
          verified: supaUser.email_confirmed_at !== null,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Funzione di login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      if (data.user) {
        const supaUser = data.user;
        setUser({
          id: supaUser.id,
          email: supaUser.email!,
          verified: supaUser.email_confirmed_at !== null,
        });

        toast({
          title: "Login effettuato",
          description: "Sei stato autenticato con successo.",
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Errore di autenticazione",
        description: error.message || "Errore durante il login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione di registrazione
  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(error.message);

      toast({
        title: "Registrazione completata",
        description: "Controlla la tua email per confermare l'account.",
      });

      // Impostiamo il flag di verifica in attesa
      setPendingVerification(true);
      navigate("/verify-email");
    } catch (error: any) {
      toast({
        title: "Errore di registrazione",
        description: error.message || "Errore durante la registrazione",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione per il logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Errore durante il logout",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      navigate("/login");
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo.",
      });
    }
  };

  // Funzione per simulare la verifica dell'email
  // In un'app reale Supabase gestisce la verifica tramite link contenuto nell'email
  const verifyEmail = async (code: string) => {
    setLoading(true);
    try {
      // In questo esempio accettiamo un qualsiasi codice numerico di 6 cifre
      if (code && code.length === 6 && /^\d+$/.test(code)) {
        toast({
          title: "Email verificata",
          description: "Il tuo account è stato verificato con successo.",
        });
        setPendingVerification(false);

        // Ricarica la sessione aggiornata
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const supaUser = session.user;
          setUser({
            id: supaUser.id,
            email: supaUser.email!,
            verified: true,
          });
        }
        navigate("/dashboard");
      } else {
        throw new Error("Codice di verifica non valido. Inserisci un codice a 6 cifre.");
      }
    } catch (error: any) {
      toast({
        title: "Errore di verifica",
        description: error.message || "Errore durante la verifica dell'email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione per richiedere nuovamente l'email di verifica
  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      // Se Supabase supporta l'invio di un nuovo link di verifica, puoi implementarlo qui.
      toast({
        title: "Email inviata",
        description: "Abbiamo inviato un nuovo codice di verifica alla tua email.",
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'invio dell'email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        verifyEmail,
        resendVerificationEmail,
        pendingVerification,
        setPendingVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook per utilizzare il contesto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve essere utilizzato all'interno di un AuthProvider");
  }
  return context;
};
