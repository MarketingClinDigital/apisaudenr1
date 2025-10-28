import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  glassCardClass,
  heroCardClass,
  pillBadgeClass,
  sectionHeadingClass,
  subheadingMutedClass,
} from "@/styles/ui";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Download,
  Activity,
  ShieldPlus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type MonthRange = "6m" | "12m";
type RiskView = "percent" | "absolute";

const TOTAL_TRIAGENS = 382;

const monthlyData: Record<MonthRange, Array<{ name: string; triagens: number; resolvidos: number }>> = {
  "6m": [
    { name: "mar 24", triagens: 58, resolvidos: 42 },
    { name: "abr 24", triagens: 60, resolvidos: 45 },
    { name: "mai 24", triagens: 63, resolvidos: 48 },
    { name: "jun 24", triagens: 51, resolvidos: 39 },
    { name: "jul 24", triagens: 53, resolvidos: 41 },
    { name: "ago 24", triagens: 62, resolvidos: 47 },
  ],
  "12m": [
    { name: "set 23", triagens: 41, resolvidos: 31 },
    { name: "out 23", triagens: 45, resolvidos: 35 },
    { name: "nov 23", triagens: 47, resolvidos: 36 },
    { name: "dez 23", triagens: 52, resolvidos: 38 },
    { name: "jan 24", triagens: 42, resolvidos: 33 },
    { name: "fev 24", triagens: 55, resolvidos: 40 },
    { name: "mar 24", triagens: 58, resolvidos: 42 },
    { name: "abr 24", triagens: 60, resolvidos: 45 },
    { name: "mai 24", triagens: 63, resolvidos: 48 },
    { name: "jun 24", triagens: 51, resolvidos: 39 },
    { name: "jul 24", triagens: 53, resolvidos: 41 },
    { name: "ago 24", triagens: 62, resolvidos: 47 },
  ],
};

const riskDistribution: Record<RiskView, Array<{ name: string; value: number; color: string }>> = {
  percent: [
    { name: "Baixo risco", value: 52, color: "#22C55E" },
    { name: "Médio risco", value: 36, color: "#FACC15" },
    { name: "Alto risco", value: 12, color: "#EF4444" },
  ],
  absolute: [
    { name: "Baixo risco", value: Math.round((TOTAL_TRIAGENS * 52) / 100), color: "#22C55E" },
    { name: "Médio risco", value: Math.round((TOTAL_TRIAGENS * 36) / 100), color: "#FACC15" },
    { name: "Alto risco", value: Math.round((TOTAL_TRIAGENS * 12) / 100), color: "#EF4444" },
  ],
};

const departmentRisk = [
  { department: "Produção", alertas: 21, indice: 8 },
  { department: "Manutenção", alertas: 16, indice: 6 },
  { department: "Logística", alertas: 12, indice: 4 },
  { department: "Administrativo", alertas: 8, indice: 2 },
];

const riskTimeline = [
  { semana: "Semana 1", concluido: 6, planejado: 10 },
  { semana: "Semana 2", concluido: 8, planejado: 10 },
  { semana: "Semana 3", concluido: 7, planejado: 10 },
  { semana: "Semana 4", concluido: 9, planejado: 10 },
];

const preventionPlan = [
  {
    id: "acao-epi",
    title: "Renovação de EPIs prioritários",
    owner: "Manutenção",
    status: "Em andamento",
    dueDate: "15 Ago",
    priority: "Alta",
  },
  {
    id: "acao-ergonomia",
    title: "Oficinas de ergonomia para administrativos",
    owner: "Administrativo",
    status: "Planejado",
    dueDate: "28 Ago",
    priority: "Média",
  },
  {
    id: "acao-mental",
    title: "Teleorientação focada em saúde mental",
    owner: "Produção",
    status: "Em andamento",
    dueDate: "22 Ago",
    priority: "Alta",
  },
];

const metrics = [
  {
    title: "Triagens realizadas",
    value: TOTAL_TRIAGENS.toString(),
    detail: "+12% vs. último ciclo",
    icon: Users,
    accent: "from-[#031B4E] via-[#0841A5] to-[#1270FF]",
    iconAccent: "from-[#8BF5FF] to-[#41DAFF]",
  },
  {
    title: "Casos de alto risco",
    value: Math.round((TOTAL_TRIAGENS * 12) / 100).toString(),
    detail: "Rastreamento imediato",
    icon: AlertTriangle,
    accent: "from-[#4A1137] via-[#AD2E5B] to-[#FF6B6B]",
    iconAccent: "from-[#FFD1DC] to-[#FF7DAE]",
  },
  {
    title: "Casos resolvidos",
    value: Math.round((TOTAL_TRIAGENS * 0.87)).toString(),
    detail: "Taxa de resolução 87%",
    icon: CheckCircle2,
    accent: "from-[#073F3A] via-[#0E7E6F] to-[#19BFA7]",
    iconAccent: "from-[#BFFFEF] to-[#6EF3CF]",
  },
];

const Relatorios: React.FC = () => {
  const [animate, setAnimate] = React.useState(false);
  const [range, setRange] = React.useState<MonthRange>("6m");
  const [riskView, setRiskView] = React.useState<RiskView>("percent");
  const [activeTab, setActiveTab] = React.useState("visao-geral");
  const [completedActions, setCompletedActions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleExport = React.useCallback(() => {
    toast.success("Relatório exportado com sucesso!");
  }, []);

  const handleCompleteAction = React.useCallback((id: string) => {
    setCompletedActions((prev) => (prev.includes(id) ? prev : [...prev, id]));
    toast.success("Ação marcada como concluída");
  }, []);

  const currentMonthlyData = React.useMemo(
    () => monthlyData[range],
    [range]
  );

  const riskData = React.useMemo(
    () => riskDistribution[riskView],
    [riskView]
  );

  return (
    <div className="space-y-8 pb-24">
      <section className={`${heroCardClass} text-slate-900`}>       
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-5">
            <span className={pillBadgeClass}>Analytics em tempo real</span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-[28px]">
                Relatórios inteligentes
              </h1>
              <p className="max-w-2xl text-sm text-slate-500">
                Visualize riscos por departamento, monitore tendências de triagens e priorize ações preventivas em minutos.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="rounded-2xl bg-[#001d46] px-6 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_-28px_rgba(0,35,85,0.8)] hover:bg-[#01295f]"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar relatório
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-2 border-[#001d46]/20 px-6 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#001d46] hover:border-[#001d46] hover:bg-[#001d46]/5"
              onClick={() => setActiveTab("analise-risco")}
            >
              <Activity className="mr-2 h-4 w-4" /> Ver análise de risco
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={sectionHeadingClass}>Resumo do ciclo</h2>
          <div className="flex gap-2">
            {["6m", "12m"].map((value) => (
              <Button
                key={value}
                variant={range === value ? "default" : "outline"}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                  range === value
                    ? "bg-[#001d46] text-white hover:bg-[#01295f]"
                    : "border border-[#001d46]/20 text-[#001d46] hover:border-[#001d46] hover:bg-[#001d46]/5"
                }`}
                onClick={() => setRange(value as MonthRange)}
              >
                {value === "6m" ? "Últimos 6 meses" : "Últimos 12 meses"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${metric.accent} p-5 text-white shadow-[0_26px_55px_-38px_rgba(8,44,120,0.85)] transition-all duration-700 ease-out`}
                style={{
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0px)" : "translateY(12px)",
                  transitionDelay: `${200 + index * 120}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                      {metric.title}
                    </p>
                    <div className="text-3xl font-semibold leading-none">
                      {metric.value}
                    </div>
                    <p className="text-xs text-white/75">{metric.detail}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.iconAccent} text-[#052753]`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6 space-y-6"
      >
        <TabsList className="flex w-full items-center justify-between rounded-[32px] bg-[#EAF3FF] px-2 py-2 shadow-inner sm:gap-2">
          <TabsTrigger value="visao-geral" className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-[#D2E5FF] bg-white/70 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4] transition data-[state=active]:border-transparent data-[state=active]:bg-white data-[state=active]:text-[#0E5CF7] data-[state=active]:shadow-[0_18px_32px_-26px_rgba(13,78,215,0.45)] sm:text-[0.8rem]">
            Visão geral
          </TabsTrigger>
          <TabsTrigger value="analise-risco" className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-[#D2E5FF] bg-white/70 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4] transition data-[state=active]:border-transparent data-[state=active]:bg-white data-[state=active]:text-[#0E5CF7] data-[state=active]:shadow-[0_18px_32px_-26px_rgba(13,78,215,0.45)] sm:text-[0.8rem]">
            Análise de risco
          </TabsTrigger>
          <TabsTrigger value="acoes-prevencao" className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-[#D2E5FF] bg-white/70 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4] transition data-[state=active]:border-transparent data-[state=active]:bg-white data-[state=active]:text-[#0E5CF7] data-[state=active]:shadow-[0_18px_32px_-26px_rgba(13,78,215,0.45)] sm:text-[0.8rem]">
            Ações de prevenção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-6 space-y-4">
          <Card className={glassCardClass}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Triagens por mês
                </CardTitle>
                <p className={subheadingMutedClass}>Evolução mensal</p>
              </div>
              <Badge variant="outline" className="border-[#0E5CF7]/20 text-[#0E5CF7]">
                {range === "6m" ? "Jan - Jun" : "Set - Ago"}
              </Badge>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentMonthlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="name" className="text-xs text-slate-500" />
                  <YAxis allowDecimals={false} className="text-xs text-slate-500" />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#E2E8F0" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="triagens"
                    stroke="#1160D8"
                    strokeWidth={2.6}
                    dot={{ r: 3 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolvidos"
                    stroke="#0BB5A4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className={glassCardClass}>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Distribuição de risco
                  </CardTitle>
                  <p className={subheadingMutedClass}>Casos anonimizados</p>
                </div>
                <div className="flex gap-2">
                  {["percent", "absolute"].map((mode) => (
                    <Button
                      key={mode}
                      variant={riskView === mode ? "default" : "outline"}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        riskView === mode
                          ? "bg-[#001d46] text-white hover:bg-[#01295f]"
                          : "border border-[#001d46]/20 text-[#001d46] hover:border-[#001d46] hover:bg-[#001d46]/5"
                      }`}
                      onClick={() => setRiskView(mode as RiskView)}
                    >
                      {mode === "percent" ? "%" : "#"}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={riskData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {riskData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={glassCardClass}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Índice por departamento
                </CardTitle>
                <p className={subheadingMutedClass}>
                  Ranking semanal de alertas críticos
                </p>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentRisk}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="alertas" fill="#2563EB" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="indice" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analise-risco" className="mt-6 space-y-4">
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className={sectionHeadingClass}>
                Linha do tempo de mitigação
              </CardTitle>
              <p className={subheadingMutedClass}>
                Conclusão das ações planejadas na última sprint
              </p>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTimeline}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="concluido"
                    stroke="#0EA5E9"
                    fill="url(#colorCompleted)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="planejado"
                    stroke="#6366F1"
                    fill="url(#colorPlanned)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={glassCardClass}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className={sectionHeadingClass}>
                  Ações priorizadas por setor
                </CardTitle>
                <p className={subheadingMutedClass}>
                  Status em tempo real das frentes críticas
                </p>
              </div>
              <Badge variant="secondary" className="bg-[#E6F5FF] text-[#1F5AA4]">
                Atualizado há 12 min
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {departmentRisk.map((item) => (
                <div
                  key={item.department}
                  className="flex items-center justify-between rounded-2xl border border-[#D2E5FF] bg-white/80 px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.department}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.alertas} alertas em acompanhamento
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#01295f] text-white">
                      Índice {item.indice}
                    </Badge>
                    <Badge variant="outline" className="border-[#0EA5E9] text-[#0EA5E9]">
                      {item.alertas > 18 ? "Crítico" : "Moderado"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acoes-prevencao" className="mt-6 space-y-4">
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className={sectionHeadingClass}>
                Plano de prevenção
              </CardTitle>
              <p className={subheadingMutedClass}>
                Priorize as iniciativas para reduzir risco ocupacional
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {preventionPlan.map((action) => {
                const completed = completedActions.includes(action.id);
                return (
                  <div
                    key={action.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[#D7E8FF] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <ShieldPlus className="h-4 w-4 text-[#0E5CF7]" />
                        {action.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        Responsável: <span className="font-medium">{action.owner}</span> • Prazo: {action.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          action.priority === "Alta"
                            ? "bg-[#FFE5EC] text-[#D92D6F]"
                            : "bg-[#FFF5D6] text-[#C97A00]"
                        }`}
                      >
                        Prioridade {action.priority}
                      </Badge>
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          completed
                            ? "bg-[#E4FAF0] text-[#0F8C5A]"
                            : "bg-[#E6F5FF] text-[#1C4CFF]"
                        }`}
                      >
                        {completed ? "Concluído" : action.status}
                      </Badge>
                      {!completed && (
                        <Button
                          size="sm"
                          className="rounded-full bg-[#001d46] px-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#01295f]"
                          onClick={() => handleCompleteAction(action.id)}
                        >
                          Marcar concluída
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className={glassCardClass}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className={sectionHeadingClass}>
                  Destaques do mês
                </CardTitle>
                <p className={subheadingMutedClass}>
                  Principais conquistas e próximos passos
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[#0E5CF7]" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#0E5CF7]" />
                  Redução de 23% nos incidentes com uso de EPIs em Produção.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#22C55E]" />
                  Conformidade NR1 alcançou 94% com auditorias semanais.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FACC15]" />
                  Teleorientações de saúde mental reduziram casos críticos em 18%.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
