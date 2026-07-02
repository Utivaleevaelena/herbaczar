// HERBACZAR — Product Collection ("Five spheres, five rituals")
function ProductCard({ p, cta, skladLabel, openForm, index }) {
  const reverse = index % 2 === 1;
  return (
    <div className={`prod-row ${reverse ? "reverse" : ""}`}>
      <div className="prod-media">
        <img src={p.img} alt={`${p.name} — ${p.subtitle}`} loading="lazy" />
        <span className="prod-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="prod-body">
        <h3 className="prod-name">{p.name}</h3>
        {p.subtitle && p.subtitle !== p.name && (
          <div className="prod-sub">{p.subtitle}</div>
        )}
        <p className="prod-desc">{p.desc}</p>
        <div className="prod-sklad">
          <span className="prod-sklad-label">{skladLabel}</span>
          <p>{p.sklad}</p>
        </div>
        <button className="prod-cta" onClick={() => openForm("sample", p.name)}>
          {cta} <span className="prod-cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function Products({ t, openForm }) {
  const c = t.products;
  return (
    <section className="products" id="collection" data-screen-label="Collection">
      <div className="container">
        <div className="section-head prod-head">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="h-serif">
            {c.title_a} <em style={{ fontStyle: "italic", color: "var(--caramel)" }}>{c.title_b}</em>
          </h2>
          <p className="body-lg">{c.intro}</p>
        </div>
        <div className="prod-list">
          {c.items.map((p, i) => (
            <ProductCard
              key={i}
              p={p}
              index={i}
              cta={c.cta}
              skladLabel={c.sklad_label}
              openForm={openForm}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Products });
