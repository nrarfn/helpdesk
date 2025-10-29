from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173/auth")
    page.wait_for_selector("#login-email")
    page.locator("#login-email").fill("admin@example.com")
    page.locator("#login-password").fill("password")
    page.get_by_role("button", name="Login").click()
    page.wait_for_url("http://localhost:5173/dashboard")
    page.goto("http://localhost:5173/admin")
    page.screenshot(path="jules-scratch/verification/admin_dashboard.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
