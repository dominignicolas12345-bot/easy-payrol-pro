import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Empleado } from "@/types/nomina";
import { Plus, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NominaModuleProps {
  empleados: Empleado[];
  onUpdate: (empleados: Empleado[]) => void;
  empresa: string;
}

export default function NominaModule({ empleados, onUpdate, empresa }: NominaModuleProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddEmpleado = () => {
    const newEmpleado: Empleado = {
      id: `emp-${Date.now()}`,
      apellidos: "",
      nombres: "",
      cargo: "",
      asignacion: "",
      fechaIngreso: new Date().toISOString().split("T")[0],
      sueldoNominal: 470,
      cedula: "",
      activo: true,
      tieneFondoReserva: false,
      acumulaFondoReserva: false,
      mensualizaDecimos: false,
    };
    onUpdate([...empleados, newEmpleado]);
  };

  const toggleEstado = (id: string) => {
    const updated = empleados.map((emp) =>
      emp.id === id ? { ...emp, activo: !emp.activo } : emp
    );
    onUpdate(updated);
  };

  const handleUpdate = (id: string, field: keyof Empleado, value: any) => {
    const updated = empleados.map((emp) =>
      emp.id === id ? { ...emp, [field]: value } : emp
    );
    onUpdate(updated);
  };

  const handleDelete = (id: string) => {
    onUpdate(empleados.filter((emp) => emp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Base de Datos de Empleados</h2>
          <p className="text-sm text-muted-foreground">
            {empresa} - Gestione la información personal y laboral de cada empleado
          </p>
        </div>
        <Button onClick={handleAddEmpleado} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      <Card className="shadow-lg border-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b bg-primary/5">
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap">No.</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap min-w-[250px]">Nombre Completo</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap min-w-[150px]">Cédula</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap min-w-[180px]">Cargo</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap min-w-[180px]">Asignación</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap min-w-[150px]">Sueldo Nominal</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap">Estado</th>
                <th className="text-center p-4 text-sm font-bold whitespace-nowrap">Fondo Reserva</th>
                <th className="text-center p-4 text-sm font-bold whitespace-nowrap">Acumula Fondo</th>
                <th className="text-center p-4 text-sm font-bold whitespace-nowrap">Mensualiza Décimos</th>
                <th className="text-left p-4 text-sm font-bold whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado, index) => (
                <tr key={empleado.id} className="border-b hover:bg-table-hover transition-colors">
                  <td className="p-4 text-sm">{index + 1}</td>
                  <td className="p-4">
                    <Input
                      value={`${empleado.apellidos} ${empleado.nombres}`.trim()}
                      onChange={(e) => {
                        const fullName = e.target.value;
                        const lastSpaceIndex = fullName.lastIndexOf(' ');
                        let apellidos = '';
                        let nombres = '';

                        if (lastSpaceIndex > 0) {
                          apellidos = fullName.substring(0, lastSpaceIndex);
                          nombres = fullName.substring(lastSpaceIndex + 1);
                        } else {
                          apellidos = fullName;
                        }

                        handleUpdate(empleado.id, "apellidos", apellidos);
                        handleUpdate(empleado.id, "nombres", nombres);
                      }}
                      className="h-10 text-sm min-w-[250px]"
                      placeholder="Apellidos Nombres"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      value={empleado.cedula}
                      onChange={(e) => handleUpdate(empleado.id, "cedula", e.target.value)}
                      className="h-10 text-sm min-w-[150px]"
                      placeholder="0000000000"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      value={empleado.cargo}
                      onChange={(e) => handleUpdate(empleado.id, "cargo", e.target.value)}
                      className="h-10 text-sm min-w-[180px]"
                      placeholder="Cargo"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      value={empleado.asignacion}
                      onChange={(e) => handleUpdate(empleado.id, "asignacion", e.target.value)}
                      className="h-10 text-sm min-w-[180px]"
                      placeholder="Asignación"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      type="number"
                      value={empleado.sueldoNominal}
                      onChange={(e) => handleUpdate(empleado.id, "sueldoNominal", parseFloat(e.target.value) || 0)}
                      className="h-10 text-sm min-w-[150px]"
                      step="0.01"
                    />
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={empleado.activo ? "default" : "secondary"}
                      className="cursor-pointer select-none"
                      onClick={() => toggleEstado(empleado.id)}
                    >
                      {empleado.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={empleado.tieneFondoReserva}
                        onCheckedChange={(checked) => handleUpdate(empleado.id, "tieneFondoReserva", checked)}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={empleado.acumulaFondoReserva}
                        onCheckedChange={(checked) => handleUpdate(empleado.id, "acumulaFondoReserva", checked)}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={empleado.mensualizaDecimos}
                        onCheckedChange={(checked) => handleUpdate(empleado.id, "mensualizaDecimos", checked)}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(empleado.id)}
                      className="h-9 w-9 p-0 hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
