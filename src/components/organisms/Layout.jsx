import { useState } from "react";
import Header from "@/components/organisms/Header";
import MobileMenu from "@/components/organisms/MobileMenu";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;