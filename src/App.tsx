import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Work {
  id: number
  title: string
  year: string
  technique: string
  dimensions: string
  imageUrl: string
}

const CATALOG_WORKS: Work[] = [
  { id: 1, title: 'Do Limbo', year: '2025', technique: 'Óleo sobre tela', dimensions: '68x59 cm',  imageUrl: '/photos/doLimbo.jpg' },
  { id: 2, title: 'Irmã Morte', year: '2024', technique: 'Óleo sobre tela', dimensions: '70x90 cm',  imageUrl: '/photos/IrmaMorte.png' },
  { id: 3, title: 'Em um lugar distante', year: '2025', technique: 'Óleo sobre tela', dimensions: '85x85 cm',  imageUrl: '/photos/obra2.jpeg' },
  { id: 4, title: 'Autoretrato', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/autoretrato.png' },
  { id: 5, title: 'Autoretrato 2', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/autoretrato2.png' },
  { id: 6, title: 'Contador de Estórias', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/obra1.jpeg' },
  { id: 7, title: 'Autoretrato 3', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/autoretrato3.png' },
  { id: 8, title: 'Autoretrato 4', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/autoretrato4.png' },
  { id: 9, title: 'Em um lugar distante (PNG)', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/Emumlugardistante.png' },
  { id: 10, title: 'Na Atividade', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/naatividade.png' },
  { id: 11, title: 'Uma Pausa pro Respiro', year: '2025', technique: 'Óleo sobre tela', dimensions: 'TBD', imageUrl: '/photos/umapausaprorespiro.png' }
]

const BACKGROUND_IMAGES = CATALOG_WORKS.map(work => work.imageUrl)

/* Caminho do MP3 Local */
const AUDIO_SRC = '/mp3/Paris.mp3'

interface ClassMedia {
  id: number
  type: 'image' | 'video'
  url: string
  caption?: { en: string; pt: string }
}

const CLASS_MEDIA: ClassMedia[] = [
  { id: 1, type: 'image', url: '', caption: { en: 'Atelier', pt: 'Ateliê' } },
  { id: 2, type: 'video', url: '', caption: { en: 'Class in action', pt: 'Aula em andamento' } },
  { id: 3, type: 'image', url: '', caption: { en: 'Student work', pt: 'Trabalho de aluno' } },
  { id: 4, type: 'video', url: '', caption: { en: 'Technique demo', pt: 'Demonstração de técnica' } }
]

function getVideoSource(url: string): { kind: 'iframe' | 'file'; src: string } {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { kind: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { kind: 'file', src: url }
  return { kind: 'iframe', src: url }
}

/* ÍCONES SVG */
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
const ImageIcon = () => (
  <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" /></svg>
)
const VideoIcon = () => (
  <svg {...iconProps}><rect x="2" y="5" width="14" height="14" rx="2" /><path d="m22 8-6 4 6 4V8Z" /></svg>
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
    bioTitle: 'About the Artist',
    bioP1: 'Nikolas de Murtas, born in 1990 in Rio de Janeiro, began his painting career over 10 years ago. Surrounded by art since childhood, he discovered his passion and desire to paint like the great masters.',
    bioP2: 'He began his studies with master Renato Ferrari in Rio de Janeiro and took classes with Caique Polizeli, where he was introduced to the techniques of Odd Nerdrum, a great Norwegian master.',
    bioP3: 'He learned the importance of painting from life and creating narratives. In his works, he strives to portray the reality of the streets and incorporate his lifestyle.',
    bioP4: 'He participated in the Piracicaba and Arceburgo Salons, receiving an honorable mention and an acquisition prize. Nikolas has worked for brands such as Vans and High, and music artists such as BK, Sain, and Bin.',
    catTitle: 'Complete Catalog 2025',
    catDesc: 'View or download the official catalog of Nikolas de Murtas.',
    catOpen: 'Open Full Screen ↗',
    catDown: 'Download PDF ⬇',
    classesTitle: 'Painting Classes',
    classesDesc: 'Learn oil painting techniques inspired by the great classical masters. The classes focus on painting from life, anatomical proportion, classical canvas preparation, and narrative creation based on Odd Nerdrum’s philosophy.',
    classesLoc: 'Location: Copacabana, Rio de Janeiro - RJ',
    classesDays: 'Available Days: Tuesdays and Thursdays (Morning/Afternoon) & Saturdays.',
    classesCTA: 'Contact to check availability and schedule your class.',
    mediaSoon: 'Coming soon',
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
    bioTitle: 'Sobre o Artista',
    bioP1: 'Nikolas de Murtas, nascido em 1990 no Rio de Janeiro, iniciou sua trajetória na pintura há mais de 10 anos. Cercado pela arte desde pequeno, descobriu sua paixão e a vontade de pintar como os grandes mestres.',
    bioP2: 'Iniciou seus estudos com o mestre Renato Ferrari no Rio de Janeiro e teve aulas com Caique Polizeli, onde foi introduzido às técnicas de Odd Nerdrum, grande mestre norueguês.',
    bioP3: 'Aprendeu a importância de se pintar do natural e da criação de narrativas. Em suas obras, tenta retratar a realidade das ruas e incorporar o seu estilo de vida.',
    bioP4: 'Participou dos Salões de Piracicaba e Arceburgo, sendo em Piracicaba premiado com menção honrosa e prêmio aquisitivo pela Câmara. Nikolas já realizou trabalhos para marcas como Vans e High, e para artistas do rap e da música brasileira como BK, Sain e Bin.',
    catTitle: 'Catálogo Completo 2025',
    catDesc: 'Visualize o catálogo oficial das obras de Nikolas de Murtas.',
    catOpen: 'Abrir PDF em tela cheia ↗',
    catDown: 'Baixar PDF ⬇',
    classesTitle: 'Aulas de Pintura a Óleo',
    classesDesc: 'Aprenda as técnicas da pintura a óleo inspiradas nos grandes mestres. As aulas focam na pintura do natural, proporção, preparação clássica de telas e criação de narrativas com base na filosofia de Odd Nerdrum.',
    classesLoc: 'Local: Copacabana, Rio de Janeiro - RJ',
    classesDays: 'Dias disponíveis: Terças e Quintas (Manhã/Tarde) e Sábados.',
    classesCTA: 'Entre em contato para verificar horários disponíveis.',
    mediaSoon: 'Em breve',
    contactTitle: 'Contato & Aquisição',
    contactDesc: 'Para disponibilidade de obras, encomendas ou informações de atelier:',
    rights: 'Todos os direitos reservados.',
    siteBy: 'Site por'
  }
}

type Tab = 'works' | 'bio' | 'catalog' | 'classes' | 'contact'

function App() {
  const [lang, setLang] = useState<'en' | 'pt'>('en')
  const [hasEntered, setHasEntered] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<Tab>('works')
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [bgIndex, setBgIndex] = useState(0)

  // Header Scroll State
  const [isScrolled, setIsScrolled] = useState(false)

  // ArtZoom State & Ref
  const [isZoomed, setIsZoomed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Player States
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  const t = TRANSLATIONS[lang]
  const pdfCatalogPath = '/photos/catalogos/catalogo-nikolas-2025.pdf'

  // Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Scroll Header Effect
  useEffect(() => {
    let ticking = false
    const update = () => {
      const y = window.scrollY
      setIsScrolled((prev) => (prev ? y > 40 : y > 200))
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

  // Player Initialization (Autoplay na inicialização global)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Tentativa de Autoplay
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Autoplay bloqueado pelo navegador. O áudio será ativado no primeiro clique.", e);
        setIsPlaying(false);
      });
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume])

  const togglePlayAudio = () => {
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

  // Função para lidar com o clique no botão "Entrar nas Obras"
  const handleEnterSite = () => {
    setHasEntered(true)
    setActiveTab('works')
    // Força o play caso o navegador tenha bloqueado no carregamento inicial
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("O áudio ainda requer permissão."));
    }
  }

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'pt' : 'en')
  }

  const handleCloseModal = () => {
    setSelectedWork(null)
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed && imgRef.current) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      imgRef.current.style.transformOrigin = `${x}% ${y}%`
    }
  }

  const renderClassMedia = (item: ClassMedia) => {
    const caption = item.caption ? item.caption[lang] : ''
    let content
    if (!item.url.trim()) {
      content = (
        <div className="media-placeholder">
          {item.type === 'image' ? <ImageIcon /> : <VideoIcon />}
          <span>{t.mediaSoon}</span>
        </div>
      )
    } else if (item.type === 'image') {
      content = <img src={item.url} alt={caption || 'Class photo'} loading="lazy" />
    } else {
      const video = getVideoSource(item.url)
      content =
        video.kind === 'file' ? (
          <video src={video.src} controls preload="metadata" />
        ) : (
          <iframe
            src={video.src}
            title={caption || 'Class video'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
    }
    return (
      <figure key={item.id} className={`class-media-item ${item.type}`}>
        <div className="media-frame">{content}</div>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    )
  }

  return (
    <div className="nerdrum-theme">

      {/* ÁUDIO GLOBAL: Carrega e tenta tocar em loop infinito */}
      <audio 
        ref={audioRef} 
        src={AUDIO_SRC} 
        autoPlay
        loop
        preload="auto" 
      />

      {!hasEntered ? (
        <>
          <div className="bg-slider-container">
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
            <button className="lang-toggle-hero glow-effect" onClick={toggleLanguage}>
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
          <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">

              {/* BARRA SUPERIOR: PLAYER NA ESQUERDA, IDIOMA NA DIREITA */}
              <div className="header-top-actions header-collapsible">
                
                <div className="mini-player">
                  <div className="player-controls">
                    <button onClick={togglePlayAudio} aria-label="Tocar Música">
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
                    />
                  </div>
                </div>

                <button className="lang-toggle" onClick={toggleLanguage}>
                  {lang === 'en' ? 'Mudar para Português (PT)' : 'Switch to English (EN)'}
                </button>

              </div>

              <div className="brand" onClick={() => setHasEntered(false)}>
                <span className="subtitle header-collapsible">{t.subtitle}</span>
                <h1 className="artist-title">Nikolas de Murtas</h1>
                <span className="instagram-handle header-collapsible">@nikolasdemurtas</span>
              </div>
              
              <nav className="nav-menu">
                <button className={activeTab === 'works' ? 'active' : ''} onClick={() => setActiveTab('works')}>{t.navWorks}</button>
                <button className={activeTab === 'bio' ? 'active' : ''} onClick={() => setActiveTab('bio')}>{t.navBio}</button>
                <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => setActiveTab('catalog')}>{t.navCatalog}</button>
                <button className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>{t.navClasses}</button>
                <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>{t.navContact}</button>
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
                <div className="gallery-grid">
                  {CATALOG_WORKS.map((work) => (
                    <article key={work.id} className="work-card" onClick={() => setSelectedWork(work)}>
                      <div className="image-wrapper">
                        <img src={work.imageUrl} alt={work.title} loading="lazy" />
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
                  <div className="text-content">
                    <p><strong>Nikolas de Murtas</strong>, {t.bioP1.replace('Nikolas de Murtas, ', '')}</p>
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
                    <a href={pdfCatalogPath} target="_blank" rel="noopener noreferrer" className="pdf-btn">
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
                  <p className="classes-main-desc">{t.classesDesc}</p>

                  <div className="classes-info-box">
                    <p className="highlight-text">📍 {t.classesLoc}</p>
                    <p className="highlight-text">🗓️ {t.classesDays}</p>
                  </div>

                  <div className="class-media-grid">
                    {CLASS_MEDIA.map(renderClassMedia)}
                  </div>

                  <p className="classes-cta">{t.classesCTA}</p>
                  <div className="catalog-actions justify-center">
                    <a href="https://wa.me/5521982910593" target="_blank" rel="noreferrer" className="pdf-btn">
                      <span className="btn-icon"><WhatsAppIcon /></span>
                      WhatsApp: (21) 98291-0593
                    </a>
                    <a href="mailto:nikolasdemurtas@gmail.com" className="pdf-btn secondary">
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
                    <a className="contact-card" href="https://wa.me/5521982910593" target="_blank" rel="noreferrer">
                      <span className="contact-icon"><WhatsAppIcon /></span>
                      <span className="contact-label">WhatsApp</span>
                      <span className="contact-value">+55 (21) 98291-0593</span>
                    </a>

                    <a className="contact-card" href="mailto:nikolasdemurtas@gmail.com">
                      <span className="contact-icon"><MailIcon /></span>
                      <span className="contact-label">Email</span>
                      <span className="contact-value">nikolasdemurtas@gmail.com</span>
                    </a>

                    <a className="contact-card" href="https://instagram.com/nikolasdemurtas" target="_blank" rel="noreferrer">
                      <span className="contact-icon"><InstagramIcon /></span>
                      <span className="contact-label">Instagram</span>
                      <span className="contact-value">@nikolasdemurtas</span>
                    </a>
                  </div>
                </div>
              </section>
            )}
          </main>

          {/* MODAL ARTZOOM */}
          {selectedWork && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={handleCloseModal}>✕</button>

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
                  {!isZoomed && <div className="zoom-hint">🔍 Zoom </div>}
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

      {/* RODAPÉ ÚNICO */}
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
                <a href="https://moa-fernandes.github.io/gps-radio-radar/" target="_blank" rel="noreferrer">Conheça</a>
              </div>
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App