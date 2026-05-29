/**
 * Tiny Express server for the date-proposal site.
 * - Serves the static frontend from /public
 * - POST /api/date  -> emails the chosen date/time + location to Trisha
 *
 * Email is sent with nodemailer. Configure SMTP via environment variables
 * (see .env.example). If SMTP isn't configured, the server logs the
 * submission to the console so the site still works in development.
 */

const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const TO_EMAIL = process.env.TO_EMAIL || "Trisha@trishafeydesigns.com";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* Build a transporter only if SMTP is configured. */
function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

const transporter = buildTransport();

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

app.post("/api/date", async (req, res) => {
  const datetimePretty = String(req.body.datetimePretty || "").slice(0, 200);
  const datetimeRaw = String(req.body.datetime || "").slice(0, 50);
  const location = String(req.body.location || "").slice(0, 300);

  if (!datetimeRaw) {
    return res.status(400).json({ error: "A date & time is required" });
  }

  const locationLine = location ? location : "(no location chosen — surprise me!)";

  const text =
    "She said YES! 🥰\n\n" +
    "When:  " + datetimePretty + "\n" +
    "Where: " + locationLine + "\n\n" +
    "Can't wait! 💕";

  const html =
    '<div style="font-family:Arial,sans-serif;color:#3a2030">' +
    '<h2 style="color:#e23e6e">She said YES! 🥰</h2>' +
    "<p><strong>When:</strong> " + escapeHtml(datetimePretty) + "</p>" +
    "<p><strong>Where:</strong> " + escapeHtml(locationLine) + "</p>" +
    '<p style="color:#ff5d8f;font-weight:bold">Can\'t wait! 💕</p>' +
    "</div>";

  try {
    if (!transporter) {
      // Dev fallback: no SMTP configured.
      console.log("\n[date-proposal] SMTP not configured — submission was:\n" + text + "\n");
      return res.json({ ok: true, delivered: false });
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: TO_EMAIL,
      subject: "💕 It's a date! " + datetimePretty,
      text: text,
      html: html
    });

    res.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    res.status(500).json({ error: "Couldn't send the email just now" });
  }
});

app.listen(PORT, () => {
  console.log("💕 Date-proposal site running at http://localhost:" + PORT);
  if (!transporter) {
    console.log("⚠️  SMTP not configured — submissions will be logged here instead of emailed.");
    console.log("   Copy .env.example to .env and fill in your SMTP details to send for real.");
  }
});
