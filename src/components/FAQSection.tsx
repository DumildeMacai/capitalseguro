import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como é possível um retorno anual de 100%?",
    answer: "Nosso modelo combina aquisições estratégicas, parcerias comerciais e eficiência operacional. Ao focarmos em mercados de alto crescimento e aplicar nossa expertise, conseguimos taxas de retorno superiores para os investidores."
  },
  {
    question: "Quando posso resgatar meu investimento inicial?",
    answer: "O investimento inicial possui um período mínimo de carência de 1 ano. Após esse período, você pode resgatar o valor principal juntamente com os rendimentos através do processo de retirada no seu painel."
  },
  {
    question: "Com que frequência os rendimentos são distribuídos?",
    answer: "Os rendimentos são calculados anualmente com a taxa informada em cada oportunidade. Você pode acompanhar o crescimento do seu investimento em tempo real pelo painel do investidor e receber extratos detalhados mensalmente."
  },
  {
    question: "Qual é o investimento mínimo?",
    answer: "O valor mínimo varia conforme a oportunidade, começando em Kz 2.500 para alguns negócios e podendo chegar a Kz 15.000 para desenvolvimentos imobiliários premium. Cada oportunidade informa claramente o mínimo exigido."
  },
  {
    question: "Como meus investimentos são garantidos?",
    answer: "Os investimentos são lastreados em ativos reais, como imóveis, participações societárias ou contratos garantidos. Além disso, aplicamos protocolos de gestão de risco e diversificação para proteger o capital."
  },
  {
    question: "Posso investir estando fora do Brasil?",
    answer: "Sim — aceitamos investidores internacionais. A plataforma suporta pagamentos internacionais seguros, mas algumas jurisdições podem ter regras específicas; recomendamos consultar um assessor financeiro local."
  },
  {
    question: "E se eu precisar resgatar antes do período de 1 ano?",
    answer: "Entendemos que situações podem mudar. Resgates antecipados podem estar sujeitos a taxas de processamento e afetar o rendimento calculado. Entre em contato com a nossa equipe de relacionamento com investidores para orientações específicas."
  },
  {
    question: "Como acompanho o desempenho dos meus investimentos?",
    answer: "Seu painel de investidor fornece atualizações em tempo real sobre todos os investimentos, incluindo valor atual, projeções de retorno e tempo até o vencimento. Você também pode acessar relatórios e análises detalhadas a qualquer momento."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Perguntas Frequentes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre investimento na Capital Seguro.
            Se precisar de mais ajuda, nossa equipe de suporte está disponível.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem value={`item-${index}`} className="border border-border rounded-lg mb-4 overflow-hidden bg-card shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-1 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12 p-6 rounded-xl border border-border bg-card shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-2">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-4">
              Nossa equipe está pronta para ajudar com qualquer dúvida sobre as oportunidades de investimento.
            </p>
            <div className="flex justify-center">
              <a href="/contact" className="text-purple hover:text-purple-dark font-medium flex items-center">
                Fale com a nossa equipe de suporte
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
