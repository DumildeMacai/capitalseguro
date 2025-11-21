import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Termos de Serviço</h1>
            <p className="text-muted-foreground mb-4">Leia os nossos Termos de Serviço para entender os seus direitos e responsabilidades ao usar a plataforma Capital Seguro.</p>
            <p className="text-muted-foreground">(Conteúdo do termo a ser adicionado conforme requisitos legais e comerciais.)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
