import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { registerFormSchema, type RegisterFormValues } from "./RegisterFormSchema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { DocumentUpload } from "./DocumentUpload";
import { RegisterFormSubmit } from "./RegisterFormSubmit";
import { DocumentFiles } from "@/utils/registerUtils";

export const RegisterForm = () => {
  const [files, setFiles] = useState<DocumentFiles>({});
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'biFront' | 'biBack') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prevFiles => ({ ...prevFiles, [field]: file }));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
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

        <RegisterFormSubmit form={form} files={files} />
      </form>
    </Form>
  );
};
