import { cn } from "@/lib/utils";

const Main = ({ children }: { children: React.ReactNode }) => {
  // This component might not be strictly necessary anymore if Navbar and Footer handle the overall page structure.
  // However, it can be kept if specific main content styling is needed later.
  return (
    <div className={cn(
      "flex-1", // Basic flex styling to allow main content to grow
      // "p-0" // Padding is now handled by individual sections or page containers
    )}>
      {children}
    </div>
  );
};

export default Main;
