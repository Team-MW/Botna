import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Star, ExternalLink, ChevronRight, Menu, X } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const BOTNA_YELLOW = '#ecbd0e';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Icons ---
const Instagram = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// --- Global UI Components ---
const ElephantLogo = ({ size = 150 }) => (
  <img
    src="/logo-botna.png"
    alt="BOTNA Logo"
    style={{ width: size, height: 'auto', display: 'block' }}
  />
);

const Navbar = ({ cities }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    ...cities.map(city => ({ name: city.name, path: `/${city.id}` })),
    { name: 'Les photos', path: '/#photos' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo-small">
          <ElephantLogo size={120} />
        </Link>

        {/* Desktop Links */}
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            link.path.startsWith('/#') ? (
               <a key={link.name} href={link.path} onClick={() => setIsMenuOpen(false)}>
                 {link.name}
               </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <div className="nav-actions">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const VideoBackground = ({ videoId, onLoaded }) => {
  const playerRef = React.useRef(null);
  const containerId = React.useMemo(() => `yt-player-${Math.random().toString(36).substr(2, 9)}`, []);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  
  // Use a ref for the callback to avoid re-running the player setup if the function identity changes
  const onLoadedRef = React.useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    const loadVideo = () => {
      if (!window.YT || !window.YT.Player) {
        if (!document.getElementById('youtube-sdk')) {
          const tag = document.createElement('script');
          tag.id = 'youtube-sdk';
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        const checkInterval = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkInterval);
            createPlayer();
          }
        }, 100);
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, showinfo: 0, rel: 0,
          modestbranding: 1, playsinline: 1, iv_load_policy: 3,
          autohide: 1, enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            setTimeout(() => {
              const playPromise = event.target.playVideo();
              if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {});
              }
            }, 500);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Now ultra-fast: 0.5s buffer
              setTimeout(() => {
                setIsVideoVisible(true);
                if (onLoadedRef.current) onLoadedRef.current();
              }, 500); 
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(0);
              event.target.playVideo();
            }
          }
        }
      });
    };
    loadVideo();
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, containerId]);

  return (
    <div className="video-background-container" style={{ opacity: isVideoVisible ? 1 : 0, transition: 'opacity 1s ease' }}>
      <div id={containerId} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

const ImageModal = ({ src, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="image-modal-overlay"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 20 }}
      className="image-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button className="modal-close" onClick={onClose}>
        <X size={32} />
      </button>
      <img src={src} alt="Menu Zoom" />
    </motion.div>
  </motion.div>
);

const FullScreenLoader = ({ isVisible }) => (
  <AnimatePresence mode="wait">
    {isVisible && (
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Performance optimized: No 24MB image, used high-end gradient instead */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, #012a45 0%, #011e31 100%)',
            opacity: 0.95
          }}
        />
        
        {/* Central Logo for branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <ElephantLogo size={200} />
          <div style={{ marginTop: '20px' }}>
             <h2 style={{ color: BOTNA_YELLOW, letterSpacing: '0.4em', fontSize: '1.5rem', textTransform: 'uppercase' }}>Botna</h2>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Page Components ---

const LocationCard = ({ city }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="location-card glass-card"
      onClick={() => navigate(`/${city.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="location-header">
        <span className="location-name">{city.name}</span>
        <MapPin size={18} color={BOTNA_YELLOW} />
      </div>
      <div className="location-body">
        <p style={{ opacity: 0.9, marginBottom: '8px' }}>{city.address}</p>
        <p style={{ fontWeight: 800, color: BOTNA_YELLOW, letterSpacing: '0.1em' }}>{city.name.toUpperCase()}</p>
      </div>
    </motion.div>
  );
};

const HomePage = ({ cities, onVideoLoaded }) => {
  return (
  <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <header className="hero main-hero">
      <VideoBackground videoId="h2V2mBBXgj4" onLoaded={onVideoLoaded} />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-logo-container"
        >
          <div className="hero-logo-row">
            <ElephantLogo size={600} />
          </div>
        </motion.div>

        <div className="hero-locations-grid">
          {cities.map(city => (
            <LocationCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </header>
    <InstagramFeed />
    <Gallery />
    <Reviews />
    <Maps />
    <History />
  </motion.div>
  );
};

const CityPage = ({ cities, onVideoLoaded }) => {
  const { cityId } = useParams();
  const city = cities.find(c => c.id === cityId);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!city) return <div className="container" style={{padding:'200px 0', textAlign:'center'}}><h1>Page non trouvée</h1><Link to="/">Retour à l'accueil</Link></div>;

  return (
    <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="city-detail-page">
      <AnimatePresence>
        {selectedImage && <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
      </AnimatePresence>
      <header className="hero">
        <VideoBackground videoId="h2V2mBBXgj4" onLoaded={onVideoLoaded} />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="city-hero-main"
          >
            <ElephantLogo size={420} />
            <div className="city-hero-text">
              <h1 className="city-title">{city.name}</h1>
              <p className="city-subtitle">{city.address}</p>
              <div className="city-actions" style={{ marginTop: '40px', justifyContent: 'center' }}>
                <a href={`tel:${city.phone.replace(/\s/g, '')}`} className="primary-btn large">
                  <Phone size={24} />
                  NOUS APPELER : {city.phone}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="city-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Notre Menu</h2>
          </div>

          <div className="carte-display">
            <div className="carte-embed">
              <div 
                className="menu-page-container glass-card" 
                onClick={() => setSelectedImage(`/assets/menus/${city.pdf}-1.png`)}
                style={{ cursor: 'zoom-in' }}
              >
                <img src={`/assets/menus/${city.pdf}-1.png`} alt="Menu Recto" style={{width:'100%', height:'auto', borderRadius:'15px'}} onError={(e)=>e.target.src='/thai.png'}/>
                <div className="zoom-hint"><ExternalLink size={16} /> Cliquer pour agrandir</div>
              </div>

              <div 
                className="menu-page-container glass-card" 
                onClick={() => setSelectedImage(`/assets/menus/${city.pdf}-2.png`)}
                style={{ marginTop: '40px', cursor: 'zoom-in' }}
              >
                <img src={`/assets/menus/${city.pdf}-2.png`} alt="Menu Verso" style={{width:'100%', height:'auto', borderRadius:'15px'}} onError={(e)=>e.target.src='/sushi.png'}/>
                <div className="zoom-hint"><ExternalLink size={16} /> Cliquer pour agrandir</div>
              </div>
            </div>
          </div>

          <div className="city-map-section">
            <h2>Nous trouver à {city.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: city.hours ? 'repeat(auto-fit, minmax(400px, 1fr))' : '1fr', gap: '30px' }}>
              <div className="map-item">
                 <iframe title={city.name} width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(city.address)}&output=embed`} allowFullScreen></iframe>
              </div>
              
              {city.hours && (
                <div className="city-hours glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '25px', fontSize: '1.8rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>Horaires d'ouverture</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {city.hours.map((h, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px', fontSize: '1.1rem' }}>
                        <strong style={{ textTransform: 'capitalize', letterSpacing: '0.05em' }}>{h.day}</strong>
                        <span style={{ color: h.time === 'Fermé' ? '#ef4444' : 'var(--white)', fontWeight: h.time === 'Fermé' ? 'bold' : 'normal' }}>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="city-faq-section">
            <div className="section-header">
              <span className="section-label">FAQ</span>
              <h2>QUESTIONS FRÉQUENTES</h2>
            </div>
            <div className="faq-grid">
              {city.faq.map((item, idx) => (
                <div key={idx} className="faq-item glass-card">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <InstagramFeed />
      <Gallery />
      <History />
    </motion.div>
  );
};

const History = () => (
  <section className="history-section">
    <div className="section-watermark">BOTNA</div>
    <div className="container">
      <div className="history-grid">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="history-visual"
        >
          <div className="decorative-circle">
            <ElephantLogo size={250} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="history-content"
        >
          <div className="section-label-container">
            <span className="section-label">NOTRE HISTOIRE</span>
          </div>
          <h2 className="history-title">Une Signature Culinaire Unique</h2>
          <p>
            En 2024, à Colomiers, <strong>BOTNA</strong> est né d'une passion : fusionner l'énergie de la Thaïlande et la finesse du Japon.
          </p>
          <p>
            Chaque restaurant, de <strong>Colomiers</strong> à <strong>Léguevin</strong>, en passant par <strong>Beauzelle</strong> et <strong>Grenade</strong>, est une invitation au voyage, où tradition et créativité s'unissent pour une expérience gustative inoubliable.
          </p>
          <div className="history-signature">BOTNA Thai & Sushi</div>
        </motion.div>
      </div>
    </div>
  </section>
);

const GALLERY_IMAGES = [
  { src: '/IMG_4175.jpg', title: 'Plateau Signature' },
  { src: '/IMG_4297.jpg', title: 'Création Botna' },
  { src: '/IMG_5200.jpg', title: 'Assortiment Sushi' },
  { src: '/IMG_5293.jpg', title: 'Sélection du Chef' },
  { src: '/IMG_4211 - copie.jpg', title: 'Trésor Mixte', bright: true },
  { src: '/IMG_4328.jpg', title: 'Délices du Chef', bright: true },
];

const Gallery = () => {
  return (
    <section id="photos" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">UNE EXPLOSION DE SAVEUR</span>
          <h2>Découvrez nos Photos</h2>
        </div>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="gallery-item"
            >
              <div className="gallery-img-wrapper">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  loading="lazy" 
                  decoding="async" 
                  style={img.bright ? { filter: 'brightness(1.5) contrast(1.1)' } : {}} 
                />
              </div>
              <h3>{img.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewCard = ({ name, date, text, rating = 5 }) => (
  <div className="review-card">
    <div className="review-header">
      <div className="review-user">
        <div className="user-avatar">{name[0]}</div>
        <div>
          <h4>{name}</h4>
          <span>{date}</span>
        </div>
      </div>
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="20" />
    </div>
    <div className="review-stars">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={16} fill={BOTNA_YELLOW} color={BOTNA_YELLOW} />
      ))}
    </div>
    <p>{text}</p>
  </div>
);

const Reviews = () => (
  <section id="avis" className="reviews-section">
    <div className="container">
      <div className="reviews-layout">
        <div className="reviews-summary">
          <h2>Ce que disent nos Clients</h2>
          <div className="stars-large">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={30} fill={BOTNA_YELLOW} color={BOTNA_YELLOW} />
            ))}
          </div>
          <p>Basée sur <strong>323 avis</strong></p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" width="100" />
        </div>
        <div className="reviews-slider">
          <ReviewCard name="Chea Mengchou" date="2025-07-23" text="Très belle découverte, ouvert... Les plats sont très bon et beaux. Le services est top. Les patrons sont très gentils." />
          <ReviewCard name="Rayane Oumanou" date="2025-07-23" text="Excellente expérience ! Les plats sont savoureux, bien épicés et pleins de saveurs. Le service est rapide et..." />
          <ReviewCard name="samy Oumanou" date="2025-07-23" text="Vraiment excellent ! Je recommande !" />
        </div>
      </div>
    </div>
  </section>
);

const InstagramFeed = () => {
  return (
    <section className="instagram-section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div className="insta-icon-wrapper">
              <Instagram size={40} color={BOTNA_YELLOW} />
            </div>
            <h2 style={{ margin: 0 }}>Suivez-nous sur Instagram</h2>
            <a 
              href="https://www.instagram.com/botna_thai_sushi/" 
              target="_blank" 
              rel="noreferrer" 
              className="insta-handle-btn"
            >
              @botna_thai_sushi
            </a>
          </div>
        </div>
        
        <div className="insta-hero-container">
          <motion.a
            whileHover={{ scale: 1.01 }}
            href="https://www.instagram.com/botna_thai_sushi/"
            target="_blank"
            rel="noreferrer"
            className="insta-hero-link"
          >
            <img 
              src="/instagram.jpg" 
              alt="Instagram Botna Feed" 
              className="insta-full-img" 
              loading="lazy" 
              decoding="async" 
            />
            <div className="insta-full-overlay">
              <div className="insta-overlay-content">
                <Instagram size={50} color="#fff" />
                <span>VOIR SUR INSTAGRAM</span>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

const Maps = () => (
  <section id="adresses" className="maps-section">
    <div className="container">
      <h2 className="section-title">Nos Adresses</h2>
      <div className="maps-grid">
        {[
          { name: "Colomiers", q: "42+Bd+Victor+Hugo,+31770+Colomiers" },
          { name: "Beauzelle", q: "18+Bd+de+l'Europe,+31700+Beauzelle" },
          { name: "Grenade", q: "6+Av.+du+Président+Kennedy,+31330+Grenade" },
          { name: "Léguevin", q: "18+Allées+des+Cordeliers,+31490+Léguevin" },
          { name: "Roquettes", q: "1+Rue+Colette+Besson,+31120+Roquettes" }
        ].map((loc) => (
          <div className="map-item" key={loc.name} style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 10,
              backgroundColor: BOTNA_YELLOW,
              color: '#011e31',
              padding: '10px 25px',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              {loc.name}
            </div>
            <iframe
              title={loc.name}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${loc.q}&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = ({ cities }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col footer-brand-col">
          <ElephantLogo size={140} />
          <p className="footer-tagline">Thai & Sushis</p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/botna_thai_sushi/?hl=fr" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://www.facebook.com/people/Botna-Tha%C3%AF-sushi/61554246296312/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Navigation</h3>
          <ul>
            {cities.map(city => (
              <li key={city.id}><Link to={`/${city.id}`}>{city.name}</Link></li>
            ))}
            <li><a href="/#photos">Les photos</a></li>
            <li><a href="/#avis">Les avis</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Informations</h3>
          <ul>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/mentions-legales">Politique de confidentialité</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <div className="contact-info" style={{ alignItems: 'flex-start' }}>
            <Phone size={18} color="var(--primary)" style={{ marginTop: '5px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cities.map(city => (
                <span key={city.id} style={{ fontSize: '0.9rem' }}>
                  {city.name} : <a href={`tel:${city.phone.replace(/\s/g, '')}`}>{city.phone}</a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BOTNA Thai & Sushis. Tous droits réservés.</p>
        <p style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.7 }}>
          Réalisé par <a href="https://microdidact.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>Microdidact</a>
        </p>
      </div>
    </div>
  </footer>
);

// --- Main App ---

function App() {
  const citiesData = [
    {
      id: 'colomiers', name: 'Colomiers', address: '42 Bd Victor Hugo, 31770 Colomiers', phone: '06 52 27 70 92', pdf: 'Colomiers2',
      faq: [
        { question: "Où manger les meilleurs sushis à Colomiers ?", answer: "Chez BOTNA, nous vous proposons une sélection rigoureuse de sushis frais préparés sur place chaque jour à Colomiers." },
        { question: "Existe-t-il un bon restaurant Thaï à Colomiers ?", answer: "BOTNA Colomiers mélange l'art délicat des sushis japonais avec les saveurs envoûtantes de la cuisine Thaïlandaise traditionnelle." },
        { question: "Proposez-vous la vente à emporter ?", answer: "Oui, tous nos plats sont disponibles en Click & Collect pour un voyage culinaire chez vous." },
        { question: "Y a-t-il des options végétariennes ?", answer: "Absolument, nous proposons une variété de makis et de plats thaïs adaptés aux régimes végétariens." }
      ],
      hours: [
        { day: 'lundi', time: 'Fermé' },
        { day: 'mardi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'mercredi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'jeudi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'vendredi', time: '12:00–14:30, 19:00–22:30' },
        { day: 'samedi', time: '12:00–14:30, 19:00–22:30' },
        { day: 'dimanche', time: '12:00–14:30, 18:30–22:00' }
      ]
    },
    {
      id: 'beauzelle', name: 'Beauzelle', address: '18 Bd de l\'Europe, 31700 Beauzelle', phone: '06 82 03 30 30', pdf: 'Beauzelle',
      faq: [
        { question: "Quel restaurant choisir à Beauzelle ?", answer: "Découvrez BOTNA Beauzelle : des bowls équilibrés, des sushis fins et des classiques de la cuisine Thaï dans un cadre moderne." },
        { question: "Où trouver des saveurs asiatiques à Beauzelle ?", answer: "Notre restaurant à Beauzelle est l'adresse idéale pour les amateurs de gastronomie asiatique de qualité près de Blagnac." },
        { question: "Est-il facile de se garer ?", answer: "Le restaurant dispose de facilités de stationnement à proximité immédiate pour votre confort." },
        { question: "Quels sont les horaires ?", answer: "Nous vous accueillons tous les jours pour satisfaire vos envies de sushis et plats thaïlandais." }
      ],
      hours: [
        { day: 'lundi', time: 'Fermé' },
        { day: 'mardi', time: '12:00–14:00, 19:00–22:00' },
        { day: 'mercredi', time: '12:00–14:00, 19:00–22:00' },
        { day: 'jeudi', time: '12:00–14:00, 19:00–22:00' },
        { day: 'vendredi', time: '12:00–14:00, 19:00–22:00' },
        { day: 'samedi', time: '12:00–14:00, 19:00–22:00' },
        { day: 'dimanche', time: '12:00–14:00, 19:00–22:00' }
      ]
    },
    {
      id: 'grenade', name: 'Grenade', address: '6 Av. du Président Kennedy, 31330 Grenade', phone: '06 88 77 65 72', pdf: 'Grenade',
      faq: [
        { question: "Où sortir manger en famille à Grenade ?", answer: "BOTNA Grenade vous accueille pour un moment convivial autour de plats généreux, alliant sushis créatifs et classiques thaïlandais." },
        { question: "Restaurant asiatique à Grenade (31) : quelles spécialités ?", answer: "Nous sommes fiers de vous proposer notre Pad Thaï traditionnel et nos plateaux signatures à Grenade." },
        { question: "Les produits sont-ils frais ?", answer: "La fraîcheur est notre priorité, tous nos poissons et légumes sont sélectionnés avec le plus grand soin." },
        { question: "Acceptez-vous les tickets restaurant ?", answer: "Oui, nous acceptons les titres restaurant ainsi que les principales cartes bancaires." }
      ],
      hours: [
        { day: 'lundi', time: 'Fermé' },
        { day: 'mardi', time: '12:00–14:30, 18:30–22:00' },
        { day: 'mercredi', time: '12:00–14:30, 18:30–22:00' },
        { day: 'jeudi', time: '12:00–14:30, 18:30–22:00' },
        { day: 'vendredi', time: '12:00–14:30, 18:30–22:30' },
        { day: 'samedi', time: '12:00–14:30, 18:30–22:30' },
        { day: 'dimanche', time: '12:00–14:30, 19:00–22:00' }
      ]
    },
    {
      id: 'leguevin', name: 'Léguevin', address: '18 Allées des Cordeliers, 31490 Léguevin', phone: '06 07 96 63 38', pdf: 'Lèguevin',
      faq: [
        { question: "Où manger les meilleurs sushis à Léguevin ?", answer: "Chez BOTNA, nous vous proposons une sélection rigoureuse de sushis frais préparés sur place chaque jour à Léguevin." },
        { question: "Existe-t-il un bon restaurant Thaï à Léguevin ?", answer: "BOTNA Léguevin mélange l'art délicat des sushis japonais avec les saveurs envoûtantes de la cuisine Thaïlandaise traditionnelle." },
        { question: "Proposez-vous la vente à emporter à Léguevin ?", answer: "Oui, tous nos plats sont disponibles en Click & Collect pour un voyage culinaire chez vous." },
        { question: "Comment réserver à Léguevin ?", answer: "Vous pouvez nous appeler directement au 06 07 96 63 38 pour vos réservations ou commandes." }
      ],
      hours: [
        { day: 'lundi', time: 'Fermé' },
        { day: 'mardi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'mercredi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'jeudi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'vendredi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'samedi', time: '12:00–14:30, 19:00–22:00' },
        { day: 'dimanche', time: '12:00–14:30, 19:00–22:00' }
      ]
    },
    {
      id: 'roquettes', name: 'Roquettes', address: '1 Rue Colette Besson, 31120 Roquettes', phone: '06 86 30 68 65', pdf: 'Lèguevin',
      faq: [
        { question: "Où savourer des sushis de qualité à Roquettes ?", answer: "BOTNA Roquettes est l'adresse incontournable pour les passionnés de poissons frais et de recettes japonaises authentiques." },
        { question: "Livraison de plats Thaï à Roquettes ?", answer: "Commandez vos plats préférés chez BOTNA Roquettes et emportez avec vous toutes les saveurs de l'Asie." },
        { question: "Peut-on commander pour un groupe ?", answer: "Nous réalisons des plateaux sur-mesure pour vos événements et réunions de groupe." },
        { question: "Comment réserver ?", answer: "Vous pouvez nous appeler directement au 06 86 30 68 65 pour vos réservations ou commandes." }
      ]
    },
  ];

  return (
    <Router>
      <AppContent citiesData={citiesData} />
    </Router>
  );
}

function AppContent({ citiesData }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const location = useLocation();

  // Reset loader on route change to hide new video initialization
  useEffect(() => {
    setVideoLoaded(false);
    setMinTimeElapsed(false);
    setImagesLoaded(false);
    
    // Preload critical images
    const imagesToPreload = [
      ...GALLERY_IMAGES.map(i => i.src),
      '/instagram.jpg',
      '/logo-botna-ligne-1-scaled-1024x409.png',
      '/logo-botna.png' // Elephant logo already in loader, keep it cached
    ];
    
    // If on a city page, preload that city's menu images
    const cityMatch = location.pathname.match(/^\/([^/]+)/);
    if (cityMatch) {
      const cityId = cityMatch[1];
      const city = citiesData.find(c => c.id === cityId);
      if (city) {
        imagesToPreload.push(`/assets/menus/${city.pdf}-1.png`);
        imagesToPreload.push(`/assets/menus/${city.pdf}-2.png`);
      }
    }

    let loadedCount = 0;
    const totalToLoad = imagesToPreload.length;

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalToLoad) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++; // Still increment on error to not block forever
        if (loadedCount >= totalToLoad) {
          setImagesLoaded(true);
        }
      };
    });

    // Failsafe if images take too long
    const imagesFailsafe = setTimeout(() => setImagesLoaded(true), 5000);
    
    // Ultra-optimized timers
    const timerMin = setTimeout(() => setMinTimeElapsed(true), 800);
    const failsafe = setTimeout(() => setVideoLoaded(true), 4000);
    
    return () => {
      clearTimeout(timerMin);
      clearTimeout(failsafe);
      clearTimeout(imagesFailsafe);
    };
  }, [location.pathname, citiesData]);

  const showOverlay = !videoLoaded || !minTimeElapsed || !imagesLoaded;

  return (
    <div className="App">
      <ScrollToTop />
      <FullScreenLoader isVisible={showOverlay} />
      <Navbar cities={citiesData} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage cities={citiesData} onVideoLoaded={() => setVideoLoaded(true)} />} />
          <Route path="/:cityId" element={<CityPage cities={citiesData} onVideoLoaded={() => setVideoLoaded(true)} />} />
          <Route path="/mentions-legales" element={<div className="legal-page" style={{paddingTop:'100px'}}><div className="container glass-card"><h1>Mentions Légales</h1><p>Contenu en cours de mise à jour...</p><Link to="/">Retour</Link></div></div>} />
        </Routes>
      </AnimatePresence>
      <Footer cities={citiesData} />
    </div>
  );
}

export default App;
