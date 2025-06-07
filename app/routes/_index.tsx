import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";

export const meta: MetaFunction = () => {
  return [
    { title: "Asterism" },
    {
      name: "description",
      content: "Verktyg för jurister",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1
            className="text-4xl md:text-6xl text-foreground mb-6"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ⁂ asterism
          </h1>
          <p
            className={cn(
              componentStyles.enhancedParagraph,
              "max-w-2xl mx-auto text-lg"
            )}
          >
            <span className={componentStyles.enhancedFirstWord}>Welcome</span>{" "}
            to a beautifully crafted design system featuring warm, natural
            tones, elegant typography, and sophisticated interactions.
          </p>
        </header>

        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const CardWrapper = index === 0 ? Link : "div";
            const cardProps = index === 0 ? { to: "/rättspraxis" } : {};

            return (
              <CardWrapper
                key={index}
                {...cardProps}
                className={cn(
                  componentStyles.card,
                  "page-transition",
                  index === 0 ? "cursor-pointer" : ""
                )}
              >
                <h2 className="text-2xl md:text-3xl mb-3 text-foreground lowercase flex items-start gap-3" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
                  <span className="text-primary text-lg leading-none translate-y-[-0.2em]">¶</span>
                  {feature.title}
                </h2>
                <p className={componentStyles.enhancedParagraph}>
                  {feature.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className={componentStyles.metadataTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </CardWrapper>
            );
          })}
        </main>

        <section className="mt-16 text-center">
          <div className="pull-quote">
            Elegant design speaks louder than words ever could.
          </div>
          <div className="footnote max-w-md mx-auto">
            This design system combines traditional typography with modern web
            technologies, creating an experience that is both timeless and
            contemporary.
          </div>
        </section>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Elegant Typography",
    description:
      "Sophisticated serif headers combined with clean sans-serif body text create a perfect balance of formality and readability.",
    tags: ["Serif", "Sans-serif", "Readability"],
  },
  {
    title: "Warm Color Palette",
    description:
      "Natural warm gray backgrounds with burgundy accents provide a welcoming and professional atmosphere.",
    tags: ["Color Theory", "Warm Tones", "Burgundy"],
  },
  {
    title: "Card-based Layout",
    description:
      "Clean white cards with subtle shadows and smooth transitions create an organized and modern interface.",
    tags: ["Cards", "Shadows", "Layout"],
  },
  {
    title: "Interactive Elements",
    description:
      "Thoughtful hover effects and smooth animations enhance user experience without overwhelming the content.",
    tags: ["Interactions", "Animations", "UX"],
  },
  {
    title: "Responsive Design",
    description:
      "Fluid grid systems and flexible components ensure beautiful presentation across all device sizes.",
    tags: ["Responsive", "Mobile", "Grid"],
  },
  {
    title: "Design System",
    description:
      "Comprehensive token-based design system with reusable components for consistent implementation.",
    tags: ["Tokens", "Components", "Consistency"],
  },
];
