# Next.js 16 / Vercel prerendering fix

Why: src/components/DashboardShell.tsx calls usePathname(), which requires a Suspense boundary when prerendering dynamic routes with Cache Components enabled.

Apply: Copy the four src/app/.../layout.tsx files into the existing project with the same paths. No changes to dashboard, CSS, Firebase, or Stripe.

Then run npm run build. Commit only the four layout files and push the branch; Vercel will rebuild automatically when configured.

Do not add the actual .env.local or any private keys to git.
