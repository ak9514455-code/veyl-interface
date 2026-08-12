# VEYL Interface

Build a completely original, high-end interactive website for VEYL.

Do NOT use a conventional SaaS landing-page structure.
Do NOT create a hero followed by feature cards followed by testimonials followed by pricing.
Do NOT make it look like a template.
Do NOT copy the visual language of TryHackMe, Hack The Box, Kali Linux, or generic cybersecurity websites.

VEYL is an upcoming cybersecurity workstation focused on visibility, privacy, investigation, and understanding what is happening on a machine.

The website should feel like a mysterious product that has been discovered, not a company trying to explain itself.

CORE IDEA

VEYL
"See what others miss."

The visitor should experience:

curiosity → discovery → tension → understanding → obsession → waitlist

The first 5 seconds matter more than the amount of information on the page.

VISUAL DIRECTION

Use a near-black monochrome environment:

#070709
#0D0D11
#121218
#24242D

Text:

#F5F5F7
#8B8B96

Accent:

#7C5CFF
#9B86FF

Purple should be extremely limited.
Most of the interface should be black, white and gray.

The site should feel like:

editorial design
+ cinematic product launch
+ futuristic operating environment
+ technical interface

But NOT sci-fi fantasy.

No neon cyberpunk.
No Matrix rain.
No green terminal aesthetic.
No random glowing shields.
No stock hacker images.
No excessive glassmorphism.
No giant gradients.
No floating cards everywhere.

TYPOGRAPHY

Use a strong modern grotesk/sans-serif.

Very large typography.
Very tight hierarchy.
Lots of negative space.

Technical information should use a monospace font.

THE HERO

Do something visually unexpected.

Do NOT center a normal headline with a button underneath.

Create an immersive composition where the VEYL wordmark and the headline feel integrated into the environment.

Possible direction:

A mostly black screen.

Small VEYL mark positioned precisely.

Huge:

"See what
others miss."

The words should have subtle motion as the user enters the page.

Behind or around the typography, create an extremely subtle system/interface visualization.

It could look like fragments of:

network activity
process information
system events
terminal output
coordinates
timestamps
connections

But these should appear as part of the visual composition, not as a boring dashboard.

Then reveal a realistic VEYL interface underneath the typography.

CTA:

"Get Early Access"

Keep the CTA small and confident.

Do not use marketing language like:
"Join thousands of cybersecurity enthusiasts."

PRODUCT REVEAL

Create a dramatic transition from the abstract hero into the actual VEYL environment.

The interface should feel like a real operating environment.

Show:

Overview
Privacy
Network
Security
Forensics
OSINT
Lab
Mentor
Terminal

But don't expose all of these as a feature list.

Instead, let the interface reveal itself visually.

The visitor should think:

"Wait, this is an actual environment."

SYSTEM EVENT STORY

Create a cinematic interactive section.

Start with a nearly empty screen.

Small monospace text:

03:41:07
process detected

03:41:11
outbound connection

03:41:14
unexpected request

03:41:19
activity correlated

Then:

"Something is wrong."

Pause.

Then:

"Now you know where to look."

Use Motion to reveal each event naturally.

Don't use huge red warning graphics.

The tension should come from restraint.

VEYL MENTOR

Introduce the AI naturally.

Don't call it:

"AI-powered revolutionary cybersecurity assistant."

Instead:

"Ask Veyl."

Show a realistic Mentor interaction.

User:

"Why is this suspicious?"

Veyl:

"Three things stand out."

Then display evidence from the system.

The interface should feel like an intelligent technical mentor, not ChatGPT pasted into a website.

TERMINAL

Create a beautiful terminal interaction.

Show:

$ grep "ERROR" server.log | sort | uniq -c

Then transform the output into a visual explanation.

The important idea:

VEYL does not hide Linux.

It makes Linux easier to understand.

This should be communicated visually rather than through a giant paragraph.

VISUAL BREAK

At some point remove almost everything.

Black background.

Huge text:

"The things you don't notice
are usually the things worth noticing."

No cards.
No icons.
No explanation.

Let the typography carry the section.

FINAL WAITLIST

Don't use a giant conventional signup form.

Create a quiet final scene.

VEYL

"Be early."

"Veyl is being built quietly."

Then:

[ your@email.com ] [ Join ]

After submission, show a subtle success state:

"You're in."

Do not use confetti.

MOTION

Use React Bits and Motion aggressively in creativity but conservatively in quantity.

Use:

- advanced text reveal
- scroll-based transformations
- subtle cursor interaction
- terminal typing
- system-event sequencing
- perspective movement
- smooth UI transitions
- subtle parallax
- magnetic CTA interaction
- masked text transitions

But every effect must have a purpose.

Do not put an animation on every element.

The animation should feel like the interface itself is alive.

INTERACTION

Make the site feel responsive to the visitor.

Examples:

- Cursor creates a subtle light field.
- Hovering over system events reveals additional information.
- Scrolling changes the perspective of the VEYL interface.
- Terminal commands animate naturally.
- The Mentor panel responds visually.
- UI elements shift slightly with depth.
- Sections transition into one another rather than simply appearing underneath each other.

IMPORTANT:

Do NOT make these interactions gimmicky.

The visitor should feel like they are exploring VEYL.

RESPONSIVE

Desktop:
cinematic and immersive.

Tablet:
preserve hierarchy and visual storytelling.

Mobile:
do NOT simply stack the desktop layout.

Create a deliberate mobile composition with large typography and simplified interactions.

TECH STACK

Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
React Bits
Motion

Use shadcn/ui only for functional UI elements.

Use React Bits for distinctive visual moments.

Use Motion for transitions and interaction.

Do not rely on a component library to determine the visual identity.

DESIGN SYSTEM

Create reusable:

Button
Badge
Navigation
Terminal
SystemEvent
StatusIndicator
MentorMessage
UIWindow
SectionHeading
WaitlistInput

Use consistent spacing, radius, typography and borders.

CODE QUALITY

Componentize the sections.

Keep animations performant.

Respect prefers-reduced-motion.

Use accessible buttons and inputs.

No unnecessary dependencies.

The website must actually work, not just look like a screenshot.

WAITLIST FORM

Validate email.

Show loading state.

Show success state.

Show error state.

Structure the submission logic so it can later connect to Supabase.

COPYWRITING

Keep copy extremely short.

Never write paragraphs explaining every feature.

Never use generic phrases such as:

"Unlock the future of cybersecurity."
"Next-generation security platform."
"AI-powered security solution."
"Revolutionary technology."
"Empowering users."
"Enterprise-grade protection."

Instead use short, confident statements.

Examples:

"See what others miss."

"Something is wrong."

"Now you know where to look."

"Ask Veyl."

"The terminal is still there."

"Be early."

FINAL FEELING

When someone finishes the page, they should NOT be able to list every VEYL feature.

They should instead think:

"I don't completely understand what this is yet."

"That interface looks insane."

"When can I use it?"

"Where do I sign up?"

Make VEYL feel like a product people discovered early.

Create something genuinely new in composition and interaction.

Do not produce another cybersecurity landing-page template.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de25e560-129c-4c95-ac27-a1911f0c06ab).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
