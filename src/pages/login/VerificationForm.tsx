
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

// Schema di validazione per il form di verifica email
const verificationSchema = z.object({
  code: z.string().min(6, { message: "Il codice deve contenere 6 caratteri" }).max(6, { message: "Il codice deve contenere 6 caratteri" }),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

const VerificationForm = () => {
  const { verifyEmail, resendVerificationEmail, loading } = useAuth();
  
  // Form di verifica
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });
  
  // Funzione di invio del form di verifica
  const onSubmit = async (data: VerificationFormValues) => {
    await verifyEmail(data.code);
  };
  
  // Funzione per richiedere un nuovo codice di verifica
  const handleResendCode = async () => {
    await resendVerificationEmail();
  };

  return (
    <div className="text-center mb-8">
      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-2">
        Verifica la tua email
      </div>
      <p className="text-muted-foreground">Ti abbiamo inviato un codice di verifica alla tua email</p>
      
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Codice di verifica</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456" 
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifica in corso..." : "Verifica"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleResendCode}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Invia nuovo codice
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerificationForm;
