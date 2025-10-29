import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PersonalInfoForm, { PersonalInfoData } from '@/components/PersonalInfoForm'; // Importar o novo componente
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  category: 'mental' | 'oral';
  scores?: Record<string, number>; // Optional scores for each option
}

const psychosocialQuestions: Question[] = [
  {
    id: 'q1',
    text: "Com que frequência você se sente esgotado ou sem energia ao final do dia?",
    options: ["Sempre", "Frequentemente", "Raramente", "Nunca"],
    category: 'mental',
    scores: { "Sempre": 3, "Frequentemente": 2, "Raramente": 1, "Nunca": 0 },
  },
  {
    id: 'q2',
    text: "Com que frequência você tem dificuldade para dormir ou acorda cansado?",
    options: ["Sempre", "Frequentemente", "Raramente", "Nunca"],
    category: 'mental',
    scores: { "Sempre": 3, "Frequentemente": 2, "Raramente": 1, "Nunca": 0 },
  },
  {
    id: 'q3',
    text: "Você sente que tem controle sobre a forma como realiza seu trabalho?",
    options: ["Sempre", "Frequentemente", "Raramente", "Nunca"],
    category: 'mental',
    scores: { "Sempre": 0, "Frequentemente": 1, "Raramente": 2, "Nunca": 3 }, // Inverted score for positive control
  },
  {
    id: 'q4',
    text: "Você acorda com dor na mandíbula ou nos músculos da face?",
    options: ["Sim", "Não"],
    category: 'oral',
    scores: { "Sim": 3, "Não": 0 },
  },
  {
    id: 'q5',
    text: "Você tem notado que range ou aperta os dentes durante o dia?",
    options: ["Sim", "Não"],
    category: 'oral',
    scores: { "Sim": 3, "Não": 0 },
  },
  {
    id: 'q6',
    text: "Você tem tido dores de cabeça frequentes que parecem vir da região da têmpora?",
    options: ["Sim", "Não"],
    category: 'oral',
    scores: { "Sim": 3, "Não": 0 },
  },
];

type OccupationalAnswer = 'sim' | 'nao';

interface OccupationalQuestion {
  id: string;
  text: string;
  weight: number;
}

type OccupationalRiskLevel = 'Risco Alto' | 'Risco Moderado' | 'Risco Baixo';
type OccupationalRiskTone = 'danger' | 'warning' | 'success';

interface OccupationalResultState {
  score: number;
  level: OccupationalRiskLevel;
  priority: string;
  tone: OccupationalRiskTone;
  nextSteps: string[];
}

const occupationalQuestions: OccupationalQuestion[] = [
  {
    id: 'febre',
    text: 'Apresenta febre (temperatura acima de 37.8°C)?',
    weight: 3,
  },
  {
    id: 'respiracao',
    text: 'Tem dificuldade para respirar ou falta de ar?',
    weight: 3,
  },
  {
    id: 'peito',
    text: 'Sente dor no peito persistente?',
    weight: 3,
  },
  {
    id: 'tosse',
    text: 'Apresenta tosse intensa ou persistente?',
    weight: 2,
  },
  {
    id: 'exposicao',
    text: 'Tem histórico de exposição a agentes químicos ou biológicos?',
    weight: 2,
  },
  {
    id: 'acidente',
    text: 'Sofreu algum acidente ou lesão no trabalho recentemente?',
    weight: 2,
  },
];

const occupationalRiskScale = [
  {
    minScore: 12,
    level: 'Risco Alto' as const,
    priority: 'Urgente',
    tone: 'danger' as const,
    nextSteps: [
      'Agendar teleorientação imediata',
      'Notificar equipe médica',
      'Preparar documentação de emergência',
    ],
  },
  {
    minScore: 6,
    level: 'Risco Moderado' as const,
    priority: 'Prioritário',
    tone: 'warning' as const,
    nextSteps: [
      'Agendar avaliação presencial em até 48h',
      'Monitorar sinais diariamente',
      'Reforçar medidas preventivas no posto de trabalho',
    ],
  },
  {
    minScore: 0,
    level: 'Risco Baixo' as const,
    priority: 'Rotina',
    tone: 'success' as const,
    nextSteps: [
      'Manter hábitos saudáveis e pausas ativas',
      'Registrar eventuais mudanças de sintomas',
      'Agendar check-up ocupacional anual',
    ],
  },
] as const;

const occupationalToneStyles: Record<
  OccupationalRiskTone,
  {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconBg: string;
    iconColor: string;
    badgeClass: string;
    priorityBadge: string;
    scoreColor: string;
    calloutBg: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badgeClass: 'bg-red-500 text-white',
    priorityBadge: 'bg-red-100 text-red-600',
    scoreColor: 'text-red-600',
    calloutBg: 'bg-red-50',
  },
  warning: {
    icon: AlertCircle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeClass: 'bg-amber-500 text-white',
    priorityBadge: 'bg-amber-100 text-amber-700',
    scoreColor: 'text-amber-600',
    calloutBg: 'bg-amber-50',
  },
  success: {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badgeClass: 'bg-emerald-500 text-white',
    priorityBadge: 'bg-emerald-100 text-emerald-700',
    scoreColor: 'text-emerald-600',
    calloutBg: 'bg-emerald-50',
  },
};

const Triagem: React.FC = () => {
  const [showPersonalInfoForm, setShowPersonalInfoForm] = React.useState(true);
  const [personalInfo, setPersonalInfo] = React.useState<PersonalInfoData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [triageResult, setTriageResult] = React.useState<{ score: number; level: string; suggestion: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'ocupacional' | 'psicossocial'>('psicossocial');
  const [occupationalQuestionIndex, setOccupationalQuestionIndex] = React.useState(0);
  const [occupationalAnswers, setOccupationalAnswers] = React.useState<Record<string, OccupationalAnswer>>({});
  const [occupationalResult, setOccupationalResult] = React.useState<OccupationalResultState | null>(null);
  const [isOccupationalSubmitting, setIsOccupationalSubmitting] = React.useState(false);

  const handlePersonalInfoSubmit = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setShowPersonalInfoForm(false);
    toast.success("Informações salvas! Inicie a triagem.");
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleOccupationalAnswerChange = (questionId: string, value: OccupationalAnswer) => {
    setOccupationalAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateOccupationalScore = (responses: Record<string, OccupationalAnswer>) => {
    return occupationalQuestions.reduce((total, question) => {
      const answer = responses[question.id];
      if (answer === 'sim') {
        return total + question.weight;
      }
      return total;
    }, 0);
  };

  const evaluateOccupationalRisk = (score: number): OccupationalResultState => {
    const matchedScale =
      occupationalRiskScale.find((scale) => score >= scale.minScore) ??
      occupationalRiskScale[occupationalRiskScale.length - 1];

    return {
      score,
      level: matchedScale.level,
      priority: matchedScale.priority,
      tone: matchedScale.tone,
      nextSteps: matchedScale.nextSteps,
    };
  };

  const calculateRiskScore = (userAnswers: Record<string, string>) => {
    let totalScore = 0;
    for (const question of psychosocialQuestions) {
      const answer = userAnswers[question.id];
      if (answer && question.scores) {
        totalScore += question.scores[answer] || 0;
      }
    }
    return totalScore;
  };

  interface PdfSection {
    heading: string;
    items: string[];
  }

  const escapePdfText = (value: string) => value.replace(/([()\\])/g, '\\$1');

  const buildPlaceholderPdfBlob = (title: string, sections: PdfSection[]) => {
    const encoder = new TextEncoder();
    const lines: string[] = [
      title,
      'Documento demonstrativo gerado para apresentação.',
      '',
    ];

    sections.forEach((section) => {
      lines.push(section.heading);
      section.items.forEach((item) => lines.push(`- ${item}`));
      lines.push('');
    });

    const textLines = lines.filter((line, index, array) => {
      if (!line && index === array.length - 1) {
        return false;
      }
      return true;
    });

    const buildContentStream = () => {
      const header = 'BT\n/F1 16 Tf\n72 770 Td\n';
      const body = textLines
        .map((line, index) => {
          const escaped = escapePdfText(line);
          if (index === 0) {
            return `(${escaped}) Tj\n`;
          }
          return `0 -24 Td\n(${escaped}) Tj\n`;
        })
        .join('');
      return `${header}${body}ET`;
    };

    const streamContent = buildContentStream();
    const streamLength = encoder.encode(streamContent).length;

    const parts: string[] = ['%PDF-1.4\n'];
    const offsets: number[] = [0];
    let currentLength = encoder.encode(parts[0]).length;

    const addObject = (content: string) => {
      offsets.push(currentLength);
      parts.push(content);
      currentLength += encoder.encode(content).length;
    };

    addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    addObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    addObject(
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    );
    addObject(
      `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    );
    addObject(
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    );

    const xrefOffset = currentLength;
    let xrefTable = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
    for (let index = 1; index < offsets.length; index++) {
      xrefTable += `${offsets[index].toString().padStart(10, '0')} 00000 n \n`;
    }

    parts.push(xrefTable);
    const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    parts.push(trailer);

    const pdfContent = parts.join('');
    return new Blob([pdfContent], { type: 'application/pdf' });
  };

  const downloadPlaceholderPdf = (
    filename: string,
    title: string,
    sections: PdfSection[],
  ) => {
    const blob = buildPlaceholderPdfBlob(title, sections);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadOccupationalPdf = () => {
    if (!occupationalResult) {
      return;
    }

    const collaboratorLines = personalInfo
      ? [
          `Nome: ${personalInfo.name || 'Não informado'}`,
          `Função: ${personalInfo.functionRole || 'Não informado'}`,
          `Setor: ${personalInfo.sector || 'Não informado'}`,
          `Idade: ${personalInfo.age || 'Não informada'}`,
          `Telefone: ${personalInfo.phone || 'Não informado'}`,
          `E-mail: ${personalInfo.email || 'Não informado'}`,
        ]
      : ['Dados pessoais não informados nesta sessão.'];

    const summaryLines = [
      `Pontuação total: ${occupationalResult.score}`,
      `Nível de risco: ${occupationalResult.level}`,
      `Prioridade: ${occupationalResult.priority}`,
    ];

    const responseLines = occupationalQuestions.map((question, index) => {
      const answer = occupationalAnswers[question.id];
      const label = answer === 'sim' ? 'Sim' : answer === 'nao' ? 'Não' : 'Sem resposta';
      return `Q${index + 1}: ${question.text} — Resposta: ${label}`;
    });

    downloadPlaceholderPdf(
      'triagem-ocupacional-demo.pdf',
      'Relatório demonstrativo: Triagem Ocupacional',
      [
        { heading: 'Informações do colaborador', items: collaboratorLines },
        { heading: 'Resumo do resultado', items: summaryLines },
        {
          heading: 'Próximos passos sugeridos',
          items: occupationalResult.nextSteps,
        },
        { heading: 'Respostas registradas', items: responseLines },
      ],
    );
  };

  const handleDownloadPsychosocialPdf = () => {
    if (!triageResult) {
      return;
    }

    const collaboratorLines = [
      `Nome: ${personalInfo?.name || 'Não informado'}`,
      `Função: ${personalInfo?.functionRole || 'Não informado'}`,
      `Setor: ${personalInfo?.sector || 'Não informado'}`,
      `Idade: ${personalInfo?.age || 'Não informada'}`,
      `Telefone: ${personalInfo?.phone || 'Não informado'}`,
      `E-mail: ${personalInfo?.email || 'Não informado'}`,
    ];

    const summaryLines = [
      `Pontuação total: ${triageResult.score}`,
      `Nível de risco: ${triageResult.level}`,
      `Sugestão de acompanhamento: ${triageResult.suggestion}`,
    ];

    const responseLines = psychosocialQuestions.map((question, index) => {
      const answer = answers[question.id] || 'Sem resposta';
      return `Q${index + 1}: ${question.text} — Resposta: ${answer}`;
    });

    downloadPlaceholderPdf(
      'triagem-psicossocial-demo.pdf',
      'Relatório demonstrativo: Triagem Psicossocial',
      [
        { heading: 'Informações do colaborador', items: collaboratorLines },
        { heading: 'Resumo do resultado', items: summaryLines },
        { heading: 'Respostas registradas', items: responseLines },
      ],
    );
  };

  const getRiskLevelAndSuggestion = (score: number) => {
    if (score >= 10) {
      return { level: "Alto Risco", suggestion: "Agendamento prioritário com especialista em saúde mental e/ou oral." };
    } else if (score >= 5) {
      return { level: "Médio Risco", suggestion: "Recomendada teleorientação com profissional de saúde." };
    } else {
      return { level: "Baixo Risco", suggestion: "Monitoramento regular e dicas de bem-estar." };
    }
  };

  const handleOccupationalNext = () => {
    if (occupationalResult) {
      return;
    }

    const currentQuestion = occupationalQuestions[occupationalQuestionIndex];
    if (!currentQuestion) {
      return;
    }

    const currentAnswer = occupationalAnswers[currentQuestion.id];
    if (!currentAnswer) {
      toast.error("Por favor, selecione uma opção antes de continuar.");
      return;
    }

    if (occupationalQuestionIndex < occupationalQuestions.length - 1) {
      setOccupationalQuestionIndex((prev) => prev + 1);
      return;
    }

    setIsOccupationalSubmitting(true);
    try {
      const score = calculateOccupationalScore(occupationalAnswers);
      const result = evaluateOccupationalRisk(score);
      setOccupationalResult(result);
    } finally {
      setIsOccupationalSubmitting(false);
    }
  };

  const handleOccupationalPrevious = () => {
    if (occupationalResult || occupationalQuestionIndex === 0) {
      return;
    }
    setOccupationalQuestionIndex((prev) => prev - 1);
  };

  const resetOccupationalFlow = () => {
    setOccupationalQuestionIndex(0);
    setOccupationalAnswers({});
    setOccupationalResult(null);
    setIsOccupationalSubmitting(false);
    setActiveTab('ocupacional');
  };

  const handleNext = async () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Por favor, selecione uma opção antes de continuar.");
      return;
    }

    if (currentQuestionIndex < psychosocialQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Questionnaire completed, calculate risk and save to Supabase
      setIsLoading(true);
      const score = calculateRiskScore(answers);
      const { level, suggestion } = getRiskLevelAndSuggestion(score);
      setTriageResult({ score, level, suggestion });

      try {
        // Only attempt to save to Supabase if it's initialized
        if (supabase) {
          try {
            // Get user ID if logged in, otherwise it will be null
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || null;

            const { error } = await supabase
              .from('triagens')
              .insert({
                user_id: userId, // Will be null if not logged in
                answers: answers,
                risk_score: score,
                risk_level: level,
                name: personalInfo?.name,
                phone: personalInfo?.phone,
                email: personalInfo?.email,
                function_role: personalInfo?.functionRole,
                age: personalInfo?.age ? Number(personalInfo.age) : null,
                sector: personalInfo?.sector,
              });

            if (error) {
              console.error("Erro ao salvar triagem:", error);
              toast.error("Erro ao salvar triagem: " + error.message);
            } else {
              toast.success("Triagem concluída e salva com sucesso!");
            }
          } catch (error) {
            console.error("Erro inesperado ao salvar triagem:", error);
            toast.error("Erro inesperado ao salvar triagem.");
          }
        } else {
          toast.success("Triagem concluída! Funcionalidades de armazenamento não disponíveis no momento.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // If on the first question, go back to personal info form
      setShowPersonalInfoForm(true);
      setPersonalInfo(null); // Clear personal info if going back
    }
  };

  const currentQuestion = psychosocialQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / psychosocialQuestions.length) * 100;
  const currentOccupationalQuestion = occupationalQuestions[occupationalQuestionIndex];
  const occupationalProgress = occupationalResult
    ? 100
    : ((occupationalQuestionIndex + 1) / occupationalQuestions.length) * 100;
  const occupationalTone = occupationalResult
    ? occupationalToneStyles[occupationalResult.tone]
    : null;
  const OccupationalResultIcon = occupationalTone ? occupationalTone.icon : null;

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-3xl bg-gradient-to-br from-clin-blue-500 via-clin-blue-400 to-clin-blue-600 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Fluxo guiado</span>
          <h1 className="text-3xl font-semibold leading-tight">Triagem Inteligente</h1>
            <p className="text-sm text-clin-blue-50/90">
              Identifique riscos rapidamente com questionários adaptativos e acompanhe o colaborador em tempo real.
            </p>
        </div>
      </section>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'ocupacional' | 'psicossocial')}
        className="w-full space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-full bg-clin-blue-100/70 p-1 shadow-inner dark:bg-clin-blue-500/10">
          <TabsTrigger
            value="ocupacional"
            className="rounded-full text-sm font-medium text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300"
          >
            Triagem Ocupacional
          </TabsTrigger>
          <TabsTrigger
            value="psicossocial"
            className="rounded-full text-sm font-medium text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300"
          >
            Triagem Psicossocial
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ocupacional" className="mt-6">
          <Card className="mx-auto max-w-2xl border-none bg-white/95 shadow-xl shadow-clin-blue-100/40 dark:bg-gray-900/80 dark:shadow-none">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl font-semibold">Questionário de Rastreio Rápido (Q-RR)</CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {occupationalResult
                    ? 'Triagem concluída!'
                    : `Questão ${occupationalQuestionIndex + 1} de ${occupationalQuestions.length}`}
                </p>
                {!occupationalResult && (
                  <Progress value={occupationalProgress} className="h-2 bg-slate-200/80" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!occupationalResult && currentOccupationalQuestion ? (
                <>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                    {currentOccupationalQuestion.text}
                  </h3>
                  <RadioGroup
                    value={occupationalAnswers[currentOccupationalQuestion.id] || ''}
                    onValueChange={(value) =>
                      handleOccupationalAnswerChange(currentOccupationalQuestion.id, value as OccupationalAnswer)
                    }
                    className="space-y-4"
                  >
                    {(['sim', 'nao'] as OccupationalAnswer[]).map((option) => {
                      const isChecked = occupationalAnswers[currentOccupationalQuestion.id] === option;
                      return (
                        <div
                          key={option}
                          className={`flex items-center space-x-3 rounded-2xl border border-emerald-100/70 p-3 transition hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-gray-800 ${
                            isChecked ? 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-500/10' : ''
                          }`}
                        >
                          <RadioGroupItem value={option} id={`${currentOccupationalQuestion.id}-${option}`} />
                          <Label htmlFor={`${currentOccupationalQuestion.id}-${option}`} className="flex-grow cursor-pointer">
                            {option === 'sim' ? 'Sim' : 'Não'}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      onClick={handleOccupationalPrevious}
                      disabled={occupationalQuestionIndex === 0 || isOccupationalSubmitting}
                    >
                      Anterior
                    </Button>
                    <Button
                      className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500"
                      onClick={handleOccupationalNext}
                      disabled={
                        !occupationalAnswers[currentOccupationalQuestion.id] || isOccupationalSubmitting
                      }
                    >
                      {occupationalQuestionIndex === occupationalQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                    </Button>
                  </div>
                </>
              ) : occupationalResult && occupationalTone && OccupationalResultIcon ? (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/60">
                    <span className="text-sm font-medium text-muted-foreground">Pontuação de Risco Calculada</span>
                    <div className={`mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full ${occupationalTone.iconBg}`}>
                      <OccupationalResultIcon className={`h-8 w-8 ${occupationalTone.iconColor}`} />
                    </div>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Pontuação Total</p>
                      <p className={`text-5xl font-bold ${occupationalTone.scoreColor}`}>{occupationalResult.score}</p>
                    </div>
                    <Badge className={`${occupationalTone.badgeClass} mt-4 rounded-full px-4 py-1 text-sm font-semibold`}>
                      {occupationalResult.level}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/70">
                      <span className="text-sm font-medium text-muted-foreground">Nível de Prioridade:</span>
                      <Badge className={`${occupationalTone.priorityBadge} rounded-full px-3 py-1 text-xs font-semibold`}>
                        {occupationalResult.priority}
                      </Badge>
                    </div>
                    <div className={`rounded-2xl px-5 py-4 ${occupationalTone.calloutBg}`}>
                      <h4 className="text-sm font-semibold text-slate-700">Próximos Passos:</h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {occupationalResult.nextSteps.map((step) => (
                          <li key={step} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-500" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                    <Button
                      variant="secondary"
                      className="rounded-full px-6"
                      onClick={handleDownloadOccupationalPdf}
                    >
                      Baixar PDF
                    </Button>
                    <Button variant="outline" className="rounded-full px-6" onClick={resetOccupationalFlow}>
                      Nova Triagem
                    </Button>
                    <Button
                      className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500"
                      onClick={() =>
                        toast.success("Consulta solicitada! Nossa equipe retornará em breve.")
                      }
                    >
                      Agendar Consulta
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="psicossocial" className="mt-6">
          {showPersonalInfoForm ? (
            <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
          ) : (
            <Card className="mx-auto max-w-2xl border-none bg-white/95 shadow-xl shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Triagem Rápida Psicossocial de Risco</CardTitle>
                {!triageResult ? (
                  <p className="text-sm text-muted-foreground">Questão {currentQuestionIndex + 1} de {psychosocialQuestions.length}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Triagem Concluída!</p>
                )}
                <Progress value={progress} className="w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                {!triageResult ? (
                  <>
                    <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                      className="space-y-4"
                    >
                      {currentQuestion.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2 rounded-2xl border border-clin-blue-100/70 p-3 hover:bg-clin-blue-50 dark:border-clin-blue-500/20 dark:hover:bg-gray-800">
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="flex-grow cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevious} disabled={isLoading}>
                        Anterior
                      </Button>
                      <Button className="rounded-full bg-clin-blue-600 px-6 text-white hover:bg-clin-blue-500" onClick={handleNext} disabled={isLoading}>
                        {currentQuestionIndex === psychosocialQuestions.length - 1 ? "Finalizar" : "Próxima"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-semibold">Resultado da Triagem</h3>
                      <p className="text-5xl font-bold text-clin-blue-600">{triageResult.score}</p>
                      <p className="text-lg">
                        Nível de Risco:{' '}
                        <span
                          className={`font-bold ${
                            triageResult.level === 'Alto Risco'
                              ? 'text-red-500'
                              : triageResult.level === 'Médio Risco'
                                ? 'text-yellow-500'
                                : 'text-emerald-500'
                          }`}
                        >
                          {triageResult.level}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sugestão: <span className="font-medium text-slate-700 dark:text-slate-200">{triageResult.suggestion}</span>
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left dark:border-gray-800 dark:bg-gray-900/70">
                      <h4 className="text-sm font-semibold text-slate-700">Resumo das Respostas</h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {psychosocialQuestions.map((question) => (
                          <li key={question.id} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                            <span>
                              <span className="font-medium">{question.text}</span>
                              <br />
                              <span className="text-slate-500">
                                Resposta: {answers[question.id] || 'Sem resposta'}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                      <Button
                        variant="secondary"
                        className="rounded-full px-6"
                        onClick={handleDownloadPsychosocialPdf}
                      >
                        Baixar PDF
                      </Button>
                      <Button
                        className="rounded-full bg-clin-blue-600 px-6 text-white hover:bg-clin-blue-500"
                        onClick={() => {
                          setCurrentQuestionIndex(0);
                          setAnswers({});
                          setTriageResult(null);
                          setShowPersonalInfoForm(true); // Go back to personal info form
                          setPersonalInfo(null);
                        }}
                      >
                        Fazer Nova Triagem
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Triagem;
