import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple via-navy to-navy-dark -z-10" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTQ0MCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBvcGFjaXR5PSIwLjIiPgo8Y2lyY2xlIGN4PSI3MjAiIGN5PSI1MTIiIHI9IjUwMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjcyMCIgY3k9IjUxMiIgcj0iNDAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz4KPGNpcmNsZSBjeD0iNzIwIiBjeT0iNTEyIiByPSIzMDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIvPgo8Y2lyY2xlIGN4PSI3MjAiIGN5PSI1MTIiIHI9IjIwMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CjwvZz4KPC9zdmc+Cg==')] bg-no-repeat bg-cover opacity-20 -z-10" />
          
          <div className="relative z-10 py-16 px-6 md:px-12 lg:px-20 text-white text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
              Start Building Your <span className="text-gold">Passive Income</span> Today
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-10">
              Join thousands of satisfied investors earning 100% annual returns. 
              Our investment platform makes it easy to build wealth with secured, high-yield opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-navy-dark font-semibold text-lg">
                <Link to="/login?register=true">Start Investing Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-medium text-lg">
                <Link to="/contact">Talk to an Advisor</Link>
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="rounded-full h-16 w-16 flex items-center justify-center bg-white/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6a4 4 0 0 0-4-4 7 7 0 0 0-7 7c0 4-3 6-3 6h14s-3-2-3-6a3 3 0 0 1 3-3" />
                    <path d="M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z" />
                    <path d="M13 15h-2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1Z" />
                    <path d="M9.5 11.5V15" />
                    <path d="M14.5 8v7.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">100% Annual Returns</h3>
                <p className="opacity-80">Guaranteed returns that outperform traditional investments</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="rounded-full h-16 w-16 flex items-center justify-center bg-white/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Asset-Backed Security</h3>
                <p className="opacity-80">Investments secured by real-world assets and properties</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="rounded-full h-16 w-16 flex items-center justify-center bg-white/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Management</h3>
                <p className="opacity-80">Simple, transparent platform with real-time monitoring</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
