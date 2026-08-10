import { motion } from "motion/react";
import { SectionHeading } from "../ui-kit";
import { SystemEvent, type VeylEvent } from "../SystemEvent";

const events: VeylEvent[] = [
  {
    time: "03:41:07",
    label: "process detected",
    detail: "/tmp/.cache/upd  ·  uid 1000  ·  ppid 1  ·  unsigned binary",
    meta: "first seen 4 minutes ago",
  },
  {
    time: "03:41:11",
    label: "outbound connection",
    detail: "45.83.220.11:8443  ·  TLS 1.3  ·  no SNI",
    meta: "destination has no reverse DNS",
  },
  {
    time: "03:41:14",
    label: "unexpected request",
    detail: "read ~/.ssh/id_ed25519  ·  denied by policy",
    meta: "policy: keys.readonly",
  },
  {
    time: "03:41:19",
    label: "activity correlated",
    detail: "3 events share one parent process",
    meta: "confidence 0.91",
  },
];

export function EventStory() {
  return (
    <section className="relative border-t border-ink-2 bg-ink-0 px-6 py-36 md:px-14">
      <SectionHeading index="02" label="03:41" className="mb-20" />
      <div className="grid gap-20 lg:grid-cols-2">
        <div className="max-w-md">
          {events.map((e, i) => (
            <SystemEvent key={e.time} event={e} index={i} />
          ))}
        </div>
        <div className="flex flex-col justify-center gap-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="veyl-display text-5xl md:text-6xl"
          >
            Something is wrong.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="veyl-display text-5xl text-muted-foreground md:text-6xl"
          >
            Now you know
            <br />
            where to look.
          </motion.p>
        </div>
      </div>
    </section>
  );
}