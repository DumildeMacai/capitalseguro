
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { handleAuthError } from "@/utils/authUtils";
import { useAuth } from "@/contexts/AuthContext";
import { registerFormSchema, type RegisterFormValues } from "./RegisterFormSchema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { DocumentUpload } from "./DocumentUpload";

export const RegisterForm = () => {
  const [files, setFiles] = useState<{ biFront?: File; biBack?: File }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      bio: "",
      userType: "investidor",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'biFront' | 'biBack') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prevFiles => ({ ...prevFiles, [field]: file }));
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    if (!files.biFront || !files.biBack) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar",
        description: "Por favor, carregue as duas faces do seu BI.",
      });
      return;
    }

    try {
      await signUp(values.email, values.password, values.userType, {
        name: values.name,
        phone: values.phone,
        address: values.address,
        city: values.city,
        province: values.province,
        bio: values.bio,
        biFront: files.biFront,
        biBack: files.biBack,
      });
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });
      navigate("/login");
    } catch (error: any) {
      handleAuthError(error, toast);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <AddressFields form={form} />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte-nos um pouco sobre você (opcional)."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Escreva uma breve descrição sobre você.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DocumentUpload files={files} onFileChange={handleFileChange} />

        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
};
