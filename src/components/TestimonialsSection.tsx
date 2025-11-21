
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Real Estate Investor",
    image: "https://randomuser.me/api/portraits/women/79.jpg",
    quote: "Capital Seguro transformou o meu futuro financeiro. Os retornos anuais de 50% são incríveis, e a plataforma é muito fácil de usar. Já recomendei a todos os meus amigos."
  },
  {
    id: 2,
    name: "Michael Reeves",
    title: "Business Owner",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    quote: "Eu estava cético no início, mas a Capital Seguro entregou exatamente o prometido. Os retornos foram consistentes e o processo de investimento é simples. Realmente mudou o jogo!"
  },
  {
    id: 3,
    name: "Emily Chang",
    title: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    quote: "Como profissional financeiro, procuro oportunidades confiáveis para meus clientes. A Capital Seguro fornece retornos excepcionais com uma abordagem direta."
  },
  {
    id: 4,
    name: "David Thompson",
    title: "Retired Executive",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    quote: "Na aposentadoria, a renda passiva é crucial. A Capital Seguro entrega retornos consistentes de 50% que me permitem aproveitar a aposentadoria sem preocupações financeiras. Serviço excepcional!"
  },
  {
    id: 5,
    name: "Jessica Rivera",
    title: "Tech Entrepreneur",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    quote: "A equipa da Capital Seguro entende as necessidades dos investidores. A plataforma é intuitiva, as opções de investimento são diversas e os retornos falam por si."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">O que os nossos investidores dizem</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Não precisa só acreditar em nós — ouça investidores que já experimentaram
            os benefícios das oportunidades de rendimento passivo da Capital Seguro.
          </p>
        </motion.div>
        
        <Carousel 
          opts={{ 
            align: "start",
            loop: true
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full flex flex-col bg-card border border-border card-shadow">
                    <div className="mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-gold inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="flex-1 text-lg mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
