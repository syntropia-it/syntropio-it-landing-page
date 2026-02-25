// Flow tree structure for the multi-step contact form
// Based on the Samana Transformaciones conversion flow

export interface FlowOption {
  label: string;
  next: string;
  value: string;
}

export interface FlowStep {
  question: string;
  options?: FlowOption[];
  isFinal?: boolean;
}

export type FlowTree = Record<string, FlowStep>;

export const FLOW_TREE: FlowTree = {
  start: {
    question: "¿QUÉ ESTÁS PENSANDO?",
    options: [
      { label: "QUIERO REMODELAR", next: "remodelar_tipo", value: "remodelar" },
      {
        label: "QUIERO CONSTRUIR",
        next: "construir_inicio",
        value: "construir",
      },
    ],
  },
  // RAMA REMODELAR
  remodelar_tipo: {
    question: "¿QUÉ TIPO DE PROPIEDAD NECESITAS REFORMAR?",
    options: [
      { label: "DEPARTAMENTO", next: "remodelar_m2", value: "departamento" },
      { label: "CASA", next: "remodelar_m2", value: "casa" },
    ],
  },
  remodelar_m2: {
    question: "¿CUÁNTOS M2 TIENE LA PROPIEDAD?",
    options: [
      { label: "-100 m²", next: "zona", value: "-100" },
      { label: "100 a 200 m²", next: "zona", value: "100-200" },
      { label: "+200 m²", next: "zona", value: "+200" },
    ],
  },
  // RAMA CONSTRUIR
  construir_inicio: {
    question: "CONTANOS",
    options: [
      { label: "YA TENGO TERRENO", next: "terreno_m2", value: "con_terreno" },
      {
        label: "QUIERO COMPRAR",
        next: "terreno_m2_buscar",
        value: "buscar_terreno",
      },
    ],
  },
  terreno_m2: {
    question: "¿CUÁNTOS M2 TIENE TU TERRENO?",
    options: [
      { label: "-300 m²", next: "zona", value: "-300" },
      { label: "300 a 700 m²", next: "zona", value: "300-700" },
      { label: "+700 m²", next: "zona", value: "+700" },
    ],
  },
  terreno_m2_buscar: {
    question: "¿DE CUÁNTOS M2 ESTÁS BUSCANDO?",
    options: [
      { label: "-300 m²", next: "zona", value: "-300" },
      { label: "300 a 700 m²", next: "zona", value: "300-700" },
      { label: "+700 m²", next: "zona", value: "+700" },
    ],
  },
  // PASO FINAL COMÚN
  zona: {
    question: "¿EN QUÉ ZONA SE ENCUENTRA / TE INTERESA?",
    isFinal: true,
  },
};
