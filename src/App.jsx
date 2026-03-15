import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const MENU = {
  espresso: [
    { name: "Ristretto",  price: "3.80", notes: "Concentrated, syrupy, stone fruit finish",       photo: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1400&q=85" },
    { name: "Cortado",    price: "4.20", notes: "Equal parts espresso & steamed milk",             photo: "https://images.unsplash.com/photo-1485808191679-5f86510bd652?w=1400&q=85" },
    { name: "Flat White", price: "4.80", notes: "Double ristretto, microfoam, silk texture",       photo: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1400&q=85" },
    { name: "Long Black", price: "4.00", notes: "Hot water over double espresso — clean & bright", photo: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1400&q=85" },
  ],
  pourover: [
    { name: "V60 Single Origin", price: "6.50", notes: "Ethiopia Yirgacheffe — jasmine, bergamot",     photo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1400&q=85" },
    { name: "Chemex Batch",      price: "5.00", notes: "Colombia Huila — brown sugar, red apple",       photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=85" },
    { name: "Aeropress",         price: "5.50", notes: "Rotating seasonal — ask your barista",          photo: "https://www.yummefy.com/dalgona-coffee-recipe.html" },
    { name: "Kalita Wave",       price: "6.00", notes: "Kenya Kirinyaga — blackcurrant, tomato",        photo: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1400&q=85" },
  ],
  pastries: [
    { name: "Cardamom Kouign",     price: "5.50", notes: "Laminated, caramelised, warm from 9am",            photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=85" },
    { name: "Brown Butter Canelé", price: "4.00", notes: "Rum & vanilla — crisp shell, custardy centre",     photo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1400&q=85" },
    { name: "Miso Croissant",      price: "5.00", notes: "Umami-sweet glaze, toasted sesame",                photo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1400&q=85" },
    { name: "Tahini Date Bar",     price: "4.50", notes: "Medjool dates, oats, sesame — vegan",              photo: "https://images.unsplash.com/photo-1490567674331-8a1a59c7a3dc?w=1400&q=85" },
  ],
};

const CAROUSEL_ITEMS = [
  { label: "01 / The Roaster",  num: "01", photo: "https://weaverscoffee.com/blogs/blog/what-is-hand-roasted-reserve-coffee-1?srsltid=AfmBOopZsSXTD2AwLLc8DQcQhitqDnIs_x0noaiUGUoWarqW3ws8WDcE" },
  { label: "02 / The Interior", num: "02", photo: "https://cuplacoffee.com/cozy-coffee-shops-near-me-for-studying-working-and-weekend-sips/" },
  { label: "03 / The Beans",    num: "03", photo: "https://www.nescafe.com/gb/coffee-culture/knowledge/coffee-beans" },
];

// Interior + food gallery — shown between Concept and Menu
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&q=80", caption: "The Space" },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80",    caption: "Morning Light" },
  { src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&q=80", caption: "At the Bar" },
  { src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1000&q=80", caption: "Counter" },
  { src: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1000&q=80", caption: "Beans" },
  { src: "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=1000&q=80", caption: "Still Life" },
];

const NAV_LINKS = [
  { label: "Concept", href: "#concept" },
  { label: "Menu",    href: "#menu"    },
  { label: "Visit",   href: "#visit"   },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Hanken+Grotesk:wght@400;500;600&family=DM+Mono:wght@400&display=swap');

/* ═══════════════════════════════════════════
   LIGHT MODE  (default)
   Light sections:  warm parchment #E8E1D4
   Dark sections:   warm tan       #CEC4B0
   ═══════════════════════════════════════════ */
:root {
  --p:      #E8E1D4;   /* light section bg */
  --p2:     #DDD5C6;
  --p3:     #CFC6B5;
  --ink:    #1B1712;   /* text on light sections */
  --acc:    #C45132;
  --focus:  #C45132;
  /* light section text tokens */
  --tm:     rgba(27,23,18,0.5);
  --td:     rgba(27,23,18,0.38);
  --tb:     rgba(27,23,18,0.62);
  --bdr-l:  rgba(27,23,18,0.12);
  --sol-l:  #C5BDB0;
  /* ── alt/dark section (Menu, Footer, Modal) ── */
  --bg-dark: #CEC4B0;  /* warm tan — clearly light, distinct from parchment */
  --lt:      #1B1712;  /* text ON dark sections in light mode = dark ink */
  --ltm:     rgba(27,23,18,0.58);
  --ltd:     rgba(27,23,18,0.36);
  --bdr-d:   rgba(27,23,18,0.1);
  --sol-d:   rgba(27,23,18,0.16);
}

/* ═══════════════════════════════════════════
   DARK MODE
   Light sections:  deep ink  #1C1812
   Dark sections:   near-black #0F0D0A
   ═══════════════════════════════════════════ */
[data-dark="true"] {
  --p:      #1C1812;
  --p2:     #141108;
  --p3:     #0F0D0A;
  --ink:    #EDE6D8;
  --tm:     rgba(237,230,216,0.5);
  --td:     rgba(237,230,216,0.36);
  --tb:     rgba(237,230,216,0.65);
  --bdr-l:  rgba(237,230,216,0.1);
  --sol-l:  rgba(237,230,216,0.2);
  /* ── alt/dark sections in dark mode ── */
  --bg-dark: #0F0D0A;
  --lt:      #E8E1D4;
  --ltm:     rgba(232,225,212,0.55);
  --ltd:     rgba(232,225,212,0.28);
  --bdr-d:   rgba(232,225,212,0.11);
  --sol-d:   rgba(232,225,212,0.2);
}
[data-dark="true"] body  { background:var(--p); color:var(--ink); }
[data-dark="true"] .hdr  { background:var(--p); border-bottom-color:rgba(237,230,216,0.16); }
[data-dark="true"] .cta-l { border-color:var(--ink); color:var(--ink); }
[data-dark="true"] .cta-l::before { background:var(--ink); }
[data-dark="true"] .cta-l:hover { color:var(--p); }

/* ── Focus styles (accessibility) ── */
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
}
button:focus-visible, a:focus-visible { border-radius: 2px; }

/* ── Skip link ── */
.skip-link {
  position:fixed; top:-100%; left:16px; z-index:9000;
  background:var(--acc); color:#fff;
  font-family:'Hanken Grotesk',sans-serif; font-size:13px; font-weight:600;
  padding:10px 20px; text-decoration:none; letter-spacing:0.05em;
  transition:top 200ms ease;
}
.skip-link:focus { top:8px; }
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--p);color:var(--ink);font-family:'Hanken Grotesk',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:var(--sol-l);}

.fc{font-family:'Barlow Condensed',sans-serif;}
.fg{font-family:'Hanken Grotesk',sans-serif;}
.fm{font-family:'DM Mono','Courier New',monospace;}

.grain{
  position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── Header ── */
.hdr{
  position:fixed;top:0;left:0;right:0;z-index:200;height:56px;
  background:var(--p);border-bottom:1.5px solid var(--ink);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(20px,5vw,64px);
  opacity:0;transform:translateY(-100%);
  transition:opacity 500ms ease,transform 500ms cubic-bezier(0.16,1,0.3,1);
}
.hdr.on{opacity:1;transform:none;}

/* ── Hero load ── */
.h-clip{clip-path:inset(0 100% 0 0);transition:clip-path 900ms cubic-bezier(0.76,0,0.24,1) 180ms;}
.h-clip.on{clip-path:inset(0 0% 0 0);}
.h-rise{opacity:0;transform:translateY(14px);}
.h-rise.on{opacity:1;transform:none;}
.h-rise.d1{transition:opacity 400ms ease 760ms,transform 400ms ease 760ms;}
.h-rise.d2{transition:opacity 400ms ease 920ms,transform 400ms ease 920ms;}
.h-rise.d3{transition:opacity 400ms ease 1060ms,transform 400ms ease 1060ms;}

/* ── Scroll reveal ── */
.rv{opacity:0;transform:translateY(32px);transition:opacity 650ms ease,transform 650ms cubic-bezier(0.16,1,0.3,1);}
.rv.in{opacity:1;transform:none;}
.rv.d1{transition-delay:120ms;}
.rv.d2{transition-delay:240ms;}

/* ── Nav ── */
.nav-lnk{
  font-family:'Hanken Grotesk',sans-serif;font-size:12px;font-weight:500;
  letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;
  color:var(--tm);transition:color 180ms ease;
}
.nav-lnk:hover{color:var(--ink);}

/* ── Hamburger ── */
.hbr{display:block;width:20px;height:1.5px;background:var(--ink);
  transform-origin:center;transition:transform 320ms cubic-bezier(0.76,0,0.24,1),opacity 180ms ease;}
.hbr.t.open{transform:rotate(45deg) translate(3.5px,3.5px);}
.hbr.m.open{opacity:0;}
.hbr.b.open{transform:rotate(-45deg) translate(3.5px,-3.5px);}

/* ── Mobile overlay ── */
.ov{
  position:fixed;inset:0;z-index:300;background:var(--ink);
  display:flex;flex-direction:column;align-items:flex-start;justify-content:center;
  padding:0 clamp(24px,8vw,80px);
  transform:translateY(-100%);
  transition:transform 480ms cubic-bezier(0.76,0,0.24,1);
}
.ov.open{transform:none;}
.ov-lnk{
  font-family:'Barlow Condensed',sans-serif;font-weight:700;
  font-size:clamp(48px,10vw,88px);letter-spacing:-0.01em;
  line-height:1.05;text-decoration:none;color:var(--lt);
  transition:color 180ms ease;display:block;padding:4px 0;
}
.ov-lnk:hover{color:var(--acc);}

/* ── CTA buttons ── */
.cta-l{
  position:relative;overflow:hidden;cursor:pointer;
  font-family:'Hanken Grotesk',sans-serif;font-size:11px;font-weight:600;
  letter-spacing:0.14em;text-transform:uppercase;
  border:1.5px solid var(--ink);padding:13px 32px;
  background:transparent;color:var(--ink);transition:color 280ms ease;
}
.cta-l::before{
  content:'';position:absolute;inset:0;background:var(--ink);
  clip-path:inset(0 100% 0 0);
  transition:clip-path 280ms cubic-bezier(0.76,0,0.24,1);z-index:0;
}
.cta-l:hover::before{clip-path:inset(0 0% 0 0);}
.cta-l:hover{color:var(--p);}
.cta-l span{position:relative;z-index:1;}

/* ── Tabs ── */
.tab{
  font-family:'Hanken Grotesk',sans-serif;font-size:11px;font-weight:600;
  letter-spacing:0.12em;text-transform:uppercase;
  background:none;border:none;border-bottom:2px solid transparent;
  padding:14px 24px;cursor:pointer;color:var(--ltm);
  transition:color 180ms,border-color 180ms;white-space:nowrap;
}
.tab.on{color:var(--lt);border-bottom-color:var(--acc);}
.tab:hover:not(.on){color:var(--lt);}

/* ── Menu items — clickable ── */
.mi{
  border-top:1px solid var(--bdr-d);padding:17px 0;
  opacity:0;transform:translateY(14px);
  transition:opacity 260ms ease,transform 260ms cubic-bezier(0.16,1,0.3,1);
  cursor:pointer;position:relative;
}
.mi.in{opacity:1;transform:none;}
.mi-inner{
  display:flex;justify-content:space-between;align-items:stretch;gap:16px;
  transition:opacity 180ms ease;
}
.mi:hover .mi-inner{opacity:0.7;}
.mi-hint{
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--acc);
  opacity:0;transition:opacity 180ms ease;
  align-self:center;flex-shrink:0;
}
.mi:hover .mi-hint{opacity:1;}

/* ── Tab panel ── */
.tp{transition:opacity 130ms ease,transform 130ms ease;}
.tp.out{opacity:0;transform:translateX(-8px);}

/* ── Char reveal ── */
.ch{display:inline-block;opacity:0;transform:translateY(0.75em);
  transition:opacity 380ms ease,transform 380ms cubic-bezier(0.22,1,0.36,1);}
.ch.in{opacity:1;transform:none;}

/* ── Newsletter input ── */
.nl-in{
  background:transparent;border:none;border-bottom:1.5px solid var(--sol-d);
  color:var(--lt);font-family:'Hanken Grotesk',sans-serif;font-size:13px;
  padding:8px 0;width:100%;outline:none;transition:border-color 180ms ease;
}
.nl-in::placeholder{color:var(--ltd);}
.nl-in:focus{border-bottom-color:var(--lt);}

/* ── Map ── */
.map-wrap{position:relative;width:100%;height:340px;overflow:hidden;}
.map-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:sepia(0.15) contrast(1.06);}
.map-frame{position:absolute;inset:0;pointer-events:none;border:1.5px solid var(--lt);}

/* ── Parallax strip ── */
.parallax-strip{position:relative;height:clamp(340px,55vw,680px);overflow:hidden;}
.parallax-inner{
  position:absolute;inset:-25% 0;
  background-image:url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80');
  background-size:cover;background-position:center;will-change:transform;
}

/* ── Gallery section ── */
.gallery-track{
  display:flex;gap:2px;overflow-x:auto;
  scrollbar-width:none;-ms-overflow-style:none;
  padding-bottom:0;
}
.gallery-track::-webkit-scrollbar{display:none;}
.gallery-item{
  flex:0 0 clamp(200px,28vw,360px);
  aspect-ratio:3/4;position:relative;overflow:hidden;cursor:pointer;
}
.gallery-img{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;
  transition:transform 500ms cubic-bezier(0.25,0.46,0.45,0.94),filter 300ms ease;
  filter:grayscale(0.2);
}
.gallery-item:hover .gallery-img{transform:scale(1.04);filter:grayscale(0);}
.gallery-cap{
  position:absolute;bottom:0;left:0;right:0;
  padding:14px 16px;
  background:linear-gradient(to top,rgba(27,23,18,0.72) 0%,transparent 100%);
  opacity:0;transition:opacity 220ms ease;
}
.gallery-item:hover .gallery-cap{opacity:1;}

/* ── Photo modal ── */
.modal-backdrop{
  position:fixed;inset:0;z-index:500;
  background:rgba(27,23,18,0);backdrop-filter:blur(0px);
  display:flex;align-items:stretch;justify-content:flex-end;
  pointer-events:none;
  transition:background 320ms ease,backdrop-filter 320ms ease;
}
.modal-backdrop.open{
  background:rgba(27,23,18,0.78);backdrop-filter:blur(4px);
  pointer-events:all;
}
.modal-panel{
  width:clamp(300px,90vw,860px);
  display:grid;grid-template-columns:1fr 1fr;
  background:var(--bg-dark);
  transform:translateX(100%);
  transition:transform 420ms cubic-bezier(0.76,0,0.24,1);
  overflow:hidden;
}
.modal-backdrop.open .modal-panel{transform:translateX(0);}
@media(max-width:640px){
  .modal-panel{grid-template-columns:1fr;width:100%;grid-template-rows:55vw auto;}
}
.modal-photo{position:relative;overflow:hidden;}
.modal-photo img{
  width:100%;height:100%;object-fit:cover;display:block;
  transition:transform 600ms cubic-bezier(0.25,0.46,0.45,0.94);
}
.modal-backdrop.open .modal-photo img{transform:scale(1.0);}
.modal-info{
  padding:clamp(28px,4vw,52px);
  display:flex;flex-direction:column;justify-content:space-between;
  border-left:1px solid var(--bdr-d);
}
.modal-close{
  position:absolute;top:16px;right:16px;z-index:10;
  background:var(--bdr-d);border:1px solid var(--bdr-d);
  color:var(--lt);cursor:pointer;width:36px;height:36px;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-family:inherit;
  transition:background 180ms ease;
}
.modal-close:hover{background:var(--sol-d);}

/* ── Responsive ── */
@media(min-width:960px){.mob-only{display:none!important;}.desk-nav{display:flex!important;}}
@media(max-width:959px){.desk-nav{display:none!important;}.mob-only{display:block!important;}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}}
`;

// ─── StyleInjector ───────────────────────────────────────────────────────────

function StyleInjector() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
}

// ─── Photo Modal ─────────────────────────────────────────────────────────────

function PhotoModal({ item, onClose }) {
  const isOpen = !!item;

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div
      className={`modal-backdrop ${isOpen ? "open" : ""}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-panel" role="dialog" aria-modal="true"
        aria-label={item ? `${item.name} details` : "Menu item"}>
        {/* Photo side */}
        <div className="modal-photo">
          {item && (
            <img
              src={item.photo}
              alt={item.name}
              loading="lazy"
            />
          )}
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Info side */}
        <div className="modal-info">
          <div>
            <p className="fm" style={{
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--acc)", marginBottom: 20,
            }}>
              {item?.tab ? item.tab.toUpperCase() : ""}
            </p>
            <h2 className="fc" style={{
              fontSize: "clamp(36px,5vw,60px)", fontWeight: 700,
              lineHeight: 0.92, textTransform: "uppercase", color: "var(--lt)",
              letterSpacing: "0.01em", marginBottom: 20,
            }}>
              {item?.name}
            </h2>
            <p className="fg" style={{
              fontSize: 15, lineHeight: 1.75, color: "var(--ltm)", marginBottom: 28,
            }}>
              {item?.notes}
            </p>
          </div>

          <div>
            <div style={{ borderTop: "1px solid var(--bdr-d)", paddingTop: 24 }}>
              <p className="fm" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ltd)", marginBottom: 8 }}>
                PRICE
              </p>
              <p className="fc" style={{
                fontSize: "clamp(40px,6vw,72px)", fontWeight: 700,
                color: "var(--lt)", lineHeight: 1, letterSpacing: "-0.01em",
              }}>
                €{item?.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ on, menuOpen, setMenuOpen, dark, setDark }) {
  const scrollTo = (id) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Skip to main content — screen reader / keyboard shortcut */}
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className={`hdr ${on}`} role="banner">
        <div className="fc" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.05em", userSelect: "none" }}
          aria-label="Silt Coffee home">
          SILT<span style={{ color: "var(--acc)", marginLeft: 1 }} aria-hidden="true">.</span>
        </div>

        <nav className="desk-nav" style={{ display: "flex", alignItems: "center", gap: 40 }}
          aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="nav-lnk"
              onClick={e => { e.preventDefault(); scrollTo(href); }}>
              {label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(v => !v)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
            style={{
              background: "none", border: "1px solid var(--bdr-l)", cursor: "pointer",
              width: 34, height: 34, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, color: "var(--ink)", transition: "background 180ms, border-color 180ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bdr-l)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
          </button>

          {/* Hamburger — mobile only */}
          <button className="mob-only"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            style={{ background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
            <span className={`hbr t ${menuOpen ? "open" : ""}`} aria-hidden="true" />
            <span className={`hbr m ${menuOpen ? "open" : ""}`} aria-hidden="true" />
            <span className={`hbr b ${menuOpen ? "open" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div id="mobile-nav" className={`ov ${menuOpen ? "open" : ""}`}
        role="dialog" aria-modal="true" aria-label="Navigation menu"
        aria-hidden={!menuOpen}>
        <button onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
          style={{ position: "absolute", top: 16, right: "clamp(20px,5vw,64px)",
            background: "none", border: "1px solid var(--sol-d)", cursor: "pointer",
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--lt)", fontSize: 14, fontFamily: "inherit" }}>
          <span aria-hidden="true">✕</span>
        </button>
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="ov-lnk"
              onClick={e => { e.preventDefault(); setMenuOpen(false); scrollTo(href); }}>
              {label}
            </a>
          ))}
        </nav>
        <p className="fm" style={{ fontSize: 10, color: "var(--ltd)", marginTop: 40, letterSpacing: "0.12em" }}>
          © 2026 SILT COFFEE
        </p>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ on }) {
  const scrollToMenu = () =>
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" style={{ paddingTop: 56, background: "var(--p)" }}>
      <div style={{ height: "1.5px", background: "var(--ink)" }} />
      <div style={{ position: "relative", minHeight: "calc(100vh - 57px)" }}>
        <div style={{ padding: "clamp(40px,7vw,96px) clamp(20px,6vw,80px)", paddingBottom: "clamp(80px,10vw,120px)" }}>
          <div className={`h-rise d1 ${on}`}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(32px,5vw,56px)" }}>
            <span className="fm" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--td)", whiteSpace: "nowrap" }}>
              00 — SILT COFFEE BERLIN
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--bdr-l)" }} />
          </div>
          <div className={`h-clip ${on}`} style={{ marginBottom: "clamp(28px,4.5vw,52px)" }}>
            <h1 className="fc" style={{
              fontSize: "clamp(72px,15vw,210px)", fontWeight: 900, lineHeight: 0.87,
              letterSpacing: "-0.01em", textTransform: "uppercase", color: "var(--ink)",
            }}>
              NOT<br />
              <span style={{ color: "var(--acc)" }}>JUST</span><br />
              COFFEE.
            </h1>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end",
            gap: "clamp(24px,4vw,56px)", maxWidth: 720 }}>
            <p className={`fg h-rise d2 ${on}`}
              style={{ color: "var(--tb)", fontSize: 16, lineHeight: 1.75,
                maxWidth: 340, flex: "1 1 220px" }}>
              Single-origin. Small-batch roasted in-house.
              Obsessively sourced from farms we actually visit.
            </p>
            <div className={`h-rise d3 ${on}`}>
              <button className="cta-l" onClick={scrollToMenu}>
                <span>View the Menu</span>
              </button>
            </div>
          </div>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: "1.5px solid var(--ink)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px clamp(20px,6vw,80px)",
        }}>
          <span className="fm" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--td)" }}>EST. 2019</span>
          <span className="fm" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--td)" }}>WESERSTRASSE 40, BERLIN</span>
        </div>
      </div>
    </section>
  );
}

// ─── Parallax Strip ───────────────────────────────────────────────────────────

function ParallaxStrip() {
  const ref = useRef(null);
  const innerRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; const inner = innerRef.current;
      if (!el || !inner) return;
      const rect = el.getBoundingClientRect();
      const progress = (rect.top - window.innerHeight) / (rect.height + window.innerHeight);
      inner.style.transform = `translateY(${progress * 18}%)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="parallax-strip">
      <div ref={innerRef} className="parallax-inner" />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom,rgba(27,23,18,0.38) 0%,rgba(27,23,18,0.18) 50%,rgba(27,23,18,0.55) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "flex-end",
        padding: "clamp(24px,4vw,52px) clamp(20px,6vw,80px)",
        borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <p className="fm" style={{
            fontSize: "clamp(11px,1.4vw,14px)", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(232,225,212,0.7)", maxWidth: 340, lineHeight: 1.7,
          }}>
            Every cup starts here — the Loring S15 Falcon,<br />roasted at dawn before the doors open.
          </p>
          <span className="fm" style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(232,225,212,0.45)", textTransform: "uppercase" }}>
            Berlin, 2024
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Concept Section ─────────────────────────────────────────────────────────

function ConceptSection({ carIdx, setCarIdx }) {
  const [ref, vis] = useInView();
  const iv = vis ? "in" : "";
  const BKGS = [
    "linear-gradient(150deg,#3A2010 0%,#1E1208 100%)",
    "linear-gradient(150deg,#221D18 0%,#141110 100%)",
    "linear-gradient(150deg,#2E1E08 0%,#1A1006 100%)",
  ];

  return (
    <section id="concept" ref={ref} style={{ background: "var(--p)" }}>
      <div style={{ height: "1.5px", background: "var(--ink)" }} />
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "17px clamp(20px,6vw,80px)", borderBottom: "1px solid var(--bdr-l)",
      }}>
        <span className="fm" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--td)" }}>01 — THE CONCEPT</span>
        <span className="fc" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "var(--td)" }}>ROASTERY / CAFÉ</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div style={{ padding: "clamp(40px,6vw,80px) clamp(20px,5vw,64px)", borderRight: "1px solid var(--bdr-l)" }}>
          <div className={`rv ${iv}`}>
            <h2 className="fc" style={{
              fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 700, lineHeight: 0.94,
              textTransform: "uppercase", letterSpacing: "0.01em", color: "var(--ink)", marginBottom: 32,
            }}>
              ROASTED<br />TWO HOURS<br />BEFORE<br /><span style={{ color: "var(--acc)" }}>YOU ARRIVE.</span>
            </h2>
          </div>
          <div className={`rv d1 ${iv}`}>
            <p className="fg" style={{ color: "var(--tb)", fontSize: 15, lineHeight: 1.82, marginBottom: 18 }}>
              We source directly from three farms across Ethiopia, Colombia, and Kenya.
              Every batch is roasted on-site in our 5kg Loring, dialled to a light-to-medium
              profile that preserves the terroir — not masking it with heat.
            </p>
            <p className="fg" style={{ color: "var(--tb)", fontSize: 15, lineHeight: 1.82 }}>
              The result is coffee that tastes like somewhere.
              Not a standardised profile — a place, a season, a decision.
            </p>
          </div>
        </div>

        <div style={{ padding: "clamp(40px,6vw,80px) clamp(20px,5vw,64px)" }}>
          <div className={`rv d2 ${iv}`}>
            <div style={{ overflow: "hidden", marginBottom: 12 }}>
              <div style={{
                display: "flex",
                transform: `translateX(-${carIdx * 100}%)`,
                transition: "transform 400ms cubic-bezier(0.76,0,0.24,1)",
              }}>
                {CAROUSEL_ITEMS.map((item, i) => (
                  <div key={i} style={{
                    flex: "0 0 100%", height: 280,
                    background: `url(${item.photo}) center/cover no-repeat`, position: "relative", overflow: "hidden",
                    display: "flex", alignItems: "flex-end", padding: "18px 22px",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: [
                        "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(232,225,212,0.04) 40px)",
                        "repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(232,225,212,0.04) 40px)",
                      ].join(","),
                    }} />
                    <span className="fc" style={{
                      position: "absolute", top: 14, right: 20, fontSize: 96, fontWeight: 900,
                      lineHeight: 1, color: "rgba(232,225,212,0.055)", letterSpacing: "-0.02em",
                    }}>{item.num}</span>
                    <span className="fm" style={{
                      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "rgba(232,225,212,0.42)", position: "relative", zIndex: 1,
                    }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: "1px solid var(--bdr-l)", paddingTop: 12,
            }}>
              <div style={{ display: "flex" }}>
                {[{ sym: "←", d: -1, label: "Previous image" }, { sym: "→", d: 1, label: "Next image" }].map(({ sym, d, label }, di) => (
                  <button key={sym}
                    aria-label={label}
                    onClick={() => setCarIdx(p => (p + d + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)}
                    style={{
                      background: "none", border: "1px solid var(--sol-l)",
                      borderRight: di === 0 ? "none" : "1px solid var(--sol-l)",
                      cursor: "pointer", width: 38, height: 34,
                      fontSize: 13, color: "var(--ink)", fontFamily: "inherit",
                      transition: "background 180ms,color 180ms",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--p)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--ink)"; }}>
                    {sym}
                  </button>
                ))}
              </div>
              <span className="fm" style={{ fontSize: 10, color: "var(--td)", letterSpacing: "0.1em" }}>
                0{carIdx + 1} / 0{CAROUSEL_ITEMS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ─────────────────────────────────────────────────────────

function GallerySection({ onPhotoClick }) {
  const [ref, vis] = useInView(0.05);
  const trackRef = useRef(null);

  return (
    <section style={{ background: "var(--p)", borderTop: "1.5px solid var(--ink)" }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "17px clamp(20px,6vw,80px)", borderBottom: "1px solid var(--bdr-l)",
      }}>
        <span className="fm" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--td)" }}>
          GALLERY — SPACE &amp; CRAFT
        </span>
        <span className="fm" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--td)" }}>
          ← SCROLL →
        </span>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={ref}
        style={{
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(24px)",
          transition: "opacity 700ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div ref={trackRef} className="gallery-track"
          style={{ padding: "2px clamp(20px,6vw,80px) 0" }}>
          {GALLERY.map((item, i) => (
            <div
              key={i}
              className="gallery-item"
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${item.caption}`}
              onClick={() => onPhotoClick(item)}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && onPhotoClick(item)}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <img src={item.src} alt={item.caption} className="gallery-img" loading="lazy" />
              <div className="gallery-cap">
                <span className="fm" style={{
                  fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "rgba(232,225,212,0.7)",
                }}>{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Lightbox ────────────────────────────────────────────────────────

function GalleryLightbox({ item, onClose }) {
  const isOpen = !!item;

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: isOpen ? "rgba(27,23,18,0.92)" : "rgba(27,23,18,0)",
        backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: isOpen ? "all" : "none",
        transition: "background 300ms ease, backdrop-filter 300ms ease",
      }}
    >
      <div style={{
        position: "relative",
        maxWidth: "min(90vw, 1100px)", maxHeight: "88vh",
        transform: isOpen ? "scale(1)" : "scale(0.94)",
        opacity: isOpen ? 1 : 0,
        transition: "transform 380ms cubic-bezier(0.22,1,0.36,1), opacity 280ms ease",
      }}>
        {item && (
          <img
            src={item.src.replace("w=1000", "w=1600")}
            alt={item.caption}
            style={{ maxWidth: "100%", maxHeight: "88vh", display: "block", objectFit: "contain" }}
          />
        )}
        {/* Caption bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(27,23,18,0.72)",
          padding: "12px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span className="fm" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ltm)" }}>
            {item?.caption}
          </span>
          <button onClick={onClose}
            style={{
              background: "none", border: "1px solid var(--bdr-d)", color: "var(--ltm)",
              cursor: "pointer", width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontFamily: "inherit", transition: "color 180ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--lt)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ltm)")}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Menu Section ────────────────────────────────────────────────────────────

function MenuSection({ activeTab, switchTab, tabOut, onItemClick }) {
  const [ref, vis] = useInView();
  const iv = vis ? "in" : "";
  const TABS = { espresso: "Espresso", pourover: "Pour Over", pastries: "Pastries" };

  return (
    <section id="menu" ref={ref} style={{ background: "var(--bg-dark)" }}>
      <div style={{ height: "1.5px", background: "var(--acc)" }} />
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "17px clamp(20px,6vw,80px)", borderBottom: "1px solid var(--bdr-d)",
      }}>
        <span className="fm" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ltd)" }}>02 — THE MENU</span>
        <span className="fm" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--ltd)" }}>TAP ITEM FOR PHOTO</span>
      </div>

      <div className={`rv ${iv}`}
        style={{ padding: "clamp(40px,6vw,72px) clamp(20px,6vw,80px) 0" }}>
        <h2 className="fc" style={{
          fontSize: "clamp(52px,10vw,140px)", fontWeight: 700,
          lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.01em", color: "var(--lt)",
        }}>
          WHAT WE'RE<br /><span style={{ color: "var(--acc)" }}>BREWING.</span>
        </h2>
      </div>

      {/* Sticky tab bar */}
      <div style={{
        position: "sticky", top: 56, zIndex: 50,
        background: "var(--bg-dark)",
        borderTop: "1px solid var(--bdr-d)", borderBottom: "1px solid var(--bdr-d)",
        overflowX: "auto", marginTop: "clamp(32px,5vw,56px)",
      }}>
        <div style={{ display: "flex", minWidth: "max-content" }} role="tablist" aria-label="Menu categories">
          {Object.entries(TABS).map(([id, label]) => (
            <button key={id}
              className={`tab ${activeTab === id ? "on" : ""}`}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`tabpanel-${id}`}
              id={`tab-${id}`}
              onClick={() => switchTab(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className={`tp ${tabOut ? "out" : ""}`}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        aria-live="polite"
        style={{ padding: "0 clamp(20px,6vw,80px) clamp(60px,8vw,100px)" }}>
        {MENU[activeTab].map((item, i) => (
          <div
            key={`${activeTab}-${i}`}
            className={`mi ${iv}`}
            style={{ transitionDelay: `${i * 55}ms` }}
            role="button"
            tabIndex={0}
            aria-label={`${item.name} — €${item.price}. ${item.notes}. Press to view photo.`}
            onClick={() => onItemClick({ ...item, tab: activeTab })}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && onItemClick({ ...item, tab: activeTab })}
          >
            <div className="mi-inner">
              <div style={{ flex: 1 }}>
                <span className="fg" style={{ fontSize: 16, fontWeight: 500, color: "var(--lt)" }}>
                  {item.name}
                </span>
                <p className="fg" style={{ fontSize: 13, color: "var(--ltd)", marginTop: 4 }}>
                  {item.notes}
                </p>
              </div>
              <span className="fm" style={{ fontSize: 13, color: "var(--ltm)", flexShrink: 0, alignSelf: "center" }}>
                €{item.price}
              </span>
              <span className="mi-hint">View →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const [hdRef, hdVis] = useInView(0.18);
  const [colRef, colVis] = useInView(0.2);
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  const handleSub = () => { if (email.trim()) { setSubDone(true); setEmail(""); } };
  const CHARS = "DROP BY.".split("");

  return (
    <footer id="visit" style={{ background: "var(--bg-dark)" }}>
      <div style={{ height: "1.5px", background: "var(--p3)" }} />
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "17px clamp(20px,6vw,80px)", borderBottom: "1px solid var(--bdr-d)",
      }}>
        <span className="fm" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ltd)" }}>03 — VISIT US</span>
      </div>

      <div ref={hdRef} style={{ padding: "clamp(40px,6vw,80px) clamp(20px,6vw,80px)", borderBottom: "1px solid var(--bdr-d)" }}>
        <h2 className="fc" style={{
          fontSize: "clamp(60px,14vw,190px)", fontWeight: 700,
          lineHeight: 0.88, textTransform: "uppercase", letterSpacing: "-0.01em", color: "var(--lt)",
        }}>
          {CHARS.map((ch, i) => (
            <span key={i} className={`ch ${hdVis ? "in" : ""}`} style={{ transitionDelay: `${i * 28}ms` }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h2>
      </div>

      <div className="map-wrap" style={{ borderBottom: "1px solid var(--bdr-d)" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2429.5!2d13.4423!3d52.4867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84fb0a6c3f5ad%3A0x42a34e8e5bba4bdc!2sWeserstra%C3%9Fe+40%2C+12045+Berlin!5e0!3m2!1sen!2sde!4v1700000000000!5m2!1sen!2sde"
          allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="Silt Coffee location"
        />
        <div className="map-frame" style={{ borderColor: "var(--bdr-d)" }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          background: "var(--bg-dark)", padding: "11px 18px",
          borderTop: "1px solid var(--bdr-d)", borderRight: "1px solid var(--bdr-d)",
        }}>
          <span className="fm" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--ltm)" }}>
            WESERSTRASSE 40 · 12045 BERLIN
          </span>
        </div>
      </div>

      <div ref={colRef} style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        opacity: colVis ? 1 : 0, transform: colVis ? "none" : "translateY(24px)",
        transition: "opacity 500ms ease 200ms, transform 500ms ease 200ms",
      }}>
        <div style={{ padding: "clamp(28px,4vw,48px) clamp(20px,4vw,48px)", borderRight: "1px solid var(--bdr-d)" }}>
          <p className="fm" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--acc)", marginBottom: 16 }}>Location</p>
          <p className="fm" style={{ fontSize: 13, color: "var(--ltm)", lineHeight: 1.9 }}>
            Silt Coffee<br />Weserstraße 40<br />12045 Berlin, DE
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 22 }}>
            {["Instagram", "Contact"].map(lbl => (
              <a key={lbl} href="#"
                style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                  color: "var(--ltm)", transition: "color 180ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--acc)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--ltm)")}>
                {lbl}
              </a>
            ))}
          </div>
        </div>

        <div style={{ padding: "clamp(28px,4vw,48px) clamp(20px,4vw,48px)", borderRight: "1px solid var(--bdr-d)" }}>
          <p className="fm" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--acc)", marginBottom: 16 }}>Hours</p>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {[["Mon – Fri","07:30 – 18:00"],["Saturday","08:00 – 17:00"],["Sunday","09:00 – 15:00"]].map(([d,h]) => (
                <tr key={d}>
                  <td className="fm" style={{ fontSize: 12, color: "var(--ltm)", paddingRight: 24, paddingBottom: 8 }}>{d}</td>
                  <td className="fm" style={{ fontSize: 12, color: "var(--lt)", paddingBottom: 8 }}>{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "clamp(28px,4vw,48px) clamp(20px,4vw,48px)" }}>
          <p className="fm" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--acc)", marginBottom: 16 }}>Stay in the loop</p>
          {subDone ? (
            <p className="fg" style={{ fontSize: 14, color: "var(--lt)" }}>✓ You're on the list.</p>
          ) : (
            <>
              <p className="fg" style={{ fontSize: 13, color: "var(--ltm)", marginBottom: 20, lineHeight: 1.65 }}>
                New roasts, menu changes, occasional thoughts on coffee.
              </p>
              <input type="email" className="nl-in" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSub()} />
              <button onClick={handleSub}
                style={{ background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--ltm)", padding: "10px 0", display: "block", transition: "color 180ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--acc)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--ltm)")}>
                Subscribe →
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{
        borderTop: "1px solid var(--bdr-d)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px clamp(20px,6vw,80px)",
      }}>
        <span className="fc" style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.04em", color: "var(--lt)" }}>
          SILT<span style={{ color: "var(--acc)" }}>.</span>
        </span>
        <span className="fm" style={{ fontSize: 10, color: "var(--ltd)", letterSpacing: "0.1em" }}>
          © 2026 SILT COFFEE BERLIN
        </span>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function CafeSite() {
  const [loaded,      setLoaded]      = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeTab,   setActiveTab]   = useState("espresso");
  const [tabOut,      setTabOut]      = useState(false);
  const [carIdx,      setCarIdx]      = useState(0);
  const [modalItem,   setModalItem]   = useState(null);
  const [galleryItem, setGalleryItem] = useState(null);
  const [dark,        setDark]        = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  // Persist dark mode preference
  useEffect(() => {
    document.documentElement.setAttribute("data-dark", dark);
    localStorage.setItem("silt-dark", dark);
  }, [dark]);

  // Restore preference on load
  useEffect(() => {
    const saved = localStorage.getItem("silt-dark");
    if (saved !== null) setDark(saved === "true");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const switchTab = (id) => {
    if (id === activeTab) return;
    setTabOut(true);
    setTimeout(() => { setActiveTab(id); setTabOut(false); }, 130);
  };

  const closeModal   = useCallback(() => setModalItem(null),   []);
  const closeGallery = useCallback(() => setGalleryItem(null), []);

  const on = loaded ? "on" : "";

  return (
    <div data-dark={dark} style={{ background: "var(--p)", color: "var(--ink)", minHeight: "100vh" }}>
      <StyleInjector />
      <div className="grain" aria-hidden="true" />

      <Header on={on} menuOpen={menuOpen} setMenuOpen={setMenuOpen} dark={dark} setDark={setDark} />

      <main id="main-content">
        <Hero on={on} />
        <ParallaxStrip />
        <ConceptSection carIdx={carIdx} setCarIdx={setCarIdx} />
        <GallerySection onPhotoClick={setGalleryItem} />
        <MenuSection
          activeTab={activeTab}
          switchTab={switchTab}
          tabOut={tabOut}
          onItemClick={setModalItem}
        />
        <Footer />
      </main>

      {/* Menu item photo modal — slides in from right */}
      <PhotoModal item={modalItem} onClose={closeModal} />

      {/* Gallery lightbox — full-screen */}
      <GalleryLightbox item={galleryItem} onClose={closeGallery} />
    </div>
  );
}
