import { expect, test } from '@playwright/test'

test('fluxo ERP completo do FermentaTrack', async ({ page }) => {
  const stamp = Date.now().toString().slice(-6)
  const cervejaNome = `IPA E2E ${stamp}`
  const tanqueNome = `Tanque E2E ${stamp}`
  const lote = `LOTE${stamp}`

  await page.goto('/cervejas')
  await expect(page.getByRole('heading', { name: 'Cervejas' })).toBeVisible()
  await page.getByRole('button', { name: 'Nova cerveja' }).click()
  await expect(page.getByRole('heading', { name: 'Nova cerveja' })).toBeVisible()
  await page.getByLabel('Nome').fill(cervejaNome)
  await page.getByLabel('Estilo').fill('American IPA')
  await page.locator('#cerveja-form').getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('cell', { name: cervejaNome })).toBeVisible()

  await page.getByRole('link', { name: 'Tanques' }).click()
  await page.getByRole('button', { name: 'Novo tanque' }).click()
  await expect(page.getByRole('heading', { name: 'Novo tanque' })).toBeVisible()
  await page.getByLabel('Nome').fill(tanqueNome)
  await page.getByLabel('Capacidade').fill('1200')
  await page.locator('#tanque-form').getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('cell', { name: tanqueNome })).toBeVisible()

  await page.getByRole('link', { name: 'Parametros' }).click()
  await page.getByLabel('Cerveja').selectOption({ label: `${cervejaNome} - American IPA` })
  const temperatura = page.locator('section').filter({ hasText: 'Temperatura' })
  const ph = page.locator('section').filter({ hasText: 'pH' })
  const extrato = page.locator('section').filter({ hasText: 'Extrato' })
  await temperatura.getByLabel('Minima').fill('10')
  await temperatura.getByLabel('Maxima').fill('12')
  await ph.getByLabel('Minimo').fill('5')
  await ph.getByLabel('Maximo').fill('5.4')
  await extrato.getByLabel('Minimo').fill('6')
  await extrato.getByLabel('Maximo').fill('8')
  await page.getByRole('button', { name: 'Salvar parametros' }).click()
  await expect(page.getByText('Parametros salvos com sucesso.')).toBeVisible()

  await page.getByRole('link', { name: 'Registros' }).click()
  await page.getByRole('button', { name: 'Novo registro' }).click()
  await expect(page.getByRole('heading', { name: 'Novo registro' })).toBeVisible()
  await page.getByLabel('Cerveja').selectOption({ label: cervejaNome })
  await page.getByLabel('Tanque').selectOption({ label: tanqueNome })
  await page.getByLabel('Lote').fill(lote)
  await page.getByLabel('Temperatura').fill('10.5')
  await page.getByLabel('pH').fill('5.2')
  await page.getByLabel('Extrato').fill('7')
  await page.getByLabel('Observacoes').fill('Registro E2E dentro da faixa')
  await page.locator('#registro-form').getByRole('button', { name: 'Salvar registro' }).click()
  await expect(page.getByText('Dentro do Padrao').first()).toBeVisible()
  await expect(page.getByRole('cell', { name: lote })).toBeVisible()

  await page.getByRole('link', { name: 'Lotes' }).click()
  await expect(page.getByRole('button', { name: new RegExp(lote) })).toBeVisible()
  await expect(page.getByText('10.5')).toBeVisible()

  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByText('Total de registros')).toBeVisible()
})
