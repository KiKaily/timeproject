import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

const Landing = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [language, setLanguage] = useState("en");

  const sections = [
    {
      id: "hero",
      titleEn: "Welcome",
      titleEs: "Bienvenido",
      titleFr: "Bienvenue",
      descEn: "Discover Something Amazing",
      descEs: "Descubre algo increíble",
      descFr: "Découvrez quelque chose d'incroyable",
    },
    {
      id: "features",
      titleEn: "Features",
      titleEs: "Características",
      titleFr: "Fonctionnalités",
      descEn: "Innovative solutions for your needs",
      descEs: "Soluciones innovadoras para tus necesidades",
      descFr: "Des solutions innovantes pour vos besoins",
    },
    {
      id: "about",
      titleEn: "About Us",
      titleEs: "Sobre Nosotros",
      titleFr: "À Propos",
      descEn: "Learn our story and mission",
      descEs: "Conoce nuestra historia y misión",
      descFr: "Découvrez notre histoire et notre mission",
    },
    {
      id: "services",
      titleEn: "Services",
      titleEs: "Servicios",
      titleFr: "Services",
      descEn: "What we offer to you",
      descEs: "Lo que te ofrecemos",
      descFr: "Ce que nous vous offrons",
    },
    {
      id: "contact",
      titleEn: "Get In Touch",
      titleEs: "Póngase en Contacto",
      titleFr: "Nous Contacter",
      descEn: "We'd love to hear from you",
      descEs: "Nos encantaría saber de ti",
      descFr: "Nous aimerions avoir de vos nouvelles",
    },
  ];

  const getTitle = (section: any) => {
    if (language === "en") return section.titleEn;
    if (language === "es") return section.titleEs;
    return section.titleFr;
  };

  const getDesc = (section: any) => {
    if (language === "en") return section.descEn;
    if (language === "es") return section.descEs;
    return section.descFr;
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        setCurrentSection(currentSection - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, sections.length]);

  const scrollToSection = (index: number) => {
    setCurrentSection(index);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-beige">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.3)" }}
      >
        <source
          src="https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_60fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header Navigation */}
        <header className="fixed top-0 right-0 z-50 p-6 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
            <Globe size={20} className="text-white" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="en" className="text-black">
                English
              </option>
              <option value="es" className="text-black">
                Español
              </option>
              <option value="fr" className="text-black">
                Français
              </option>
            </select>
          </div>
        </header>

        {/* Scroll Sections */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white px-8 max-w-4xl">
            <h1 className="text-7xl md:text-8xl font-bold mb-6 drop-shadow-lg">
              {getTitle(sections[currentSection])}
            </h1>
            <p className="text-2xl md:text-3xl font-light drop-shadow-md">
              {getDesc(sections[currentSection])}
            </p>

            {/* Section Content */}
            <div className="mt-12 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              {currentSection === 0 && (
                <p className="opacity-90">
                  Experience the future of digital solutions with our innovative platform.
                </p>
              )}
              {currentSection === 1 && (
                <div className="space-y-4">
                  <p>✨ Beautiful Design</p>
                  <p>⚡ Lightning Fast</p>
                  <p>🔒 Secure & Reliable</p>
                </div>
              )}
              {currentSection === 2 && (
                <p className="opacity-90">
                  Founded with a mission to revolutionize how people interact with technology.
                  We believe in excellence, innovation, and customer satisfaction.
                </p>
              )}
              {currentSection === 3 && (
                <div className="space-y-4">
                  <p>📱 Mobile Solutions</p>
                  <p>🌐 Web Development</p>
                  <p>💼 Enterprise Services</p>
                </div>
              )}
              {currentSection === 4 && (
                <p className="opacity-90">
                  Reach out to us for more information or partnership opportunities.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-20 pb-8 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSection
                    ? "w-8 bg-white"
                    : "w-3 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-white/70 text-sm">
            {currentSection + 1} / {sections.length}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-sm flex items-center gap-2">
            <span>📧</span>
            <a
              href="mailto:contact@projectelallavor.com"
              className="hover:text-blue-300 transition"
            >
              contact@projectelallavor.com
            </a>
          </div>

          <div className="text-white text-sm flex items-center gap-2">
            <span>📍</span>
            <span>Worldwide</span>
          </div>

          <div className="text-white text-sm flex items-center gap-2">
            <span>📞</span>
            <a
              href="tel:+14155552671"
              className="hover:text-blue-300 transition"
            >
              +1 (415) 555-2671
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
