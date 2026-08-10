import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/veyl/Navigation";
import { CursorField } from "@/components/veyl/CursorField";
import { Hero } from "@/components/veyl/sections/Hero";
import { Reveal } from "@/components/veyl/sections/Reveal";
import { EventStory } from "@/components/veyl/sections/EventStory";
import { Mentor } from "@/components/veyl/sections/Mentor";
import { TerminalSection } from "@/components/veyl/sections/TerminalSection";
import { VisualBreak } from "@/components/veyl/sections/VisualBreak";
import { Waitlist } from "@/components/veyl/sections/Waitlist";

const title = "VEYL — See what others miss.";
const description =
  "VEYL is a cybersecurity workstation for visibility, privacy, investigation and understanding what your machine is doing. Early access.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-ink-0 text-foreground">
      <CursorField />
      <Navigation />
      <Hero />
      <Reveal />
      <EventStory />
      <Mentor />
      <TerminalSection />
      <VisualBreak />
      <Waitlist />
    </main>
  );
}
