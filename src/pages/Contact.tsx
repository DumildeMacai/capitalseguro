import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Contacto</h1>
            <p className="text-muted-foreground mb-4">Tem alguma pergunta? Envie-nos um e-mail em <a href="mailto:suporte@capitalseguro.com" className="underline">suporte@capitalseguro.com</a> e responderemos em breve.</p>
            <p className="text-muted-foreground">Também pode consultar as nossas redes sociais para novidades e anúncios.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
