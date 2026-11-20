# Certificate Verification

The React app provides an admin form at `/admin` and public certificate lookup
pages at `/verify?id=<certificateId>`. Certificate records are stored in
Supabase. Public verification masks email and phone; creating records requires
an authenticated admin account.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
   The table does not allow public reads; public pages use a lookup function
   that returns only a matching certificate and masks contact details.
3. In Supabase Authentication, disable public sign-ups and create/confirm an
   admin user from the dashboard. Use that account to sign in at `/admin`.
4. Copy `.env.example` to `.env.local` and fill in the project URL and either
   the project's publishable key or legacy anon key:

   ```text
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
   ```

   These are browser-side public project values. Do not put a Supabase
   service-role key in this app or any `VITE_` variable.
5. Install dependencies and start the app:

   ```powershell
   npm install
   npm run dev
   ```

   Open `/admin`, sign in, and submit a certificate. On success, the browser
   opens `/verify?id=<certificateId>`. A verification link can be shared with
   visitors; the site host must serve `index.html` for the `/verify` path
   (configure an SPA fallback/rewrite if the host does not do this by default).

## Routes

- `/admin` — protected email/password sign-in and certificate creation.
- `/verify?id=<certificateId>` — public verification for a saved certificate.

The query string `?certificateId` without a parameter name is also accepted.

## Deploy to Vercel

1. Push the project to a GitHub repository. `.env.local` is ignored; do not
   commit it.
2. Import the repository in Vercel. Use the Vite defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add `VITE_SUPABASE_URL` and either `VITE_SUPABASE_PUBLISHABLE_KEY` or
   `VITE_SUPABASE_ANON_KEY` under the Vercel project's environment variables,
   then deploy.
4. In Vercel project settings, add your Hostinger domain. Copy the DNS records
   Vercel shows into the domain's DNS zone in Hostinger; use Vercel's displayed
   values rather than guessing them.
5. In Supabase URL Configuration, set the deployed site as the Site URL and
   add it to the allowed redirect URLs.

`vercel.json` rewrites direct visits to `/admin` and `/verify` to the React app.
