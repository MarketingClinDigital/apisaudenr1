import { Card } from "@/components/ui/card";

export function HeroCard() {
  return (
    <Card className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_0_20px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <img
          src="/one-logo.svg"
          alt="One"
          className="h-[37px] w-auto"
        />

        <div className="space-y-2">
          <h1 className="heading-hero text-navy-dark">
            Tudo sobre NR1,{"\n"}e um só lugar.
          </h1>
          <p className="text-description text-text-gray">
            Triagens inteligentes, teleorientação conectada e analytics para decisões rápidas em saúde ocupacional.
          </p>
        </div>
      </div>
    </Card>
  );
}