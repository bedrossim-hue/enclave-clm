import { useState, useEffect, useRef } from "react";

// ── COLORS ──────────────────────────────────────────────────────────────
// White #FFFFFF (primary bg)
// Navy  #1A2744
// Teal  #0D9E8F
// LightGreen #7EC8A0 (accent, minimal)
// LightGrey  #F4F5F6 (minimal)

const C = {
  white: "#FFFFFF",
  navy: "#1A2744",
  teal: "#0D9E8F",
  green: "#7EC8A0",
  grey: "#F4F5F6",
  greyBorder: "#E2E4E8",
  text: "#1A2744",
  muted: "#6B7280",
};

const NEWS_ITEMS = [
  "⚠ CA/B Forum Ballot SC-081 PASSED — TLS certs moving to 47-day max validity by 2029",
  "📅 March 15, 2026: First deadline — all new certs max 200-day validity",
  "🔴 Spotify suffered 4-hour outage traced to expired internal certificate",
  "📋 PCI DSS 4.0 now requires continuous certificate monitoring — deadline passed",
  "🌐 Apple, Google, Mozilla & Microsoft ALL voted YES on 47-day cert mandate",
  "⚡ LinkedIn cert expiry incident disrupted API access for 6+ hours",
  "🔒 FedRAMP now mandating automated CLM as part of authorization requirements",
  "📉 IBM: Average cost of certificate-related outage is $5,600 per minute",
  "🚨 March 15, 2027: Certs drop to 100-day max — automation no longer optional",
  "✅ NIST SP 800-57 updated guidance includes shorter cert lifecycle requirements",
];

const DEADLINES = [
  { date: new Date("2026-03-15"), label: "200-Day Max", desc: "All new TLS certs issued on or after this date must not exceed 200 days validity." },
  { date: new Date("2027-03-15"), label: "100-Day Max", desc: "Validity window halves again. Manual renewal at scale becomes operationally impossible." },
  { date: new Date("2029-03-15"), label: "47-Day Max", desc: "Final phase. Nearly 8 renewals per cert per year. Automation is mandatory." },
];

const VENDORS = {
  "DigiCert": { base: 320, perCert: 48 },
  "Sectigo": { base: 180, perCert: 28 },
  "Venafi": { base: 2400, perCert: 22 },
  "Manual / Spreadsheet": { base: 0, perCert: 0 },
  "Other / Unknown": { base: 500, perCert: 35 },
};

// ── COUNTDOWN ────────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [diff, setDiff] = useState(targetDate - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(targetDate - Date.now()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  const total = Math.max(0, diff);
  const days = Math.floor(total / 86400000);
  const hrs = Math.floor((total % 86400000) / 3600000);
  const mins = Math.floor((total % 3600000) / 60000);
  const secs = Math.floor((total % 60000) / 1000);
  return { days, hrs, mins, secs };
}

function CountdownUnit({ value, label }) {
  return (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700, color: C.navy, lineHeight: 1 }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── TICKER ───────────────────────────────────────────────────────────────
function Ticker() {
  return (
    <div style={{ background: C.navy, padding: "10px 0", overflow: "hidden", position: "relative" }}>
      <div style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        animation: "ticker 60s linear infinite",
      }}>
        {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
          <span key={i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.green, marginRight: 64 }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────────────────
function Navbar({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : C.white,
      borderBottom: `1px solid ${C.greyBorder}`,
      backdropFilter: "blur(10px)",
      boxShadow: scrolled ? "0 2px 20px rgba(26,39,68,0.08)" : "none",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
            <span style={{ color: C.teal, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700 }}>SC</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: "-0.01em" }}>Enclave</div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>by SideChannel</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Deadlines", "Scorecard", "Calculator", "Pricing"].map(s => (
            <span key={s} onClick={() => scrollTo(s)} style={{ fontSize: 12, fontWeight: 500, color: C.muted, cursor: "pointer", letterSpacing: "0.04em", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = C.teal}
              onMouseLeave={e => e.target.style.color = C.muted}>{s}</span>
          ))}
          <a href="sms:8018222706" style={{
            background: C.teal, color: C.white, padding: "9px 20px",
            fontSize: 12, fontWeight: 700, textDecoration: "none",
            borderRadius: 4, letterSpacing: "0.04em",
          }}>Text for Demo</a>
        </div>
      </div>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────
function Hero({ scrollTo }) {
  const cd = useCountdown(DEADLINES[0].date);
  return (
    <section style={{ background: C.white, padding: "80px 32px 64px", borderBottom: `1px solid ${C.greyBorder}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#FFF4E5", border: "1px solid #FFD580", borderRadius: 4, marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF9500", display: "inline-block", animation: "blink 1.4s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#B45309", letterSpacing: "0.08em", textTransform: "uppercase" }}>Industry Mandate Active</span>
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(38px, 4.5vw, 58px)", fontWeight: 400, color: C.navy, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Every certificate.<br />
              <span style={{ color: C.teal }}>47 days</span> by 2029.<br />
              Are you ready?
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, marginBottom: 32, maxWidth: 480, fontWeight: 400 }}>
              The CA/Browser Forum has mandated TLS certificate lifetimes drop to 47 days by 2029 — approved by Apple, Google, Mozilla, and Microsoft. Manual management is no longer viable.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("Scorecard")} style={{ background: C.navy, color: C.white, border: "none", padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: "0.04em" }}>
                Check Your Risk Score
              </button>
              <a href="sms:8018222706" style={{ background: C.white, color: C.teal, border: `2px solid ${C.teal}`, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em" }}>
                📱 Text 801-822-2706
              </a>
            </div>
          </div>
          <div>
            <div style={{ background: C.grey, border: `1px solid ${C.greyBorder}`, borderRadius: 8, padding: 32 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>
                Time Until First Deadline — March 15, 2026
              </div>
              <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
                {[{ v: cd.days, l: "Days" }, { v: cd.hrs, l: "Hours" }, { v: cd.mins, l: "Minutes" }, { v: cd.secs, l: "Seconds" }].map((u, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    <CountdownUnit value={u.v} label={u.l} />
                    {i < 3 && <span style={{ color: C.teal, fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 700, padding: "0 8px", marginBottom: 12 }}>:</span>}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, borderTop: `1px solid ${C.greyBorder}`, paddingTop: 16 }}>
                On this date, all newly issued TLS certs must be <strong style={{ color: C.navy }}>200 days or less</strong>. Every public-facing website is affected.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              {[
                { num: "8×", label: "Renewals per cert/yr at 47 days" },
                { num: "$5,600", label: "Per minute cost of cert outage" },
                { num: "71%", label: "Of orgs don't know how many certs they manage" },
                { num: "100%", label: "Of public websites affected" },
              ].map((s, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.greyBorder}`, borderRadius: 6, padding: "16px 18px" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, color: C.teal }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── DEADLINE TIMELINE ────────────────────────────────────────────────────
function DeadlineSection() {
  return (
    <section style={{ background: C.white, padding: "72px 32px", borderBottom: `1px solid ${C.greyBorder}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>CA/B Forum Mandate SC-081</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, fontWeight: 400, color: C.navy, letterSpacing: "-0.02em" }}>
            The phased reduction timeline.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {DEADLINES.map((d, i) => {
            const cd = useCountdown(d.date);
            const pct = Math.max(0, Math.min(100, ((d.date - Date.now()) / (d.date - new Date("2025-01-01"))) * 100));
            return (
              <div key={i} style={{ border: `1px solid ${C.greyBorder}`, borderRadius: 8, padding: 28, background: i === 0 ? C.grey : C.white, position: "relative", overflow: "hidden" }}>
                {i === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.teal }} />}
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.teal, marginBottom: 8 }}>
                  {d.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.navy, marginBottom: 8 }}>{d.label}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>{d.desc}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  {[{ v: cd.days, l: "d" }, { v: cd.hrs, l: "h" }, { v: cd.mins, l: "m" }].map((u, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 700, color: C.navy }}>{String(u.v).padStart(2, "0")}</div>
                      <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em" }}>{u.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── RISK SCORECARD ───────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "How do you currently track certificate expiration?",
    options: [
      { label: "Automated CLM platform", score: 0 },
      { label: "Calendar reminders / email alerts", score: 2 },
      { label: "Spreadsheet or shared doc", score: 3 },
      { label: "We don't track them formally", score: 4 },
    ]
  },
  {
    q: "How many certificates does your organization manage?",
    options: [
      { label: "Fewer than 25", score: 0 },
      { label: "25–100", score: 1 },
      { label: "100–500", score: 2 },
      { label: "500+", score: 3 },
    ]
  },
  {
    q: "Have you experienced an unplanned outage caused by an expired certificate?",
    options: [
      { label: "Never", score: 0 },
      { label: "Once, years ago", score: 1 },
      { label: "Once in the past 2 years", score: 3 },
      { label: "More than once", score: 4 },
    ]
  },
  {
    q: "What environments do your certificates span?",
    options: [
      { label: "Single on-prem environment", score: 0 },
      { label: "Cloud only (single provider)", score: 1 },
      { label: "Hybrid or multi-cloud", score: 2 },
      { label: "Multi-cloud + on-prem + edge", score: 3 },
    ]
  },
  {
    q: "Are you subject to compliance frameworks that require certificate management?",
    options: [
      { label: "No compliance requirements", score: 0 },
      { label: "SOC 2 only", score: 1 },
      { label: "PCI, HIPAA, or ISO 27001", score: 2 },
      { label: "FedRAMP or multiple frameworks", score: 3 },
    ]
  },
  {
    q: "Are you aware of all certificates in your environment, including shadow IT?",
    options: [
      { label: "Yes, we have full visibility", score: 0 },
      { label: "Mostly, but some gaps", score: 2 },
      { label: "No — likely have unknown certs", score: 3 },
      { label: "We've never audited for shadow certs", score: 4 },
    ]
  },
];

function Scorecard() {
  const [answers, setAnswers] = useState({});


  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = 21;
  const pct = Math.round((total / maxScore) * 100);

  const risk = pct < 25 ? { label: "Low Exposure", color: C.teal, desc: "Your environment shows strong CLM hygiene. The upcoming mandate will increase your renewal burden but automation can handle it." }
    : pct < 55 ? { label: "Moderate Exposure", color: "#F59E0B", desc: "You have manageable blind spots today, but the 47-day mandate will amplify these risks significantly." }
    : { label: "Critical Exposure", color: "#EF4444", desc: "Your current approach will not scale to meet the mandate. An outage or compliance gap is a matter of when, not if." };

  const complete = QUESTIONS.every((_, qi) => answers[qi] !== undefined);

  return (
    <section style={{ background: C.grey, padding: "72px 32px", borderBottom: `1px solid ${C.greyBorder}` }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>Self-Assessment</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, fontWeight: 400, color: C.navy, letterSpacing: "-0.02em" }}>Certificate Risk Scorecard</h2>
          <p style={{ fontSize: 15, color: C.muted, marginTop: 12, lineHeight: 1.7 }}>Answer 6 questions to understand your CLM exposure before and after the mandate.</p>
        </div>

        {QUESTIONS.map((q, qi) => (
          <div key={qi} style={{ background: C.white, border: `1px solid ${C.greyBorder}`, borderRadius: 8, padding: "24px 28px", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 16, lineHeight: 1.5 }}>
              <span style={{ color: C.teal, fontFamily: "'IBM Plex Mono', monospace", marginRight: 10 }}>{String(qi + 1).padStart(2, "0")}</span>
              {q.q}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {q.options.map((opt, oi) => {
                const sel = answers[qi] === opt.score && answers[`_${qi}`] === oi;
                return (
                  <div key={oi} onClick={() => setAnswers(prev => ({ ...prev, [qi]: opt.score, [`_${qi}`]: oi }))}
                    style={{
                      padding: "12px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13,
                      border: `1.5px solid ${sel ? C.teal : C.greyBorder}`,
                      background: sel ? `${C.teal}12` : C.white,
                      color: sel ? C.navy : C.muted,
                      fontWeight: sel ? 600 : 400,
                      transition: "all 0.15s",
                    }}>
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {complete && (
          <div style={{ background: C.white, border: `1px solid ${C.greyBorder}`, borderRadius: 8, padding: 40, marginTop: 8, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: risk.color, marginBottom: 4 }}>{pct}</div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Risk Score out of 100</div>
            <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: 20, background: `${risk.color}15`, color: risk.color, fontWeight: 700, fontSize: 14, marginBottom: 20 }}>{risk.label}</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>{risk.desc}</p>
            <div style={{ height: 6, background: C.greyBorder, borderRadius: 3, marginBottom: 32 }}>
              <div style={{ height: "100%", width: pct + "%", background: risk.color, borderRadius: 3, transition: "width 1s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/melizzabedrossi/" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#0A66C2", color: C.white,
                  padding: "13px 24px", borderRadius: 6,
                  fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.02em",
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
              <a href="sms:8018222706" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: C.teal, color: C.white,
                padding: "13px 24px", borderRadius: 6,
                fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.02em",
              }}>
                📱 Text 801-822-2706
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── CALCULATOR ───────────────────────────────────────────────────────────
function Calculator() {
  const [certCount, setCertCount] = useState(50);
  const [vendor, setVendor] = useState("Manual / Spreadsheet");
  const [teamSize, setTeamSize] = useState(2);
  const [environments, setEnvironments] = useState([]);
  const [compliance, setCompliance] = useState([]);


  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const v = VENDORS[vendor] || VENDORS["Other / Unknown"];
  const currentCost = v.base + (v.perCert * certCount);

  const comparisons = [
    { name: "DigiCert", cost: VENDORS["DigiCert"].base + VENDORS["DigiCert"].perCert * certCount },
    { name: "Sectigo", cost: VENDORS["Sectigo"].base + VENDORS["Sectigo"].perCert * certCount },
    { name: "Venafi", cost: VENDORS["Venafi"].base + VENDORS["Venafi"].perCert * certCount },
  ].filter(c => c.name !== vendor);

  const renewalBurden = (days) => Math.ceil((365 / days) * certCount);

  return (
    <section style={{ background: C.white, padding: "72px 32px", borderBottom: `1px solid ${C.greyBorder}` }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>Environment Analysis</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, fontWeight: 400, color: C.navy, letterSpacing: "-0.02em" }}>
            What is your environment worth to manage?
          </h2>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 10, lineHeight: 1.7, maxWidth: 600 }}>
            Tell us about your environment. We'll show you how your current vendor costs compare to alternatives — and what your renewal burden looks like as deadlines hit.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>
                Certificates Managed: <span style={{ color: C.navy, fontFamily: "'IBM Plex Mono', monospace" }}>{certCount}</span>
              </label>
              <input type="range" min={5} max={2000} value={certCount} onChange={e => setCertCount(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: C.teal }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4 }}>
                <span>5</span><span>2,000+</span>
              </div>
            </div>

            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>
                Team Members Managing Certs: <span style={{ color: C.navy, fontFamily: "'IBM Plex Mono', monospace" }}>{teamSize}</span>
              </label>
              <input type="range" min={1} max={20} value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: C.teal }} />
            </div>

            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>Current Vendor / Tool</label>
              <select value={vendor} onChange={e => setVendor(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.greyBorder}`, borderRadius: 6, fontSize: 13, background: C.white, color: C.navy, outline: "none" }}>
                {Object.keys(VENDORS).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>Environments</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["On-Premises", "AWS", "Azure", "GCP", "Hybrid", "Edge / CDN"].map(env => (
                  <div key={env} onClick={() => toggleArr(environments, setEnvironments, env)}
                    style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontWeight: 500, transition: "all 0.15s",
                      background: environments.includes(env) ? C.teal : C.white,
                      color: environments.includes(env) ? C.white : C.muted,
                      border: `1.5px solid ${environments.includes(env) ? C.teal : C.greyBorder}`,
                    }}>{env}</div>
                ))}
              </div>
            </div>

            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>Compliance Frameworks</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["PCI DSS", "HIPAA", "FedRAMP", "SOC 2", "ISO 27001", "NIST"].map(fw => (
                  <div key={fw} onClick={() => toggleArr(compliance, setCompliance, fw)}
                    style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontWeight: 500, transition: "all 0.15s",
                      background: compliance.includes(fw) ? C.navy : C.white,
                      color: compliance.includes(fw) ? C.white : C.muted,
                      border: `1.5px solid ${compliance.includes(fw) ? C.navy : C.greyBorder}`,
                    }}>{fw}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col — results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Vendor Cost Comparison (Annual)</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Your Current: <strong style={{ color: C.navy }}>{vendor}</strong></div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700, color: C.navy }}>
                  {currentCost === 0 ? "No direct cost*" : `$${currentCost.toLocaleString()}/yr`}
                </div>
                {currentCost === 0 && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>*Hidden cost is your team's time</div>}
              </div>
              <div style={{ borderTop: `1px solid ${C.greyBorder}`, paddingTop: 16 }}>
                {comparisons.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < comparisons.length - 1 ? `1px solid ${C.greyBorder}` : "none" }}>
                    <span style={{ fontSize: 13, color: C.muted }}>{c.name}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 600, color: C.navy }}>${c.cost.toLocaleString()}/yr</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.grey, borderRadius: 8, padding: 24, border: `1px solid ${C.greyBorder}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Renewal Burden at Your Scale</div>
              {[
                { label: "Today (398 days)", days: 398, color: C.green },
                { label: "Mar 2026 (200 days)", days: 200, color: "#F59E0B" },
                { label: "Mar 2027 (100 days)", days: 100, color: "#F97316" },
                { label: "Mar 2029 (47 days)", days: 47, color: "#EF4444" },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: C.muted }}>{r.label}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: C.navy }}>{renewalBurden(r.days)} renewals/yr</span>
                  </div>
                  <div style={{ height: 5, background: C.greyBorder, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: Math.min(100, (renewalBurden(r.days) / renewalBurden(47)) * 100) + "%", background: r.color, borderRadius: 3, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* LinkedIn CTA */}
            <div style={{ background: C.navy, borderRadius: 8, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 6 }}>Ready to talk pricing?</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 20, lineHeight: 1.6 }}>
                Connect with Melizza Bedrossi, Chief Partnerships & Alliances Officer at SideChannel, to get a custom Enclave quote based on your environment.
              </div>
              <a
                href="https://www.linkedin.com/in/melizzabedrossi/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "#0A66C2", color: C.white,
                  padding: "13px 20px", borderRadius: 6,
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  letterSpacing: "0.02em", transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#0856a8"}
                onMouseLeave={e => e.currentTarget.style.background = "#0A66C2"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 12 }}>
                Or text <span style={{ color: C.green, fontWeight: 600 }}>801-822-2706</span> for a faster response
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SMS CTA ──────────────────────────────────────────────────────────────
function SMSCTA() {
  return (
    <section style={{ background: C.navy, padding: "72px 32px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.green, marginBottom: 16 }}>No Forms. No Friction.</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, fontWeight: 400, color: C.white, letterSpacing: "-0.02em", marginBottom: 16 }}>
          Ready to see Enclave in action?
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 40 }}>
          Text us directly. A SideChannel CLM specialist will respond within one business hour with demo availability or a custom pricing quote for your environment.
        </p>
        <a href="sms:8018222706?body=Hi, I'd like to request a demo of Enclave CLM" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: C.teal, color: C.white,
          padding: "18px 40px", fontSize: 16, fontWeight: 700,
          borderRadius: 6, textDecoration: "none", letterSpacing: "0.02em",
          boxShadow: `0 8px 32px rgba(13, 158, 143, 0.4)`,
        }}>
          📱 Text 801-822-2706
        </a>
        <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          Standard messaging rates apply · Mon–Fri 8am–6pm MT
        </div>
      </div>
    </section>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const refs = {
    Deadlines: useRef(null),
    Scorecard: useRef(null),
    Calculator: useRef(null),
    Pricing: useRef(null),
  };

  const scrollTo = (section) => {
    refs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: C.white, fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #9CA3AF; }
        input[style*="rgba(255,255,255,0.08)"]::placeholder { color: rgba(255,255,255,0.4) !important; }
      `}</style>
      <Ticker />
      <Navbar scrollTo={scrollTo} />
      <Hero scrollTo={scrollTo} />
      <div ref={refs.Deadlines}><DeadlineSection /></div>
      <div ref={refs.Scorecard}><Scorecard /></div>
      <div ref={refs.Calculator}><Calculator /></div>
      <div ref={refs.Pricing}><SMSCTA /></div>
    </div>
  );
}
