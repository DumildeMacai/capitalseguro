
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
    question: "How is a 50% annual return possible?",
    answer: "Our unique investment model combines strategic real estate acquisitions, innovative business partnerships, and optimized operational efficiency. By focusing on high-growth markets and leveraging our extensive expertise, we consistently achieve this exceptional return rate for our investors."
  },
  {
    question: "When can I withdraw my initial investment?",
    answer: "Your initial investment has a minimum lock period of 1 year. After this period, you can withdraw your principal amount along with the earned returns through our simple withdrawal process in your dashboard."
  },
  {
    question: "How often are returns distributed?",
    answer: "Returns are calculated on an annual basis at a rate of 50%. You can track the growth of your investment in real-time through your investor dashboard, and you'll receive detailed monthly statements."
  },
  {
    question: "What is the minimum investment amount?",
    answer: "The minimum investment amount varies by opportunity, starting from $2,500 for some business investments to $15,000 for premium real estate developments. Each investment opportunity clearly displays its minimum requirement."
  },
  {
    question: "How are my investments secured?",
    answer: "Your investments are backed by real, tangible assets such as properties, business equity, or secured contracts. Additionally, we implement stringent risk management protocols and diversification strategies to safeguard your capital."
  },
  {
    question: "Can I invest from outside the United States?",
    answer: "Yes, we welcome international investors. Our platform supports global investments with secure international payment methods. However, certain jurisdictions may have specific regulations, so we recommend consulting your local financial advisor."
  },
  {
    question: "What happens if I need to withdraw before the 1-year period?",
    answer: "While we encourage maintaining your investment for the full term to maximize returns, we understand circumstances change. Early withdrawals are subject to a processing fee and may affect the calculated returns. Please contact our investor relations team for specific details."
  },
  {
    question: "How do I track my investment performance?",
    answer: "Your personalized investor dashboard provides real-time updates on all your investments, including current value, projected returns, and time until maturity. You can access detailed analytics and reports at any time."
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about investing with FutureInvest. 
            If you need further assistance, our support team is always available.
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
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our team is ready to assist you with any questions about our investment opportunities.
            </p>
            <div className="flex justify-center">
              <a href="/contact" className="text-purple hover:text-purple-dark font-medium flex items-center">
                Contact Our Support Team
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
