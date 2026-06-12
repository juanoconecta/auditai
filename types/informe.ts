export interface CategoriaScore {
  nombre: string;
  score: number;
  descripcion: string;
}

export interface ItemFODA {
  texto: string;
}

export interface Recomendacion {
  titulo: string;
  descripcion: string;
  impacto: string;
  prioridad: "alta" | "media" | "baja";
}

export interface ClienteIdeal {
  edad: string;
  genero: string;
  intereses: string[];
  descripcion: string;
}

export interface ProyeccionMes {
  mes: string;
  descripcion: string;
  metrica: string;
}

export interface InformeAuditoria {
  perfil: string;
  redSocial: string;
  scoreGeneral: number;
  nivelGeneral: string;
  resumenEjecutivo: string;
  categorias: CategoriaScore[];
  benchmark: {
    industria: string;
    promedioIndustria: number;
    posicion: string;
    descripcion: string;
  };
  foda: {
    fortalezas: ItemFODA[];
    oportunidades: ItemFODA[];
    debilidades: ItemFODA[];
    amenazas: ItemFODA[];
  };
  clienteIdeal: ClienteIdeal;
  recomendaciones: Recomendacion[];
  proyeccion90dias: ProyeccionMes[];
  fechaGeneracion: string;
}

export interface FormData {
  perfil: string;
  redSocial: "instagram" | "tiktok" | "linkedin";
  nicho: string;
  objetivo: string;
  descripcion: string;
}
