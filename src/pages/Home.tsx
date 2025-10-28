import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/home/PageHeader";
import { HeroCard } from "@/components/home/HeroCard";
import { ProgressCard } from "@/components/home/ProgressCard";
import { IndicatorCard } from "@/components/home/IndicatorCard";
import { Button } from "@/components/ui/button";
import { mockRootProps } from "@/data/indexMockData";

const Home: React.FC = () => {
  const [animate, setAnimate] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-8 pb-24">
      <PageHeader />

      <div className="space-y-6 rounded-[24px] bg-white/80 p-5 shadow-[0_18px_30px_-24px_rgba(2,28,73,0.65)] backdrop-blur">
        <HeroCard />

        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
          <Button
            size="lg"
            className="flex-1 rounded-2xl bg-[#001d46] px-6 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_16px_35px_-22px_rgba(0,35,85,0.85)] transition hover:bg-[#01295f]"
            onClick={() => navigate("/triagem")}
          >
            Iniciar triagem
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-2xl border-2 border-[#001d46]/20 px-6 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#001d46] transition hover:border-[#001d46] hover:bg-[#001d46]/5"
            onClick={() => navigate("/relatorios")}
          >
            Ver relatórios
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-section text-navy-dark">Em progresso</h2>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Atualizado agora
          </span>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {mockRootProps.progressItems.map((item, index) => (
            <ProgressCard
              key={item.id}
              item={item}
              progressValue={animate ? item.progress : 0}
              animationDelay={150 + index * 120}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-section text-navy-dark">
            Indicadores-chave do último ciclo
          </h2>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Ciclo de julho
          </span>
        </div>
        <div className="space-y-3">
          {mockRootProps.indicators.map((indicator, index) => (
            <IndicatorCard
              key={indicator.id}
              indicator={indicator}
              percentageValue={animate ? indicator.percentage : 0}
              animationDelay={200 + index * 120}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

