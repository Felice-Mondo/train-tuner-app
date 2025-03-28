import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Definizione del tipo di profilo utente
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

// Interfaccia del contesto di autenticazione
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  loadingProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: { full_name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  pendingVerification: boolean;
  setPendingVerification: (pending: boolean) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

// Creazione del contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contesto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Funzione per recuperare il profilo dell'utente
  const fetchProfile = async (userId: string) => {
    try {
      setLoadingProfile(true);
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (checkError) {
        throw checkError;
      }

      // If profile doesn't exist, create it
      if (!existingProfile || existingProfile.length === 0) {
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData?.user?.email || '';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId,
              full_name: userEmail.split('@')[0],
              avatar_url: null
            }
          ])
          .select('*')
          .single();
        
        if (insertError) {
          throw insertError;
        }
        
        setProfile(newProfile);
      } else {
        // Profile exists, use it
        setProfile(existingProfile[0]);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    // Impostare prima il listener per i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
        // Utilizzare setTimeout per evitare deadlock con Supabase
        setTimeout(() => {
          fetchProfile(currentSession.user.id);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    // Poi verificare se esiste già una sessione
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funzione per aggiornare il profilo dell'utente
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Aggiorna il profilo locale
      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Funzione di login
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login effettuato",
          description: "Sei stato autenticato con successo.",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Errore di autenticazione",
        description: error?.message || "Si è verificato un errore durante l'accesso",
        variant: "destructive",
      });

      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione di registrazione
  const register = async (email: string, password: string, userData?: { full_name?: string }) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || null
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Se l'utente non deve verificare l'email
        toast({
          title: "Registrazione completata",
          description: "Account creato con successo.",
        });
        navigate("/dashboard");
      } else {
        // Se l'utente deve verificare l'email
        setPendingVerification(true);
        toast({
          title: "Registrazione completata",
          description: "Abbiamo inviato un'email di verifica all'indirizzo fornito. Controlla la tua casella di posta.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Errore di registrazione",
        description: error?.message || "Si è verificato un errore durante la registrazione",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per verificare l'email
  const verifyEmail = async (code: string) => {
    setLoading(true);
    
    try {
      // In una vera applicazione, questo sarebbe gestito da Supabase attraverso link di conferma email
      // Questa è solo una simulazione per questa demo
      if (code && code.length === 6 && /^\d+$/.test(code)) {
        toast({
          title: "Email verificata",
          description: "Il tuo account è stato verificato con successo.",
        });
        
        setPendingVerification(false);
        navigate("/login");
      } else {
        throw new Error("Codice di verifica non valido. Inserisci un codice a 6 cifre.");
      }
    } catch (error: any) {
      toast({
        title: "Errore di verifica",
        description: error?.message || "Si è verificato un errore durante la verifica dell'email",
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
      // In una vera applicazione, chiameremmo l'API di Supabase per rinviare l'email
      // Simulazione per questa demo
      toast({
        title: "Email inviata",
        description: "Abbiamo inviato un nuovo codice di verifica alla tua email.",
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error?.message || "Si è verificato un errore durante l'invio dell'email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione di logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // La pulizia dello stato sarà gestita dal listener onAuthStateChange
      navigate("/login");
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo.",
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error?.message || "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        loadingProfile,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        verifyEmail,
        resendVerificationEmail,
        pendingVerification,
        setPendingVerification,
        updateProfile
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
