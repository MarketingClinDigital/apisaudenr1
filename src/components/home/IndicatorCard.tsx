import React from "react";
import { Card } from "@/components/ui/card";
import BriefcasePinkIcon from "../icons/BriefcasePinkIcon";
import CirclePurpleIcon from "../icons/CirclePurpleIcon";
import BookOrangeIcon from "../icons/BookOrangeIcon";
import type { Indicator } from "@/types";

interface IndicatorCardProps {
  indicator: Indicator;
  percentageValue?: number;
  animationDelay?: number;
}

const iconMap = {
  "triagens-realizadas": BriefcasePinkIcon,
  "taxa-resolucao": CirclePurpleIcon,
  "conformidade-nr1": BookOrangeIcon,
};

const ringColorMap = {
  "triagens-realizadas": "#36E385",
  "taxa-resolucao": "#9260f4",
  "conformidade-nr1": "#FF9B4A",
};

export function IndicatorCard({
  indicator,
  percentageValue,
  animationDelay = 0,
}: IndicatorCardProps) {
  const IconComponent = iconMap[indicator.id as keyof typeof iconMap];
  const ringColor = ringColorMap[indicator.id as keyof typeof ringColorMap];
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const percentage =
    percentageValue === undefined ? indicator.percentage : percentageValue;
  const dashArray = `${percentage * 1.759} 175.9`;

  return (
    <Card
      className="flex items-center justify-between rounded-[15px] bg-white p-5 shadow-[0_4px_32px_rgba(0,0,0,0.04)] transition-all duration-700 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(12px)",
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-lg">
          {IconComponent && <IconComponent width={17} height={17} color={ringColor} />}
        </div>
        <div>
          <p className="text-card-title text-text-primary font-normal">
            {indicator.title}
          </p>
          <p className="text-label text-text-dark-gray">
            {indicator.subtitle}
          </p>
        </div>
      </div>

      <div className="relative h-16 w-16 shrink-0">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={ringColor}
            strokeWidth="6"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 900ms ease-out",
              transitionDelay: `${animationDelay}ms`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-label text-text-primary font-normal">
            {indicator.value}
          </span>
        </div>
      </div>
    </Card>
  );
}
