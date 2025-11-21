import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

type Props = {
  onUpload?: (publicUrl: string) => void;
};

const UploadAvatar: React.FC<Props> = ({ onUpload }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return toast({ title: 'Nenhum arquivo', description: 'Selecione uma imagem antes de enviar.' });
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${uuidv4()}.${ext}`;

      const { error } = await supabase.storage.from('documentos').upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from('documentos').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;
      // try to persist avatar url to profiles table (if column exists)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: upsertError } = await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl });
          if (upsertError) {
            console.warn('Avatar enviado, mas não foi possível atualizar profiles.avatar_url:', upsertError);
            toast({ title: 'Foto enviada', description: 'Imagem enviada, porém falha ao atualizar perfil. Verifique coluna `avatar_url` no Supabase.' });
            onUpload?.(publicUrl);
            return;
          }
        }
      } catch (err) {
        console.warn('Erro ao atualizar profile avatar_url', err);
      }

      toast({ title: 'Foto atualizada', description: 'Sua foto de perfil foi enviada e salva.' });
      onUpload?.(publicUrl);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erro', description: err?.message || 'Falha no upload.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setFile(null)}>Remover</Button>
        <Button size="sm" onClick={handleUpload} disabled={!file || uploading}>{uploading ? 'Enviando...' : 'Enviar Foto'}</Button>
      </div>
    </div>
  );
};

export default UploadAvatar;
