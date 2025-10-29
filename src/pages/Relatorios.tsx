import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
const Relatorios: React.FC = () => {
  const [triageMetrics, setTriageMetrics] = React.useState({
    totalTriagens: 382,
    altoRisco: 48,
    medioRisco: 136,
    baixoRisco: 198,
    triagensPorMes: [
      { name: 'jan 24', triagens: 42 },
      { name: 'fev 24', triagens: 55 },
      { name: 'mar 24', triagens: 60 },
      { name: 'abr 24', triagens: 58 },
      { name: 'mai 24', triagens: 63 },
      { name: 'jun 24', triagens: 51 },
      { name: 'jul 24', triagens: 53 },
    ] as { name: string; triagens: number }[],
  });
  const [isLoading] = React.useState(false);

  const metrics = [
    { title: "Total de Triagens", value: isLoading ? "..." : triageMetrics.totalTriagens.toString(), icon: Users, description: "Total geral", iconColor: "text-teal-600", bgColor: "bg-teal-100/70" },
    { title: "Casos de Alto Risco", value: isLoading ? "..." : triageMetrics.altoRisco.toString(), icon: AlertTriangle, description: "Requer atenção", iconColor: "text-red-500", bgColor: "bg-red-100/70" },
    { title: "Casos de Médio Risco", value: isLoading ? "..." : triageMetrics.medioRisco.toString(), icon: AlertTriangle, description: "Monitoramento", iconColor: "text-yellow-500", bgColor: "bg-yellow-100/70" },
    { title: "Casos de Baixo Risco", value: isLoading ? "..." : triageMetrics.baixoRisco.toString(), icon: CheckCircle, description: "Sem risco imediato", iconColor: "text-green-500", bgColor: "bg-green-100/70" },
  ];

  const riskDistributionData = [
    { name: 'Baixo Risco', value: triageMetrics.baixoRisco, color: '#22C55E' }, // Green
    { name: 'Médio Risco', value: triageMetrics.medioRisco, color: '#FACC15' }, // Yellow
    { name: 'Alto Risco', value: triageMetrics.altoRisco, color: '#EF4444' }, // Red
  ];

  // Filter out categories with 0 value for the pie chart to avoid empty slices
  const filteredRiskDistributionData = riskDistributionData.filter(item => item.value > 0);

  const departmentRiskData = [
    { department: 'Produção', riskIndex: 8 },
    { department: 'Manutenção', riskIndex: 6 },
    { department: 'Logística', riskIndex: 4 },
    { department: 'Administrativo', riskIndex: 2 },
  ];

  const riskFactors = [
    { label: 'Exposição Química', value: '35%', badgeClass: 'bg-red-100 text-red-600' },
    { label: 'Ergonomia', value: '28%', badgeClass: 'bg-yellow-100 text-yellow-600' },
    { label: 'Acidentes', value: '22%', badgeClass: 'bg-clin-blue-100 text-clin-blue-600' },
  ];

  const alertSectors = [
    { name: 'Produção', color: 'text-red-500' },
    { name: 'Manutenção', color: 'text-yellow-500' },
  ];

  const recommendations = [
    'Reforçar treinamento em EPIs',
    'Avaliar ventilação em Produção',
    'Implementar pausas ergonômicas',
  ];

  const preventionActions = [
    { title: 'Treinamento de Segurança', department: 'Produção', priority: 'Alta', priorityClass: 'bg-red-100 text-red-600', status: 'Em Andamento', statusVariant: 'bg-clin-blue-100 text-clin-blue-600' },
    { title: 'Ergonomia no Trabalho', department: 'Administrativo', priority: 'Média', priorityClass: 'bg-yellow-100 text-yellow-600', status: 'Planejado', statusVariant: 'bg-gray-100 text-gray-500' },
    { title: 'EPI - Renovação', department: 'Manutenção', priority: 'Alta', priorityClass: 'bg-red-100 text-red-600', status: 'Concluído', statusVariant: 'bg-clin-blue-200 text-clin-blue-700' },
    { title: 'Avaliação Ambiental', department: 'Logística', priority: 'Média', priorityClass: 'bg-yellow-100 text-yellow-600', status: 'Em Andamento', statusVariant: 'bg-clin-blue-100 text-clin-blue-600' },
  ];

  const recommendedActions = [
    { title: 'Campanha de Vacinação', description: 'Recomendado para todos os setores' },
    { title: 'Workshop de Saúde Mental', description: 'Foco em departamentos administrativos' },
    { title: 'Auditoria de Segurança', description: 'Prioridade: Produção e Manutenção' },
  ];

  const actionImpact = [
    { label: 'Redução de Incidentes', value: '-23%', valueClass: 'text-clin-blue-600' },
    { label: 'Conformidade NR1', value: '94%', valueClass: 'text-clin-blue-600' },
    { label: 'Satisfação dos Colaboradores', value: '4.6/5', valueClass: 'text-clin-blue-600' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-3xl bg-gradient-to-br from-clin-blue-500 via-clin-blue-400 to-clin-blue-600 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="md:max-w-xl text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Insights em tempo real</span>
            <h1 className="mt-2 text-3xl font-semibold leading-tight">Relatórios e Analytics</h1>
            <p className="mt-3 text-sm text-clin-blue-50/90">Visualize riscos por departamento, monitore tendências e direcione ações preventivas com rapidez.</p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-8 w-8 ${metric.iconColor || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="visao-geral" className="w-full mt-6 space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-clin-blue-100/70 p-1 shadow-inner dark:bg-clin-blue-500/10">
          <TabsTrigger value="visao-geral" className="rounded-full text-xs font-semibold uppercase tracking-wide text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300">Visão Geral</TabsTrigger>
          <TabsTrigger value="analise-risco" className="rounded-full text-xs font-semibold uppercase tracking-wide text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300">Análise</TabsTrigger>
          <TabsTrigger value="acoes-prevencao" className="rounded-full text-xs font-semibold uppercase tracking-wide text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-6 space-y-4">
          <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Triagens por Mês</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Evolução mensal</p>
            </CardHeader>
            <CardContent className="h-72">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">Carregando dados...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={triageMetrics.triagensPorMes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" className="text-sm text-gray-600 dark:text-gray-400" />
                    <YAxis allowDecimals={false} className="text-sm text-gray-600 dark:text-gray-400" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                    <Legend />
                    <Line type="monotone" dataKey="triagens" stroke="#001d46" activeDot={{ r: 8 }} name="Triagens" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="pt-1">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Distribuição de Risco</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Casos anonimizados por categoria</p>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center p-4"> {/* Adicionado p-4 aqui */}
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">Carregando dados...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredRiskDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80} // Reduzido para melhor responsividade
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {filteredRiskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analise-risco" className="mt-6 space-y-6">
          <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Risco por Departamento</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Índice de risco médio por setor (anonimizado)</p>
            </CardHeader>
            <CardContent className="pt-6 h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentRiskData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="department" tick={{ fill: 'currentColor' }} className="text-sm text-gray-600 dark:text-gray-400" />
                  <YAxis allowDecimals={false} domain={[0, 8]} tick={{ fill: 'currentColor' }} className="text-sm text-gray-600 dark:text-gray-400" />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 29, 70, 0.08)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }}
                    formatter={(value: number) => [`${value}`, 'Índice de risco']}
                  />
                  <Bar dataKey="riskIndex" fill="#001d46" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/30 dark:bg-gray-900/85 dark:shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Fatores de Risco Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskFactors.map((factor) => (
                  <div key={factor.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{factor.label}</span>
                    <Badge className={`${factor.badgeClass} font-semibold`}>{factor.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/30 dark:bg-gray-900/85 dark:shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Setores em Alerta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertSectors.map((sector) => (
                  <div key={sector.name} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <AlertTriangle className={`h-4 w-4 ${sector.color}`} />
                    <span>{sector.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/30 dark:bg-gray-900/85 dark:shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acoes-prevencao" className="mt-6 space-y-6">
          <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Ações de Prevenção em Andamento</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Iniciativas baseadas nos dados de risco corporativo</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {preventionActions.map((action) => (
                <div
                  key={action.title}
                  className="flex items-center gap-3 rounded-2xl border border-clin-blue-100/70 bg-white/90 px-5 py-4 shadow-sm dark:border-clin-blue-500/20 dark:bg-gray-900/60"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.department}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <Badge className={`px-3 py-1 rounded-full font-semibold shadow-sm ${action.priorityClass}`}>{action.priority}</Badge>
                    <Badge className={`px-3 py-1 rounded-full font-semibold shadow-sm ${action.statusVariant}`}>{action.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/30 dark:bg-gray-900/85 dark:shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">Próximas Ações Recomendadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedActions.map((action) => (
                  <div key={action.title} className="rounded-xl bg-clin-blue-50 dark:bg-clin-blue-900/20 px-5 py-4">
                    <h4 className="text-sm font-semibold text-clin-blue-900 dark:text-clin-blue-200">{action.title}</h4>
                    <p className="text-xs text-clin-blue-700 dark:text-clin-blue-300/80">{action.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-white/95 shadow-lg shadow-clin-blue-100/30 dark:bg-gray-900/85 dark:shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">Impacto das Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actionImpact.map((impact) => (
                  <div key={impact.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{impact.label}</span>
                    <span className={`text-sm font-semibold ${impact.valueClass}`}>{impact.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
