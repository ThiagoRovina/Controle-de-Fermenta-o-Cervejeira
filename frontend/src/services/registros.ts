import { api } from './api'
import type { Registro, RegistroFiltros, RegistroInput } from '../types'

export async function getRegistros(filtros?: RegistroFiltros): Promise<Registro[]> {
  const { data } = await api.get<Registro[]>('/registros', { params: filtros })
  return data
}

export async function getRegistro(id: string): Promise<Registro> {
  const { data } = await api.get<Registro>(`/registros/${id}`)
  return data
}

export async function createRegistro(payload: RegistroInput): Promise<Registro> {
  const { data } = await api.post<Registro>('/registros', payload)
  return data
}

export async function updateRegistro(id: string, payload: RegistroInput): Promise<Registro> {
  const { data } = await api.put<Registro>(`/registros/${id}`, payload)
  return data
}

export async function deleteRegistro(id: string): Promise<void> {
  await api.delete(`/registros/${id}`)
}
