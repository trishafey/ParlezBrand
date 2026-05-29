# 💕 Will you go on a date with me?

A playful little one-page website that asks the big question.

## What it does

1. **The question** — *"Do you want to go on a date with me?"* with a **Yes** and a **No** button.
2. **The runaway No** — every time you try to click **No**, it dodges away. After **10 attempts** it sprints clean off the screen, leaving only one option. 😏
3. **Yes!** — clicking **Yes** sets off a burst of **heart confetti** and the message **"YAY! I knew you'd say yes 🥰"**.
4. **Plan it** — a page with a **date & time picker (required)** and a **location picker (optional)**.
5. **Send it** — submitting **emails the details to Trisha@trishafeydesigns.com**, then shows a celebration animation and **"Can't wait!"**.

The frontend is plain HTML/CSS/JS with a tiny self-contained confetti engine — no external libraries or CDNs needed.

## Run it locally

```bash
npm install
npm start
```

Then open <http://localhost:3000>.

Without email configured, the site fully works and the submission is **logged to your terminal** instead of emailed — handy for testing.

## Make the email actually send

The form posts to a small Express + [nodemailer](https://nodemailer.com) backend.

1. Copy the example config:
   ```bash
   cp .env.example .env
   ```
2. Fill in your SMTP details in `.env`.
   - **Gmail:** turn on 2-Step Verification, then create an **App Password**
     (Google Account → Security → App passwords) and use that as `SMTP_PASS`.
3. `npm start` again. Submissions now email **Trisha@trishafeydesigns.com**
   (change `TO_EMAIL` in `.env` to send elsewhere).

## Deploy

It's a standard Node app — `npm start` serves both the site and the API on one
port. It runs anywhere that hosts Node (Render, Railway, Fly.io, a VPS, etc.).
Just set the same environment variables from `.env` in your host's dashboard.

## Project layout

```
public/
  index.html   the four screens (question → yay → details → done)
  styles.css   styling + animations
  script.js    runaway button, confetti, form submit
server.js      static hosting + POST /api/date email endpoint
.env.example   email configuration template
```
