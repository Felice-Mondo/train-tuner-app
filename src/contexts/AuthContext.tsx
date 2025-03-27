
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Definizione del tipo di utente
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Interfaccia del contesto di autenticazione
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Creazione del contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contesto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verifica se l'utente è già autenticato all'avvio dell'app
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    
    checkUser();
  }, []);

  // Funzione di login
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simuliamo l'autenticazione con i dati forniti
      if (email === "mondo.felice@outoolk.it" && password === "wolfstein.97") {
        const userData: User = {
          id: "user-1",
          email: "mondo.felice@outoolk.it",
          name: "Mondo Felice"
        };
        
        // Salva l'utente nel localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Login effettuato",
          description: "Sei stato autenticato con successo.",
        });
        
        navigate("/dashboard");
      } else {
        throw new Error("Credenziali non valide");
      }
    } catch (error) {
      toast({
        title: "Errore di autenticazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante l'accesso",
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
      // Per questo esempio, accettiamo solo l'email specificata
      if (email === "mondo.felice@outoolk.it") {
        const userData: User = {
          id: "user-1",
          email: "mondo.felice@outoolk.it",
          name: "Mondo Felice"
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Registrazione completata",
          description: "Il tuo account è stato creato con successo.",
        });
        
        navigate("/dashboard");
      } else {
        throw new Error("Registrazione non consentita con questa email");
      }
    } catch (error) {
      toast({
        title: "Errore di registrazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante la registrazione",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione di logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast({
      title: "Logout effettuato",
      description: "Sei stato disconnesso con successo.",
    });
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
