import { api } from './api'
import type { Parametros, ParametrosInput } from '../types'

export async function getParametros(cervejaId: string): Promise<Parametros> {
  const { data } = await api.get<Parametros>(`/cervejas/${cervejaId}/parametros`)
  return data
}

export async function saveParametros(cervejaId: string, payload: ParametrosInput): Promise<Parametros> {
  const { data } = await api.put<Parametros>(`/cervejas/${cervejaId}/parametros`, payload)
  return data
}
