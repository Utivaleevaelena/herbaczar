// HERBACZAR — main app
const { useState: useState_, useEffect: useEffect_, useRef: useRef_ } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentPalette": "warm",
  "headlineFont": "cormorant",
  "showVideoSection": true,
  "showMarquee": true
}/*EDITMODE-END*/;

const PALETTES = {
  // Warm near-black brown · gold + cream (steaming-tea mood)
  warm: {
    "--surface": "#0E0B09",
    "--surface-2": "#15110D",
    "--ivory": "#15110D",
    "--ivory-deep": "#1A150F",
    "--champagne": "#1F1812",
    "--caramel": "#E0C089",
    "--gold": "#CBA462",
    "--gold-soft": "#B8935A",
    "--chocolate": "#070504",
    "--chocolate-hover": "#000000",
    "--text": "#F4EEE1",
    "--text-soft": "rgba(244, 238, 225, 0.66)",
    "--text-mute": "rgba(244, 238, 225, 0.42)",
    "--line": "rgba(228, 214, 188, 0.14)",
    "--line-soft": "rgba(228, 214, 188, 0.08)",
  },
  // Neutral cool charcoal · crisp gold (monochrome editorial mood)
  noir: {
    "--surface": "#0C0C0D",
    "--surface-2": "#141416",
    "--ivory": "#141416",
    "--ivory-deep": "#1A1A1D",
    "--champagne": "#1E1E21",
    "--caramel": "#D9BC82",
    "--gold": "#C2A05C",
    "--gold-soft": "#A98A4E",
    "--chocolate": "#050506",
    "--chocolate-hover": "#000000",
    "--text": "#F2F1EF",
    "--text-soft": "rgba(242, 241, 239, 0.62)",
    "--text-mute": "rgba(242, 241, 239, 0.4)",
    "--line": "rgba(228, 226, 220, 0.13)",
    "--line-soft": "rgba(228, 226, 220, 0.07)",
  },
  // Deep forest green-black · muted gold (botanical mood)
  botanical: {
    "--surface": "#0C100C",
    "--surface-2": "#121711",
    "--ivory": "#121711",
    "--ivory-deep": "#172017",
    "--champagne": "#1B241B",
    "--caramel": "#CFB877",
    "--gold": "#B6A35E",
    "--gold-soft": "#9E8C4E",
    "--chocolate": "#070B07",
    "--chocolate-hover": "#000000",
    "--text": "#EFEFE4",
    "--text-soft": "rgba(239, 239, 228, 0.64)",
    "--text-mute": "rgba(239, 239, 228, 0.42)",
    "--line": "rgba(214, 220, 200, 0.13)",
    "--line-soft": "rgba(214, 220, 200, 0.07)",
  },
};

const APPLE_SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', Roboto, Arial, sans-serif";
const HEADLINE_FONTS = {
  cormorant: APPLE_SYSTEM_FONT,
  playfair: APPLE_SYSTEM_FONT,
  italiana: APPLE_SYSTEM_FONT,
};

function App() {
  const [lang, setLang] = useState_(() => {
    try { return localStorage.getItem('herb_lang') || 'pl'; } catch (e) { return 'pl'; }
  });
  const [formState, setFormState] = useState_({});
  const [intent, setIntent] = useState_('sample');
  const tweakHook = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];
  const tweaks = tweakHook[0];
  const setTweak = tweakHook[1];

  // persist lang
  useEffect_(() => {
    try { localStorage.setItem('herb_lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
  }, [lang]);

  // apply palette + font tweaks
  useEffect_(() => {
    const root = document.documentElement;
    const palette = PALETTES[tweaks.accentPalette] || PALETTES.warm;
    Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty('--serif', HEADLINE_FONTS[tweaks.headlineFont] || HEADLINE_FONTS.cormorant);
  }, [tweaks.accentPalette, tweaks.headlineFont]);

  const t = window.TRANSLATIONS[lang];

  const openForm = (kind, segment, opts) => {
    setIntent(kind);
    if (opts && opts.message) {
      setFormState(prev => ({ ...prev, message: opts.message }));
    } else if (segment) {
      setFormState(prev => ({ ...prev, message: `Interested in: ${segment}\n\n${prev.message || ''}`.trim() }));
    }
    const el = document.getElementById('lead');
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
  };

  return (
    <>
      <Header t={t} lang={lang} setLang={setLang} openForm={openForm} transparent={true} />
      <Hero t={t} openForm={openForm} />
      {tweaks.showVideoSection && <VideoExperience t={t} />}
      <Products t={t} openForm={openForm} />
      {tweaks.showMarquee && <Marquee t={t} />}
      <SpecBand t={t} />
      <Emotion t={t} />
      <Experience t={t} />
      <How t={t} />
      <Benefits t={t} />
      <LeadForm
        t={t}
        formState={formState}
        setFormState={setFormState}
        intent={intent}
        setIntent={setIntent}
      />
      <FAQ t={t} />
      <FinalCTA t={t} openForm={openForm} />
      <Footer t={t} lang={lang} setLang={setLang} />
      <StickyCTA t={t} openForm={openForm} />
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

function TweaksUI({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakRadio
        label="Mood"
        value={tweaks.accentPalette}
        onChange={(v) => setTweak('accentPalette', v)}
        options={['warm', 'noir', 'botanical']}
      />
      <TweakSection label="Typography" />
      <TweakRadio
        label="Headline"
        value={tweaks.headlineFont}
        onChange={(v) => setTweak('headlineFont', v)}
        options={['cormorant', 'playfair', 'italiana']}
      />
      <TweakSection label="Sections" />
      <TweakToggle
        label="Video section"
        value={tweaks.showVideoSection}
        onChange={(v) => setTweak('showVideoSection', v)}
      />
      <TweakToggle
        label="Marquee strip"
        value={tweaks.showMarquee}
        onChange={(v) => setTweak('showMarquee', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
