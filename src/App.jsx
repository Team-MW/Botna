import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Star, ExternalLink, ChevronRight, Menu, X } from 'lucide-react';
import './App.css';

const BOTNA_YELLOW = '#ecbd0e';

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

const Navbar = ({ onCitySelect, onHomeClick, cities }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    ...cities.map(city => ({ name: city.name, type: 'city', id: city.id })),
    { name: 'Les photos', href: '#photos', type: 'anchor' },
    { name: 'Les avis', href: '#avis', type: 'anchor' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo-small" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          <ElephantLogo size={120} />
        </div>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href || '#'}
              onClick={(e) => {
                if (link.type === 'city') {
                  e.preventDefault();
                  onCitySelect(link.id);
                }
                setIsMenuOpen(false);
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <a href="tel:+33652277092" className="primary-btn">
            APPELEZ
          </a>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const ElephantLogo = ({ size = 150 }) => (
  <img
    src="/logo-botna.png"
    alt="BOTNA Logo"
    style={{ width: size, height: 'auto', display: 'block' }}
  />
);

const LocationCard = ({ name, address, onClick }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="location-card glass-card"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <div className="location-header">
      <span className="location-name">{name}</span>
      <MapPin size={18} color={BOTNA_YELLOW} />
    </div>
    <div className="location-body">
      <p style={{ opacity: 0.9, marginBottom: '8px' }}>{address}</p>
      <p style={{ fontWeight: 800, color: BOTNA_YELLOW, letterSpacing: '0.1em' }}>{name.toUpperCase()}</p>
    </div>
  </motion.div>
);

const CityDetail = ({ city }) => (
  <div className="city-detail-page">
    <header className="hero">
      <VideoBackground videoId="h2V2mBBXgj4" onLoaded={() => { }} />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="city-hero-main"
        >
          <ElephantLogo size={420} />
          <div className="city-hero-text">
            <span className="section-label">{city.name.toUpperCase()}</span>
            <h1 className="city-title">{city.name}</h1>
            <p className="city-subtitle">{city.address}</p>
            <div className="city-actions" style={{ marginTop: '40px', justifyContent: 'center' }}>
              <a href={`tel:${city.phone.replace(/\s/g, '')}`} className="primary-btn large">
                <Phone size={24} />
                APPELEZ-NOUS
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </header>

    <section className="city-content-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">La Carte</span>
          <h2>Notre Menu</h2>
        </div>

        <div className="carte-display">
          <div className="carte-embed">
            <div className="menu-page-container glass-card">
              <span className="page-label">Recto / Thaï</span>
              <PDFPage url={`/dépliant-prépa-${city.pdf}.pdf`} pageNum={1} />
            </div>

            <div className="menu-page-container glass-card" style={{ marginTop: '40px' }}>
              <span className="page-label">Verso / Sushis</span>
              <PDFPage url={`/dépliant-prépa-${city.pdf}.pdf`} pageNum={2} />
            </div>

            <div className="carte-info" style={{ marginTop: '40px' }}>
              <p>Besoin de la version haute définition ?</p>
              <a href={`/dépliant-prépa-${city.pdf}.pdf`} className="primary-btn" target="_blank" rel="noreferrer">
                TÉLÉCHARGER LE PDF COMPLET
              </a>
            </div>
          </div>
        </div>

        <div className="city-map-section">
          <h2>Nous trouver à {city.name}</h2>
          <MapItem address={city.address} />
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
  </div>
);

const LegalNotice = () => (
  <div className="legal-page">
    <header className="hero">
      <VideoBackground videoId="h2V2mBBXgj4" onLoaded={() => { }} />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <ElephantLogo size={200} />
        <h1 className="city-title">Mentions Légales</h1>
      </div>
    </header>
    <section className="legal-content">
      <div className="container glass-card">
        <div className="legal-block">
          <h2>1. Présentation du site</h2>
          <p>En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site BOTNA l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :</p>
          <p><strong>Propriétaire :</strong> BOTNA – SARL au capital de 10 000€ – 42 Bd Victor Hugo, 31770 Colomiers</p>
          <p><strong>Responsable publication :</strong> BOTNA – contact@botna.fr</p>
          <p><strong>Hébergeur :</strong> Vercel Inc. – 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
        </div>
        <div className="legal-block">
          <h2>2. Conditions générales d’utilisation du site</h2>
          <p>L’utilisation du site BOTNA implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment.</p>
        </div>
        <div className="legal-block">
          <h2>3. Propriété intellectuelle</h2>
          <p>BOTNA est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.</p>
          <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : BOTNA.</p>
        </div>
        <div className="legal-block">
          <h2>4. Gestion des données personnelles</h2>
          <p>Le Client est informé des réglementations concernant la communication marketing, la loi du 21 Juin 2014 pour la confiance dans l’Economie Numérique, la Loi Informatique et Liberté du 06 Août 2004 ainsi que du Règlement Général sur la Protection des Données (RGPD : n° 2016-679).</p>
        </div>
      </div>
    </section>
  </div>
);

const GlobalLoader = () => (
  <div className="global-loader">
    <div className="loader-content">
      <ElephantLogo size={120} />
      <div className="spinner"></div>
    </div>
  </div>
);

const PDFPage = ({ url, pageNum }) => {
  const canvasRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const renderPage = async () => {
      try {
        if (!window.pdfjsLib) return;
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await window.pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        setIsLoading(false);
      } catch (err) {
        console.error('PDF error:', err);
      }
    };
    renderPage();
  }, [url, pageNum]);

  return (
    <div className="pdf-page-container">
      {isLoading && <div className="mini-spinner"></div>}
      <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: isLoading ? 'none' : 'block' }} />
    </div>
  );
};

const VideoBackground = ({ videoId, onLoaded }) => (
  <div className="video-background-container">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
      frameBorder="0"
      onLoad={onLoaded}
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      title="Background Video"
    ></iframe>
  </div>
);

const LoadingScreen = () => (
  <div className="video-loader">
    <div className="spinner"></div>
    <p>Préparation de votre voyage culinaire...</p>
  </div>
);

const Hero = ({ onCitySelect }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <header className="hero main-hero">
      <VideoBackground videoId="h2V2mBBXgj4" onLoaded={() => setIsVideoLoaded(true)} />
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
          <LocationCard
            name="Colomiers"
            address="42 BOULEVARD VICTOR HUGO, 31770 Colomiers"
            onClick={() => onCitySelect('colomiers')}
          />
          <LocationCard
            name="Beauzelle"
            address="18 BOULEVARD DE L'EUROPE, 31700 Beauzelle"
            onClick={() => onCitySelect('beauzelle')}
          />
          <LocationCard
            name="Grenade"
            address="6 AV DU PRÉSIDENT KENNEDY, 31330 Grenade"
            onClick={() => onCitySelect('grenade')}
          />
          <LocationCard
            name="Roquettes"
            address="1 RUE COLLETTE BESSON, 31120 Roquettes"
            onClick={() => onCitySelect('roquettes')}
          />
        </div>
      </div>
    </header>
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
            Chaque restaurant, de <strong>Beauzelle</strong> à <strong>Grenade</strong>, est une invitation au voyage, où tradition et créativité s'unissent pour une expérience gustative inoubliable.
          </p>
          <div className="history-signature">BOTNA Thai & Sushi</div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Gallery = () => {
  const images = [
    { src: '/thai.png', title: 'Crevette citron vert avec riz à l\'ail' },
    { src: '/sushi.png', title: 'Maki & sushi' },
    { src: '/thai.png', title: 'Labe de boeuf' },
    { src: '/sushi.png', title: 'Plateau Signature' },
    { src: '/thai.png', title: 'Pad Thai Traditionnel' },
    { src: '/sushi.png', title: 'California Rolls' },
  ];

  return (
    <section id="photos" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">UNE EXPLOSION DE SAVEUR</span>
          <h2>Découvrez nos Photos</h2>
        </div>
        <div className="gallery-grid">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="gallery-item"
            >
              <div className="gallery-img-wrapper">
                <img src={img.src} alt={img.title} />
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
          <ReviewCard
            name="Chea Mengchou"
            date="2025-07-23"
            text="Très belle découverte, ouvert... Les plats sont très bon et beaux. Le services est top. Les patrons sont très gentils."
          />
          <ReviewCard
            name="Rayane Oumanou"
            date="2025-07-23"
            text="Excellente expérience ! Les plats sont savoureux, bien épicés et pleins de saveurs. Le service est rapide et..."
          />
          <ReviewCard
            name="samy Oumanou"
            date="2025-07-23"
            text="Vraiment excellent ! Je recommande !"
          />
        </div>
      </div>
    </div>
  </section>
);

const MapItem = ({ address }) => {
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className="map-item">
      <iframe
        title={address}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
      ></iframe>
    </div>
  );
};

const Maps = () => (
  <section id="adresses" className="maps-section">
    <div className="container">
      <h2 className="section-title">Nos Adresses</h2>
      <div className="maps-grid">
        <MapItem address="42 Bd Victor Hugo, 31770 Colomiers" />
        <MapItem address="18 Bd de l'Europe, 31700 Beauzelle" />
        <MapItem address="6 Av. du Président Kennedy, 31330 Grenade" />
        <MapItem address="1 Rue Colette Besson, 31120 Roquettes" />
      </div>
    </div>
  </section>
);

const Footer = ({ onCitySelect, onHomeClick, onLegalClick }) => (
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
            <li><a href="#" onClick={(e) => { e.preventDefault(); onCitySelect('colomiers'); }}>Colomiers</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onCitySelect('beauzelle'); }}>Beauzelle</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onCitySelect('grenade'); }}>Grenade</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onCitySelect('roquettes'); }}>Roquettes</a></li>
            <li><a href="#photos" onClick={onHomeClick}>Les photos</a></li>
            <li><a href="#avis" onClick={onHomeClick}>Les avis</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Informations</h3>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onLegalClick(); }}>Mentions légales</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onLegalClick(); }}>Politique de confidentialité</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <p className="contact-info">
            <Phone size={18} color="var(--primary)" />
            <span>Tel : <a href="tel:0652277092">06 52 27 70 92</a></span>
          </p>
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

function App() {
  const [activeView, setActiveView] = useState('home'); // home, city, mentions
  const [activeCityId, setActiveCityId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... cities remain the same
  // (I'll keep the full data in the real replacement)

  useEffect(() => {
    // Hide global loader after initial load (+ some time for style)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Force scroll to top on view or city change
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [activeView, activeCityId]);

  const handleCitySelect = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveCityId(id);
      setActiveView('city');
      setIsLoading(false);
    }, 800);
  };

  const handleHomeClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveCityId(null);
      setActiveView('home');
      setIsLoading(false);
    }, 800);
  };

  const handleLegalClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveCityId(null);
      setActiveView('mentions');
      setIsLoading(false);
    }, 800);
  };

  const citiesData = [
    {
      id: 'colomiers',
      name: 'Colomiers',
      address: '42 Bd Victor Hugo, 31770 Colomiers',
      phone: '06 52 27 70 92',
      pdf: 'Colomiers2',
      faq: [
        { question: "Où manger les meilleurs sushis à Colomiers ?", answer: "Chez BOTNA, nous vous proposons une sélection rigoureuse de sushis frais préparés sur place chaque jour à Colomiers." },
        { question: "Existe-t-il un bon restaurant Thaï à Colomiers ?", answer: "BOTNA Colomiers mélange l'art délicat des sushis japonais avec les saveurs envoûtantes de la cuisine Thaïlandaise traditionnelle." }
      ]
    },
    {
      id: 'beauzelle',
      name: 'Beauzelle',
      address: '18 Bd de l\'Europe, 31700 Beauzelle',
      phone: '06 52 27 70 92',
      pdf: 'Beauzelle',
      faq: [
        { question: "Quel restaurant choisir à Beauzelle ?", answer: "Découvrez BOTNA Beauzelle : des bowls équilibrés, des sushis fins et des classiques de la cuisine Thaï dans un cadre moderne." },
        { question: "Où trouver des saveurs asiatiques à Beauzelle ?", answer: "Notre restaurant à Beauzelle est l'adresse idéale pour les amateurs de gastronomie asiatique de qualité près de Blagnac." }
      ]
    },
    {
      id: 'grenade',
      name: 'Grenade',
      address: '6 Av. du Président Kennedy, 31330 Grenade',
      phone: '06 52 27 70 92',
      pdf: 'Grenade',
      faq: [
        { question: "Où sortir manger en famille à Grenade ?", answer: "BOTNA Grenade vous accueille pour un moment convivial autour de plats généreux, alliant sushis créatifs et classiques thaïlandais." },
        { question: "Restaurant asiatique à Grenade (31) : quelles spécialités ?", answer: "Nous sommes fiers de vous proposer notre Pad Thaï traditionnel et nos plateaux signatures à Grenade." }
      ]
    },
    {
      id: 'roquettes',
      name: 'Roquettes',
      address: '1 Rue Colette Besson, 31120 Roquettes',
      phone: '06 52 27 70 92',
      pdf: 'Lèguevin',
      faq: [
        { question: "Où savourer des sushis de qualité à Roquettes ?", answer: "BOTNA Roquettes est l'adresse incontournable pour les passionnés de poissons frais et de recettes japonaises authentiques." },
        { question: "Livraison de plats Thaï à Roquettes ?", answer: "Commandez vos plats préférés chez BOTNA Roquettes et emportez avec vous toutes les saveurs de l'Asie." }
      ]
    },
  ];

  const activeCity = citiesData.find(c => c.id === activeCityId);

  return (
    <div className="App">
      {isLoading && <GlobalLoader />}

      <div className={`main-layout ${isLoading ? 'hidden' : 'visible'}`}>
        <Navbar
          onCitySelect={handleCitySelect}
          onHomeClick={handleHomeClick}
          cities={citiesData}
        />

        {activeView === 'city' && activeCity && (
          <CityDetail city={activeCity} />
        )}

        {activeView === 'mentions' && (
          <LegalNotice />
        )}

        {activeView === 'home' && (
          <>
            <Hero onCitySelect={handleCitySelect} />
            <History />
            <Gallery />
            <Reviews />
            <Maps />
          </>
        )}
        <Footer
          onCitySelect={handleCitySelect}
          onHomeClick={handleHomeClick}
          onLegalClick={handleLegalClick}
        />
      </div>
    </div>
  );
}

export default App;
