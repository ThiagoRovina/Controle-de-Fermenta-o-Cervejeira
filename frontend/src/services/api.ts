import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { mensagem?: string; erros?: Record<string, string[]> } | undefined

    if (data?.mensagem) {
      return data.mensagem
    }

    if (data?.erros) {
      return Object.values(data.erros).flat().join(' ')
    }
  }

  return 'Nao foi possivel concluir a operacao.'
}
