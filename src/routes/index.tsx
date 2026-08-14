import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/veyl/Navigation";
import { CursorField } from "@/components/veyl/CursorField";
import { Hero } from "@/components/veyl/sections/Hero";
import { Reveal } from "@/components/veyl/sections/Reveal";
import { EventStory } from "@/components/veyl/sections/EventStory";
import { Mentor } from "@/components/veyl/sections/Mentor";
import React, { Suspense } from 'react';
const TerminalSection = React.lazy(() => import('@/components/veyl/sections/TerminalSection').then(m => ({ default: m.TerminalSection })));
const VisualBreak = React.lazy(() => import('@/components/veyl/sections/VisualBreak').then(m => ({ default: m.VisualBreak })));
const Waitlist = React.lazy(() => import('@/components/veyl/sections/Waitlist').then(m => ({ default: m.Waitlist })));

const title = "VEYL — See what others miss.";
const description =
  "VEYL is a cybersecurity workstation for visibility, privacy, investigation and understanding what your machine is doing. Early access.";

import CinematicLayout from "@/components/Layout/CinematicLayout";

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
    <CinematicLayout>
      <CursorField />
      <Navigation />
      <Hero />
      <Reveal />
      <EventStory />
      <Mentor />
      <Suspense fallback={<div className="py-24">Loading...</div>}>
        <TerminalSection />
        <VisualBreak />
        <Waitlist />
      </Suspense>
    </CinematicLayout>
  );
}
