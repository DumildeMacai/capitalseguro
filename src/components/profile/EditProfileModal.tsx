import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (profile: any) => void;
};

const EditProfileModal: React.FC<Props> = ({ open, onOpenChange, onSaved }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  useEffect(() => {
    if (!open) return;
    // load current profile when modal opens
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error || !data) return;
        setName(data.nome_completo || "");
        setPhone(data.telefone || "");
        setAddress(data.endereco || "");
        setCity(data.cidade || "");
        setProvince(data.pais || "Angola");
      } catch (err) {
        console.error(err);
      }
    })();
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const payload: any = {
        id: user.id,
        nome_completo: name || null,
        telefone: phone || null,
        endereco: address || null,
        cidade: city || null,
        provincia: province || null,
      };

      const { error } = await supabase.from('profiles').upsert(payload);
      if (error) throw error;

      toast({ title: 'Perfil atualizado', description: 'Suas informações foram salvas com sucesso.' });
      // fetch fresh profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      onSaved?.(profileData);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Erro', description: error?.message || 'Falha ao salvar perfil.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Informações</DialogTitle>
          <DialogDescription>Atualize seus dados pessoais.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label className="text-sm">Nome Completo</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <label className="text-sm">Telefone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

          <label className="text-sm">Endereço</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />

          <label className="text-sm">Cidade</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />

          <label className="text-sm">Província</label>
          <Input value={province} onChange={(e) => setProvince(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
