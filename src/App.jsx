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
          <a href="tel:0652277092" className="primary-btn">
            VOIR CARTE
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

const LocationCard = ({ name, address, zip }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="location-card glass-card"
  >
    <div className="location-header">
      <span className="location-name">{name}</span>
      <MapPin size={18} color={BOTNA_YELLOW} />
    </div>
    <div className="location-body">
      <p>{address}</p>
      <p>{zip} {name.toUpperCase()}</p>
    </div>
  </motion.div>
);

const CityDetail = ({ city }) => (
  <div className="city-detail-page">
    <header className="hero">
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
          <span className="section-label">LA CARTE</span>
          <h2>NOTRE MENU</h2>
        </div>
        
        <div className="carte-display">
          <div className="carte-placeholder glass-card">
            <div className="carte-grid">
               {/* Ici on peut mettre les pages du menu extraites du PDF */}
               <img src="/thai.png" alt="Menu part 1" className="menu-card" />
               <img src="/sushi.png" alt="Menu part 2" className="menu-card" />
            </div>
            <div className="carte-info">
              <h3>Consultez notre dépliant complet</h3>
              <p>Découvrez toutes nos spécialités Thaï et nos créations Sushi dans notre menu détaillé pour {city.name}.</p>
              <a href={`/dépliant-prépa-${city.pdf}.pdf`} className="primary-btn" target="_blank" rel="noreferrer">
                VOIR LE PDF COMPLET
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

const Hero = () => (
  <header className="hero">
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
        />
        <LocationCard 
          name="Beauzelle" 
          address="18 BOULEVARD DE L'EUROPE, 31700 Beauzelle" 
        />
        <LocationCard 
          name="Grenade" 
          address="6 AV DU PRÉSIDENT KENNEDY, 31330 Grenade" 
        />
        <LocationCard 
          name="Roquettes" 
          address="1 RUE COLLETTE BESSON, 31120 Roquettes" 
        />
      </div>
    </div>
  </header>
);

const History = () => (
  <section className="history-section">
    <div className="container">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="history-content"
      >
        <span className="section-label">L'HISTOIRE</span>
        <p>
          En 2024, dans la charmante ville de Colomiers, une nouvelle aventure culinaire a débuté avec l'ouverture du restaurant <strong>BOTNA</strong>, un lieu unique où les saveurs de la Thaïlande rencontrent l'art délicat des sushis japonais.
        </p>
        <p>
          Porté par un accueil chaleureux et un engouement grandissant, <strong>BOTNA</strong> poursuit son développement. Début 2025, le restaurant s'installe à <strong>Beauzelle</strong> pour continuer à faire voyager les papilles. Toujours fidèle à son identité, le lieu mêle avec élégance les parfums envoûtants de la cuisine thaïlandaise à la finesse des sushis japonais, dans un cadre moderne où tradition et créativité se rejoignent naturellement.
        </p>
        <p>
          L'histoire ne s'arrête pas là. À <strong>l'été 2025, BOTNA</strong> ouvre les portes d'un nouveau restaurant dans la ville de <strong>Grenade</strong>, marquant une nouvelle étape dans cette aventure gourmande. Chaque ouverture est pensée comme une invitation à découvrir une cuisine métissée, généreuse et sincère, où chaque plat raconte une histoire, entre Asie et Occident.
        </p>
        <p>
          Ainsi, BOTNA devient bien plus qu'un restaurant : une signature culinaire qui s'étend, fidèle à sa promesse d'offrir des expériences gustatives uniques, alliant exigence, authenticité et passion.
        </p>
      </motion.div>
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
          <h2>VOIR NOS PHOTOS</h2>
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
          <h2>EXCELLENT</h2>
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
      <h2 className="section-title">Nos adresses</h2>
      <div className="maps-grid">
        <MapItem address="42 Bd Victor Hugo, 31770 Colomiers" />
        <MapItem address="18 Bd de l'Europe, 31700 Beauzelle" />
        <MapItem address="6 Av. du Président Kennedy, 31330 Grenade" />
        <MapItem address="1 Rue Colette Besson, 31120 Roquettes" />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col footer-brand-col">
          <ElephantLogo size={140} />
          <p className="footer-tagline">Thai & Sushis</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Navigation</h3>
          <ul>
            <li><a href="#colomiers">Colomiers</a></li>
            <li><a href="#beauzelle">Beauzelle</a></li>
            <li><a href="#grenade">Grenade</a></li>
            <li><a href="#roquettes">Roquettes</a></li>
            <li><a href="#photos">Les photos</a></li>
            <li><a href="#avis">Les avis</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Informations</h3>
          <ul>
            <li><a href="#mentions">Mentions légales</a></li>
            <li><a href="#confidentialite">Politique de confidentialité</a></li>
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
      </div>
    </div>
  </footer>
);

function App() {
  const [activeCityId, setActiveCityId] = useState(null);

  const cities = [
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

  const activeCity = cities.find(c => c.id === activeCityId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCityId]);

  return (
    <div className="App">
      <Navbar 
        onCitySelect={setActiveCityId} 
        onHomeClick={() => setActiveCityId(null)} 
        cities={cities}
      />
      
      {activeCityId ? (
        <CityDetail city={activeCity} />
      ) : (
        <>
          <Hero />
          <History />
          <Gallery />
          <Reviews />
          <Maps />
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
