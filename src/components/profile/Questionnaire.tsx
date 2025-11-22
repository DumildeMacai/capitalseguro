import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const questions = [
  {
    id: 'q1',
    text: 'Qual é o seu horizonte de investimento?',
    options: ['Curto (0-2 anos)', 'Médio (3-5 anos)', 'Longo (5+ anos)']
  },
  {
    id: 'q2',
    text: 'Qual é sua tolerância a perdas?',
    options: ['Baixa', 'Moderada', 'Alta']
  },
  {
    id: 'q3',
    text: 'Qual objetivo principal do investimento?',
    options: ['Preservação de capital', 'Renda', 'Crescimento agressivo']
  },
  {
    id: 'q4',
    text: 'Como reagiria se seu portfólio caísse 20% em um ano?',
    options: ['Venderia tudo', 'Esperaria e manteria', 'Compraria mais']
  },
  {
    id: 'q5',
    text: 'Qual parte do seu capital você destinaria a investimentos de maior risco?',
    options: ['0-10%', '10-30%', '30%+']
  }
];

const Questionnaire: React.FC<Props> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setAnswer = (qid: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const computeRisk = () => {
    // Very simple scoring heuristic
    let score = 0;
    if (answers['q1'] === 'Longo (5+ anos)') score += 2;
    if (answers['q1'] === 'Médio (3-5 anos)') score += 1;
    if (answers['q2'] === 'Alta') score += 2;
    if (answers['q2'] === 'Moderada') score += 1;
    if (answers['q3'] === 'Crescimento agressivo') score += 2;
    if (answers['q3'] === 'Renda') score += 1;
    if (answers['q4'] === 'Compraria mais') score += 2;
    if (answers['q4'] === 'Esperaria e manteria') score += 1;
    if (answers['q5'] === '30%+') score += 2;
    if (answers['q5'] === '10-30%') score += 1;

    if (score >= 7) return 'Arrojado';
    if (score >= 4) return 'Moderado';
    return 'Conservador';
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const risk = computeRisk();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Save summary to profiles.bio as JSON string (lightweight approach)
      const bio = JSON.stringify({ risk_profile: risk, questionnaire: answers });
      const { error } = await supabase.from('profiles').update({ bio }).eq('id', user.id);
      if (error) throw error;

      toast({ title: 'Questionário enviado', description: `Seu perfil de risco foi atualizado: ${risk}` });
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erro', description: err?.message || 'Falha ao enviar questionário.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Questionário de Perfil</DialogTitle>
          <DialogDescription>Responda algumas perguntas rápidas para avaliarmos seu perfil de risco.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="font-medium">{q.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(q.id, opt)}
                    className={`px-3 py-2 border rounded text-left ${answers[q.id] === opt ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Questionnaire;
