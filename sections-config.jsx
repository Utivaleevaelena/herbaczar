// HERBACZAR — B2B Product Configurator ("Choose Your Tea Collection")
const { useState: useStateCfg, useRef: useRefCfg, useMemo: useMemoCfg, useEffect: useEffectCfg } = React;

// Volume-based indicative unit pricing (€ per sphere)
function cfgUnitPrice(base, qty) {
  let m = 1;
  if (qty >= 1000) m = 0.62;
  else if (qty >= 500) m = 0.70;
  else if (qty >= 250) m = 0.78;
  else if (qty >= 100) m = 0.85;
  else if (qty >= 50) m = 0.92;
  return base * m;
}
function cfgMoney(n) {
  return "€" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Quantity selector ─────────────────────────────
function CfgQty({ c, value, onChange }) {
  const [customMode, setCustomMode] = useStateCfg(false);
  const opts = c.qtyOptions;
  const isPreset = opts.includes(value);
  return (
    <div className="cfg-qty">
      <div className="cfg-qty-label">{c.labels.qty}</div>
      <div className="cfg-qty-chips">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            className={`cfg-chip ${!customMode && value === o ? "on" : ""}`}
            onClick={() => { setCustomMode(false); onChange(o); }}
          >{o}</button>
        ))}
        <button
          type="button"
          className={`cfg-chip ${customMode || (!isPreset && value > 0) ? "on" : ""}`}
          onClick={() => { setCustomMode(true); }}
        >{c.labels.custom}</button>
      </div>
      {(customMode || (!isPreset && value > 0)) && (
        <input
          type="number"
          min="1"
          className="cfg-qty-custom"
          placeholder={c.labels.customPh}
          value={value || ""}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          autoFocus
        />
      )}
    </div>
  );
}

// ── Single tea card ───────────────────────────────
function CfgCard({ c, tea, qty, onQty, inOffer, inSample, toggleOffer, toggleSample, open, onToggleOpen }) {
  const q = qty || 0;
  const unit = cfgUnitPrice(tea.base, q || 1);
  const subtotal = unit * q;
  const P = window.Placeholder;
  return (
    <div className={`cfg-card ${open ? "open" : ""}`}>
      <div className="cfg-card-media">
        {tea.img
          ? <P src={tea.img} alt={`${tea.name} — ${tea.subtitle}`} />
          : <P label={c.labels.g_main} file={tea.subtitle} ratio="1:1" />}
        <div className="cfg-card-type">{tea.type}</div>
      </div>
      <div className="cfg-card-body">
        <div className="cfg-card-head">
          <div>
            <h3>{tea.name}</h3>
            <div className="cfg-card-sub">{tea.subtitle}</div>
          </div>
          <div className="cfg-card-price">
            <span className="from">{cfgMoney(tea.base)}</span>
            <span className="unit">{c.labels.unit}</span>
          </div>
        </div>
        <p className="cfg-card-desc">{tea.desc}</p>

        <dl className="cfg-spec">
          <div><dt>{c.labels.flavor}</dt><dd>{tea.flavor}</dd></div>
          <div><dt>{c.labels.ingredients}</dt><dd>{tea.ingredients}</dd></div>
          <div><dt>{c.labels.serving}</dt><dd>{c.serving}</dd></div>
        </dl>

        <CfgQty c={c} value={q} onChange={onQty} />

        <div className="cfg-subtotal">
          <span>{c.labels.subtotal}</span>
          <strong>{q > 0 ? cfgMoney(subtotal) : "—"}</strong>
        </div>

        <div className="cfg-card-actions">
          <button
            type="button"
            className={`cfg-btn cfg-btn-offer ${inOffer ? "on" : ""}`}
            onClick={() => toggleOffer(tea.id)}
          >{inOffer ? c.labels.addedOffer : c.labels.addOffer}</button>
          <button
            type="button"
            className={`cfg-btn cfg-btn-sample ${inSample ? "on" : ""}`}
            onClick={() => toggleSample(tea.id)}
          >{inSample ? c.labels.addedSample : c.labels.addSample}</button>
        </div>

        <button type="button" className="cfg-details-toggle" onClick={() => onToggleOpen(tea.id)}>
          <span>{open ? c.labels.close : c.labels.details}</span>
          <span className="chev">{open ? "−" : "+"}</span>
        </button>

        <div className="cfg-details" style={{ maxHeight: open ? 1400 : 0 }}>
          <div className="cfg-details-inner">
            <div className="cfg-gallery">
              {tea.img
                ? <P src={tea.img} alt={tea.name} />
                : <P label={c.labels.g_main} ratio="4:3" />}
              <P label={c.labels.g_macro} ratio="1:1" />
              <P label={c.labels.g_infusion} ratio="1:1" />
              <P label={c.labels.g_packaging} ratio="1:1" />
            </div>
            <div className="cfg-detail-blocks">
              <div className="cfg-db"><span className="k">{c.labels.aroma}</span><p>{tea.aroma}</p></div>
              <div className="cfg-db"><span className="k">{c.labels.notes}</span><p>{tea.notes}</p></div>
              <div className="cfg-db"><span className="k">{c.labels.prep}</span><p>{tea.prep}</p></div>
              <div className="cfg-db">
                <span className="k">{c.labels.bestFor}</span>
                <div className="cfg-tags">{tea.bestFor.map((b, i) => <span key={i}>{b}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quotation summary ─────────────────────────────
function CfgSummary({ c, teas, qtys, offer, sample, total, onRequest, onClear, compact }) {
  const offerItems = teas.filter((t) => offer[t.id] && (qtys[t.id] || 0) > 0);
  const sampleItems = teas.filter((t) => sample[t.id]);
  const P = window.Placeholder;
  return (
    <div className={`cfg-summary ${compact ? "compact" : ""}`}>
      <div className="cfg-summary-head">
        <h3>{c.summary.title}</h3>
        {(offerItems.length > 0 || sampleItems.length > 0) && (
          <button type="button" className="cfg-clear" onClick={onClear}>{c.summary.clear}</button>
        )}
      </div>

      {offerItems.length === 0 ? (
        <p className="cfg-summary-empty">{c.summary.empty}</p>
      ) : (
        <div className="cfg-summary-list">
          {offerItems.map((t) => {
            const q = qtys[t.id];
            const sub = cfgUnitPrice(t.base, q) * q;
            return (
              <div className="cfg-summary-row" key={t.id}>
                <div className="cfg-thumb">
                  {t.img ? <P src={t.img} alt={t.name} /> : <P label="" ratio="1:1" />}
                </div>
                <div className="cfg-summary-info">
                  <div className="nm">{t.name}</div>
                  <div className="qt">{q} × {cfgMoney(cfgUnitPrice(t.base, q))}</div>
                </div>
                <div className="cfg-summary-sub">{cfgMoney(sub)}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="cfg-summary-totals">
        <div className="row">
          <span>{c.summary.shipping}</span>
          <span className="muted">{c.summary.shipping_val}</span>
        </div>
        <div className="row total">
          <span>{c.summary.total}</span>
          <strong>{cfgMoney(total)}</strong>
        </div>
      </div>

      <p className="cfg-note">{c.summary.note}</p>

      {sampleItems.length > 0 && (
        <div className="cfg-sample-box">
          <div className="cfg-sample-title">{c.summary.sample_title}</div>
          <div className="cfg-sample-items">
            {sampleItems.map((t) => <span key={t.id}>{t.name}</span>)}
          </div>
        </div>
      )}

      <div className="cfg-wholesale">{c.summary.wholesale}</div>

      <button type="button" className="cfg-request btn btn-primary" onClick={onRequest}>
        {c.summary.cta} <span className="btn-arrow"></span>
      </button>
    </div>
  );
}

// ── Section ───────────────────────────────────────
function TeaConfigurator({ t, openForm }) {
  const c = t.config;
  const teas = c.teas;
  const [qtys, setQtys] = useStateCfg({});
  const [offer, setOffer] = useStateCfg({});
  const [sample, setSample] = useStateCfg({});
  const [open, setOpen] = useStateCfg(null);
  const [barVisible, setBarVisible] = useStateCfg(false);
  const sectionRef = useRefCfg(null);

  useEffectCfg(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => setBarVisible(e.isIntersecting && e.intersectionRatio > 0),
      { threshold: 0, rootMargin: "-40% 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const setQty = (id) => (v) => setQtys((p) => ({ ...p, [id]: v }));
  const toggleOffer = (id) => setOffer((p) => {
    const next = { ...p, [id]: !p[id] };
    // ensure a quantity exists when adding to offer
    if (next[id] && !(qtys[id] > 0)) setQtys((q) => ({ ...q, [id]: 50 }));
    return next;
  });
  const toggleSample = (id) => setSample((p) => ({ ...p, [id]: !p[id] }));
  const toggleOpen = (id) => setOpen((o) => (o === id ? null : id));
  const clear = () => { setQtys({}); setOffer({}); setSample({}); };

  const total = useMemoCfg(() => {
    return teas.reduce((sum, tea) => {
      if (offer[tea.id] && qtys[tea.id] > 0) {
        return sum + cfgUnitPrice(tea.base, qtys[tea.id]) * qtys[tea.id];
      }
      return sum;
    }, 0);
  }, [teas, offer, qtys]);

  const requestOffer = () => {
    const lines = [];
    lines.push(c.summary.cta.toUpperCase());
    lines.push("");
    const offerItems = teas.filter((tea) => offer[tea.id] && qtys[tea.id] > 0);
    if (offerItems.length) {
      lines.push("— Offer request —");
      offerItems.forEach((tea) => {
        const q = qtys[tea.id];
        const sub = cfgUnitPrice(tea.base, q) * q;
        lines.push(`• ${tea.name} (${tea.subtitle}) × ${q} — ${cfgMoney(sub)}`);
      });
      lines.push(`Estimated total: ${cfgMoney(total)} (indicative · shipping calculated individually)`);
    }
    const sampleItems = teas.filter((tea) => sample[tea.id]);
    if (sampleItems.length) {
      lines.push("");
      lines.push("— Sample box —");
      lines.push(sampleItems.map((tea) => tea.name).join(", "));
    }
    if (!offerItems.length && !sampleItems.length) {
      lines.push("(No teas selected yet — I'd like to discuss options.)");
    }
    openForm("sample", null, { message: lines.join("\n") });
  };

  return (
    <section className="cfg" id="configurator" data-screen-label="Configurator" ref={sectionRef}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="h-serif">
            {c.h2_a} <em style={{ fontStyle: "italic", color: "var(--gold)" }}>{c.h2_b}</em>
          </h2>
          <p className="body-lg">{c.intro}</p>
        </div>

        <div className="cfg-layout">
          <div className="cfg-catalogue">
            {teas.map((tea) => (
              <CfgCard
                key={tea.id}
                c={c}
                tea={tea}
                qty={qtys[tea.id]}
                onQty={setQty(tea.id)}
                inOffer={!!offer[tea.id]}
                inSample={!!sample[tea.id]}
                toggleOffer={toggleOffer}
                toggleSample={toggleSample}
                open={open === tea.id}
                onToggleOpen={toggleOpen}
              />
            ))}

            <div className="cfg-pl-card">
              <div className="cfg-pl-tag">{c.privateLabel.tag}</div>
              <h3>{c.privateLabel.title}</h3>
              <p>{c.privateLabel.body}</p>
              <button type="button" className="cfg-pl-cta" onClick={() => openForm("presentation", c.privateLabel.tag)}>
                {c.privateLabel.cta} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <aside className="cfg-aside">
            <div className="cfg-aside-sticky">
              <CfgSummary
                c={c} teas={teas} qtys={qtys} offer={offer} sample={sample}
                total={total} onRequest={requestOffer} onClear={clear}
              />
              <p className="cfg-form-note">{c.formNote}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky summary bar */}
      <div className={`cfg-mobilebar ${barVisible ? "show" : ""}`}>
        <div className="cfg-mobilebar-info">
          <span className="lbl">{c.summary.total}</span>
          <strong>{cfgMoney(total)}</strong>
        </div>
        <button type="button" className="btn btn-primary" onClick={requestOffer}>
          {c.summary.cta}
        </button>
      </div>
    </section>
  );
}

Object.assign(window, { TeaConfigurator });
