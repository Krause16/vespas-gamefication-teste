import { test, expect } from '@playwright/test'

test.describe('Fluxo de entrada por código de sala', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/entrar')
    // Aguarda o boot sequence terminar
    await page.waitForSelector('input[aria-label="Dígito 1 de 6"]', { timeout: 8000 })
  })

  test('código incompleto não exibe botão ENTRAR', async ({ page }) => {
    const inputs = page.locator('input[aria-label^="Dígito"]')
    // Digita apenas 5 dígitos
    for (let i = 0; i < 5; i++) {
      await inputs.nth(i).fill(String(i + 1))
    }
    await expect(page.getByRole('button', { name: /entrar/i })).not.toBeVisible()
  })

  test('código inválido exibe mensagem de erro', async ({ page }) => {
    const inputs = page.locator('input[aria-label^="Dígito"]')
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).fill('9')
    }
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('alert')).toContainText(/sala|encontrada|inválido/i)
  })

  test('link para modo solo está visível', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sozinho|solo/i })).toBeVisible()
  })
})
