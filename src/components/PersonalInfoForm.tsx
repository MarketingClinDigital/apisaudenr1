import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoData) => void;
}

export interface PersonalInfoData {
  name: string;
  phone: string;
  email: string;
  functionRole: string;
  age: number | '';
  sector: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<PersonalInfoData>({
    name: '',
    phone: '',
    email: '',
    functionRole: '',
    age: '',
    sector: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof PersonalInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.functionRole || !formData.age || !formData.sector) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast.error("Por favor, insira uma idade válida.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="mx-auto max-w-2xl border-none bg-white/95 shadow-xl shadow-clin-blue-100/40 dark:bg-gray-900/85 dark:shadow-none">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Suas Informações</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">Preencha para personalizarmos a triagem ao seu perfil.</p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nome Completo</Label>
            <Input id="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} className="rounded-xl border-clin-blue-100/60 bg-white/90 focus-visible:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Telefone</Label>
            <Input id="phone" placeholder="(XX) XXXXX-XXXX" value={formData.phone} onChange={handleChange} className="rounded-xl border-clin-blue-100/60 bg-white/90 focus-visible:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</Label>
            <Input id="email" type="email" placeholder="seu.email@exemplo.com" value={formData.email} onChange={handleChange} className="rounded-xl border-clin-blue-100/60 bg-white/90 focus-visible:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="functionRole" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Função/Cargo</Label>
            <Input id="functionRole" placeholder="Sua função na empresa" value={formData.functionRole} onChange={handleChange} className="rounded-xl border-clin-blue-100/60 bg-white/90 focus-visible:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Idade</Label>
            <Input id="age" type="number" placeholder="Sua idade" value={formData.age} onChange={handleChange} className="rounded-xl border-clin-blue-100/60 bg-white/90 focus-visible:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Setor</Label>
            <Select onValueChange={(value) => handleSelectChange('sector', value)} value={formData.sector}>
              <SelectTrigger id="sector" className="rounded-xl border-clin-blue-100/60 bg-white/90 focus:ring-clin-blue-500 dark:border-gray-700 dark:bg-gray-900/60">
                <SelectValue placeholder="Selecione seu setor" />
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
          <div className="flex justify-end pt-2">
            <Button type="submit" className="rounded-full bg-clin-blue-600 px-6 py-2.5 text-white hover:bg-clin-blue-500">
              Iniciar Triagem
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;