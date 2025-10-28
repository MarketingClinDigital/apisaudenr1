import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import BriefcaseGreenIcon from "../icons/BriefcaseGreenIcon";
import type { ProgressItem } from "@/types";

interface ProgressCardProps {
  item: ProgressItem;
  progressValue?: number;
  animationDelay?: number;
}

export function ProgressCard({
  item,
  progressValue,
  animationDelay = 0,
}: ProgressCardProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const displayProgress =
    progressValue === undefined ? item.progress : progressValue;

  return (
    <Card
      className="relative overflow-hidden rounded-[19px] bg-navy-dark p-5 shadow-none transition-all duration-700 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(12px)",
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-label text-text-light-gray">
            {item.category}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-bright">
            <BriefcaseGreenIcon width={12} height={12} color="#001d46" />
          </div>
        </div>

        <p className="text-card-title text-white whitespace-pre-line">
          {item.title}
        </p>

        <div className="space-y-1">
          <Progress value={displayProgress} className="h-[7px] bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00F0AE] to-[#4EE4FF] transition-all duration-700 ease-out"
              style={{
                width: `${displayProgress}%`,
                transitionDelay: `${animationDelay}ms`,
              }}
            />
          </Progress>
        </div>
      </div>
    </Card>
  );
}
