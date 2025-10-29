import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  ShieldHalf,
  LogOut,
  Download,
  Activity,
  Calendar,
  ClipboardList as ClipboardListIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BACKOFFICE_AUTH_EVENT,
  BACKOFFICE_PROFILE_EVENT,
  BACKOFFICE_STORAGE_KEY,
  type BackofficeProfileAction,
} from '@/constants/backoffice';

type MetricKey = 'totalTriagens' | 'altoRisco' | 'medioRisco' | 'baixoRisco';
type Tone = 'positive' | 'negative' | 'neutral';
type ActionStatus = 'Em andamento' | 'Planejado' | 'Concluído';

const toneClasses: Record<Tone, string> = {
  positive: 'text-emerald-600',
  negative: 'text-red-500',
  neutral: 'text-slate-500 dark:text-slate-400',
};

const statusClasses: Record<ActionStatus, string> = {
  'Em andamento':
    'bg-clin-blue-100 text-clin-blue-700 dark:bg-clin-blue-500/20 dark:text-clin-blue-200',
  Planejado:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  Concluído:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
};

const metricsConfig: {
  title: string;
  key: MetricKey;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  delta: string;
  deltaTone: Tone;
}[] = [
  {
    title: 'Total de Triagens',
    key: 'totalTriagens',
    description: 'Últimos 30 dias',
    icon: Users,
    accent: 'bg-clin-blue-100/70 text-clin-blue-700',
    delta: '+12% vs mês anterior',
    deltaTone: 'positive',
  },
  {
    title: 'Casos de Alto Risco',
    key: 'altoRisco',
    description: 'Acompanhamento crítico',
    icon: AlertTriangle,
    accent: 'bg-red-100/80 text-red-600',
    delta: '+3 casos na semana',
    deltaTone: 'negative',
  },
  {
    title: 'Casos de Médio Risco',
    key: 'medioRisco',
    description: 'Monitoramento semanal',
    icon: AlertTriangle,
    accent: 'bg-yellow-100/80 text-yellow-600',
    delta: '-6% vs trimestre',
    deltaTone: 'positive',
  },
  {
    title: 'Casos de Baixo Risco',
    key: 'baixoRisco',
    description: 'Programa preventivo',
    icon: CheckCircle,
    accent: 'bg-emerald-100/80 text-emerald-600',
    delta: '+9 acompanhamentos',
    deltaTone: 'neutral',
  },
];

const insightHighlights: {
  label: string;
  value: string;
  tone: Tone;
  detail: string;
}[] = [
  {
    label: 'Absenteísmo médio',
    value: '-12%',
    tone: 'positive',
    detail: 'Redução pós programa ergonômico',
  },
  {
    label: 'Tempo médio de atendimento',
    value: '18 min',
    tone: 'neutral',
    detail: 'Objetivo <= 20 min',
  },
  {
    label: 'Reincidência GR4',
    value: '+4%',
    tone: 'negative',
    detail: 'Revisar protocolos setor produção',
  },
  {
    label: 'Satisfação colaboradores',
    value: '4.6 / 5',
    tone: 'positive',
    detail: 'Pesquisa de julho (n=184)',
  },
];

const actionPlan: {
  program: string;
  owner: string;
  status: ActionStatus;
  due: string;
  progress: number;
}[] = [
  {
    program: 'Programa Saúde Integral',
    owner: 'Guilherme Costa',
    status: 'Em andamento',
    due: '15 ago 24',
    progress: 68,
  },
  {
    program: 'Revisão NR-01 e NR-07',
    owner: 'Ana Moraes',
    status: 'Planejado',
    due: '22 ago 24',
    progress: 25,
  },
  {
    program: 'Campanha Vacinação 2ª fase',
    owner: 'Equipe Enfermagem',
    status: 'Concluído',
    due: '30 jul 24',
    progress: 100,
  },
  {
    program: 'Auditoria preventiva CIPA',
    owner: 'Ricardo Lima',
    status: 'Em andamento',
    due: '05 set 24',
    progress: 41,
  },
];

const upcomingAudits: {
  name: string;
  date: string;
  detail: string;
}[] = [
  {
    name: 'Revisão NR-15 / NR-17',
    date: '12 ago',
    detail: 'Checklist em aprovação com segurança operacional',
  },
  {
    name: 'CIPA • Reunião mensal',
    date: '14 ago',
    detail: 'Ata preliminar pendente de assinatura',
  },
];

const activityFeed: {
  title: string;
  timestamp: string;
  detail: string;
}[] = [
  {
    title: 'NR-7 Inspeção finalizada',
    timestamp: 'Hoje • 09:25',
    detail: 'Equipe técnica anexou laudos e enviou recomendação de follow-up.',
  },
  {
    title: 'Triagem Produção atualizada',
    timestamp: 'Ontem • 18:40',
    detail:
      'Nova priorização de 6 colaboradores para acompanhamento médico semanal.',
  },
  {
    title: 'Envio do Relatório mensal',
    timestamp: '07 ago • 16:12',
    detail: 'Checklist de conformidade encaminhado ao jurídico para ciência.',
  },
];

const complianceChecklist: {
  label: string;
  status: string;
  detail: string;
  variant: string;
}[] = [
  {
    label: 'NR-01 • Gerenciamento de riscos',
    status: 'Concluído',
    detail: 'Documentação atualizada em 06/08/24',
    variant: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  {
    label: 'PCMSO / ASO vigentes',
    status: 'Em andamento',
    detail: 'Renovações pendentes: 12 colaboradores',
    variant: 'bg-clin-blue-100 text-clin-blue-700 dark:bg-clin-blue-500/20 dark:text-clin-blue-200',
  },
  {
    label: 'NR-18 • Obras e estruturas',
    status: 'Revisão',
    detail: 'Checklist de campo agendado para 21/08/24',
    variant: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  },
];

const recentAlerts: {
  title: string;
  sector: string;
  level: 'Alto' | 'Médio' | 'Baixo';
  levelVariant: string;
  timestamp: string;
}[] = [
  {
    title: 'Sobrecarga repetitiva',
    sector: 'Produção',
    level: 'Alto',
    levelVariant: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300',
    timestamp: 'Há 12 minutos',
  },
  {
    title: 'Exposição química controlada',
    sector: 'Manutenção',
    level: 'Médio',
    levelVariant:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-200',
    timestamp: 'Há 36 minutos',
  },
  {
    title: 'Pausas regulares implementadas',
    sector: 'Administrativo',
    level: 'Baixo',
    levelVariant:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200',
    timestamp: 'Ontem • 15:10',
  },
];

type TriageMetrics = {
  totalTriagens: number;
  altoRisco: number;
  medioRisco: number;
  baixoRisco: number;
  triagensPorMes: { name: string; triagens: number }[];
};

const Backoffice: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [profileData, setProfileData] = React.useState({
    name: 'Ana Nogueira',
    email: 'ana.nogueira@empresa.com',
    phone: '(11) 98888-1122',
    role: 'Diretoria de Saúde Ocupacional',
    bio: 'Responsável pelo programa corporativo de saúde e segurança nas unidades do Sudeste.',
  });
  const [profileDraft, setProfileDraft] = React.useState(profileData);
  const [profileViewOpen, setProfileViewOpen] = React.useState(false);
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsState, setSettingsState] = React.useState({
    notifications: true,
    weeklyDigest: true,
    shareReports: false,
  });

  const [triageMetrics] = React.useState<TriageMetrics>({
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
    ],
  });

  const departmentRiskData = [
    { department: 'Produção', riskIndex: 8 },
    { department: 'Manutenção', riskIndex: 6 },
    { department: 'Logística', riskIndex: 4 },
    { department: 'Administrativo', riskIndex: 2 },
  ];

  const riskDistributionData = [
    { name: 'Baixo Risco', value: triageMetrics.baixoRisco, color: '#059669' },
    { name: 'Médio Risco', value: triageMetrics.medioRisco, color: '#FBBF24' },
    { name: 'Alto Risco', value: triageMetrics.altoRisco, color: '#DC2626' },
  ].filter((item) => item.value > 0);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const storedAuth = window.localStorage.getItem(BACKOFFICE_STORAGE_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  React.useEffect(() => {
    if (editProfileOpen) {
      setProfileDraft(profileData);
    }
  }, [editProfileOpen, profileData]);

  const persistAuth = React.useCallback((nextValue: boolean) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (nextValue) {
      window.localStorage.setItem(BACKOFFICE_STORAGE_KEY, 'true');
    } else {
      window.localStorage.removeItem(BACKOFFICE_STORAGE_KEY);
    }
  }, []);

  const handleLogout = React.useCallback(() => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    setProfileViewOpen(false);
    setEditProfileOpen(false);
    setSettingsOpen(false);
    persistAuth(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(BACKOFFICE_AUTH_EVENT, {
          detail: { authenticated: false },
        }),
      );
    }
  }, [persistAuth]);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (username.trim() === 'admin' && password === 'admin') {
        setIsAuthenticated(true);
        setErrorMessage('');
        persistAuth(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent(BACKOFFICE_AUTH_EVENT, {
              detail: { authenticated: true },
            }),
          );
        }
        return;
      }

      setErrorMessage('Credenciais inválidas. Utilize admin / admin.');
    },
    [password, persistAuth, username],
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const authListener = (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<{ authenticated: boolean } | undefined>;
      if (!event.detail) {
        return;
      }
      if (event.detail.authenticated) {
        setIsAuthenticated(true);
        return;
      }

      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      setErrorMessage('');
      setProfileViewOpen(false);
      setEditProfileOpen(false);
      setSettingsOpen(false);
      persistAuth(false);
    };

    const profileListener = (
      rawEvent: Event,
    ) => {
      const event = rawEvent as CustomEvent<{ action: BackofficeProfileAction } | undefined>;
      const action = event.detail?.action;
      if (!action) {
        return;
      }

      switch (action) {
        case 'view-profile':
          setProfileViewOpen(true);
          break;
        case 'edit-profile':
          setEditProfileOpen(true);
          break;
        case 'settings':
          setSettingsOpen(true);
          break;
        case 'sign-out':
          handleLogout();
          break;
        default:
          break;
      }
    };

    window.addEventListener(
      BACKOFFICE_AUTH_EVENT,
      authListener as EventListener,
    );
    window.addEventListener(
      BACKOFFICE_PROFILE_EVENT,
      profileListener as EventListener,
    );

    return () => {
      window.removeEventListener(
        BACKOFFICE_AUTH_EVENT,
        authListener as EventListener,
      );
      window.removeEventListener(
        BACKOFFICE_PROFILE_EVENT,
        profileListener as EventListener,
      );
    };
  }, [handleLogout, persistAuth]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center pb-16">
        <Card className="w-full max-w-sm border-clin-blue-100/70 shadow-lg shadow-clin-blue-100/60">
          <CardHeader className="space-y-1 text-center">
            <Badge
              variant="secondary"
              className="mx-auto w-fit bg-clin-blue-100/80 text-clin-blue-700"
            >
              Acesso Backoffice
            </Badge>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Dashboard Administrativo
            </CardTitle>
            <p className="text-sm text-gray-500">
              Informe as credenciais temporárias para continuar.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={username}
                  autoComplete="username"
                  placeholder="admin"
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  placeholder="admin"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {errorMessage && (
                <p className="text-sm font-medium text-red-500">{errorMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-clin-blue-600 text-white hover:bg-clin-blue-700"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-clin-blue-600 via-clin-blue-500 to-clin-blue-700 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_55%)]" />
        <div className="relative grid gap-10 p-8 lg:grid-cols-[1.7fr_1fr] lg:p-10">
          <div>
            <Badge className="bg-white/15 text-xs font-semibold uppercase tracking-wide text-white">
              Visão executiva
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">
              Backoffice de Relatórios
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/80 lg:text-base">
              Acompanhe indicadores críticos de saúde ocupacional, programe intervenções e
              monitore o cumprimento das obrigações legais em tempo real.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-white/75">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                <Activity className="h-4 w-4" />
                Última sincronização 09/08 • 09:20
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                <ShieldHalf className="h-4 w-4" />
                Dados demonstrativos para testes
              </span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button className="bg-white text-clin-blue-700 hover:bg-white/90">
                <Download className="mr-2 h-4 w-4" />
                Exportar relatórios
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setEditProfileOpen(true)}
              >
                Editar perfil
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setSettingsOpen(true)}
              >
                Configurações
              </Button>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <Calendar className="h-10 w-10 rounded-full bg-white/20 p-2 text-white" />
              <div>
                <p className="text-sm font-semibold">Agenda de auditorias</p>
                <p className="text-xs text-white/70">
                  Próximos compromissos críticos
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {upcomingAudits.map((audit) => (
                <div
                  key={audit.name}
                  className="flex items-start justify-between rounded-2xl bg-white/12 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {audit.name}
                    </p>
                    <p className="text-xs text-white/70">{audit.detail}</p>
                  </div>
                  <Badge className="rounded-full bg-white text-xs font-semibold text-clin-blue-700">
                    {audit.date}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricsConfig.map((metric) => {
          const Icon = metric.icon;
          const value = triageMetrics[metric.key];
          return (
            <Card
              key={metric.key}
              className="border border-slate-200/70 bg-white shadow-sm shadow-clin-blue-100/40 dark:border-gray-800 dark:bg-gray-900/85"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {metric.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {metric.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded-xl px-2 py-1 text-xs font-semibold',
                    metric.accent,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {value}
                </div>
                <p
                  className={cn(
                    'mt-3 text-xs font-medium',
                    toneClasses[metric.deltaTone],
                  )}
                >
                  {metric.delta}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Badge className="bg-clin-blue-100 text-clin-blue-700 dark:bg-clin-blue-500/20 dark:text-clin-blue-200">
                Evolução mensal
              </Badge>
              <CardTitle className="mt-3 text-xl font-semibold">
                Triagens realizadas
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tendência de volume nos últimos sete meses
              </p>
            </div>
            <BarChart3 className="h-10 w-10 text-clin-blue-600" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={triageMetrics.triagensPorMes}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="name"
                  className="text-xs text-slate-500 dark:text-slate-400"
                />
                <YAxis
                  allowDecimals={false}
                  className="text-xs text-slate-500 dark:text-slate-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="triagens"
                  stroke="#001d46"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                Insights chave
              </Badge>
              <CardTitle className="mt-3 text-xl font-semibold">
                Indicadores qualitativos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {insightHighlights.map((insight) => (
              <div
                key={insight.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-gray-700"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {insight.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {insight.detail}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-lg font-semibold',
                    toneClasses[insight.tone],
                  )}
                >
                  {insight.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Índice de risco por setor
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Comparativo semanal em escala de 0 a 10
            </p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRiskData} barSize={42}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="department"
                  className="text-xs text-slate-500 dark:text-slate-400"
                />
                <YAxis
                  allowDecimals={false}
                  className="text-xs text-slate-500 dark:text-slate-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="riskIndex"
                  radius={[10, 10, 0, 0]}
                  fill="#001d46"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                Distribuição de risco
              </Badge>
              <CardTitle className="mt-3 text-xl font-semibold">
                Casos por categoria
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Percentual de exposição por nível de atenção
              </p>
            </div>
            <ShieldHalf className="h-10 w-10 text-emerald-600" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Badge className="bg-clin-blue-100 text-clin-blue-700 dark:bg-clin-blue-500/20 dark:text-clin-blue-200">
                Planos de ação
              </Badge>
              <CardTitle className="mt-3 text-xl font-semibold">
                Programas em andamento
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Status consolidado das iniciativas prioritárias
              </p>
            </div>
            <ClipboardListIcon className="h-10 w-10 text-clin-blue-600" />
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead className="text-right">Progresso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionPlan.map((plan) => (
                  <TableRow key={plan.program}>
                    <TableCell className="font-medium text-slate-700 dark:text-slate-200">
                      {plan.program}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      {plan.owner}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusClasses[plan.status]}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      {plan.due}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {plan.progress}%
                        </span>
                        <Progress
                          value={plan.progress}
                          className="h-2.5 w-32 overflow-hidden bg-slate-200 dark:bg-slate-800"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Últimos alertas automatizados
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Eventos gerados pela inteligência preventiva
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.title}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {alert.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Setor: {alert.sector}
                      </p>
                    </div>
                    <Badge className={alert.levelVariant}>{alert.level}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    {alert.timestamp}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Checklist de conformidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceChecklist.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.label}
                    </p>
                    <Badge className={item.variant}>{item.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/85">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Registro de atividades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.title}>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {activity.timestamp}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {activity.detail}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Backoffice;
