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
      <Tabs defaultValue="psicossocial" className="w-full space-y-6">
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
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Questionário de Rastreio Rápido (Q-RR)</CardTitle>
              <p className="text-sm text-muted-foreground">Questão 1 de 6</p>
              <Progress value={16.6} className="w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">Apresenta febre (temperatura acima de 37.8°C)?</h3>
              <RadioGroup defaultValue="option-one" className="space-y-4">
                <div className="flex items-center space-x-2 rounded-2xl border border-clin-blue-100/70 p-3 hover:bg-clin-blue-50 dark:border-clin-blue-500/20 dark:hover:bg-gray-800">
                  <RadioGroupItem value="sim" id="r1" />
                  <Label htmlFor="r1" className="flex-grow cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-2xl border border-clin-blue-100/70 p-3 hover:bg-clin-blue-50 dark:border-clin-blue-500/20 dark:hover:bg-gray-800">
                  <RadioGroupItem value="nao" id="r2" />
                  <Label htmlFor="r2" className="flex-grow cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
              <div className="flex justify-between mt-6">
                <Button variant="outline" disabled>Anterior</Button>
                <Button className="rounded-full bg-clin-blue-600 px-5 hover:bg-clin-blue-500">Próxima</Button>
              </div>
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
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Resultado da Triagem:</h3>
                    <p className="text-lg">Nível de Risco: <span className={`font-bold ${triageResult.level === 'Alto Risco' ? 'text-red-500' : triageResult.level === 'Médio Risco' ? 'text-yellow-500' : 'text-green-500'}`}>{triageResult.level}</span></p>
                    <p className="text-md text-muted-foreground">Pontuação: {triageResult.score}</p>
                    <p className="text-md">Sugestão de Agendamento: <span className="font-medium">{triageResult.suggestion}</span></p>
                    <Button className="mt-4 rounded-full bg-clin-blue-600 px-6 text-white hover:bg-clin-blue-500" onClick={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                      setTriageResult(null);
                      setShowPersonalInfoForm(true); // Go back to personal info form
                      setPersonalInfo(null);
                    }}>
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