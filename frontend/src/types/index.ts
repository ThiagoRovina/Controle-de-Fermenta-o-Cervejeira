export interface Cerveja {
  id: string
  nome: string
  estilo: string
  criadoEm?: string
}

export interface Tanque {
  id: string
  nome: string
  capacidade: number
  criadoEm?: string
}

export interface Parametros {
  id?: string
  cervejaId: string
  tempMin: number
  tempMax: number
  phMin: number
  phMax: number
  extratoMin: number
  extratoMax: number
  criadoEm?: string
  atualizadoEm?: string
}

export type StatusFermentacao = 'dentro_padrao' | 'atencao' | 'fora_padrao'

export interface Registro {
  id: string
  cervejaId: string
  tanqueId: string
  numeroLote: string
  dataHora: string
  temperatura: number
  ph: number
  extrato: number
  observacoes?: string | null
  status: StatusFermentacao
  criadoEm?: string
}

export interface DashboardData {
  totalRegistros: number
  dentroPadrao: number
  atencao: number
  foraPadrao: number
}

export interface LoteResumo {
  numeroLote: string
  totalRegistros: number
  primeiraMedicao: string
  ultimaMedicao: string
  ultimoStatus: StatusFermentacao
}

export interface LoteHistorico {
  numeroLote: string
  registros: Registro[]
}

export interface CervejaInput {
  nome: string
  estilo: string
}

export interface TanqueInput {
  nome: string
  capacidade: number
}

export type ParametrosInput = Omit<Parametros, 'id' | 'cervejaId' | 'criadoEm' | 'atualizadoEm'>

export interface RegistroInput {
  cervejaId: string
  tanqueId: string
  numeroLote: string
  dataHora: string
  temperatura: number
  ph: number
  extrato: number
  observacoes?: string
}

export interface RegistroFiltros {
  cervejaId?: string
  tanqueId?: string
  numeroLote?: string
  status?: StatusFermentacao | ''
}
