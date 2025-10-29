import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Stethoscope, Send, Thermometer, HeartPulse, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
  const fieldClasses = "rounded-xl border-clin-blue-100/60 bg-white/90 focus-visible:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60";

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
    <div className="space-y-6 pb-12">
      <section className="rounded-3xl bg-gradient-to-br from-clin-blue-500 via-clin-blue-400 to-clin-blue-600 p-6 text-white shadow-xl">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Atendimento digital</span>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">Teleorientação Assistida</h1>
        <p className="mt-3 text-sm text-clin-blue-50/90">
          Fluxo guiado para anamnese, acompanhamento de sintomas e encaminhamento clínico em poucos toques.
        </p>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-clin-blue-100/70 p-1 shadow-inner dark:bg-clin-blue-500/10">
          <TabsTrigger
            value="anamnese"
            className="flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-wide text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300"
          >
            <User className="h-4 w-4" />
            <span>Anamnese</span>
          </TabsTrigger>
          <TabsTrigger
            value="sintomas"
            className="flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-wide text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300"
          >
            <Stethoscope className="h-4 w-4" />
            <span>Sintomas</span>
          </TabsTrigger>
          <TabsTrigger
            value="encaminhamento"
            className="flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-wide text-clin-blue-700 transition data-[state=active]:bg-white data-[state=active]:text-clin-blue-600 data-[state=active]:shadow-md dark:text-clin-blue-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-clin-blue-300"
          >
            <Send className="h-4 w-4" />
            <span>Encaminhar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anamnese" className="mt-6">
          <Card className="mx-auto max-w-3xl border-none bg-white/95 shadow-xl shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Protocolo de Anamnese Adaptado</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coleta de informações essenciais para contextualizar o atendimento.</p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleAnamneseSubmit} className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nome Completo</Label>
                  <Input id="nomeCompleto" placeholder="Digite o nome do paciente" value={anamneseData.nomeCompleto} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Idade</Label>
                  <Input id="idade" type="number" placeholder="Idade" value={anamneseData.idade} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcaoCargo" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Função/Cargo</Label>
                  <Input id="funcaoCargo" placeholder="Função na empresa" value={anamneseData.funcaoCargo} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setor" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Setor</Label>
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
                  <Label htmlFor="queixaPrincipal" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Queixa Principal</Label>
                  <Textarea id="queixaPrincipal" placeholder="Descreva a queixa principal do paciente" rows={3} value={anamneseData.queixaPrincipal} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historicoMedico" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Histórico Médico Relevante</Label>
                  <Textarea id="historicoMedico" placeholder="Doenças preexistentes, alergias, medicamentos em uso" rows={3} value={anamneseData.historicoMedico} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exposicaoOcupacional" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Exposição Ocupacional</Label>
                  <Textarea id="exposicaoOcupacional" placeholder="Agentes químicos, físicos ou biológicos a que está exposto" rows={3} value={anamneseData.exposicaoOcupacional} onChange={handleAnamneseChange} className={fieldClasses} />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="rounded-full bg-clin-blue-600 px-6 py-2.5 text-white hover:bg-clin-blue-500">
                    Salvar e continuar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sintomas" className="mt-6">
          <Card className="mx-auto max-w-3xl border-none bg-white/95 shadow-xl shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Visualização de Sintomas</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mapeamento e avaliação dos sintomas apresentados.</p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSintomasSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperatura" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span>Temperatura</span>
                      </Label>
                      <Badge variant="secondary" className="rounded-full bg-orange-100/70 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                        Vital
                      </Badge>
                    </div>
                    <Input id="temperatura" placeholder="36.5" value={sintomasData.temperatura} onChange={handleSintomasChange} className={fieldClasses} />
                    <p className="text-xs text-gray-500 dark:text-gray-400">°C - Temperatura corporal</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pressaoSistolica" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <HeartPulse className="h-4 w-4 text-red-500" />
                        <span>Pressão Sistólica</span>
                      </Label>
                      <Badge variant="secondary" className="rounded-full bg-red-100/70 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        Vital
                      </Badge>
                    </div>
                    <Input id="pressaoSistolica" placeholder="120" value={sintomasData.pressaoSistolica} onChange={handleSintomasChange} className={fieldClasses} />
                    <p className="text-xs text-gray-500 dark:text-gray-400">mmHg</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pressaoDiastolica" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <HeartPulse className="h-4 w-4 text-red-500" />
                        <span>Pressão Diastólica</span>
                      </Label>
                      <Badge variant="secondary" className="rounded-full bg-red-100/70 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        Vital
                      </Badge>
                    </div>
                    <Input id="pressaoDiastolica" placeholder="80" value={sintomasData.pressaoDiastolica} onChange={handleSintomasChange} className={fieldClasses} />
                    <p className="text-xs text-gray-500 dark:text-gray-400">mmHg</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <FileText className="h-4 w-4 text-purple-500" />
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
                          className={`justify-start rounded-2xl border-clin-blue-100/60 py-3 text-sm font-medium transition ${isSelected ? "bg-clin-blue-600 text-white hover:bg-clin-blue-500" : "bg-white/80 hover:bg-clin-blue-50 dark:bg-gray-900/60 dark:hover:bg-gray-800"}`}
                          onClick={() => handleSymptomToggle(symptom)}
                        >
                          {symptom}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoesClinicas" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Observações Clínicas</Label>
                  <Textarea id="observacoesClinicas" placeholder="Observações adicionais" rows={4} value={sintomasData.observacoesClinicas} onChange={handleSintomasChange} className={fieldClasses} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="rounded-full bg-clin-blue-600 px-6 py-2.5 text-white hover:bg-clin-blue-500">
                    Salvar sintomas
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encaminhamento" className="mt-6">
          <Card className="mx-auto max-w-3xl border-none bg-white/95 shadow-xl shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Encaminhamento Integrado</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Defina especialidade, urgência e justificativas com poucos toques.</p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleEncaminhamentoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="especialidade" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Especialidade</Label>
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
                    <Label htmlFor="nivelUrgencia" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nível de urgência</Label>
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
                  <Label htmlFor="justificativa" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Justificativa</Label>
                  <Textarea id="justificativa" placeholder="Descreva o motivo do encaminhamento" rows={4} value={encaminhamentoData.justificativa} onChange={handleEncaminhamentoChange} className={fieldClasses} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2 rounded-full bg-clin-blue-600 px-6 py-2.5 text-white hover:bg-clin-blue-500">
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