// HERBACZAR — section components (Part 1: Header / Hero / Marquee / Emotion / Experience / Segments / How)
const { useState, useEffect, useRef } = React;

// Placeholder visual — used wherever a real video/photo isn't available
function Placeholder({ label, file, dark, ratio, style, src, alt }) {
  if (src) {
    return (
      <div className={`placeholder filled${dark ? ' dark' : ''}`} style={style}>
        <img src={src} alt={alt || label || ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return (
    <div className={`placeholder${dark ? ' dark' : ''}`} style={style}>
      <div className="pl-corner tl"></div>
      <div className="pl-corner tr"></div>
      <div className="pl-corner bl"></div>
      <div className="pl-corner br"></div>
      <div className="pl-meta">
        <span>{label}</span>
        {ratio ? <span>{ratio}</span> : null}
      </div>
      {file ? <div className="pl-label-main">{file}</div> : null}
      <div className="pl-meta">
        <span>Awaiting upload</span>
        <span>HERBACZAR · {dark ? 'V' : 'IMG'}</span>
      </div>
    </div>
  );
}

function VideoPlaceholder({ title, duration, file, src }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!src || !ref.current) return;
    const v = ref.current;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.volume = 0;
    const tryPlay = () => v.play().catch(() => {});
    v.addEventListener('loadeddata', tryPlay);
    tryPlay();
    return () => v.removeEventListener('loadeddata', tryPlay);
  }, [src]);
  if (src) {
    return (
      <>
        <video
          ref={ref}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 55%, rgba(26,14,8,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="pl-label" style={{ color: 'rgba(245,239,230,0.85)' }}>
          <span>{title}</span>
        </div>
      </>
    );
  }
  return (
    <div className="pl-bg">
      <div className="play-btn">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7L8 5z"/></svg>
      </div>
      <div className="pl-label">
        <span>{title}</span>
      </div>
    </div>
  );
}

// ──────────────── HEADER ────────────────
function Header({ t, lang, setLang, transparent, openForm }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClick = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView ? window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }) : null;
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : transparent ? 'transparent' : ''}`}>
        <div className="container header-inner">
          <a href="#top" className="logo" onClick={linkClick('top')}>
            <div className="logo-mark">H</div>
            <div>
              <div className="logo-wordmark">HERBACZAR</div>
              <div className="logo-sub">Tea Ritual · Est. Poland</div>
            </div>
          </a>
          <nav className="nav-primary">
            <a href="#experience" className="nav-link" onClick={linkClick('experience')}>{t.nav.experience}</a>
            <a href="#faq" className="nav-link" onClick={linkClick('faq')}>{t.nav.faq}</a>
          </nav>
          <div className="header-actions">
            <div className="lang-switch" role="group" aria-label="Language">
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >EN</button>
              <div className="lang-divider"></div>
              <button
                className={lang === 'pl' ? 'active' : ''}
                onClick={() => setLang('pl')}
              >PL</button>
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: '12px 22px', fontSize: 12 }}
              onClick={() => openForm('sample')}
            >
              {t.nav.sample}
            </button>
            <button
              className={`menu-btn ${open ? 'open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <div className="lines">
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        <a href="#experience" onClick={linkClick('experience')}>{t.nav.experience}</a>
        <a href="#faq" onClick={linkClick('faq')}>{t.nav.faq}</a>
        <button
          className="btn btn-primary"
          style={{ marginTop: 24, background: '#F5EFE6', color: '#251610' }}
          onClick={() => { setOpen(false); openForm('sample'); }}
        >{t.nav.sample}</button>
      </div>
    </>
  );
}

// ──────────────── HERO ────────────────
function Hero({ t, openForm }) {
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="hero-media">
        <img
          src="images/hero-bg.png"
          alt="Glass teapot, blue tea sphere dessert and a cup of tea in warm morning light"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="container hero-content">
        <div className="hero-main">
          <div className="hero-eyebrow">
            <span className="dot"></span>
            <span>{t.hero.eyebrow}</span>
          </div>
          <h1>
            {t.hero.h1_a} <em>{t.hero.h1_b}</em> {t.hero.h1_c}
          </h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => openForm('sample')}>
              {t.hero.cta_primary} <span className="btn-arrow"></span>
            </button>
            <button className="btn btn-secondary on-dark" onClick={() => {
              const el = document.getElementById('collection');
              if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
            }}>
              <span>{t.hero.cta_secondary}</span>
            </button>
          </div>
          <div className="hero-trust">
            {t.hero.trust.map((label, i) => <span key={i}>{label}</span>)}
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <span>{t.hero.scroll}</span>
        <div className="line-v"></div>
      </div>
    </section>
  );
}

// ──────────────── MARQUEE ────────────────
function Marquee({ t }) {
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((label, i) => (
          <span className="marquee-item" key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}

// ──────────────── SPEC BAND ────────────────
function SpecIcon({ kind }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "volume") {
    return (
      <svg viewBox="0 0 64 64" width="60" height="60" {...common} aria-hidden="true">
        <path d="M20 24h20a10 10 0 0 1 0 20H20a4 4 0 0 1-4-4V28a4 4 0 0 1 4-4Z" />
        <path d="M44 28h4a5 5 0 0 1 0 10h-4" />
        <path d="M24 16c0 3-3 3-3 6M32 16c0 3-3 3-3 6" />
        <path d="M16 50h28" opacity="0.5" />
      </svg>
    );
  }
  if (kind === "sugar") {
    return (
      <svg viewBox="0 0 64 64" width="60" height="60" {...common} aria-hidden="true">
        <path d="M22 26 32 20l10 6v12l-10 6-10-6V26Z" />
        <path d="M22 26l10 6 10-6M32 32v12" opacity="0.55" />
        <circle cx="32" cy="32" r="22" opacity="0.9" />
        <path d="M17 17 47 47" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width="60" height="60" {...common} aria-hidden="true">
      <rect x="14" y="24" width="36" height="24" rx="4" />
      <path d="M24 24l3-5h10l3 5" />
      <circle cx="32" cy="36" r="7" />
      <path d="M32 8v6M32 8l-2.5 2M32 8l2.5 2" opacity="0.85" />
      <path d="M48 12l-1.5 4M48 12l2 1M48 12l-1 2.5" opacity="0.7" />
    </svg>
  );
}

function SpecBand({ t }) {
  const s = t.specband;
  const icons = ["volume", "sugar", "wow"];
  return (
    <section className="specband" id="essence" data-screen-label="Essence">
      <div className="container">
        <div className="specband-head">
          <span className="eyebrow">{s.eyebrow}</span>
          <h2 className="h-serif">
            {s.title_a} <em style={{ fontStyle: "italic", color: "var(--caramel)" }}>{s.title_b}</em>
          </h2>
        </div>
        <div className="specband-grid">
          {s.items.map((it, i) => (
            <div className="specband-item" key={i}>
              <div className="specband-illus"><SpecIcon kind={icons[i]} /></div>
              <div className="specband-num">
                {it.num}<span className="unit">{it.unit}</span>
              </div>
              <p className="specband-label">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── EMOTION ────────────────
function Emotion({ t }) {
  return (
    <section className="emotion section-pad" id="emotion" data-screen-label="02 Emotion">
      <div className="container">
        <div className="emotion-inner">
          <div className="emotion-text">
            <span className="eyebrow">{t.emotion.eyebrow}</span>
            <h2>
              {t.emotion.h2_a} <em>{t.emotion.h2_b}</em>
            </h2>
            <p className="body-lg">{t.emotion.p1}</p>
            <p className="body-lg">{t.emotion.p2}</p>
            <div className="pull">{t.emotion.pull}</div>
          </div>
          <div className="emotion-visual">
            <Placeholder
              src="images/emotion-hero.png"
              alt="Couple by candlelight behind a glass teapot with a heart-shaped HERBACZAR tea sphere"
              ratio="4:5"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────── PRODUCT EXPERIENCE ────────────────
function Experience({ t }) {
  return (
    <section className="experience" id="experience" data-screen-label="03 Experience">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t.exp.eyebrow}</span>
          <h2 className="h-serif">
            {t.exp.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.exp.h2_b}</em>
          </h2>
          <p className="body-lg">{t.exp.sub}</p>
        </div>
        <div className="exp-grid">
          {t.exp.cards.map((c, i) => (
            <div className="exp-card" key={i}>
              <div className="exp-num">{c.num}</div>
              <div>
                <h3 className="exp-card-title">{c.title}</h3>
                <div className="exp-card-sub">{c.sub}</div>
                <p className="exp-card-body">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── B2B SEGMENTS ────────────────
function Segments({ t, openForm }) {
  return (
    <section className="segments" id="segments" data-screen-label="04 Segments">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t.segments.eyebrow}</span>
          <h2 className="h-serif">
            {t.segments.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.segments.h2_b}</em>
          </h2>
          <p className="body-lg">{t.segments.sub}</p>
        </div>
        <div className="seg-grid">
          {t.segments.items.map((s, i) => (
            <div className={`seg-card ${s.feature ? 'feature' : ''}`} key={i}>
              <div className="seg-image">
                <span className="seg-num">— 0{i + 1}</span>
                <Placeholder
                  dark
                  label={s.title.toUpperCase() + ' · LIFESTYLE'}
                  file={`Upload ${s.title} Lifestyle Photo`}
                  ratio={s.feature ? '16:10' : '4:3'}
                />
              </div>
              <div className="seg-body">
                <div className="seg-tag">{s.tag}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <button className="seg-cta" onClick={() => openForm('sample', s.title)}>
                  {t.segments.cta_card} <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── HOW IT WORKS ────────────────
function How({ t }) {
  return (
    <section className="how" id="how" data-screen-label="05 How it Works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow-light">{t.how.eyebrow}</span>
          <h2>
            {t.how.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--caramel)' }}>{t.how.h2_b}</em>
          </h2>
          <p>{t.how.sub}</p>
        </div>
        <div className="how-steps">
          {t.how.steps.map((s, i) => (
            <div className="how-step" key={i}>
              <div className="step-circle">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  Placeholder, VideoPlaceholder, Header, Hero, Marquee, SpecBand, Emotion, Experience, Segments, How
});
