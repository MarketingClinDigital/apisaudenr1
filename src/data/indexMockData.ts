import type { IndexPageProps } from '../types';

export const mockRootProps: IndexPageProps = {
  progressItems: [
    {
      id: "triagem-jorge",
      category: "Triagens" as const,
      title: "Triagem do colaborador\nJorge Aor",
      progress: 85
    },
    {
      id: "caso-fernanda",
      category: "Casos" as const,
      title: "Estudo de caso de\nFernanda Cavalcanti",
      progress: 60
    }
  ],
  indicators: [
    {
      id: "triagens-realizadas",
      title: "Triagens Realizadas",
      subtitle: "Último mês",
      value: "328",
      percentage: 100
    },
    {
      id: "taxa-resolucao",
      title: "Taxa de Resolução",
      subtitle: "Casos resolvidos",
      value: "87%",
      percentage: 87
    },
    {
      id: "conformidade-nr1",
      title: "Conformidade NR1",
      subtitle: "vs. mês anterior",
      value: "94%",
      percentage: 94
    }
  ]
};