
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { registerFormSchema, type RegisterFormValues } from "./RegisterFormSchema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { DocumentUpload } from "./DocumentUpload";

export const RegisterForm = () => {
  const [files, setFiles] = useState<{ biFront?: File; biBack?: File }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      console.log("Iniciando registro com dados:", { 
        email: values.email, 
        userType: values.userType,
        userData: {
          name: values.name,
          phone: values.phone
        } 
      });
      
      // Registro direto com Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            tipo: values.userType,
            nome: values.name,
            telefone: values.phone
          }
        }
      });

      if (error) {
        console.error("Erro ao registrar usuário:", error);
        toast({
          variant: "destructive",
          title: "Erro ao registrar",
          description: error.message || "Ocorreu um erro durante o registro.",
        });
        return;
      }
      
      console.log("Usuário registrado com sucesso:", data.user?.id);
      
      // Se o usuário foi criado com sucesso, fazer upload dos documentos
      if (data.user) {
        await handleDocumentUpload(data.user.id, files);
        await updateUserProfile(data.user.id, values, files);
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Erro completo no registro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro durante o registro.",
      });
    }
  };

  const handleDocumentUpload = async (userId: string, files: { biFront?: File; biBack?: File }) => {
    try {
      // Upload do documento frente
      if (files.biFront) {
        const { error: frontError } = await supabase.storage
          .from('documentos')
          .upload(`${userId}/bi_frente`, files.biFront);
          
        if (frontError) {
          console.error("Erro ao fazer upload do documento (frente):", frontError);
        } else {
          console.log("Upload da frente do documento realizado com sucesso");
        }
      }
      
      // Upload do documento verso
      if (files.biBack) {
        const { error: backError } = await supabase.storage
          .from('documentos')
          .upload(`${userId}/bi_verso`, files.biBack);
          
        if (backError) {
          console.error("Erro ao fazer upload do documento (verso):", backError);
        } else {
          console.log("Upload do verso do documento realizado com sucesso");
        }
      }
    } catch (error) {
      console.error("Erro durante o upload de documentos:", error);
    }
  };
  
  const updateUserProfile = async (userId: string, values: RegisterFormValues, files: { biFront?: File; biBack?: File }) => {
    try {
      const updateData = {
        user_id: userId,
        nome_completo: values.name,
        telefone: values.phone,
        endereco: values.address,
        cidade: values.city,
        provincia: values.province,
        bio: values.bio || '',
        doc_frente: files.biFront ? `${userId}/bi_frente` : null,
        doc_verso: files.biBack ? `${userId}/bi_verso` : null,
        empresa_nome: values.userType === 'parceiro' ? values.name : null,
        ramo_negocio: null
      };
      
      console.log("Atualizando perfil com dados:", updateData);
      
      const { error } = await supabase
        .rpc('update_user_profile', updateData);
        
      if (error) {
        console.error("Erro ao atualizar perfil:", error);
      } else {
        console.log("Perfil atualizado com sucesso");
      }
    } catch (updateError) {
      console.error("Exceção durante atualização de perfil:", updateError);
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
