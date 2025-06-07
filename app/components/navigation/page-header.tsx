import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";

interface PageHeaderProps {
  title: string;
  description: string;
  showBackToHome?: boolean;
}

export function PageHeader({ title, description, showBackToHome = true }: PageHeaderProps) {
  return (
    <header className="text-center mb-16">
      {showBackToHome && (
        <Link 
          to="/" 
          className="inline-block mb-8 text-primary hover:text-primary/80 transition-colors"
          style={{ fontFamily: '"La Belle Aurore", cursive' }}
        >
          ← ⁂ asterism
        </Link>
      )}
      <h1 
        className="text-4xl md:text-6xl text-foreground mb-6 lowercase"
        style={{ fontFamily: '"La Belle Aurore", cursive' }}
      >
        {title}
      </h1>
      <p className={cn(componentStyles.enhancedParagraph, "max-w-2xl mx-auto text-lg")}>
        <span className={componentStyles.enhancedFirstWord}>
          {description.split(' ')[0]}
        </span>{' '}
        {description.split(' ').slice(1).join(' ')}
      </p>
    </header>
  );
}