import { SectionHeading, UIWindow, StatusIndicator, Badge } from "../ui-kit";
import { MentorMessage } from "../MentorMessage";

const evidence = [
  ["binary", "/tmp/.cache/upd", "unsigned, written 4m ago"],
  ["network", "45.83.220.11:8443", "no SNI, no reverse DNS"],
  ["access", "~/.ssh/id_ed25519", "read attempt, denied"],
];

export function Mentor() {
  return (
    <section className="relative border-t border-ink-2 bg-ink-0 px-6 py-32 md:px-14">
      <SectionHeading index="03" label="mentor" className="mb-16" />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
        <div>
          <h2 className="veyl-display text-6xl md:text-7xl">Ask Veyl.</h2>
          <p className="mt-6 max-w-xs font-mono text-[12px] leading-relaxed text-muted-foreground">
            It reads the same machine you do. It just reads all of it.
          </p>
        </div>

        <UIWindow
          title="mentor"
          right={<StatusIndicator label="reasoning on local evidence" tone="active" />}
          bodyClassName="p-6 md:p-8"
        >
          <div className="space-y-7">
            <MentorMessage from="user">Why is this suspicious?</MentorMessage>
            <MentorMessage from="veyl" delay={0.5}>
              Three things stand out.
            </MentorMessage>

            <div className="space-y-px overflow-hidden rounded-xs border border-ink-3">
              {evidence.map(([k, v, note], i) => (
                <div
                  key={k}
                  className="grid grid-cols-[76px_1fr] gap-4 bg-ink-2/60 px-4 py-3 font-mono text-[11px]"
                  style={{ opacity: 1 - i * 0.06 }}
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span>
                    <span className="text-foreground/90">{v}</span>
                    <span className="block text-muted-foreground">{note}</span>
                  </span>
                </div>
              ))}
            </div>

            <MentorMessage from="veyl" delay={1.1}>
              Alone, none of these matter. Together, they describe a process that hid itself, called
              home, and reached for a key.
            </MentorMessage>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>isolate process</Badge>
              <Badge>block destination</Badge>
              <Badge>open forensics</Badge>
            </div>
          </div>
        </UIWindow>
      </div>
    </section>
  );
}