# 🎂 Siddhant's Birthday — MCA MANIT Bhopal

A cozy, colorful, mobile-first birthday celebration site: your batchmates open the link, see it's your birthday, leave a wish, and contribute via UPI — no more room-to-room collections.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Prisma.

---

## 1. What's inside

- **Public page (`/`)** — hero announcement, countdown, birthday profile, UPI contribution flow (enter your name → pick a preset or custom amount → pay + QR code), wishes wall, live celebration progress, WhatsApp/native share.
- **Private dashboard (`/dashboard`)** — protected by an ID + password. See every contribution and wish, mark contributions verified, delete spam. There's no separate "admin" concept — this is just your one private page.
- **No payment gateway** — payments happen directly via a `upi://pay` deep link and a QR code. The site can never confirm a payment actually succeeded (UPI doesn't allow that from a website); people enter their name first, then self-report via "I've Paid," and you verify manually in `/dashboard`.

---

## 2. Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm

---

## 3. Run it locally

```bash
npm install
cp .env.example .env
```

`.env` already comes with your dashboard sign-in set up:

```env
DASHBOARD_ID="Sidhu@585"
DASHBOARD_PASSWORD="Vachi@Iloveu"
```

Change these anytime by editing `.env`. Also fill in:

```env
NEXT_PUBLIC_UPI_ID="your-upi-id@bank"     # <-- put your real UPI ID here
NEXT_PUBLIC_UPI_NAME="Siddhant"
DASHBOARD_SESSION_SECRET="<run: openssl rand -hex 32>"
```

`DATABASE_URL` is already set to a local SQLite file (`file:./dev.db`) — nothing else to configure for local dev.

Then:

```bash
npx prisma db push   # creates the local SQLite database + tables
npm run dev
```

Open http://localhost:3000. The very first request auto-creates the one birthday row (Siddhant) from the seed data in `lib/config.ts` — no manual seeding step needed.

Visit http://localhost:3000/dashboard to sign in with your ID + password and see who's contributed and wished you.

---

## 4. Where to put your details

Everything you're likely to want to change lives in **`lib/config.ts`**:

```ts
export const SEED_BIRTHDAY = {
  name: "Siddhant",
  course: "MCA",
  college: "MANIT Bhopal",
  birthdayMonth: 9,
  birthdayDay: 18,
  targetAmount: 3000,          // set to null to hide the target
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "...",
  upiName: process.env.NEXT_PUBLIC_UPI_NAME ?? "...",
};
```

This seeds the database the first time the site runs. **If you change these values after the row already exists** (i.e. you've already opened the site once), either delete the row and let it reseed, or edit it directly:

```bash
npx prisma studio   # opens a local GUI to edit the Birthday row directly
```

Your real UPI ID and payee name should go in `.env` (`NEXT_PUBLIC_UPI_ID`, `NEXT_PUBLIC_UPI_NAME`) — they flow into `lib/config.ts` automatically.

---

## 5. How the contribution flow works

1. Visitor enters their **name** first — the amount options stay locked/greyed out until a name is typed.
2. They pick a preset amount or type a custom one, then tap **Pay via UPI**.
3. A screen opens with a "Pay via UPI app" button (deep link) and a QR code as a fallback for desktop.
4. Since no website can actually confirm a UPI payment succeeded, they tap **I've paid**, optionally add a birthday message, and submit.
5. That contribution shows up on your `/dashboard` immediately, with a **pending → verified** toggle so you can mark it once you've actually checked your UPI app, and a delete button for anything fake.

---

## 6. Testing the birthday flow before 18 September

The site shows one of three states based on the current date **in Asia/Kolkata time** (never the visitor's local timezone):

- **Upcoming** → countdown timer
- **Today** → full birthday celebration
- **Past** → thank-you state

To preview the "today" or "past" state without waiting, set this in `.env` (development only — it's ignored in production builds):

```env
NEXT_PUBLIC_DEV_FAKE_DATE="2026-09-18"
```

Restart `npm run dev` after changing it. Comment the line out (or delete it) to go back to the real date. **Never set this in your production `.env` on Vercel.**

---

## 7. How the data works

| Model          | Purpose                                                              |
|----------------|-----------------------------------------------------------------------|
| `Birthday`     | One row — you. Holds name, course, college, date, UPI info, target amount. |
| `Contribution` | One row per "I've Paid" submission: name, amount, optional message, `status` (`pending`/`verified`), timestamp. |
| `Wish`         | One row per birthday wish: name, message, timestamp. |

**Privacy**: the public page only ever shows aggregated numbers ("₹2,450 collected", "24 friends contributed") and the wishes people chose to make public. Individual names/amounts/status are only visible on `/dashboard` after signing in.

**Public progress counter**: it counts every contribution that hasn't been deleted, regardless of `pending`/`verified` status — that's what keeps the "24 friends contributed" number feeling alive through the day. The verified flag is your own private trust marker; use the delete button in `/dashboard` to remove anything that looks fake or spammy, which also removes it from the public count.

---

## 8. Deploying to Vercel

SQLite works great locally, but Vercel's serverless functions don't have a persistent filesystem — you need a real hosted database for production. The easiest free options that work well with Prisma + Vercel:

- **[Neon](https://neon.tech)** (serverless Postgres, generous free tier)
- **Vercel Postgres** (built into the Vercel dashboard)

### Steps

1. **Create the database.** Sign up for Neon (or open the Storage tab in your Vercel project → Postgres), create a database, and copy the connection string it gives you.

2. **Switch the Prisma provider.** In `prisma/schema.prisma`, change:

   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

   to:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Push the schema to the new database** (run locally, pointed at the production URL, once):

   ```bash
   DATABASE_URL="your-postgres-connection-string" npx prisma db push
   ```

4. **Push your code to GitHub**, then import the repo into Vercel ([vercel.com/new](https://vercel.com/new)).

5. **Set environment variables** in the Vercel project settings (Settings → Environment Variables) — copy every key from `.env.example` except leave `NEXT_PUBLIC_DEV_FAKE_DATE` unset:

   - `DATABASE_URL` → your Postgres connection string
   - `NEXT_PUBLIC_UPI_ID`
   - `NEXT_PUBLIC_UPI_NAME`
   - `DASHBOARD_ID`
   - `DASHBOARD_PASSWORD`
   - `DASHBOARD_SESSION_SECRET`
   - `NEXT_PUBLIC_SITE_URL` → your real Vercel URL, e.g. `https://your-project.vercel.app`

6. **Deploy.** Vercel runs `npm run build`, which runs `prisma generate` automatically before `next build`.

7. Open the deployed URL once — this auto-creates the Siddhant row in your production database, exactly like it does locally.

8. Share the link in your MCA WhatsApp group 🎉

---

## 9. Project structure

```
app/
  page.tsx                    # public homepage (server component, fetches data)
  dashboard/
    page.tsx                  # private dashboard (ID+password gated server component)
    login/page.tsx            # sign-in form
  api/
    wishes/route.ts                  # POST create a wish
    contributions/route.ts           # POST record a contribution
    dashboard/
      login/route.ts                 # POST sign-in
      logout/route.ts                # POST sign-out
      data/route.ts                  # GET full dashboard data
      contributions/[id]/route.ts    # PATCH status / DELETE
      wishes/[id]/route.ts           # DELETE
  opengraph-image.tsx          # dynamic OG image for link previews
  icon.tsx                     # dynamic favicon

components/
  birthday/                    # all the public-page building blocks
  dashboard/                   # dashboard UI
  ui/                          # Button, Input, Modal, Toast primitives

lib/
  config.ts                    # <-- edit your birthday details here
  db.ts                        # Prisma client singleton
  upi.ts                       # UPI deep-link builder
  validation.ts                 # input validation + sanitization
  date.ts                       # Asia/Kolkata-aware countdown/state logic
  dashboard-auth.ts             # signed-cookie dashboard session helper
  birthday-data.ts               # shared data-fetching/aggregation helpers

prisma/
  schema.prisma                 # Birthday / Contribution / Wish models

types/
  index.ts                      # shared TypeScript types
```

---

## 10. What this MVP deliberately does not do

Per the brief: no payment gateway, no WhatsApp Business API, no multi-user accounts, no roles/permissions beyond your one dashboard login, no automatic payment verification. The architecture (a `Birthday` table keyed by slug) is ready to extend to more batchmates and features later, but none of that is built now — this version is just for your birthday.
#   s i d  
 