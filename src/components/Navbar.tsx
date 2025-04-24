
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-navy/80 shadow-md backdrop-blur-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
            <span className="text-white text-lg font-bold">M</span>
          </span>
          <span className="text-gradient font-extrabold">MACAIINVEST</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-purple transition-colors">
            Início
          </Link>
          <Link to="/investments" className="font-medium hover:text-purple transition-colors">
            Investimentos
          </Link>
          <Link to="/about" className="font-medium hover:text-purple transition-colors">
            Sobre
          </Link>
          <Link to="/contact" className="font-medium hover:text-purple transition-colors">
            Contacto
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" className="font-medium">
              Entrar
            </Button>
          </Link>
          <Link to="/login?register=true">
            <Button className="bg-gradient-primary hover:opacity-90 font-medium">
              Comece a Investir
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link to="/" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">
                Início
              </Link>
              <Link to="/investments" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">
                Investimentos
              </Link>
              <Link to="/about" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">
                Sobre
              </Link>
              <Link to="/contact" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">
                Contacto
              </Link>
              
              <div className="border-t mt-4 pt-4 px-4 flex flex-col gap-3">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full font-medium">
                    Entrar
                  </Button>
                </Link>
                <Link to="/login?register=true" className="w-full">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 font-medium">
                    Comece a Investir
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
