
import * as z from "zod";

export const registerFormSchema = z.object({
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

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
