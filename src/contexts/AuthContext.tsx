
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  logout: () => void;
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
      // Autenticazione con email: mondo.felice@outoolk.it e password: wolfstein.97
      if (email === "mondo.felice@outoolk.it" && password === "wolfstein.97") {
        // Verifica se l'utente esiste nello storage
        const storedUserJson = localStorage.getItem("user");
        
        if (storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          
          // Verifica se l'account è stato verificato
          if (!storedUser.verified) {
            setPendingVerification(true);
            toast({
              title: "Account non verificato",
              description: "Devi verificare il tuo account prima di accedere. Controlla la tua email o richiedi un nuovo codice.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          setUser(storedUser);
        } else {
          // Se l'utente non esiste nello storage, crea un nuovo utente verificato (scenario fallback)
          const userData: User = {
            id: "user-1",
            email: "mondo.felice@outoolk.it",
            name: "Mondo Felice",
            verified: true
          };
          
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
        
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
          name: "Mondo Felice",
          verified: false // L'utente non è verificato al momento della registrazione
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        // Non impostare l'utente attivo finché non è verificato
        // setUser(userData);
        
        toast({
          title: "Registrazione completata",
          description: "Abbiamo inviato un'email di verifica all'indirizzo fornito. Controlla la tua casella di posta.",
        });
        
        setPendingVerification(true);
        // Non navigare alla dashboard fino alla verifica
        // navigate("/dashboard");
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

  // Funzione per verificare l'email
  const verifyEmail = async (code: string) => {
    setLoading(true);
    
    try {
      // In un'app reale, invieremmo il codice al backend per la verifica
      // Per questo esempio, accetteremo qualsiasi codice a 6 cifre
      if (code && code.length === 6 && /^\d+$/.test(code)) {
        const storedUserJson = localStorage.getItem("user");
        
        if (storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          storedUser.verified = true;
          
          localStorage.setItem("user", JSON.stringify(storedUser));
          setUser(storedUser);
          
          toast({
            title: "Email verificata",
            description: "Il tuo account è stato verificato con successo.",
          });
          
          setPendingVerification(false);
          navigate("/dashboard");
        } else {
          throw new Error("Utente non trovato");
        }
      } else {
        throw new Error("Codice di verifica non valido. Inserisci un codice a 6 cifre.");
      }
    } catch (error) {
      toast({
        title: "Errore di verifica",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante la verifica dell'email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione per richiedere un nuovo codice di verifica
  const resendVerificationEmail = async () => {
    setLoading(true);
    
    try {
      // In un'app reale, invieremmo una richiesta al backend per un nuovo codice
      // Per questo esempio, facciamo finta di inviare una nuova email
      toast({
        title: "Email inviata",
        description: "Abbiamo inviato un nuovo codice di verifica alla tua email.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante l'invio dell'email",
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
        verifyEmail,
        resendVerificationEmail,
        pendingVerification,
        setPendingVerification
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
