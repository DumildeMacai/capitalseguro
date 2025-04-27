import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon } from "lucide-react";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleAuthError } from "@/utils/authUtils";
import { useAuth } from "@/hooks/useAuth";

const registerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres.",
  }),
  phone: z.string().min(9, {
    message: "Número de telefone deve ter pelo menos 9 caracteres.",
  }),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  city: z.string().min(2, {
    message: "Cidade deve ter pelo menos 2 caracteres.",
  }),
  province: z.string().min(2, {
    message: "Província deve ter pelo menos 2 caracteres.",
  }),
  bio: z.string().max(160, {
    message: "Bio deve ter no máximo 160 caracteres.",
  }).optional(),
  userType: z.enum(["investidor", "parceiro"], {
    required_error: "Por favor, selecione um tipo de usuário.",
  }),
});

export const RegisterForm = () => {
  const [files, setFiles] = useState<{ biFront?: File; biBack?: File }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof registerFormSchema>>({
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

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="joao.silva@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="9XX XXX XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="investidor">Investidor</SelectItem>
                    <SelectItem value="parceiro">Parceiro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Luanda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Província</FormLabel>
                  <FormControl>
                    <Input placeholder="Luanda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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

        {/* Update the upload field styles for better alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel>BI (Frente)</FormLabel>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'biFront')}
                className="hidden"
                id="biFront"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
                onClick={() => document.getElementById('biFront')?.click()}
              >
                <UploadIcon size={16} />
                <span>Explorar...</span>
              </Button>
              <span className="text-sm text-muted-foreground">
                {files.biFront?.name || "Nenhum ficheiro selecionado"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>BI (Verso)</FormLabel>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'biBack')}
                className="hidden"
                id="biBack"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
                onClick={() => document.getElementById('biBack')?.click()}
              >
                <UploadIcon size={16} />
                <span>Explorar...</span>
              </Button>
              <span className="text-sm text-muted-foreground">
                {files.biBack?.name || "Nenhum ficheiro selecionado"}
              </span>
            </div>
          </div>
        </div>

        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
};
