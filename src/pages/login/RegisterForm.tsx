
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

// Schema di validazione per il form di registrazione
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  password: z.string().min(6, { message: "La password deve contenere almeno 6 caratteri" }),
  confirmPassword: z.string().min(6, { message: "La password deve contenere almeno 6 caratteri" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non corrispondono",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register: registerUser, loading } = useAuth();
  
  // Form di registrazione
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Funzione di invio del form di registrazione
  const onSubmit = async (data: RegisterFormValues) => {
    await registerUser(data.email, data.password, { full_name: data.fullName });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Nome completo</FormLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input 
                    type={isPasswordVisible ? "text" : "password"} 
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input 
                    type={isPasswordVisible ? "text" : "password"} 
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registrazione in corso..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
