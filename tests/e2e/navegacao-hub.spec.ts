import { test, expect } from '@playwright/test'

test.describe('Navegação do hub', () => {
  // Acessa o hub simulando sessão ativa via cookie
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'vespas-sessao',
        value: 'SOLO',
        domain: 'localhost',
        path: '/',
      },
    ])
    // Seed store no sessionStorage
    await page.goto('/hub')
  })

  test('hub exibe seção de missões', async ({ page }) => {
    await expect(page.getByText(/missões/i)).toBeVisible({ timeout: 8000 })
  })

  test('rota não existente retorna 404', async ({ page }) => {
    await page.goto('/rota-que-nao-existe')
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText(/não encontrada/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /início/i })).toBeVisible()
  })

  test('/entrar redireciona de volta à /entrar sem sessão', async ({ page, context }) => {
    // Remove cookie para simular sem sessão
    await context.clearCookies()
    await page.goto('/hub')
    await expect(page).toHaveURL('/entrar')
  })
})
