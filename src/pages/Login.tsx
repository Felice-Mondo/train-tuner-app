
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import LoginContainer from "./login/LoginContainer";
import LoginHeader from "./login/LoginHeader";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./login/RegisterForm";
import VerificationForm from "./login/VerificationForm";

const Login = () => {
  const { 
    isAuthenticated, 
    loading, 
    pendingVerification
  } = useAuth();
  
  // Se l'utente è già autenticato, reindirizza alla dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  // Se è in attesa di verifica, mostra il form di verifica
  if (pendingVerification) {
    return (
      <LoginContainer>
        <VerificationForm />
      </LoginContainer>
    );
  }

  // Altrimenti mostra il form di login/registrazione
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>
      
      <LoginContainer>
        <LoginHeader 
          title="TrainSync" 
          subtitle="Track and optimize your fitness journey" 
        />
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
        </div>
      </LoginContainer>
    </div>
  );
};

export default Login;
