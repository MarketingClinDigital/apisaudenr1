import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Stethoscope, Send, Thermometer, HeartPulse, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  glassCardClass,
  heroCardClass,
  inputSurfaceClass,
  labelMutedClass,
  pillBadgeClass,
  primaryGradientButtonClass,
} from "@/styles/ui";

const Teleorientacao: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('anamnese');

  const [anamneseData, setAnamneseData] = React.useState({
    nomeCompleto: '',
    idade: '',
    funcaoCargo: '',
    setor: '',
    queixaPrincipal: '',
    historicoMedico: '',
    exposicaoOcupacional: '',
  });

  const [sintomasData, setSintomasData] = React.useState({
    temperatura: '',
    pressaoSistolica: '',
    pressaoDiastolica: '',
    sintomasReportados: [] as string[],
    observacoesClinicas: '',
  });

  const [encaminhamentoData, setEncaminhamentoData] = React.useState({
    especialidade: '',
    nivelUrgencia: '',
    justificativa: '',
  });

  const allSymptoms = ["Febre", "Tosse", "Dor no Peito", "Falta de Ar", "Tontura", "Náusea", "Cansaço", "Dor de Cabeça"];
  const fieldClasses = inputSurfaceClass;
  const tabTriggerClass =
    "flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#D2E5FF] bg-white/80 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4] transition data-[state=active]:border-transparent data-[state=active]:bg-white data-[state=active]:text-[#0E5CF7] data-[state=active]:shadow-[0_18px_32px_-26px_rgba(13,78,215,0.45)] sm:text-[0.75rem]";
  const symptomChipBaseClass =
    "flex items-center gap-2 rounded-full border border-[#C7E3FF] bg-white px-3 py-2 text-xs font-semibold text-[#1F5BA4] transition hover:border-[#8DD1FF] hover:bg-[#EEF6FF]";
  const highlightCardClass =
    "rounded-[28px] bg-gradient-to-br from-[#041E59] via-[#02183F] to-[#010C29] p-5 text-white shadow-[0_24px_55px_-38px_rgba(5,24,88,0.85)]";

  const handleAnamneseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAnamneseData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnamneseSelectChange = (value: string) => {
    setAnamneseData((prev) => ({ ...prev, setor: value }));
  };

  const handleSintomasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSintomasData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setSintomasData((prev) => {
      const updatedSymptoms = prev.sintomasReportados.includes(symptom)
        ? prev.sintomasReportados.filter((s) => s !== symptom)
        : [...prev.sintomasReportados, symptom];
      return { ...prev, sintomasReportados: updatedSymptoms };
    });
  };

  const handleEncaminhamentoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEncaminhamentoData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEncaminhamentoSelectChange = (field: string, value: string) => {
    setEncaminhamentoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnamneseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anamneseData.nomeCompleto || !anamneseData.queixaPrincipal) {
      toast.error("Por favor, preencha os campos obrigatórios da Anamnese.");
      return;
    }
    toast.success("Anamnese salva! Prossiga para os sintomas.");
    setActiveTab('sintomas');
  };

  const handleSintomasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sintomasData.temperatura || !sintomasData.pressaoSistolica || !sintomasData.pressaoDiastolica) {
      toast.error("Por favor, preencha os dados vitais.");
      return;
    }
    toast.success("Sintomas registrados! Prossiga para o encaminhamento.");
    setActiveTab('encaminhamento');
  };

  const handleEncaminhamentoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encaminhamentoData.especialidade || !encaminhamentoData.nivelUrgencia || !encaminhamentoData.justificativa) {
      toast.error("Por favor, preencha todos os campos de encaminhamento.");
      return;
    }
    toast.success("Encaminhamento enviado com sucesso!");
  };

  return (
    <div className="space-y-8 pb-24">
      <section className={`${heroCardClass} text-slate-900`}>
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(0,175,255,0.22),_transparent_62%)]" />
        <div className="absolute -left-10 -bottom-16 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,215,194,0.18),_transparent_62%)]" />
        <div className="relative space-y-6">
          <div className="space-y-4">
            <span className={pillBadgeClass}>Atendimento digital</span>
            <h1 className="text-3xl font-semibold leading-tight sm:text-[28px]">
              Teleorientação Assistida
            </h1>
            <p className="max-w-xl text-sm text-slate-500">
              Fluxo guiado para anamnese, monitoramento de sinais vitais e
              encaminhamento clínico conectado ao time multiprofissional.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={highlightCardClass}>
              <div className="flex items-center justify-between">
                <Thermometer className="h-8 w-8 text-[#7EF6FF]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  Tempo médio
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold leading-none">08:30</p>
              <p className="mt-3 text-xs text-white/70">
                Triagem completa com registro dos sinais vitais prioritários.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-[0_22px_50px_-38px_rgba(10,61,130,0.45)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E1F3FF] via-white to-[#F5FBFF] text-[#1C4CFF]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Encaminhamento em 1 clique
                  </p>
                  <p className="text-xs text-slate-500">
                    Especialidade, urgência e justificativa integradas ao prontuário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full items-center justify-between rounded-[32px] bg-[#EAF3FF] px-2 py-2 shadow-inner sm:gap-2">
          <TabsTrigger
            value="anamnese"
            className={tabTriggerClass}
          >
            <User className="h-4 w-4" />
            <span>Anamnese</span>
          </TabsTrigger>
          <TabsTrigger
            value="sintomas"
            className={tabTriggerClass}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Sintomas</span>
          </TabsTrigger>
          <TabsTrigger
            value="encaminhamento"
            className={tabTriggerClass}
          >
            <Send className="h-4 w-4" />
            <span>Encaminhar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anamnese" className="mt-6">
          <Card className={`${glassCardClass} mx-auto max-w-3xl`}>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Protocolo de Anamnese Adaptado
              </CardTitle>
              <p className="text-sm text-slate-500">
                Coleta de informações essenciais para contextualizar o atendimento.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleAnamneseSubmit} className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto" className={labelMutedClass}>
                    Nome Completo
                  </Label>
                  <Input id="nomeCompleto" placeholder="Digite o nome do paciente" value={anamneseData.nomeCompleto} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade" className={labelMutedClass}>
                    Idade
                  </Label>
                  <Input id="idade" type="number" placeholder="Idade" value={anamneseData.idade} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcaoCargo" className={labelMutedClass}>
                    Função/Cargo
                  </Label>
                  <Input id="funcaoCargo" placeholder="Função na empresa" value={anamneseData.funcaoCargo} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setor" className={labelMutedClass}>
                    Setor
                  </Label>
                  <Select onValueChange={handleAnamneseSelectChange} value={anamneseData.setor}>
                    <SelectTrigger id="setor" className={fieldClasses}>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="producao">Produção</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="queixaPrincipal" className={labelMutedClass}>
                    Queixa Principal
                  </Label>
                  <Textarea id="queixaPrincipal" placeholder="Descreva a queixa principal do paciente" rows={3} value={anamneseData.queixaPrincipal} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historicoMedico" className={labelMutedClass}>
                    Histórico Médico Relevante
                  </Label>
                  <Textarea id="historicoMedico" placeholder="Doenças preexistentes, alergias, medicamentos em uso" rows={3} value={anamneseData.historicoMedico} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exposicaoOcupacional" className={labelMutedClass}>
                    Exposição Ocupacional
                  </Label>
                  <Textarea id="exposicaoOcupacional" placeholder="Agentes químicos, físicos ou biológicos a que está exposto" rows={3} value={anamneseData.exposicaoOcupacional} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" className={primaryGradientButtonClass}>
                    Salvar e continuar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sintomas" className="mt-6">
          <Card className={`${glassCardClass} mx-auto max-w-3xl`}>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Visualização de Sintomas
              </CardTitle>
              <p className="text-sm text-slate-500">
                Mapeamento e avaliação dos sintomas apresentados.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSintomasSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperatura" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Thermometer className="h-4 w-4" />
                        <span>Temperatura</span>
                      </Label>
                      <span className="rounded-full bg-[#E6F5FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4]">
                        Vital
                      </span>
                    </div>
                    <Input id="temperatura" placeholder="36.5" value={sintomasData.temperatura} onChange={handleSintomasChange} className={fieldClasses} />
                    <p className="text-xs text-slate-400">°C - Temperatura corporal</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pressaoSistolica" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <HeartPulse className="h-4 w-4" />
                        <span>Pressão Sistólica</span>
                      </Label>
                      <span className="rounded-full bg-[#E6F5FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4]">
                        Vital
                      </span>
                    </div>
                    <Input id="pressaoSistolica" placeholder="120" value={sintomasData.pressaoSistolica} onChange={handleSintomasChange} className={fieldClasses} />
                    <p className="text-xs text-slate-400">mmHg</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pressaoDiastolica" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <HeartPulse className="h-4 w-4" />
                        <span>Pressão Diastólica</span>
                      </Label>
                      <span className="rounded-full bg-[#E6F5FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F5BA4]">
                        Vital
                      </span>
                    </div>
                    <Input id="pressaoDiastolica" placeholder="80" value={sintomasData.pressaoDiastolica} onChange={handleSintomasChange} className={fieldClasses} />
                    <p className="text-xs text-slate-400">mmHg</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <FileText className="h-4 w-4" />
                    <span>Sintomas Reportados</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {allSymptoms.map((symptom) => {
                      const isSelected = sintomasData.sintomasReportados.includes(symptom);
                      return (
                        <Button
                          key={symptom}
                          type="button"
                          variant="outline"
                          className={cn(
                            symptomChipBaseClass,
                            isSelected &&
                              "border-transparent bg-gradient-to-r from-[#033A7A] via-[#0D58CA] to-[#1A75FF] text-white shadow-[0_22px_45px_-28px_rgba(13,89,202,0.65)]"
                          )}
                          onClick={() => handleSymptomToggle(symptom)}
                        >
                          {symptom}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoesClinicas" className={labelMutedClass}>
                    Observações Clínicas
                  </Label>
                  <Textarea id="observacoesClinicas" placeholder="Observações adicionais" rows={4} value={sintomasData.observacoesClinicas} onChange={handleSintomasChange} className={fieldClasses} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className={primaryGradientButtonClass}>
                    Salvar sintomas
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encaminhamento" className="mt-6">
          <Card className={`${glassCardClass} mx-auto max-w-3xl`}>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Encaminhamento Integrado
              </CardTitle>
              <p className="text-sm text-slate-500">
                Defina especialidade, urgência e justificativas com poucos toques.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleEncaminhamentoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="especialidade" className={labelMutedClass}>
                      Especialidade
                    </Label>
                    <Select onValueChange={(value) => handleEncaminhamentoSelectChange('especialidade', value)} value={encaminhamentoData.especialidade}>
                      <SelectTrigger id="especialidade" className={fieldClasses}>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinico_geral">Clínico Geral</SelectItem>
                        <SelectItem value="psicologia">Psicologia</SelectItem>
                        <SelectItem value="odontologia">Odontologia</SelectItem>
                        <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nivelUrgencia" className={labelMutedClass}>
                      Nível de urgência
                    </Label>
                    <Select onValueChange={(value) => handleEncaminhamentoSelectChange('nivelUrgencia', value)} value={encaminhamentoData.nivelUrgencia}>
                      <SelectTrigger id="nivelUrgencia" className={fieldClasses}>
                        <SelectValue placeholder="Selecione a urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imediato">Imediato</SelectItem>
                        <SelectItem value="prioritario">Prioritário</SelectItem>
                        <SelectItem value="programado">Programado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="justificativa" className={labelMutedClass}>
                    Justificativa
                  </Label>
                  <Textarea id="justificativa" placeholder="Descreva o motivo do encaminhamento" rows={4} value={encaminhamentoData.justificativa} onChange={handleEncaminhamentoChange} className={fieldClasses} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className={cn(primaryGradientButtonClass, "flex items-center gap-2")}>
                    <Send className="h-4 w-4" />
                    <span>Enviar encaminhamento</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teleorientacao;
