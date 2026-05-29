# 💕 Will you go on a date with me?

A playful little one-page website that asks the big question. Pure static
HTML/CSS/JS — no build step, no server. Just open `index.html`, or host it
free on **GitHub Pages** and send your friend the link.

## What it does

1. **The question** — *"Do you want to go on a date with me?"* with a **Yes** and a **No** button.
2. **The runaway No** — every time you try to click **No**, it dodges away. After **10 attempts** it sprints clean off the screen, leaving only one option. 😏
3. **Yes!** — clicking **Yes** sets off a burst of **heart confetti** and the message **"YAY! I knew you'd say yes 🥰"**.
4. **Plan it** — a page with a **date & time picker (required)** and a **location picker (optional)**.
5. **Send it** — the finale shows a celebration animation, **"Can't wait!"**, and an **"✉️ Email the details to Trisha"** button.

The confetti is a tiny self-contained canvas engine — no external libraries or CDNs.

## Try it locally

Just open `index.html` in your browser. That's it.

## Put it online (so you can send the link)

The easiest free option is **GitHub Pages**:

1. Push these files to the repo (they live at the root on purpose).
2. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**,
   pick your branch and the `/ (root)` folder, then **Save**.
3. After a minute your site is live at
   `https://<your-username>.github.io/<repo>/` — send that link to your friend. 💌

## The email

Out of the box, the **"✉️ Email the details to Trisha"** button on the final
screen opens a pre-filled email to **Trisha@trishafeydesigns.com** with the
chosen date/time and location — works everywhere, zero setup.

Want it to send **automatically** (no email app opening)? Set up a free form
service and paste one line:

1. Create a free form at <https://formspree.io> pointed at Trisha's address.
2. Open `script.js` and set:
   ```js
   var FORMSPREE_ENDPOINT = "https://formspree.io/f/your-id-here";
   ```
3. Submitting now emails the details automatically. (The email button still
   appears as a backup.)

To send to a different address, change `TO_EMAIL` near the top of `script.js`.

## Project layout

```
index.html   the four screens (question → yay → details → done)
styles.css   styling + animations
script.js    runaway button, confetti, form + email
```
