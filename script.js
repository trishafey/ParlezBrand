/* ============================================================
   A tiny date-proposal site.
   - The "No" button runs away when you try to click it.
   - After 10 dodges it sprints off the screen for good.
   - "Yes" triggers heart confetti and reveals the planner.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     CONFIG — where the date details go.
     ------------------------------------------------------------
     TO_EMAIL: the address the "Email the details" button sends to.

     FORMSPREE_ENDPOINT (optional): if you want the details emailed
     AUTOMATICALLY on submit (no email app opening), create a free
     form at https://formspree.io pointed at TO_EMAIL and paste its
     endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
     Leave it as "" to just use the email button — works with zero setup.
     ============================================================ */
  var TO_EMAIL = "Trisha@trishafeydesigns.com";
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdbwwgj";

  /* ---------- screen switching ---------- */
  function show(id) {
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.toggle("is-active", s.id === id);
    });
  }

  /* ---------- heart confetti (self-contained canvas) ---------- */
  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var rafId = null;

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function drawHeart(x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size / 16, size / 16);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, -2, -8, -2, -8, 4);
    ctx.bezierCurveTo(-8, 9, -3, 12, 0, 16);
    ctx.bezierCurveTo(3, 12, 8, 9, 8, 4);
    ctx.bezierCurveTo(8, -2, 0, -2, 0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  var COLORS = ["#ff5d8f", "#e23e6e", "#ffcf4d", "#ff8fab", "#ff3d6e", "#ffd166"];

  function burst(count) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2.4;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 4 + Math.random() * 9;
      particles.push({
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: 14 + Math.random() * 20,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 1
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += 0.22;          // gravity
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > canvas.height + 40) {
        particles.splice(i, 1);
        continue;
      }
      drawHeart(p.x, p.y, p.size, p.rot, p.color, Math.max(0, Math.min(1, p.life)));
    }
    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rafId = null;
    }
  }

  /* keep a gentle stream going for the finale */
  function celebrate(duration) {
    var start = Date.now();
    (function rain() {
      burst(10);
      if (Date.now() - start < duration) setTimeout(rain, 180);
    })();
  }

  /* ---------- ambient floating hearts on the question card ---------- */
  (function ambientHearts() {
    var holder = document.querySelector(".floating-hearts");
    if (!holder) return;
    var emojis = ["💕", "💖", "💗", "💝", "🌸"];
    for (var i = 0; i < 9; i++) {
      var s = document.createElement("span");
      s.textContent = emojis[i % emojis.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 0.9 + Math.random() * 1.4 + "rem";
      s.style.animationDuration = 5 + Math.random() * 6 + "s";
      s.style.animationDelay = Math.random() * 6 + "s";
      holder.appendChild(s);
    }
  })();

  /* ---------- the evasive No button ---------- */
  var noBtn = document.getElementById("btn-no");
  var yesBtn = document.getElementById("btn-yes");
  var taunt = document.getElementById("taunt");
  var attempts = 0;
  var MAX = 10;
  var gone = false;

  var TAUNTS = [
    "Nice try 😏",
    "Too slow! 🏃‍♀️💨",
    "Catch me if you can!",
    "Hmmm, are you sure?",
    "The button says no to No.",
    "Not happening 😌",
    "You really want to click that?",
    "Almost had me!",
    "Keep dreaming 💭",
    "Okay okay, last chance…"
  ];

  function dodge() {
    if (gone) return;
    attempts++;

    if (!noBtn.classList.contains("evading")) {
      // freeze its current size, then detach so we can fly it anywhere
      var r = noBtn.getBoundingClientRect();
      noBtn.style.width = r.width + "px";
      noBtn.style.height = r.height + "px";
      noBtn.classList.add("evading");
    }

    taunt.textContent = TAUNTS[Math.min(attempts - 1, TAUNTS.length - 1)];

    if (attempts >= MAX) {
      runAway();
      return;
    }

    var bw = noBtn.offsetWidth;
    var bh = noBtn.offsetHeight;
    var pad = 12;
    var maxX = window.innerWidth - bw - pad;
    var maxY = window.innerHeight - bh - pad;
    var x = pad + Math.random() * Math.max(0, maxX - pad);
    var y = pad + Math.random() * Math.max(0, maxY - pad);
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.style.transform = "rotate(" + (Math.random() * 24 - 12) + "deg)";

    // make Yes a touch bigger each dodge — nudge, nudge
    var scale = 1 + Math.min(attempts, MAX) * 0.05;
    yesBtn.style.transform = "scale(" + scale + ")";
  }

  function runAway() {
    gone = true;
    taunt.textContent = "Fine, I'll just leave then. There's only one answer 💛";
    noBtn.style.transition = "left 0.9s cubic-bezier(0.6,0,0.9,0.2), top 0.9s ease, opacity 0.9s ease, transform 0.9s ease";
    noBtn.style.left = window.innerWidth + 200 + "px";
    noBtn.style.top = -200 + "px";
    noBtn.style.transform = "rotate(540deg) scale(0.3)";
    noBtn.style.opacity = "0";
    setTimeout(function () {
      noBtn.style.display = "none";
    }, 950);
  }

  // dodge on any attempt to interact
  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("mousedown", function (e) { e.preventDefault(); dodge(); });
  noBtn.addEventListener("click", function (e) { e.preventDefault(); dodge(); });
  noBtn.addEventListener("touchstart", function (e) { e.preventDefault(); dodge(); }, { passive: false });
  noBtn.addEventListener("focus", dodge);

  /* ---------- YES! ---------- */
  yesBtn.addEventListener("click", function () {
    burst(90);
    setTimeout(function () { burst(60); }, 250);
    show("screen-yay");
  });

  document.getElementById("btn-continue").addEventListener("click", function () {
    burst(40);
    show("screen-details");
    document.getElementById("datetime").focus();
  });

  /* ---------- the form ---------- */
  var form = document.getElementById("date-form");
  var dtInput = document.getElementById("datetime");
  var dtError = document.getElementById("datetime-error");
  var locInput = document.getElementById("location");
  var submitBtn = document.getElementById("btn-submit");
  var status = document.getElementById("form-status");

  // don't allow dates in the past
  (function setMin() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dtInput.min = now.toISOString().slice(0, 16);
  })();

  function prettyDate(value) {
    var d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleString(undefined, {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "numeric", minute: "2-digit"
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("error");

    if (!dtInput.value) {
      dtError.textContent = "Please pick a date & time 💕";
      dtInput.classList.add("invalid");
      dtInput.focus();
      return;
    }
    dtError.textContent = "";
    dtInput.classList.remove("invalid");

    var payload = {
      datetimePretty: prettyDate(dtInput.value),
      location: locInput.value.trim()
    };

    // If Formspree is configured, email the details automatically.
    // Otherwise just celebrate — the "Email the details" button on the
    // finale screen is always there as the guaranteed way to send.
    if (FORMSPREE_ENDPOINT) {
      submitBtn.disabled = true;
      status.textContent = "Sending… 💌";
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          message: buildMessage(payload),
          when: payload.datetimePretty,
          where: payload.location || "(surprise me!)"
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Hmm, couldn't send automatically");
          finish(payload, true);
        })
        .catch(function () {
          // Fall back to the celebration + manual email button.
          finish(payload, false);
        });
    } else {
      finish(payload, false);
    }
  });

  function buildMessage(payload) {
    var lines = [
      "She said YES! 🥰",
      "",
      "When:  " + payload.datetimePretty,
      "Where: " + (payload.location || "(no location — surprise me!)"),
      "",
      "Can't wait! 💕"
    ];
    return lines.join("\n");
  }

  function buildMailto(payload) {
    var subject = "It's a date! " + payload.datetimePretty;
    return "mailto:" + TO_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(buildMessage(payload));
  }

  function finish(payload, autoSent) {
    var sub = "I'll see you on " + payload.datetimePretty;
    sub += payload.location ? " at " + payload.location + " 💖" : " 💖";
    document.getElementById("done-sub").textContent = sub;

    var emailBtn = document.getElementById("btn-email");
    emailBtn.href = buildMailto(payload);
    if (autoSent) {
      // Already emailed via Formspree; offer the button as an optional extra.
      emailBtn.textContent = "✉️ Send it again from your email";
    } else {
      emailBtn.textContent = "✉️ Email the details to Trisha";
    }

    show("screen-done");
    celebrate(2600);
  }
})();
