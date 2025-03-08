
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Calculator, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-morphism p-8 rounded-3xl max-w-md w-full text-center shadow-lg animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-secondary/50 dark:bg-secondary/30 rounded-full flex items-center justify-center mb-6">
          <Calculator className="w-10 h-10 text-primary animate-pulse-light" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-foreground/80 mb-6">Oops! We couldn't find that page</p>
        
        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary/90 active:scale-95">
          <ArrowLeft size={18} />
          <span>Back to Calculator</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
