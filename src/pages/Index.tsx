import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatosModule from "@/components/nomina/DatosModule";
import NominaModule from "@/components/nomina/NominaModule";
import RolPagosModule from "@/components/nomina/RolPagosModule";
import { DatosConfig, Empleado } from "@/types/nomina";
import { FileSpreadsheet, Users, Calculator } from "lucide-react";

const Index = () => {
  const [datos, setDatos] = useState<DatosConfig>({
    id: "1",
    empresa: "",
    mes: "Enero",
    fechaCorte: new Date().toISOString().split("T")[0],
    diasMes: 31,
  });

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [activeTab, setActiveTab] = useState("datos");

  const canAccessNomina = datos.empresa.trim() !== "";
  const canAccessRol = canAccessNomina && empleados.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Sistema de Nómina</h1>
              <p className="text-sm text-muted-foreground">Gestión profesional de roles de pago</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="datos" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Datos
            </TabsTrigger>
            <TabsTrigger value="nomina" className="gap-2" disabled={!canAccessNomina}>
              <Users className="h-4 w-4" />
              Nómina
            </TabsTrigger>
            <TabsTrigger value="rol" className="gap-2" disabled={!canAccessRol}>
              <Calculator className="h-4 w-4" />
              Rol de Pagos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datos">
            <DatosModule datos={datos} onUpdate={setDatos} />
          </TabsContent>

          <TabsContent value="nomina">
            <NominaModule empleados={empleados} onUpdate={setEmpleados} empresa={datos.empresa} />
          </TabsContent>

          <TabsContent value="rol">
            <RolPagosModule empleados={empleados} datos={datos} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
