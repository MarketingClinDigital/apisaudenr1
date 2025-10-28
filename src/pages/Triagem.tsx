import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PersonalInfoForm, { PersonalInfoData } from '@/components/PersonalInfoForm'; // Importar o novo componente
import {
  glassCardClass,
  heroCardClass,
  pillBadgeClass,
  primaryGradientButtonClass,
  outlineSoftButtonClass,
} from "@/styles/ui";

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

const Triagem: React.FC = () => {
  const [showPersonalInfoForm, setShowPersonalInfoForm] = React.useState(true);
  const [personalInfo, setPersonalInfo] = React.useState<PersonalInfoData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [triageResult, setTriageResult] = React.useState<{ score: number; level: string; suggestion: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePersonalInfoSubmit = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setShowPersonalInfoForm(false);
    toast.success("Informações salvas! Inicie a triagem.");
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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

  const getRiskLevelAndSuggestion = (score: number) => {
    if (score >= 10) {
      return { level: "Alto Risco", suggestion: "Agendamento prioritário com especialista em saúde mental e/ou oral." };
    } else if (score >= 5) {
      return { level: "Médio Risco", suggestion: "Recomendada teleorientação com profissional de saúde." };
    } else {
      return { level: "Baixo Risco", suggestion: "Monitoramento regular e dicas de bem-estar." };
    }
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
  const radioOptionClass =
    "flex items-center gap-3 rounded-2xl border border-[#C7E5FF] bg-white/75 p-3 transition hover:border-[#8ED4FF] hover:bg-[#EEF7FF]";
  const tabTriggerClass =
    "flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#D2E5FF] bg-white/80 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4] transition data-[state=active]:border-transparent data-[state=active]:bg-white data-[state=active]:text-[#0E5CF7] data-[state=active]:shadow-[0_18px_32px_-26px_rgba(13,78,215,0.45)] sm:text-[0.8rem]";

  return (
    <div className="space-y-8 pb-24">
      <section className={`${heroCardClass} text-slate-900`}>
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,_rgba(0,175,255,0.22),_transparent_60%)]" />
        <div className="absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,215,194,0.18),_transparent_60%)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-5">
            <span className={pillBadgeClass}>Fluxo guiado</span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-[28px]">
                Triagem Inteligente
              </h1>
              <p className="max-w-md text-sm text-slate-500">
                Identifique riscos rapidamente com questionários adaptativos e
                acompanhe o colaborador em tempo real, mantendo a conformidade
                com a NR1.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <div className="rounded-[28px] bg-gradient-to-br from-[#041E59] via-[#031645] to-[#010E2D] p-5 text-white shadow-[0_24px_60px_-38px_rgba(4,24,88,0.9)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Triagens concluídas
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-semibold leading-none">1.248</span>
                <span className="mb-1 text-xs text-white/70">NR1</span>
              </div>
              <div className="mt-5 h-2 w-full rounded-full bg-white/15">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#0CF0D7] to-[#28B7FF]" />
              </div>
              <p className="mt-3 text-xs text-white/70">
                +12% vs. último ciclo
              </p>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="psicossocial" className="space-y-6">
        <TabsList className="mx-auto flex w-full items-center justify-between rounded-[32px] bg-[#EAF3FF] px-2 py-2 shadow-inner sm:gap-2">
          <TabsTrigger
            value="ocupacional"
            className={tabTriggerClass}
          >
            Triagem Ocupacional
          </TabsTrigger>
          <TabsTrigger
            value="psicossocial"
            className={tabTriggerClass}
          >
            Triagem Psicossocial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ocupacional" className="mt-6">
          <Card className={`${glassCardClass} mx-auto max-w-2xl`}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Questionário de Rastreio Rápido (Q-RR)
              </CardTitle>
              <p className="text-sm text-slate-500">Questão 1 de 6</p>
              <Progress value={16.6} className="mt-3 h-2 rounded-full bg-[#EAF5FF]" />
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium text-slate-800">
                Apresenta febre (temperatura acima de 37.8°C)?
              </h3>
              <RadioGroup defaultValue="option-one" className="space-y-4">
                <div className={radioOptionClass}>
                  <RadioGroupItem value="sim" id="r1" />
                  <Label htmlFor="r1" className="flex-grow cursor-pointer text-sm text-slate-700">
                    Sim
                  </Label>
                </div>
                <div className={radioOptionClass}>
                  <RadioGroupItem value="nao" id="r2" />
                  <Label htmlFor="r2" className="flex-grow cursor-pointer text-sm text-slate-700">
                    Não
                  </Label>
                </div>
              </RadioGroup>
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" disabled className={outlineSoftButtonClass}>
                  Anterior
                </Button>
                <Button className={primaryGradientButtonClass}>Próxima</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="psicossocial" className="mt-6">
          {showPersonalInfoForm ? (
            <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
          ) : (
            <Card className={`${glassCardClass} mx-auto max-w-2xl`}>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Triagem Rápida Psicossocial de Risco
                </CardTitle>
                {!triageResult ? (
                  <p className="text-sm text-slate-500">
                    Questão {currentQuestionIndex + 1} de {psychosocialQuestions.length}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">Triagem Concluída!</p>
                )}
                <Progress value={progress} className="mt-3 h-2 rounded-full bg-[#EAF5FF]" />
              </CardHeader>
              <CardContent className="space-y-6">
                {!triageResult ? (
                  <>
                    <h3 className="text-lg font-medium text-slate-800">
                      {currentQuestion.text}
                    </h3>
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                      className="space-y-4"
                    >
                      {currentQuestion.options.map((option) => (
                        <div key={option} className={radioOptionClass}>
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="flex-grow cursor-pointer text-sm text-slate-700">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="mt-6 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isLoading}
                        className={outlineSoftButtonClass}
                      >
                        Anterior
                      </Button>
                      <Button
                        className={primaryGradientButtonClass}
                        onClick={handleNext}
                        disabled={isLoading}
                      >
                        {currentQuestionIndex === psychosocialQuestions.length - 1
                          ? "Finalizar"
                          : "Próxima"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Resultado da Triagem
                    </h3>
                    <p className="text-lg text-slate-700">
                      Nível de Risco:{" "}
                      <span
                        className={`font-bold ${
                          triageResult.level === "Alto Risco"
                            ? "text-[#F04438]"
                            : triageResult.level === "Médio Risco"
                              ? "text-[#F59F00]"
                              : "text-[#12B76A]"
                        }`}
                      >
                        {triageResult.level}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">
                      Pontuação: {triageResult.score}
                    </p>
                    <p className="text-sm text-slate-600">
                      Sugestão de Agendamento:{" "}
                      <span className="font-medium text-slate-900">
                        {triageResult.suggestion}
                      </span>
                    </p>
                    <Button
                      className={primaryGradientButtonClass}
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setAnswers({});
                        setTriageResult(null);
                        setShowPersonalInfoForm(true);
                        setPersonalInfo(null);
                      }}
                    >
                      Fazer Nova Triagem
                    </Button>
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
