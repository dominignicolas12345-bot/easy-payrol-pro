import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatosConfig } from "@/types/nomina";
import { Calendar } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const getDiasMes = (mes: string, year: number = new Date().getFullYear()): number => {
  const mesIndex = MESES.indexOf(mes);
  if (mesIndex === -1) return 30;
  return new Date(year, mesIndex + 1, 0).getDate();
};

interface DatosModuleProps {
  datos: DatosConfig;
  onUpdate: (datos: DatosConfig) => void;
}

export default function DatosModule({ datos, onUpdate }: DatosModuleProps) {
  const [localDatos, setLocalDatos] = useState(datos);

  const handleChange = (field: keyof DatosConfig, value: string) => {
    const updated = { ...localDatos, [field]: value };
    
    if (field === "mes") {
      updated.diasMes = getDiasMes(value);
    }
    
    setLocalDatos(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Parámetros del Mes</h2>
        <p className="text-sm text-muted-foreground">
          Configure los datos generales del período de nómina
        </p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="empresa">Nombre de la Empresa</Label>
            <Input
              id="empresa"
              value={localDatos.empresa}
              onChange={(e) => handleChange("empresa", e.target.value)}
              placeholder="Ingrese nombre de empresa"
              className="font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mes">Mes</Label>
            <Select value={localDatos.mes} onValueChange={(value) => handleChange("mes", value)}>
              <SelectTrigger id="mes">
                <SelectValue placeholder="Seleccione mes" />
              </SelectTrigger>
              <SelectContent>
                {MESES.map((mes) => (
                  <SelectItem key={mes} value={mes}>
                    {mes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaCorte">Fecha de Corte</Label>
            <div className="relative">
              <Input
                id="fechaCorte"
                type="date"
                value={localDatos.fechaCorte}
                onChange={(e) => handleChange("fechaCorte", e.target.value)}
                className="font-medium"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Días del mes:</span>
            <span className="font-semibold text-lg">{localDatos.diasMes}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
