
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DocumentFiles, registerUser } from "@/utils/registerUtils";
import { RegisterFormValues } from "./RegisterFormSchema";
import { UseFormReturn } from "react-hook-form";

interface RegisterFormSubmitProps {
  form: UseFormReturn<RegisterFormValues>;
  files: DocumentFiles;
}

export const RegisterFormSubmit: React.FC<RegisterFormSubmitProps> = ({ form, files }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUser(values, files, toast);
    
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <Button 
      disabled={isLoading} 
      className="w-full" 
      type="submit" 
      onClick={form.handleSubmit(onSubmit)}
    >
      {isLoading ? "Cadastrando..." : "Cadastrar"}
    </Button>
  );
};
