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
    contactTitle: 'Contact & Acquisition',
    contactDesc: 'For catalog availability, commissions, or atelier information:',
    rights: 'All rights reserved.'
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
    classesTitle: 'Aulas de Pintura a Óleo',
    classesDesc: 'Aprenda as técnicas da pintura a óleo inspiradas nos grandes mestres. As aulas focam na pintura do natural, proporção, preparação clássica de telas e criação de narrativas com base na filosofia de Odd Nerdrum.',
    classesLoc: 'Local: Copacabana, Rio de Janeiro - RJ',
    classesDays: 'Dias disponíveis: Terças e Quintas (Manhã/Tarde) e Sábados.',
    classesCTA: 'Entre em contato para verificar horários disponíveis.',
    contactTitle: 'Contato & Aquisição',
    contactDesc: 'Para disponibilidade de obras, encomendas ou informações de atelier:',
    rights: 'Todos os direitos reservados.'
  }
}

function App() {
  const [lang, setLang] = useState<'en' | 'pt'>('en')
  const [hasEntered, setHasEntered] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'works' | 'bio' | 'catalog' | 'classes' | 'contact'>('works')
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [bgIndex, setBgIndex] = useState(0)
  
  // Header Scroll State
  const [isScrolled, setIsScrolled] = useState(false)
  
  // ArtZoom State & Ref
  const [isZoomed, setIsZoomed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'pt' : 'en')
  }

  const handleCloseModal = () => {
    setSelectedWork(null)
    setIsZoomed(false)
  }

  // ArtZoom Mouse Tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed && imgRef.current) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      imgRef.current.style.transformOrigin = `${x}% ${y}%`
    }
  }

  return (
    <div className="nerdrum-theme">
      
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
            <button className="enter-works-btn glow-effect" onClick={() => { setHasEntered(true); setActiveTab('works') }}>
              {t.btnEnter}
            </button>
          </div>
          </section>
        </>
      ) : (
        <div className="site-wrapper fade-in">
          {/* Header com a classe dinâmica 'scrolled' */}
          <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">

              <div className="header-top-actions">
                <button className="lang-toggle" onClick={toggleLanguage}>
                  {lang === 'en' ? 'Mudar para Português (PT)' : 'Switch to English (EN)'}
                </button>
              </div>

              <div className="brand" onClick={() => setHasEntered(false)}>
                <span className="subtitle">{t.subtitle}</span>
                <h1 className="artist-title">Nikolas de Murtas</h1>
                <span className="instagram-handle">@nikolasdemurtas</span>
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

                  <p className="classes-cta">{t.classesCTA}</p>
                  <div className="catalog-actions justify-center">
                    <a href="https://wa.me/5521982910593" target="_blank" rel="noreferrer" className="pdf-btn">WhatsApp: (21) 98291-0593</a>
                    <a href="mailto:nikolasdemurtas@gmail.com" className="pdf-btn secondary">nikolasdemurtas@gmail.com</a>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'contact' && (
              <section className="contact-section slide-up">
                <div className="content-container text-center">
                  <h2>{t.contactTitle}</h2>
                  <p>{t.contactDesc}</p>
                  <div className="contact-details">
                    <p><strong>WhatsApp / Phone:</strong> <a href="https://wa.me/5521982910593" target="_blank" rel="noreferrer">+55 (21) 98291-0593</a></p>
                    <p><strong>Email:</strong> <a href="mailto:nikolasdemurtas@gmail.com">nikolasdemurtas@gmail.com</a></p>
                    <p><strong>Instagram:</strong> <a href="https://instagram.com/nikolasdemurtas" target="_blank" rel="noreferrer">@nikolasdemurtas</a></p>
                  </div>
                </div>
              </section>
            )}
          </main>

          {/* MODAL ARTZOOM (APENAS PARA OBRAS) */}
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

          <footer className="site-footer">
            <div className="footer-container">
              <p>© {new Date().getFullYear()} Moacir Fernandes.  {t.rights}</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}

export default App