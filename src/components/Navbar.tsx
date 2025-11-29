import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, userType, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Attach scroll listener once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    // set initial state
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <span className="text-white text-sm font-bold">CS</span>
          </span>
          <span className="text-gradient font-extrabold">Capital Seguro</span>
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
          {user ? (
            <>
              <div className="text-sm text-muted-foreground">
                {user.email}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User size={16} />
                    {userType === "investidor" && "Investidor"}
                    {userType === "parceiro" && "Parceiro"}
                    {userType === "admin" && "Admin"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {userType === "investidor" && (
                    <DropdownMenuItem asChild>
                      <Link to="/investidor" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard size={16} />
                        Dashboard do Investidor
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userType === "parceiro" && (
                    <DropdownMenuItem asChild>
                      <Link to="/parceiro" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard size={16} />
                        Dashboard de Parceiro
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userType === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
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
            </>
          )}
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
                {user ? (
                  <>
                    <div className="text-xs text-muted-foreground mb-2">
                      {user.email}
                    </div>
                    {userType === "investidor" && (
                      <Link to="/investidor" className="w-full">
                        <Button variant="outline" className="w-full justify-start font-medium gap-2">
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {userType === "parceiro" && (
                      <Link to="/parceiro" className="w-full">
                        <Button variant="outline" className="w-full justify-start font-medium gap-2">
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {userType === "admin" && (
                      <Link to="/admin" className="w-full">
                        <Button variant="outline" className="w-full justify-start font-medium gap-2">
                          <LayoutDashboard size={16} />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="destructive"
                      className="w-full justify-start font-medium gap-2"
                      onClick={() => signOut()}
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
