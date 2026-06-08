import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, CheckSquare, Settings, Heart, MessageSquare, Award, ArrowUpRight, HelpCircle, Shield, User, Hotel, Mail, Phone, ChevronRight, Lock, Sun, Moon } from 'lucide-react';
import InstagramFeed from './components/InstagramFeed';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import AiAssistant from './components/AiAssistant';
import { Booking, AppSettings } from './types';
import { LanguageCode, LANGUAGES, TRANSLATIONS } from './translations';
import doctorProfile from '../images/drhuseyinblikci.jpg';

export default function App() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [showAdminTab, setShowAdminTab] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Staff secure administrative mode
  const [isStaff, setIsStaff] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const isLocalStaff = localStorage.getItem('is_staff') === 'true' || localStorage.getItem('is_rayane') === 'true';
    const hasStaffParam = params.has('staff') || params.has('Staff') || params.has('rayane') || params.has('Rayane');
    if (hasStaffParam) {
      localStorage.setItem('is_staff', 'true');
      return true;
    }
    return isLocalStaff;
  });

  const [secretClicks, setSecretClicks] = useState(0);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const handleSecretClick = () => {
    setSecretClicks(prev => {
      const newVal = prev + 1;
      if (newVal >= 3) {
        const targetVal = !isStaff;
        setIsStaff(targetVal);
        localStorage.setItem('is_staff', String(targetVal));
        return 0;
      }
      return newVal;
    });
  };

  // Fetch settings & bookings from custom Express full-stack API representation
  const fetchData = async () => {
    try {
      const [resSettings, resBookings] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/bookings')
      ]);

      if (resSettings.ok && resBookings.ok) {
        const valSettings = await resSettings.json();
        const valBookings = await resBookings.json();
        setSettings(valSettings);
        setBookings(valBookings);
      }
    } catch (err) {
      console.error("Failed to load application coordinates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const sectionIds = ['about', 'expertises', 'instagram-feed', 'reserve'];
    const handleScroll = () => {
      // Fallback: If scrolled to the absolute bottom, select the reservation section
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
        setActiveSection('reserve');
        return;
      }

      const scrollPosition = window.scrollY + 180; // height offset to trigger active state naturally
      
      let currentSection = 'about';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run an initial timeout check to make sure correct section is painted after assets or layout shifts
    const timer = setTimeout(handleScroll, 200);

    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Update administrative notification email on the backend
  const handleUpdateSettings = async (newEmail: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationEmail: newEmail })
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-500/20 selection:text-teal-900" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Premium Glassmorphic Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Clinician Brand Title */}
        <div 
          className="flex items-center gap-3 select-none"
          title="Opera Yaşam Clinique"
        >
          <div className="w-10 h-10 shadow-md rounded-full overflow-hidden shrink-0 border border-teal-500/30">
            <img 
              src={doctorProfile} 
              alt="Dr. Hüseyin Balıkçı Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-display font-black text-slate-900 text-base leading-none tracking-tight">Opera Yaşam</h1>
            <span className="text-[10px] text-teal-600 uppercase tracking-widest font-bold block mt-0.5">{t.navBrandSub}</span>
          </div>
        </div>

        {/* Dynamic Navigation row (Adapt for Mobile cleanly with simple responsive rules) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <a 
            href="#about" 
            className={`transition-colors duration-200 ${
              activeSection === 'about'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {t.navClinic}
          </a>
          <a 
            href="#expertises" 
            className={`transition-colors duration-200 ${
              activeSection === 'expertises'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {t.navExpertises}
          </a>
          <a 
            href="#instagram-feed" 
            className={`transition-colors duration-200 flex items-center gap-1 ${
              activeSection === 'instagram-feed'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            <span>{t.navGallery}</span>
          </a>
          <a 
            href="#reserve" 
            className={`transition-colors duration-200 ${
              activeSection === 'reserve'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {t.navStay}
          </a>
          
          <span className="h-4 w-[1px] bg-slate-200" />

          {/* Premium Language Dropdown Selection widget */}
          <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1.5 text-xs transition-colors">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer text-xs"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} &nbsp; {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Elegant Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 inline-flex items-center justify-center select-none active:scale-95"
            title={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-500 animate-[spin_8s_linear_infinite]" />
            ) : (
              <Moon className="w-4 h-4 text-teal-600" />
            )}
          </button>

          {/* Settings Admin trigger tab (Visible only to Staff when unlocked) */}
          {isStaff && (
            <>
              <span className="h-4 w-[1px] bg-slate-200" />
              <button 
                onClick={() => {
                  setShowAdminTab(!showAdminTab);
                  // Auto-scroll to admin section when toggled
                  setTimeout(() => {
                    document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`cursor-pointer px-4.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                  showAdminTab 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-emerald-600" /> 
                <span>{showAdminTab ? (lang === 'fr' ? 'Quitter Staff' : 'Exit Staff') : (lang === 'fr' ? 'Espace Staff' : "Staff's Portal")}</span>
              </button>
            </>
          )}
        </nav>

        {/* Mobile Quick Action Link */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Selector Dropdown */}
          <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1.5 text-xs">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer text-xs"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 inline-flex items-center justify-center active:scale-95 transition-transform"
            title={darkMode ? "Mode clair" : "Mode sombre"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-500 animate-[spin_8s_linear_infinite]" />
            ) : (
              <Moon className="w-4 h-4 text-teal-600" />
            )}
          </button>

          {isStaff && (
            <button 
              onClick={() => {
                setShowAdminTab(!showAdminTab);
                setTimeout(() => {
                  document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`p-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
                showAdminTab ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-emerald-50 text-emerald-800'
              }`}
              title={lang === 'fr' ? 'Espace Staff' : "Staff's Portal"}
            >
              <Settings className="w-4 h-4 text-emerald-600" />
            </button>
          )}
          <a 
            href="#reserve" 
            className="bg-teal-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg relative overflow-hidden uppercase tracking-wider"
          >
            {(t.btnPlan || "").split(' ')[0] || "Réserver"}
          </a>
        </div>
      </header>

      {/* Main Stream Area */}
      <main className="flex-1">

        {/* Premium Clinical Hero Banner Section */}
        <section id="about" className="relative bg-slate-950 text-white overflow-hidden py-24 md:py-32">
          
          {/* Unsplash beautiful high-end aesthetic clinical operating theater context */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80&referrerpolicy=no-referrer"
              alt="Dr Hüseyin Balıkçı Operating Suite in Antalya" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-15 filter grayscale contrast-125"
            />
            {/* Backdrop lighting color overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center justify-center gap-1.5 bg-teal-500/10 text-teal-400 font-semibold text-xs px-3 py-1 rounded-full border border-teal-500/20">
                <Sparkles className="w-3.5 h-3.5" /> {t.heroBadge}
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none text-white">
                {t.heroTitle.split(' ').slice(0, 2).join(' ')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  {t.heroTitle.split(' ').slice(2).join(' ')}
                </span>
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-light">
                {t.heroDesc}
              </p>

              {/* High end features quick links */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 border-t border-white/10 pt-6">
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span>{t.heroFeature1}</span>
                </div>
                <div className="h-3 w-[1px] bg-white/20 hidden sm:inline-block" />
                <div className="flex items-center gap-1">
                  <Hotel className="w-4 h-4 text-teal-400" />
                  <span>{t.heroFeature2}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a 
                  href="#reserve" 
                  className="bg-teal-600 hover:bg-teal-500 text-white font-display font-semibold px-8 py-3.5 rounded-xl text-center text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  {t.btnPlan}
                </a>
                <a 
                  href="#instagram-feed" 
                  className="bg-white/10 hover:bg-white/15 text-white font-display px-6 py-3.5 rounded-xl text-center text-xs font-semibold transition-all"
                >
                  {t.btnInstagram}
                </a>
              </div>

            </div>

            {/* Quick Consultation Badge widget */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <h4 className="font-display font-bold text-sm text-white">{t.vipBannerTitle}</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                {t.vipBannerText}
              </p>

              <div className="space-y-2 pt-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                  <span>{t.vipCheck1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  <span>{t.vipCheck2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  <span>{t.vipCheck3}</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* CLINICAL STANDARDS / TRUST POINTS BENTO MATRIX */}
        <section id="expertises" className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 font-sans">
            
            <div className="text-center mb-16">
              <span className="text-teal-600 font-bold text-xs uppercase tracking-widest block mb-1">
                {t.pillarsSub}
              </span>
              <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">
                {t.pillarsTitle}
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                {t.pillarsDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Pillar 1 */}
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 glow-card space-y-4">
                <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t.pillar1Title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {t.pillar1Desc}
                </p>
                <a href="#reserve" className="text-teal-600 font-semibold text-xs inline-flex items-center gap-1 hover:underline pt-2">
                  {t.learnMore} <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 glow-card space-y-4">
                <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t.pillar2Title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {t.pillar2Desc}
                </p>
                <a href="#reserve" className="text-teal-600 font-semibold text-xs inline-flex items-center gap-1 hover:underline pt-2">
                  {t.learnMore} <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 glow-card space-y-4">
                <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t.pillar3Title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {t.pillar3Desc}
                </p>
                <a href="#reserve" className="text-teal-600 font-semibold text-xs inline-flex items-center gap-1 hover:underline pt-2">
                  {t.learnMore} <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* CONNECTED INSTAGRAM FEED MODULE */}
        <InstagramFeed lang={lang} />

        {/* BOOKING ENGINE (WITH CHECK-IN & CHECK-OUT COORDINATION AND NOTIFICATIONS RECEIVERS) */}
        <BookingForm onBookingSuccess={fetchData} lang={lang} />

        {/* ADMINISTRATIVE SUITE (Visible dynamically, and toggle-able cleanly) */}
        {showAdminTab && (
          <AdminPanel 
            bookings={bookings} 
            settings={settings}
            onRefresh={fetchData}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

      </main>

      {/* Floating Clinical AI Advisory Counselor */}
      <AiAssistant lang={lang} />

      {/* Exquisite Footer (Explicit disclaimer, and administrative lock triggers) */}
      <footer className="bg-slate-900 text-white/80 py-16 px-4 md:px-8 border-t border-slate-800" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className={`max-w-6xl mx-auto grid grid-cols-1 ${isStaff ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-10`}>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-display">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-teal-500/20 shadow-sm shrink-0">
                <img 
                  src={doctorProfile} 
                  alt="Dr. Hüseyin Balıkçı" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-bold text-white text-sm">Opera Yaşam</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-light">
              {t.footerDesc}
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-display font-semibold text-xs uppercase tracking-wider text-teal-400">{t.footerSectionTitle}</h5>
            <ul className="text-xs text-slate-400 space-y-2.5 font-light">
              <li>{t.footerCheck}</li>
              <li>{t.footerTransfer}</li>
              <li>{t.footerEmail}</li>
              <li>{t.footerHotels}</li>
            </ul>
          </div>

          {isStaff && (
            <div className="space-y-4">
              <h5 className="font-display font-semibold text-xs uppercase tracking-wider text-teal-400">Section Staff</h5>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Accéder au panneau d'administration clinique sécurisé pour gérer les dossiers patients et transmissions hôtelières.
              </p>
              <button
                onClick={() => {
                  setShowAdminTab(true);
                  setTimeout(() => {
                    document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold px-4.5 py-2 rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Ouvrir l'Administration
              </button>
            </div>
          )}

        </div>

        {/* Legal and Disclaimer Bar */}
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-light gap-4">
          <p>© 2026 Opera Yaşam. {t.footerLegal}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://www.instagram.com/drhuseyinbalikci/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram Officiel @drhuseyinbalikci</a>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => {
                setIsStaff(true);
                setShowAdminTab(true);
                setTimeout(() => {
                  document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-emerald-400 text-teal-500 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Espace Staff</span>
            </button>
            <span className="text-teal-500/80">{t.footerSubtext}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
