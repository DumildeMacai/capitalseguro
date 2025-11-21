import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Sobre Capital Seguro</h1>
            <p className="text-muted-foreground mb-4">
              Capital Seguro é uma plataforma de investimentos que conecta investidores a oportunidades de alto retorno, apoiadas por ativos reais e negócios locais.
            </p>
            <p className="text-muted-foreground">
              Nosso objetivo é oferecer oportunidades acessíveis, seguras e transparentes para ajudar você a construir riqueza ao longo do tempo.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
