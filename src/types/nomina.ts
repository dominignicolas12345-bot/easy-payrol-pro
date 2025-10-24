export interface DatosConfig {
  id: string;
  empresa: string;
  mes: string;
  fechaCorte: string;
  diasMes: number;
}

export interface Empleado {
  id: string;
  apellidos: string;
  nombres: string;
  cargo: string;
  asignacion: string;
  fechaIngreso: string;
  sueldoNominal: number;
  fechaSalida?: string;
  cedula: string;
  activo: boolean;
  tieneFondoReserva: boolean;
  acumulaFondoReserva: boolean;
  mensualizaDecimos: boolean;
}

export interface RolPagosRow {
  empleadoId: string;
  // Datos básicos (calculados desde nómina)
  diasMes: number;
  diasTrabajados: number;
  sueldoNominal: number;
  
  // Ingresos editables
  horas50: number;
  horas100: number;
  bonificacion: number;
  viaticos: number;
  
  // Ingresos calculados
  sueldo: number;
  valorHoras50: number;
  valorHoras100: number;
  decimoTerceroMensualizado: number;
  decimoCuartoMensualizado: number;
  totalGanado: number;
  
  // Descuentos editables
  prestamosEmpleado: number;
  anticipoSueldo: number;
  retencionRenta: number;
  otrosDescuentos: number;
  prestamosIess: number;
  
  // Descuentos calculados
  aportePersonal: number;
  totalDescuentos: number;
  
  // Liquidación
  subtotal: number;
  valorFondoReserva: number;
  depositoIess: number;
  netoRecibir: number;
}
