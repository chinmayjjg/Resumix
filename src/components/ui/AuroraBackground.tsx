import { cn } from "@/lib/utils";

export default function AuroraBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("aurora-background", className)}>
      <div className="aurora-orb aurora-orb-one" />
      <div className="aurora-orb aurora-orb-two" />
      <div className="aurora-grid" />
    </div>
  );
}
