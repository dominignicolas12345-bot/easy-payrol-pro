import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Empleado, RolPagosRow, DatosConfig } from "@/types/nomina";

interface RolPagosModuleProps {
  empleados: Empleado[];
  datos: DatosConfig;
}

const calcularRolPagos = (empleado: Empleado, row: RolPagosRow, diasMes: number): RolPagosRow => {
  // Cálculos automáticos según las fórmulas Excel
  const sueldo = (row.sueldoNominal / diasMes) * row.diasTrabajados;
  const valorHoras50 = (row.sueldoNominal / 240) * row.horas50 * 1.5;
  const valorHoras100 = (row.sueldoNominal / 240) * 2 * row.horas100;
  
  const decimoTerceroMensualizado = (sueldo + valorHoras50 + valorHoras100) / 12;
  const decimoCuartoMensualizado = ((470 / 240) * 8 * row.diasTrabajados) / 12;
  
  const totalGanado = sueldo + valorHoras50 + valorHoras100 + row.bonificacion + row.viaticos + 
    decimoTerceroMensualizado + decimoCuartoMensualizado;
  
  const aportePersonal = (sueldo + valorHoras50 + valorHoras100 + row.bonificacion) * 0.0945;
  
  const totalDescuentos = row.prestamosEmpleado + row.anticipoSueldo + row.retencionRenta + 
    aportePersonal + row.otrosDescuentos + row.prestamosIess;
  
  const subtotal = totalGanado - totalDescuentos;
  
  const valorFondoReserva = empleado.acumulaFondoReserva 
    ? (sueldo + valorHoras50 + valorHoras100) * (1/12)
    : 0;
  
  const netoRecibir = subtotal + valorFondoReserva - row.depositoIess;

  return {
    ...row,
    sueldo,
    valorHoras50,
    valorHoras100,
    decimoTerceroMensualizado,
    decimoCuartoMensualizado,
    totalGanado,
    aportePersonal,
    totalDescuentos,
    subtotal,
    valorFondoReserva,
    netoRecibir,
  };
};

export default function RolPagosModule({ empleados, datos }: RolPagosModuleProps) {
  const empleadosActivos = empleados.filter((e) => e.activo);
  
  const [rolPagos, setRolPagos] = useState<Record<string, RolPagosRow>>({});

  useEffect(() => {
    const initialRol: Record<string, RolPagosRow> = {};
    empleadosActivos.forEach((emp) => {
      if (!rolPagos[emp.id]) {
        const baseRow: RolPagosRow = {
          empleadoId: emp.id,
          diasMes: datos.diasMes,
          diasTrabajados: datos.diasMes,
          sueldoNominal: emp.sueldoNominal,
          horas50: 0,
          horas100: 0,
          bonificacion: 0,
          viaticos: 0,
          sueldo: 0,
          valorHoras50: 0,
          valorHoras100: 0,
          decimoTerceroMensualizado: 0,
          decimoCuartoMensualizado: 0,
          totalGanado: 0,
          prestamosEmpleado: 0,
          anticipoSueldo: 0,
          retencionRenta: 0,
          otrosDescuentos: 0,
          prestamosIess: 0,
          aportePersonal: 0,
          totalDescuentos: 0,
          subtotal: 0,
          valorFondoReserva: 0,
          depositoIess: 0,
          netoRecibir: 0,
        };
        initialRol[emp.id] = calcularRolPagos(emp, baseRow, datos.diasMes);
      } else {
        initialRol[emp.id] = calcularRolPagos(emp, rolPagos[emp.id], datos.diasMes);
      }
    });
    setRolPagos(initialRol);
  }, [empleadosActivos.length, datos.diasMes]);

  const handleUpdate = (empleadoId: string, field: keyof RolPagosRow, value: number) => {
    const empleado = empleados.find((e) => e.id === empleadoId);
    if (!empleado) return;

    const updated = { ...rolPagos[empleadoId], [field]: value };
    const recalculated = calcularRolPagos(empleado, updated, datos.diasMes);
    
    setRolPagos({ ...rolPagos, [empleadoId]: recalculated });
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Rol de Pagos</h2>
        <p className="text-sm text-muted-foreground">
          {datos.empresa} - {datos.mes}
        </p>
      </div>

      <Card className="shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead>
              <tr className="border-b bg-table-header">
                <th colSpan={5} className="text-center p-3 font-semibold border-r">DATOS</th>
                <th colSpan={7} className="text-center p-3 font-semibold border-r">INGRESOS</th>
                <th colSpan={7} className="text-center p-3 font-semibold border-r">DESCUENTOS</th>
                <th colSpan={4} className="text-center p-3 font-semibold">LIQUIDACIÓN</th>
              </tr>
              <tr className="border-b bg-table-header text-xs">
                {/* DATOS */}
                <th className="p-3 text-left whitespace-nowrap">No.</th>
                <th className="p-3 text-left whitespace-nowrap min-w-[200px]">Nombre</th>
                <th className="p-3 text-left whitespace-nowrap min-w-[150px]">Cargo</th>
                <th className="p-3 text-right whitespace-nowrap">Días Mes</th>
                <th className="p-3 text-right border-r whitespace-nowrap min-w-[100px]">Días Trab.</th>
                
                {/* INGRESOS */}
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Sueldo</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[100px]">Horas 50%</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[100px]">Horas 100%</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Bonificación</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Viáticos</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[100px]">13ro</th>
                <th className="p-3 text-right border-r whitespace-nowrap min-w-[130px]">Total Ganado</th>
                
                {/* DESCUENTOS */}
                <th className="p-3 text-right whitespace-nowrap min-w-[130px]">Préstamos Emp.</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Anticipo</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Ret. Renta</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Aporte IESS</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[100px]">Otros</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[130px]">Préstamos IESS</th>
                <th className="p-3 text-right border-r whitespace-nowrap min-w-[130px]">Total Desc.</th>
                
                {/* LIQUIDACIÓN */}
                <th className="p-3 text-right whitespace-nowrap min-w-[120px]">Subtotal</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[130px]">Fondo Reserva</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[130px]">Depósito IESS</th>
                <th className="p-3 text-right whitespace-nowrap min-w-[140px]">Neto a Recibir</th>
              </tr>
            </thead>
            <tbody>
              {empleadosActivos.map((empleado, index) => {
                const row = rolPagos[empleado.id];
                if (!row) return null;

                return (
                  <tr key={empleado.id} className="border-b hover:bg-table-hover transition-colors">
                    {/* DATOS */}
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{`${empleado.apellidos} ${empleado.nombres}`}</td>
                    <td className="p-3 text-muted-foreground">{empleado.cargo}</td>
                    <td className="p-3 text-right">{row.diasMes}</td>
                    <td className="p-3 border-r">
                      <Input
                        type="number"
                        value={row.diasTrabajados}
                        onChange={(e) => handleUpdate(empleado.id, "diasTrabajados", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[100px]"
                      />
                    </td>
                    
                    {/* INGRESOS */}
                    <td className="p-3 text-right bg-muted/30 font-mono">${formatCurrency(row.sueldo)}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.horas50}
                        onChange={(e) => handleUpdate(empleado.id, "horas50", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[100px]"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.horas100}
                        onChange={(e) => handleUpdate(empleado.id, "horas100", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[100px]"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.bonificacion}
                        onChange={(e) => handleUpdate(empleado.id, "bonificacion", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[120px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.viaticos}
                        onChange={(e) => handleUpdate(empleado.id, "viaticos", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[120px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3 text-right bg-muted/30 font-mono">${formatCurrency(row.decimoTerceroMensualizado)}</td>
                    <td className="p-3 text-right bg-muted/30 font-mono font-semibold border-r">${formatCurrency(row.totalGanado)}</td>
                    
                    {/* DESCUENTOS */}
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.prestamosEmpleado}
                        onChange={(e) => handleUpdate(empleado.id, "prestamosEmpleado", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[130px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.anticipoSueldo}
                        onChange={(e) => handleUpdate(empleado.id, "anticipoSueldo", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[120px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.retencionRenta}
                        onChange={(e) => handleUpdate(empleado.id, "retencionRenta", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[120px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3 text-right bg-muted/30 font-mono">${formatCurrency(row.aportePersonal)}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.otrosDescuentos}
                        onChange={(e) => handleUpdate(empleado.id, "otrosDescuentos", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[100px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.prestamosIess}
                        onChange={(e) => handleUpdate(empleado.id, "prestamosIess", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[130px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3 text-right bg-muted/30 font-mono font-semibold border-r">${formatCurrency(row.totalDescuentos)}</td>
                    
                    {/* LIQUIDACIÓN */}
                    <td className="p-3 text-right bg-muted/30 font-mono">${formatCurrency(row.subtotal)}</td>
                    <td className="p-3 text-right bg-muted/30 font-mono">${formatCurrency(row.valorFondoReserva)}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={row.depositoIess}
                        onChange={(e) => handleUpdate(empleado.id, "depositoIess", parseFloat(e.target.value) || 0)}
                        className="h-9 text-right text-sm min-w-[130px]"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3 text-right bg-primary/5 font-mono font-bold text-base">${formatCurrency(row.netoRecibir)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
