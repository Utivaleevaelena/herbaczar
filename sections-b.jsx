// HERBACZAR — section components (Part 2: Video / Private Label / Benefits / Lead Form / FAQ / Final CTA / Footer / Sticky CTA)

// ──────────────── VIDEO EXPERIENCE ────────────────
function VideoExperience({ t }) {
  const srcs = [
    'videos/jak-dziala-bombka.mp4',
    'videos/herbaczar-tworzenie.mp4',
    'videos/herbaczar-hero.mp4',
    'videos/herbaczar-macro.mp4',
  ];
  const trackRef = useRef(null);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.video-slide');
    const amount = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section className="video-exp" id="video" data-screen-label="06 Video">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t.video.eyebrow}</span>
          <h2 className="h-serif">
            {t.video.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.video.h2_b}</em>
          </h2>
          <p className="body-lg">{t.video.sub}</p>
        </div>
      </div>
      <div className="video-carousel">
        <button
          className="carousel-arrow prev"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="video-track" ref={trackRef}>
          {t.video.tiles.map((v, i) => (
            <div className="video-slide" key={i}>
              <VideoPlaceholder title={v.title} file={v.file} duration={v.duration} src={srcs[i]} />
            </div>
          ))}
        </div>
        <button
          className="carousel-arrow next"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  );
}

// ──────────────── PRIVATE LABEL ────────────────
function PrivateLabel({ t }) {
  const data = t.pl;
  return (
    <section className="private-label" id="private-label" data-screen-label="07 Private Label">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="h-serif">
            {data.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{data.h2_b}</em>
          </h2>
          <p className="body-lg">{data.sub}</p>
        </div>
        <div className="pl-grid">
          {data.items.map((item, i) => (
            <div className={`pl-card ${item.size}`} key={i}>
              <div className="pl-image">
                <Placeholder
                  label={item.tag.toUpperCase()}
                  file={`Upload ${item.title} mockup`}
                  ratio="4:3"
                />
              </div>
              <div className="pl-body">
                <div className="pl-tag">{item.tag}</div>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── BENEFITS ────────────────
function Benefits({ t }) {
  return (
    <section className="benefits" id="benefits" data-screen-label="08 Benefits">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t.benefits.eyebrow}</span>
          <h2 className="h-serif">
            {t.benefits.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.benefits.h2_b}</em>
          </h2>
        </div>
        <div className="ben-grid">
          {t.benefits.items.map((b, i) => (
            <div className="ben-item" key={i}>
              <div className="ben-num">— {b.n}</div>
              <h4>{b.title}</h4>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── LEAD FORM ────────────────
function LeadForm({ t, formState, setFormState, intent, setIntent }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const f = t.lead.fields;

  const onChange = (key) => (e) => {
    setFormState({ ...formState, [key]: e.target.value });
  };

  const buildPayload = () => ({
    _subject: `HERBACZAR — nowe zgłoszenie B2B (${intent === 'presentation' ? 'Prezentacja' : 'Próbka'})`,
    'Cel kontaktu': intent === 'presentation' ? (f.intent_presentation || 'Presentation') : (f.intent_sample || 'Sample'),
    'Imię i nazwisko': formState.name || '',
    'Firma': formState.company || '',
    'Rodzaj działalności': formState.type || '',
    'Kraj / Miasto': formState.location || '',
    'Email': formState.email || '',
    'Telefon': formState.phone || '',
    'Strona / Instagram': formState.web || '',
    'Szacowany wolumen': formState.volume || '',
    'Wiadomość': formState.message || '',
  });

  const mailtoFallback = (data) => {
    const body = Object.entries(data)
      .filter(([k]) => k !== '_subject')
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const href = `mailto:herbaczar8@gmail.com?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const data = buildPayload();
    setSending(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/herbaczar8@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('bad status');
      setSubmitted(true);
    } catch (err) {
      // No backend reachable (e.g. preview sandbox) — hand off to the mail client
      mailtoFallback(data);
      setSubmitted(true);
    } finally {
      setSending(false);
      const el = document.getElementById('lead');
      if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <section className="lead" id="lead" data-screen-label="09 Lead Form">
      <div className="container">
        <div className="lead-inner">
          <div className="lead-text">
            <span className="eyebrow">{t.lead.eyebrow}</span>
            <h2>
              {t.lead.h2_a} <em>{t.lead.h2_b}</em>
            </h2>
            <p>{t.lead.p}</p>
            <ul className="lead-bullets">
              {t.lead.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="lead-contact">
              <div className="row">
                <span className="lbl">{t.lead.contact_email}</span>
                <a href="mailto:herbaczar8@gmail.com">herbaczar8@gmail.com</a>
              </div>
              <div className="row">
                <span className="lbl">{t.lead.contact_phone}</span>
                <a href="tel:+48737532208">+48 737 532 208</a>
              </div>
              <div className="row">
                <span className="lbl">{t.lead.contact_ig}</span>
                <a href="https://www.instagram.com/herbaczar" target="_blank" rel="noreferrer">@Herbaczar</a>
              </div>
            </div>
          </div>

          <div className="lead-form">
            {submitted ? (
              <div className="form-success">
                <h3>{t.lead.success_h}</h3>
                <p>{t.lead.success_p}</p>
                <button
                  className="btn btn-secondary on-dark"
                  style={{ marginTop: 28 }}
                  onClick={() => setSubmitted(false)}
                >
                  <span>← Edit my request</span>
                </button>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submit}>
                <div className="form-field full">
                  <label>{f.intent}</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setIntent('sample')}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '12px 18px',
                        fontSize: 11,
                        background: intent === 'sample' ? 'var(--caramel)' : 'transparent',
                        color: intent === 'sample' ? 'var(--chocolate)' : 'rgba(245,239,230,0.8)',
                        border: intent === 'sample' ? '1px solid var(--caramel)' : '1px solid rgba(245,239,230,0.22)'
                      }}
                    >{f.intent_sample}</button>
                    <button
                      type="button"
                      onClick={() => setIntent('presentation')}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '12px 18px',
                        fontSize: 11,
                        background: intent === 'presentation' ? 'var(--caramel)' : 'transparent',
                        color: intent === 'presentation' ? 'var(--chocolate)' : 'rgba(245,239,230,0.8)',
                        border: intent === 'presentation' ? '1px solid var(--caramel)' : '1px solid rgba(245,239,230,0.22)'
                      }}
                    >{f.intent_presentation}</button>
                  </div>
                </div>

                <div className="form-field">
                  <label>{f.name} <span className="req">*</span></label>
                  <input required value={formState.name || ''} onChange={onChange('name')} />
                </div>
                <div className="form-field">
                  <label>{f.company}</label>
                  <input value={formState.company || ''} onChange={onChange('company')} />
                </div>

                <div className="form-field">
                  <label>{f.type} <span className="req">*</span></label>
                  <select required value={formState.type || ''} onChange={onChange('type')}>
                    <option value="">—</option>
                    {f.type_options.map((o, i) => <option key={i} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>{f.location}</label>
                  <input placeholder="Warszawa, PL" value={formState.location || ''} onChange={onChange('location')} />
                </div>

                <div className="form-field">
                  <label>{f.email} <span className="req">*</span></label>
                  <input required type="email" value={formState.email || ''} onChange={onChange('email')} />
                </div>
                <div className="form-field">
                  <label>{f.phone}</label>
                  <input placeholder="+48 ..." value={formState.phone || ''} onChange={onChange('phone')} />
                </div>

                <div className="form-field">
                  <label>{f.web}</label>
                  <input placeholder="www. / @" value={formState.web || ''} onChange={onChange('web')} />
                </div>
                <div className="form-field">
                  <label>{f.volume}</label>
                  <select value={formState.volume || ''} onChange={onChange('volume')}>
                    <option value="">—</option>
                    {f.volume_options.map((o, i) => <option key={i} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="form-field full">
                  <label>{f.message}</label>
                  <textarea
                    placeholder={f.message_ph}
                    value={formState.message || ''}
                    onChange={onChange('message')}
                  />
                </div>

                <label className="form-consent">
                  <input
                    type="checkbox"
                    required
                    checked={!!formState.consent}
                    onChange={(e) => setFormState({ ...formState, consent: e.target.checked })}
                  />
                  <span>{f.consent}</span>
                </label>

                <div className="form-submit">
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending ? '…' : t.lead.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────── FAQ ────────────────
function FAQ({ t }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq" data-screen-label="10 FAQ">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className="h-serif">
            {t.faq.h2_a} <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.faq.h2_b}</em>
          </h2>
        </div>
        <div className="faq-list">
          {t.faq.items.map((item, i) => (
            <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                <span className="toggle">+</span>
              </button>
              <div className="faq-a">
                <div className="inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── FINAL CTA ────────────────
function FinalCTA({ t, openForm }) {
  return (
    <section className="final-cta" id="final-cta" data-screen-label="11 Final CTA">
      <div className="container">
        <div className="final-cta-inner">
          <span className="eyebrow">{t.final.eyebrow}</span>
          <h2>
            {t.final.h2_a} <em>{t.final.h2_b}</em>
          </h2>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => openForm('sample')}>
              {t.final.cta} <span className="btn-arrow"></span>
            </button>
            <button className="btn btn-secondary on-dark" onClick={() => openForm('presentation')}>
              <span>{t.final.cta_secondary}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────── FOOTER ────────────────
function Footer({ t, lang, setLang }) {
  return (
    <footer className="footer" data-screen-label="12 Footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-mark" style={{ width: 44, height: 44, fontSize: 22 }}>H</div>
              <div>
                <div className="logo-wordmark">HERBACZAR</div>
                <div className="logo-sub">Tea Ritual · Est. Poland</div>
              </div>
            </div>
            <p>{t.footer.tagline}</p>
            <div className="footer-social" style={{ marginTop: 24 }}>
              <a href="https://www.instagram.com/herbaczar" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>
              </a>
              <a href="https://www.tiktok.com/@herbaczar" target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.3a5 5 0 0 1-3-1V15a5 5 0 1 1-4.3-5v3a2 2 0 1 0 1.5 2V3h2.5a4.4 4.4 0 0 0 3.3 3.3z"/></svg>
              </a>
              <a href="mailto:herbaczar8@gmail.com" aria-label="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5>{t.footer.contact_h}</h5>
            <ul>
              <li><a href="mailto:herbaczar8@gmail.com">{t.footer.contact[0]}</a></li>
              <li><a href="tel:+48737532208">{t.footer.contact[1]}</a></li>
              <li><a href="https://www.instagram.com/herbaczar" target="_blank" rel="noreferrer">{t.footer.contact[2]}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.business_h}</h5>
            <ul>
              {t.footer.business.map((b, i) => <li key={i}><a href="#collection">{b}</a></li>)}
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.legal_h}</h5>
            <ul>
              {t.footer.legal.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.copyright}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span>{t.footer.built}</span>
            <div className="lang-switch" style={{ borderColor: 'var(--line)' }}>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <div className="lang-divider"></div>
              <button className={lang === 'pl' ? 'active' : ''} onClick={() => setLang('pl')}>PL</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ──────────────── STICKY MOBILE CTA ────────────────
function StickyCTA({ t, openForm }) {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const leadEl = document.getElementById('lead');
      const finalEl = document.getElementById('final-cta');
      const y = window.scrollY + window.innerHeight - 100;
      // Hide when over lead form or after
      if (leadEl && finalEl) {
        const finalBottom = finalEl.offsetTop + finalEl.offsetHeight;
        setHide((y > leadEl.offsetTop && y < leadEl.offsetTop + leadEl.offsetHeight + 80) || y > finalBottom);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className={`sticky-cta ${hide ? 'hide' : ''}`}
      onClick={() => openForm('sample')}
    >
      <span>{t.sticky}</span>
      <span>→</span>
    </button>
  );
}

Object.assign(window, {
  VideoExperience, PrivateLabel, Benefits, LeadForm, FAQ, FinalCTA, Footer, StickyCTA
});
