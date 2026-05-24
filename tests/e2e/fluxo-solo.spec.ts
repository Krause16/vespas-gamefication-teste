import { test, expect } from '@playwright/test'

test.describe('Fluxo modo solo', () => {
  test('acessa /solo e vê formulário correto', async ({ page }) => {
    await page.goto('/solo')
    await expect(page.getByText(/modo solo/i)).toBeVisible()
    await expect(page.getByText(/treino livre/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /começar sozinho/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /código de sala/i })).toBeVisible()
  })

  test('campo apelido aceita texto', async ({ page }) => {
    await page.goto('/solo')
    await page.getByLabel(/apelido/i).fill('Agente Teste')
    await expect(page.getByLabel(/apelido/i)).toHaveValue('Agente Teste')
  })

  test('link volta para /entrar', async ({ page }) => {
    await page.goto('/solo')
    await page.getByRole('link', { name: /código de sala/i }).click()
    await expect(page).toHaveURL('/entrar')
  })
})
