import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import {
  glassCardClass,
  inputSurfaceClass,
  labelMutedClass,
} from "@/styles/ui";

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
    <Card className={`${glassCardClass} mx-auto max-w-2xl`}>
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-900">
          Suas Informações
        </CardTitle>
        <p className="text-sm text-slate-500">
          Preencha para personalizarmos a triagem ao seu perfil.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name" className={labelMutedClass}>
              Nome Completo
            </Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              className={inputSurfaceClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className={labelMutedClass}>
              Telefone
            </Label>
            <Input
              id="phone"
              placeholder="(XX) XXXXX-XXXX"
              value={formData.phone}
              onChange={handleChange}
              className={inputSurfaceClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={labelMutedClass}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              className={inputSurfaceClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="functionRole" className={labelMutedClass}>
              Função/Cargo
            </Label>
            <Input
              id="functionRole"
              placeholder="Sua função na empresa"
              value={formData.functionRole}
              onChange={handleChange}
              className={inputSurfaceClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className={labelMutedClass}>
              Idade
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Sua idade"
              value={formData.age}
              onChange={handleChange}
              className={inputSurfaceClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector" className={labelMutedClass}>
              Setor
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("sector", value)}
              value={formData.sector}
            >
              <SelectTrigger id="sector" className={inputSurfaceClass}>
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
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#1C4CFF] via-[#0044FF] to-[#0CE4FF] px-8 py-3 text-white shadow-[0_20px_40px_-24px_rgba(11,71,224,0.8)] transition hover:from-[#1C4CFF] hover:via-[#005CFF] hover:to-[#15F2D0]"
            >
              Iniciar Triagem
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
