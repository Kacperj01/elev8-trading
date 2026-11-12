// ELEV8 Trading website.
// The Supabase key below is the public (publishable) key: it can only add mentorship applications,
// never read them (see supabase/mentorship_applications.sql). Never put the service key here.
const CONFIG = {
  supabaseUrl: "https://jkxcoebilwcqeeziqhwn.supabase.co",
  supabaseKey: "sb_publishable_K_X-lBQ1wsN86Bo4Ip8-Sg_OPIsLES6",
  // Vantage partner link. Leave empty until it's ready; the button then shows "coming soon".
  vantageUrl: "",
};

document.getElementById("yr").textContent = new Date().getFullYear();

// Vantage button
const vb = document.getElementById("vantageBtn");
if (vb && CONFIG.vantageUrl) {
  vb.href = CONFIG.vantageUrl; vb.target = "_blank"; vb.rel = "noopener sponsored";
  vb.removeAttribute("aria-disabled"); vb.textContent = "Sign up with Vantage";
} else if (vb) {
  vb.addEventListener("click", e => e.preventDefault());
}

// Mentorship application
const form = document.getElementById("applyForm");
if (form) {
  const err = document.getElementById("applyErr"), btn = document.getElementById("applyBtn");
  const show = m => { err.textContent = m; err.hidden = !m; };
  form.addEventListener("submit", async e => {
    e.preventDefault(); show("");
    const f = new FormData(form);
    if (f.get("website")) return; // filled in by a bot
    const v = k => String(f.get(k) || "").trim();
    const row = { name: v("name"), email: v("email"), handle: v("handle") || null, level: v("level"), goals: v("goals"),
                  age_confirmed: f.get("age") === "on", consent: f.get("consent") === "on" };
    if (!row.name) return show("Please add your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) return show("Please check your email address.");
    if (!row.level) return show("Please pick your level.");
    if (!row.goals) return show("Please tell us what you want to get out of mentorship.");
    if (!row.age_confirmed) return show("Mentorship is for people aged 18 and over.");
    if (!row.consent) return show("Please agree to the privacy policy so we can store your application.");
    btn.disabled = true; btn.textContent = "Sending…";
    try {
      const r = await fetch(CONFIG.supabaseUrl + "/rest/v1/mentorship_applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: CONFIG.supabaseKey, Prefer: "return=minimal" },
        body: JSON.stringify(row),
      });
      if (!r.ok) {
        const t = await r.text();
        if (/already applied/i.test(t)) throw new Error("You've already sent an application with this email in the last day. We'll be in touch soon.");
        if (/too many/i.test(t)) throw new Error("We're getting a lot of applications right now. Please try again in an hour, or message us on Instagram.");
        throw new Error("Something went wrong sending your application. Please try again, or message us on Instagram.");
      }
      form.hidden = true;
      const d = document.getElementById("applyDone"); d.hidden = false; d.focus();
    } catch (x) {
      show(x.message && !/fetch/i.test(x.message) ? x.message : "Couldn't connect. Check your internet and try again.");
      btn.disabled = false; btn.textContent = "Send application";
    }
  });
}
