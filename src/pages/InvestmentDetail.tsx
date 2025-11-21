import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const InvestmentDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Detalhes do Investimento</h1>
            <p className="text-muted-foreground mb-6">ID do investimento: <span className="font-medium">{id}</span></p>

            <p className="mb-4">Aqui estarão os detalhes completos do investimento selecionado, como descrição, metas de captação, risco, cronograma e opções para investir.</p>

            <div className="flex gap-3">
              <Link to="/investments" className="inline-block px-4 py-2 bg-muted text-muted-foreground rounded hover:opacity-90">Voltar à lista</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvestmentDetail;
