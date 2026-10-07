
import { Leaf } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 text-primary mb-4">
              <Leaf size={28} />
              <span className="text-xl font-bold text-foreground">LeafDoc</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Identify plants, detect diseases, and get expert care information. Your AI-powered plant assistant.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li> {/* Placeholder */}
            </ul>
          </div>
          
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; LeafDoc 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
