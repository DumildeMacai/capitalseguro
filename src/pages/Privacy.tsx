import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-muted-foreground mb-4">A proteção dos seus dados é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações.</p>
            <p className="text-muted-foreground">(Conteúdo da política a ser adicionado conforme requisitos legais e de compliance.)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
