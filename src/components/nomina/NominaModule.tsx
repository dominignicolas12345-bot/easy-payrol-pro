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
}

export default function NominaModule({ empleados, onUpdate }: NominaModuleProps) {
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
    setEditingId(newEmpleado.id);
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
            Gestione la información personal y laboral de cada empleado
          </p>
        </div>
        <Button onClick={handleAddEmpleado} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-table-header">
                <th className="text-left p-3 text-sm font-semibold">No.</th>
                <th className="text-left p-3 text-sm font-semibold">Apellidos</th>
                <th className="text-left p-3 text-sm font-semibold">Nombres</th>
                <th className="text-left p-3 text-sm font-semibold">Cédula</th>
                <th className="text-left p-3 text-sm font-semibold">Cargo</th>
                <th className="text-left p-3 text-sm font-semibold">Asignación</th>
                <th className="text-left p-3 text-sm font-semibold">Sueldo Nominal</th>
                <th className="text-left p-3 text-sm font-semibold">Estado</th>
                <th className="text-left p-3 text-sm font-semibold">Fondo Reserva</th>
                <th className="text-left p-3 text-sm font-semibold">Acumula Fondo</th>
                <th className="text-left p-3 text-sm font-semibold">Mensualiza Décimos</th>
                <th className="text-left p-3 text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado, index) => (
                <tr key={empleado.id} className="border-b hover:bg-table-hover transition-colors">
                  <td className="p-3 text-sm">{index + 1}</td>
                  <td className="p-3">
                    <Input
                      value={empleado.apellidos}
                      onChange={(e) => handleUpdate(empleado.id, "apellidos", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Apellidos"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={empleado.nombres}
                      onChange={(e) => handleUpdate(empleado.id, "nombres", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Nombres"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={empleado.cedula}
                      onChange={(e) => handleUpdate(empleado.id, "cedula", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="0000000000"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={empleado.cargo}
                      onChange={(e) => handleUpdate(empleado.id, "cargo", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Cargo"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={empleado.asignacion}
                      onChange={(e) => handleUpdate(empleado.id, "asignacion", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Asignación"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      value={empleado.sueldoNominal}
                      onChange={(e) => handleUpdate(empleado.id, "sueldoNominal", parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="p-3">
                    <Badge variant={empleado.activo ? "default" : "secondary"}>
                      {empleado.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Switch
                      checked={empleado.tieneFondoReserva}
                      onCheckedChange={(checked) => handleUpdate(empleado.id, "tieneFondoReserva", checked)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Switch
                      checked={empleado.acumulaFondoReserva}
                      onCheckedChange={(checked) => handleUpdate(empleado.id, "acumulaFondoReserva", checked)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Switch
                      checked={empleado.mensualizaDecimos}
                      onCheckedChange={(checked) => handleUpdate(empleado.id, "mensualizaDecimos", checked)}
                    />
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(empleado.id)}
                      className="h-8 w-8 p-0"
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
