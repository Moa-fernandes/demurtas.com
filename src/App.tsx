import { useState, useEffect, useRef } from 'react'
import './App.css'
import { LazyImage } from './components/LazyImage'

interface Work {
  id: number
  title: string
  year: string
  technique: string
  dimensions: string
  imageUrl: string
}

const CATALOG_WORKS: Work[] = [
  { id: 1, title: 'Do limbo', year: '2025', technique: 'Óleo sobre tela', dimensions: '68x59 cm',  imageUrl: '/photos/doLimbo.jpg' },
  { id: 2, title: 'Irmã morte', year: '2024', technique: 'Óleo sobre tela', dimensions: '70x90 cm',  imageUrl: '/photos/IrmaMorte.png' },
  { id: 3, title: 'Em um lugar distante', year: '2025', technique: 'Óleo sobre tela', dimensions: '85x85 cm',  imageUrl: '/photos/obra2.jpeg' },
  { id: 4, title: 'Autoretrato', year: '2025', technique: 'Óleo sobre tela', dimensions: '37x47 cm', imageUrl: '/photos/autoretrato.png' },
  { id: 5, title: 'Autoretrato 2', year: '2025', technique: 'Óleo sobre tela', dimensions: '46x49 cm', imageUrl: '/photos/autoretrato2.png' },
  { id: 6, title: 'Contador de estórias', year: '2025', technique: 'Óleo sobre tela', dimensions: '50x40 cm', imageUrl: '/photos/obra1.jpeg' },
  { id: 7, title: 'Autoretrato 3', year: '2025', technique: 'Óleo sobre tela', dimensions: '38x45 cm', imageUrl: '/photos/autoretrato3.png' },
  { id: 8, title: 'Autoretrato 4', year: '2025', technique: 'Óleo sobre tela', dimensions: '42x40 cm', imageUrl: '/photos/autoretrato4.png' },
  { id: 9, title: 'Em um lugar distante', year: '2025', technique: 'Óleo sobre tela', dimensions: '85x85 cm', imageUrl: '/photos/Emumlugardistante.png' },
  { id: 10, title: 'Na atividade', year: '2025', technique: 'Óleo sobre tela', dimensions: '50x65 cm', imageUrl: '/photos/naatividade.png' },
  { id: 11, title: 'Uma pausa pro respiro', year: '2025', technique: 'Óleo sobre tela', dimensions: '35x43 cm', imageUrl: '/photos/umapausaprorespiro.png' }
]

const BACKGROUND_IMAGES = CATALOG_WORKS.map(work => work.imageUrl)
const AUDIO_SRC = '/mp3/Paris.mp3'

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
const MailIcon = () => (
  <svg {...iconProps}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)
const InstagramIcon = () => (
  <svg {...iconProps}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" strokeWidth={2.4} /></svg>
)
const WhatsAppIcon = () => (
  <svg {...iconProps}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><g transform="translate(7.6 7.6) scale(0.4)"><path strokeWidth={3.4} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></g></svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z" /></svg>
)
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
)
const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
)

const TRANSLATIONS = {
  en: {
    subtitle: 'Official Website',
    navWorks: 'Works',
    navBio: 'Biography',
    navCatalog: 'PDF Catalog',
    navClasses: 'Classes',
    navContact: 'Contact',
    heroSub: 'Painter born in 1990',
    heroQuote: '“They do not walk through streets or live in houses. They live in a landscape and eventually find a cave to die in.”',
    btnEnter: 'Enter the works →',
    worksTitle: 'Selected Works & Paintings',
    worksSub: 'Classical tradition, figurative depth, and contemporary urban culture.',
    filterAll: 'All',
    sortNewest: 'Newest First',
    sortOldest: 'Oldest First',
    bioTitle: 'About the Artist',
    bioP1: 'Born in Rio de Janeiro in 1990, Nikolas de Murtas grew up surrounded by art. Coming from a family of painters and sculptors—with a mother who is a visual artist and restorer boasting a rich intellectual and artistic background—he discovered early on a deep desire to paint like the old masters.',
    bioP2: 'His painting journey began over a decade ago. He studied under master Renato Ferrari in Rio de Janeiro and took classes with Caique Polizeli, where he was introduced to the techniques of Norwegian master Odd Nerdrum. This connection deepened in April 2026, when Nikolas traveled to Norway and spent two months immersed in living, studying, and breathing the thoughts and "Kitsch" philosophy directly alongside Odd Nerdrum himself—embracing craftsmanship, raw emotion, and dramatic narrative.',
    bioP3: 'He joined the artist team for the Netflix series "Dom de Iludir", where he executed—among paintings of his own signature and creation—copies and replicas of iconic works of national art, such as Pierrette (1922) and Samba, both by Di Cavalcanti, as well as Enterro na Rede (1944), from Cândido Portinari’s acclaimed series Os Retirantes.',
    bioP4: 'A recipient of an honorable mention and an acquisition prize at the Piracicaba and Arceburgo Salons, he has also created works for brands such as Vans and High, and for musical artists like BK, Sain, and Bin.',
    catTitle: 'Complete Catalog 2025',
    catDesc: 'View or download the official catalog of Nikolas de Murtas.',
    catOpen: 'Open Full Screen ↗',
    classesTitle: 'Classes',
    classesDrawingTitle: 'Introduction to drawing:',
    classesDrawingItem1: 'Fundamentals of drawing',
    classesDrawingItem2: 'Charcoal drawing',
    classesPaintingTitle: 'Introduction to painting:',
    classesPaintingItem1: 'Fundamentals of oil painting',
    classesPaintingItem2: 'Study of classical paintings by the great masters.',
    classesLoc: 'Location: Copacabana, Rio de Janeiro - RJ',
    classesDays: 'Available Days: Tuesdays and Fridays 10h - 13h.',
    classesCTA: 'Contact to check availability and schedule your class.',
    contactTitle: 'Contact & Acquisition',
    contactDesc: 'For catalog availability, commissions, or atelier information:',
    rights: 'All rights reserved.',
    siteBy: 'Website by'
  },
  pt: {
    subtitle: 'Site Oficial',
    navWorks: 'Obras',
    navBio: 'Biografia',
    navCatalog: 'Catálogo PDF',
    navClasses: 'Aulas',
    navContact: 'Contato',
    heroSub: 'Pintor nascido em 1990',
    heroQuote: '“Elas não caminham pelas ruas nem moram em casas. Vivem em uma paisagem e eventualmente encontram uma caverna para morrer.”',
    btnEnter: 'Entrar nas obras →',
    worksTitle: 'Obras Selecionadas',
    worksSub: 'Tradição clássica, figurativismo e cultura urbana contemporânea.',
    filterAll: 'Todas',
    sortNewest: 'Mais Recentes',
    sortOldest: 'Mais Antigas',
    bioTitle: 'Sobre o Artista',
    bioP1: 'Nascido em 1990 no Rio de Janeiro, Nikolas de Murtas cresceu em meio à arte. Filho de uma artista plástica e restauradora, ele teve a criação moldada por essa herança de pintores e escultores, descobrindo desde cedo a vontade de pintar como os grandes mestres.',
    bioP2: 'Sua trajetória na pintura começou há mais de 10 anos. Iniciou os estudos com o mestre Renato Ferrari no Rio de Janeiro e depois conheceu um pupilo de Odd Nerdrum, onde conheceu as técnicas do renomado mestre norueguês. Essa conexão se aprofundou em abril de 2026, quando Nikolas viajou à Noruega e passou dois meses imerso vivendo, estudando e respirando os pensamentos e a filosofia "Kitsch" diretamente com o próprio Odd Nerdrum — abraçando o resgate do ofício, da emoção crua e da narrativa dramática.',
    bioP3: 'Integrou o time de artistas da série "Dom de Iludir", da Netflix, onde executou — dentre quadros de sua própria assinatura e criação — cópias e réplicas de obras icônicas da arte nacional, como Pierrette (1922) e Samba, ambas de Di Cavalcanti, além de Enterro na Rede (1944), da série Os Retirantes de Cândido Portinari.',
    bioP4: 'Premiado com menção honrosa e prêmio aquisitivo nos Salões de Piracicaba e Arceburgo, realizou trabalhos para marcas como Vans e High, e para artistas como BK, Sain e Bin.',
    catTitle: 'Catálogo Completo 2025',
    catDesc: 'Visualize o catálogo oficial das obras de Nikolas de Murtas.',
    catOpen: 'Abrir PDF em tela cheia ↗',
    classesTitle: 'Aulas',
    classesDrawingTitle: 'Introdução ao desenho:',
    classesDrawingItem1: 'Fundamentos do desenho',
    classesDrawingItem2: 'Desenho com carvão',
    classesPaintingTitle: 'Introdução à pintura:',
    classesPaintingItem1: 'Fundamentos da pintura a óleo',
    classesPaintingItem2: 'Estudo de pinturas clássicas dos grandes mestres.',
    classesLoc: 'Local: Copacabana, Rio de Janeiro - RJ',
    classesDays: 'Dias disponíveis: Terças e Sextas de 10h às 13h.',
    classesCTA: 'Entre em contato para verificar horários disponíveis.',
    contactTitle: 'Contato & Aquisição',
    contactDesc: 'Para disponibilidade de obras, encomendas ou informações de atelier:',
    rights: 'Todos os direitos reservados.',
    siteBy: 'Site por'
  }
}

type Tab = 'works' | 'bio' | 'catalog' | 'classes' | 'contact'

function App() {
  const [lang, setLang] = useState<'en' | 'pt'>('en')
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    return window.location.hash.length > 1;
  })
  
  // Sincronização inicial com a URL (Deep Linking)
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const hash = window.location.hash.replace('#', '').split('?')[0];
    if (['works', 'bio', 'catalog', 'classes', 'contact'].includes(hash)) {
      return hash as Tab;
    }
    return 'works';
  })

  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const obraParam = params.get('obra');
    if (obraParam) {
      const found = CATALOG_WORKS.find(w => w.title.toLowerCase().replace(/\s+/g, '-') === obraParam);
      return found ? found.id : null;
    }
    return null;
  })

  const [bgIndex, setBgIndex] = useState(0)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)

  const [isZoomed, setIsZoomed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)
  const bgContainerRef = useRef<HTMLDivElement>(null)

  const lastScrollY = useRef(0)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const t = TRANSLATIONS[lang]
  const pdfCatalogPath = '/photos/catalogos/catalogo-nikolas-2025.pdf'

  // Sistema de Som Nativo (Web Audio API para micro-cliques)
  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Ignora se o navegador bloquear sem interação prévia
    }
  };

  // Efeito Parallax ao mover o mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgContainerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgContainerRef.current.style.transform = `translate(calc(-2.5vw + ${x}px), calc(-2.5vh + ${y}px))`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sincronização de Estado com a URL (Deep Linking)
  useEffect(() => {
    if (!hasEntered) {
      window.location.hash = '';
      return;
    }
    const workObj = CATALOG_WORKS.find(w => w.id === selectedWorkId);
    const obraSlug = workObj ? `?obra=${workObj.title.toLowerCase().replace(/\s+/g, '-')}` : '';
    window.location.hash = `#${activeTab}${obraSlug}`;
  }, [activeTab, selectedWorkId, hasEntered]);

  const filteredWorks = CATALOG_WORKS.filter(work => {
    if (selectedYear === 'all') return true
    return work.year === selectedYear
  }).sort((a, b) => {
    if (sortOrder === 'newest') return parseInt(b.year) - parseInt(a.year)
    return parseInt(a.year) - parseInt(b.year)
  })

  const selectedWork = CATALOG_WORKS.find(w => w.id === selectedWorkId) || null

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedWorkId) {
        if (e.key === 'Escape') handleCloseModal()
        if (e.key === 'ArrowRight') handleNextWork()
        if (e.key === 'ArrowLeft') handlePrevWork()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedWorkId, filteredWorks])

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Zen Mode (Esconder header ao rolar para baixo)
  useEffect(() => {
    let ticking = false
    const update = () => {
      const y = window.scrollY
      setIsScrolled(y > 150)
      if (y > lastScrollY.current && y > 300) {
        setIsHeaderHidden(true)
      } else {
        setIsHeaderHidden(false)
      }
      lastScrollY.current = y
      ticking = false
    }
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setIsScrolled(false)
  }, [activeTab, hasEntered])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Autoplay bloqueado pelo navegador.", e);
        setIsPlaying(false);
      });
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume])

  const togglePlayAudio = () => {
    playClickSound();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Erro ao iniciar áudio", err);
          setIsPlaying(false);
        });
    }
  }

  const handleEnterSite = () => {
    playClickSound();
    setHasEntered(true)
    setActiveTab('works')
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Áudio aguardando permissão."));
    }
  }

  const toggleLanguage = () => {
    playClickSound();
    setLang(lang === 'en' ? 'pt' : 'en')
  }

  const handleCloseModal = () => {
    playClickSound();
    setSelectedWorkId(null)
    setIsZoomed(false)
  }

  const handleNextWork = () => {
    playClickSound();
    if (!selectedWorkId) return
    const currentIndex = filteredWorks.findIndex(w => w.id === selectedWorkId)
    const nextIndex = (currentIndex + 1) % filteredWorks.length
    setSelectedWorkId(filteredWorks[nextIndex].id)
    setIsZoomed(false)
  }

  const handlePrevWork = () => {
    playClickSound();
    if (!selectedWorkId) return
    const currentIndex = filteredWorks.findIndex(w => w.id === selectedWorkId)
    const prevIndex = (currentIndex - 1 + filteredWorks.length) % filteredWorks.length
    setSelectedWorkId(filteredWorks[prevIndex].id)
    setIsZoomed(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!isZoomed) {
      if (touchStartX.current - touchEndX.current > 75) {
        handleNextWork()
      }
      if (touchEndX.current - touchStartX.current > 75) {
        handlePrevWork()
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed && imgRef.current) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      imgRef.current.style.transformOrigin = `${x}% ${y}%`
    }
  }

  const changeTab = (tab: Tab) => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="nerdrum-theme">

      <audio 
        ref={audioRef} 
        src={AUDIO_SRC} 
        autoPlay
        loop
        preload="auto" 
      />

      {!hasEntered ? (
        <>
          <div className="bg-slider-container" ref={bgContainerRef}>
            {BACKGROUND_IMAGES.map((img, index) => (
              <div
                key={index}
                className={`bg-slide ${index === bgIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url('${img}')` }}
              />
            ))}
            <div className="bg-overlay" />
          </div>

          <section className="landing-hero fade-in">
            <button className="lang-toggle-hero glow-effect" onClick={toggleLanguage} aria-label="Alterar Idioma">
              {lang === 'en' ? 'PT-BR' : 'EN-US'}
            </button>

           <div className="hero-content">
            <span className="hero-subtitle">{t.heroSub}</span>
            <h1 className="hero-artist-name">Nikolas de Murtas</h1>
            <p className="hero-manifesto">{t.heroQuote}</p>
            <button className="enter-works-btn glow-effect" onClick={handleEnterSite}>
              {t.btnEnter}
            </button>
          </div>
          </section>
        </>
      ) : (
        <div className="site-wrapper fade-in">
          <header className={`site-header ${isScrolled ? 'scrolled' : ''} ${isHeaderHidden ? 'header-hidden' : ''}`}>
            <div className="header-container">

              <div className="header-top-actions header-collapsible">
                <div className="mini-player">
                  <div className="player-controls">
                    <button onClick={togglePlayAudio} aria-label={isPlaying ? "Pausar Música" : "Tocar Música"}>
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </div>
                  
                  <div className="player-screen">
                    <div className="marquee-content">
                      SOFIANE PAMART - PARIS ♪ &nbsp;&nbsp;&nbsp;&nbsp; SOFIANE PAMART - PARIS ♪
                    </div>
                  </div>

                  <div className="player-volume">
                    <VolumeIcon />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={(e) => setVolume(parseFloat(e.target.value))} 
                      className="volume-slider" 
                      aria-label="Volume da Música"
                    />
                  </div>
                </div>

                <button className="lang-toggle" onClick={toggleLanguage} aria-label="Mudar Idioma">
                  {lang === 'en' ? 'Mudar para Português (PT)' : 'Switch to English (EN)'}
                </button>
              </div>

              <div className="brand" onClick={() => { playClickSound(); setHasEntered(false); }}>
                <span className="subtitle header-collapsible">{t.subtitle}</span>
                <h1 className="artist-title">Nikolas de Murtas</h1>
                <span className="instagram-handle header-collapsible">@nikolasdemurtas</span>
              </div>
              
              <nav className="nav-menu" role="navigation">
                <button className={activeTab === 'works' ? 'active' : ''} onClick={() => changeTab('works')}>{t.navWorks}</button>
                <button className={activeTab === 'bio' ? 'active' : ''} onClick={() => changeTab('bio')}>{t.navBio}</button>
                <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => changeTab('catalog')}>{t.navCatalog}</button>
                <button className={activeTab === 'classes' ? 'active' : ''} onClick={() => changeTab('classes')}>{t.navClasses}</button>
                <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => changeTab('contact')}>{t.navContact}</button>
              </nav>

            </div>
          </header>

          <main className="site-main">
            {activeTab === 'works' && (
              <section className="works-section slide-up">
                <div className="section-header">
                  <h2>{t.worksTitle}</h2>
                  <p className="section-sub">{t.worksSub}</p>
                </div>

                <div className="gallery-controls">
                  <div className="filter-group">
                    <button 
                      className={`filter-btn ${selectedYear === 'all' ? 'active' : ''}`}
                      onClick={() => { playClickSound(); setSelectedYear('all'); }}
                    >
                      {t.filterAll}
                    </button>
                    <button 
                      className={`filter-btn ${selectedYear === '2025' ? 'active' : ''}`}
                      onClick={() => { playClickSound(); setSelectedYear('2025'); }}
                    >
                      2025
                    </button>
                    <button 
                      className={`filter-btn ${selectedYear === '2024' ? 'active' : ''}`}
                      onClick={() => { playClickSound(); setSelectedYear('2024'); }}
                    >
                      2024
                    </button>
                  </div>

                  <div className="sort-group">
                    <select 
                      className="sort-select"
                      value={sortOrder}
                      onChange={(e) => { playClickSound(); setSortOrder(e.target.value as 'newest' | 'oldest'); }}
                      aria-label="Ordenar Obras"
                    >
                      <option value="newest">{t.sortNewest}</option>
                      <option value="oldest">{t.sortOldest}</option>
                    </select>
                  </div>
                </div>

                <div className="gallery-grid">
                  {filteredWorks.map((work) => (
                    <article key={work.id} className="work-card" onClick={() => { playClickSound(); setSelectedWorkId(work.id); }}>
                      <div className="image-wrapper">
                        <LazyImage src={work.imageUrl} alt={work.title} />
                      </div>
                      <div className="work-details">
                        <h3>{work.title}</h3>
                        <p className="meta">{work.technique} — {work.year}</p>
                        <p className="dimensions">{work.dimensions}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'bio' && (
              <section className="bio-section slide-up">
                <div className="content-container">
                  <h2>{t.bioTitle}</h2>
                  <div className="text-content bio-paragraphs">
                    <p>{t.bioP1}</p>
                    <p>{t.bioP2}</p>
                    <p>{t.bioP3}</p>
                    <p>{t.bioP4}</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'catalog' && (
              <section className="catalog-section slide-up">
                <div className="content-container text-center">
                  <h2>{t.catTitle}</h2>
                  <p className="catalog-desc">{t.catDesc}</p>

                  <div className="catalog-actions justify-center">
                    <a href={pdfCatalogPath} target="_blank" rel="noopener noreferrer" className="pdf-btn" onClick={() => playClickSound()}>
                      {t.catOpen}
                    </a>
                  </div>

                  <div className="pdf-viewer-wrapper">
                    <iframe src={pdfCatalogPath} title="Catalog" className="pdf-object" />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'classes' && (
              <section className="classes-section slide-up">
                <div className="content-container text-center">
                  <h2>{t.classesTitle}</h2>

                  <div className="classes-course-content">
                    <div className="course-module">
                      <h3>{t.classesDrawingTitle}</h3>
                      <ul>
                        <li>{t.classesDrawingItem1}</li>
                        <li>{t.classesDrawingItem2}</li>
                      </ul>
                    </div>
                    
                    <div className="course-module">
                      <h3>{t.classesPaintingTitle}</h3>
                      <ul>
                        <li>{t.classesPaintingItem1}</li>
                        <li>{t.classesPaintingItem2}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="classes-info-box">
                    <p className="highlight-text">📍 {t.classesLoc}</p>
                    <p className="highlight-text">🗓️ {t.classesDays}</p>
                  </div>

                  <p className="classes-cta">{t.classesCTA}</p>
                  <div className="catalog-actions justify-center">
                    <a href="https://wa.me/5521982910593" target="_blank" rel="noreferrer" className="pdf-btn" onClick={() => playClickSound()}>
                      <span className="btn-icon"><WhatsAppIcon /></span>
                      WhatsApp: (21) 98291-0593
                    </a>
                    <a href="mailto:nikolasdemurtas@gmail.com" className="pdf-btn secondary" onClick={() => playClickSound()}>
                      <span className="btn-icon"><MailIcon /></span>
                      nikolasdemurtas@gmail.com
                    </a>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'contact' && (
              <section className="contact-section slide-up">
                <div className="content-container text-center">
                  <h2>{t.contactTitle}</h2>
                  <p>{t.contactDesc}</p>

                  <div className="contact-list">
                    <a className="contact-card" href="https://wa.me/5521982910593" target="_blank" rel="noreferrer" onClick={() => playClickSound()}>
                      <span className="contact-icon"><WhatsAppIcon /></span>
                      <span className="contact-label">WhatsApp</span>
                      <span className="contact-value">+55 (21) 98291-0593</span>
                    </a>

                    <a className="contact-card" href="mailto:nikolasdemurtas@gmail.com" onClick={() => playClickSound()}>
                      <span className="contact-icon"><MailIcon /></span>
                      <span className="contact-label">Email</span>
                      <span className="contact-value">nikolasdemurtas@gmail.com</span>
                    </a>

                    <a className="contact-card" href="https://instagram.com/nikolasdemurtas" target="_blank" rel="noreferrer" onClick={() => playClickSound()}>
                      <span className="contact-icon"><InstagramIcon /></span>
                      <span className="contact-label">Instagram</span>
                      <span className="contact-value">@nikolasdemurtas</span>
                    </a>
                  </div>
                </div>
              </section>
            )}
          </main>

          {selectedWork && (
            <div className="modal-overlay" onClick={handleCloseModal} role="dialog" aria-modal="true">
              <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <button className="close-btn" onClick={handleCloseModal} aria-label="Fechar Modal">✕</button>

                <button className="modal-nav-btn modal-prev" onClick={(e) => { e.stopPropagation(); handlePrevWork(); }} aria-label="Obra Anterior">‹</button>
                <button className="modal-nav-btn modal-next" onClick={(e) => { e.stopPropagation(); handleNextWork(); }} aria-label="Próxima Obra">›</button>

                <div
                  className={`art-zoom-container ${isZoomed ? 'zoomed' : ''}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    ref={imgRef}
                    src={selectedWork.imageUrl}
                    alt={selectedWork.title}
                    className="art-zoom-img"
                  />
                  {!isZoomed && <div className="zoom-hint">🔍 Zoom / ↔️ Swipe / ⌨️ Setas</div>}
                </div>

                <div className="modal-info">
                  <h2>{selectedWork.title}</h2>
                  <p>{selectedWork.technique}, {selectedWork.year}</p>
                  <span>{selectedWork.dimensions}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <footer className={`site-footer ${!hasEntered ? 'on-landing' : ''}`}>
        <div className="footer-container">
          <p className="footer-copy">© {new Date().getFullYear()} Nikolas de Murtas. {t.rights}</p>
          <p className="footer-credit">
            {t.siteBy}{' '}
            <span className="dev-wrapper">
              Moacir Fernandes
              <div className="dev-tooltip">
                <a href="https://wa.me/5521973019585" target="_blank" rel="noreferrer">WhatsApp</a>
                <a href="https://www.linkedin.com/in/moacir-fernandes-ba0a97a0/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://github.com/Moa-fernandes" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://moa-fernandes.github.io/gps-radio-radar/" target="_blank" rel="noreferrer">WebSite</a>
              </div>
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App