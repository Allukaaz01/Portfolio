import React, { useState, useEffect } from 'react';
import { Mail, Shield, RefreshCw, Send, CheckCircle, ExternalLink, Sparkles, UserCheck, AlertCircle, Phone, Calendar, Search, ListFilter, HelpCircle, Building, Star, Users, FolderArchive, Trash2, Archive } from 'lucide-react';
import { Booking, AppSettings } from '../types';

export const ANTALYA_HOTELS = [
  {
    name: "Akra Hotel",
    rating: "★★★★★ (8.9 Superbe)",
    email: "concierge@akrahotels.com",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Akra+Hotel+Antalya",
    description: "Hôtel urbain haut de gamme en bord de mer, idéalement situé au centre de la falaise d'Antalya."
  },
  {
    name: "Rixos Downtown Antalya",
    rating: "★★★★★ (8.6 Très bien)",
    email: "downtown@rixos.com",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Rixos+Downtown+Antalya",
    description: "Complexe de luxe situé à côté de la plage de Konyaaltı, entouré de somptueux jardins exotiques."
  },
  {
    name: "Lara Barut Collection",
    rating: "★★★★★ (9.2 Exceptionnel)",
    email: "lara@barutcollection.com",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Lara+Barut+Collection+Antalya",
    description: "Hôtel ultra tout compris réputé pour son confort post-opératoire de haute voltige de relaxation."
  },
  {
    name: "Titanic Mardan Palace",
    rating: "★★★★★ (9.1 Exceptionnel)",
    email: "mardan.palace@titanic.com.tr",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Titanic+Mardan+Palace+Antalya",
    description: "Palais d'inspiration ottomane de grand luxe, idéal pour une convalescence impériale absolue."
  },
  {
    name: "Crowne Plaza Antalya",
    rating: "★★★★★ (8.5 Très bien)",
    email: "info@cpantalya.com",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Crowne+Plaza+Antalya",
    description: "Hôtel de standing supérieur idéalement positionné le long du boulevard côtier de Konyaaltı."
  },
  {
    name: "DoubleTree by Hilton Antalya Centre",
    rating: "★★★★★ (8.4 Très bien)",
    email: "info@doubletreeantalya.com",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=DoubleTree+by+Hilton+Antalya+City+Centre",
    description: "Hôtel citadin moderne et feutré offrant des nuits calmes au centre-ville d'Antalya."
  }
];

interface AdminPanelProps {
  bookings: Booking[];
  settings: AppSettings | null;
  onRefresh: () => void;
  onUpdateSettings: (newEmail: string) => Promise<boolean>;
}

export default function AdminPanel({ bookings, settings, onRefresh, onUpdateSettings }: AdminPanelProps) {
  // Local states
  const [isAdminLocked, setIsAdminLocked] = useState(true);
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  const [notificationEmail, setNotificationEmail] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState(false);

  // Dispatch parameters for Selected booking to hotel
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [hotelEmail, setHotelEmail] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [specialHotelNotes, setSpecialHotelNotes] = useState('');
  const [language, setLanguage] = useState<'French' | 'English'>('French');
  const [emailBody, setEmailBody] = useState('');
  
  // Interactive administrator-managed dates and status states
  const [modalCheckIn, setModalCheckIn] = useState('');
  const [modalCheckOut, setModalCheckOut] = useState('');
  const [modalStatus, setModalStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const [saveStatusSuccess, setSaveStatusSuccess] = useState(false);
  const [saveStatusError, setSaveStatusError] = useState<string | null>(null);
  const [saveStatusLoading, setSaveStatusLoading] = useState(false);

  // Save patient administrative dates and status
  const handleSaveDetailsAndSync = async () => {
    if (!selectedBooking) return;
    setSaveStatusLoading(true);
    setSaveStatusError(null);
    setSaveStatusSuccess(false);

    try {
      const response = await fetch('/api/bookings/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          checkIn: modalCheckIn,
          checkOut: modalCheckOut,
          status: modalStatus
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedBooking(data.booking);
        setSaveStatusSuccess(true);
        onRefresh(); // Refresh parent listings live
        setTimeout(() => setSaveStatusSuccess(false), 3000);
      } else {
        setSaveStatusError(data.error || "Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      console.error(err);
      setSaveStatusError("Impossible d'atteindre le serveur.");
    } finally {
      setSaveStatusLoading(false);
    }
  };

  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'dispatched'>('all');
  const [showArchived, setShowArchived] = useState(false);

  const [demoLoading, setDemoLoading] = useState(false);

  // Generate a randomized high-fidelity demo patient booking
  const handleCreateDemoPatient = async () => {
    setDemoLoading(true);
    try {
      const demoNames = [
        "Amélie Dubois", "Jean-Pierre Martin", "Sarah Laurent", "Thomas Bernard", "Emma Martinez",
        "Lucas Roux", "Chloé Petit", "Julien Lefebvre", "Sophie Mercier", "Pierre Moreau"
      ];
      const demoEmails = [
        "amelie.dubois@gmail.com", "jpmartin@outlook.com", "sarah.laurent@gmail.com", "t.bernard@yahoo.fr", "emma.martinez@gmail.com",
        "lucas.roux@gmail.com", "chloe.petit@hotmail.fr", "j.lefebvre@gmail.com", "sophie.mercier@gmail.com", "p.moreau@orange.fr"
      ];
      const demoPhones = [
        "+33 6 12 34 56 78", "+33 7 89 01 23 45", "+33 6 98 76 54 32", "+33 6 55 44 33 22", "+33 7 11 22 33 44",
        "+33 6 44 55 66 77", "+33 6 22 33 44 55", "+33 7 77 88 99 00", "+33 6 11 99 88 77", "+44 7911 123456"
      ];
      const demoSurgeries = ["primary", "revision", "ethnic", "septoplasty", "other"];
      const demoNotes = [
        "Première rhinoplastie pour correction de bosse nasale et pointe tombante.",
        "Rhinoplastie secondaire (révision) suite à problème respiratoire et obstruction narinaire.",
        "Rhinoplastie ethnique avec affinement délicat de la base alaire.",
        "Septoplastie pour déviation sévère de la cloison nasale et amélioration fonctionnelle.",
        "Souhaite corriger l'asymétrie de la pointe du nez constatée en vue de profil."
      ];

      const rIndex = Math.floor(Math.random() * demoNames.length);
      const rSurgery = demoSurgeries[Math.floor(Math.random() * demoSurgeries.length)];
      const rNotes = demoNotes[Math.floor(Math.random() * demoNotes.length)];

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: demoNames[rIndex],
          email: demoEmails[rIndex],
          phone: demoPhones[rIndex],
          surgeryType: rSurgery,
          notes: rNotes,
          checkIn: "",
          checkOut: ""
        })
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert("Erreur lors de la génération du patient.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion.");
    } finally {
      setDemoLoading(false);
    }
  };

  // Initialize notification email input once settings are fetched
  useEffect(() => {
    if (settings) {
      setNotificationEmail(settings.notificationEmail);
    }
  }, [settings]);

  // Handle Passkey unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Exclusively secured passcode for Staff
    if (passkey === 'Rayane@127') {
      setIsAdminLocked(false);
      setPasskeyError('');
    } else {
      setPasskeyError("Code d'accès incorrect.");
    }
  };

  // Handle archiving a single booking
  const handleArchiveBooking = async (bookingId: string, archiveStatus = true) => {
    if (!window.confirm(archiveStatus ? "Êtes-vous sûr de vouloir archiver (supprimer de la liste active) ce patient ?" : "Voulez-vous désarchiver ce patient ?")) {
      return;
    }
    try {
      const response = await fetch('/api/bookings/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, archived: archiveStatus })
      });
      if (response.ok) {
        onRefresh();
      } else {
        const err = await response.json();
        alert(err.error || "Une erreur s'est produite.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion avec le serveur.");
    }
  };

  // Handle archiving ALL bookings
  const handleArchiveAllBookings = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir archiver TOUS les patients de la liasse active ? Cette action nettoiera la table de travail tout en préservant l'historique complet.")) {
      return;
    }
    try {
      const response = await fetch('/api/bookings/archive-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        onRefresh();
      } else {
        const err = await response.json();
        alert(err.error || "Une erreur s'est produite lors de l'archivage global.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion.");
    }
  };

  // Handle live modification of primary admin email
  const handleEmailSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailUpdateLoading(true);
    setEmailUpdateSuccess(false);

    const success = await onUpdateSettings(notificationEmail);
    setEmailUpdateLoading(false);
    
    if (success) {
      setEmailUpdateSuccess(true);
      setTimeout(() => setEmailUpdateSuccess(false), 4000);
    }
  };

  // Trigger Gemini AI generation to auto-compose the perfect email for hotel concierge registry
  const handleAiDraftCompose = async () => {
    if (!selectedBooking) return;
    setAiDraftLoading(true);
    try {
      const response = await fetch('/api/bookings/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          hotelName: hotelName || "l'Hôtel de séjour",
          language,
          customRequest: specialHotelNotes,
          checkIn: modalCheckIn,
          checkOut: modalCheckOut
        })
      });

      const data = await response.json();
      if (response.ok) {
        setEmailBody(data.draft);
      } else {
        alert(data.error || "Une erreur est survenue lors de l'aide de rédaction par IA.");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible d'obtenir une réponse de l'I.A.");
    } finally {
      setAiDraftLoading(false);
    }
  };

  // Dispatch details directly to hotel e-mail
  const handleSendToHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !hotelEmail.includes('@')) {
      alert("Veuillez saisir une adresse email d'hôtel valide.");
      return;
    }

    setDispatchLoading(true);
    setDispatchSuccessMsg(null);

    try {
      const response = await fetch('/api/bookings/send-hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          hotelEmail,
          messageBody: emailBody,
          additionalNotes: specialHotelNotes
        })
      });

      const data = await response.json();

      if (response.ok) {
        setDispatchSuccessMsg(data.message);
        onRefresh(); // Refresh bookings logs list
        
        // Clear wizard fields
        setTimeout(() => {
          setSelectedBooking(null);
          setHotelEmail('');
          setHotelName('');
          setSpecialHotelNotes('');
          setEmailBody('');
          setDispatchSuccessMsg(null);
        }, 4000);
      } else {
        alert(data.error || "Échec de l'envoi.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur technique s'est produite lors de l'acheminement.");
    } finally {
      setDispatchLoading(false);
    }
  };

  // Filter bookings based on search & category selecion
  const getFilteredBookings = () => {
    return bookings.filter(b => {
      const matchesArchive = showArchived ? !!b.archived : !b.archived;
      if (!matchesArchive) return false;

      const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.phone.includes(searchQuery);

      if (statusFilter === 'all') return matchesSearch;
      if (statusFilter === 'pending') return matchesSearch && b.status === 'pending';
      if (statusFilter === 'confirmed') return matchesSearch && b.status === 'confirmed';
      if (statusFilter === 'dispatched') return matchesSearch && b.hotelSentStatus;
      return matchesSearch;
    });
  };

  const filteredBookings = getFilteredBookings();

  // Unlock Screen if locked
  if (isAdminLocked) {
    return (
      <section id="admin" className="py-20 bg-slate-100">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-800 flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-extrabold text-slate-900">Espace Administratif</h2>
              <p className="text-slate-500 text-xs">
                Cette section est réservée au secrétariat médical du Dr. Hüseyin Balıkçı.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Code d'accès Secrétariat</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 text-xs outline-none transition-all text-center font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                />
              </div>

              {passkeyError && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /> {passkeyError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-display font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Déverrouiller le Panneau
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Admin Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-black text-slate-900">Tableau Administrative</h1>
              <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Gestion de la clinique, modifications des notifications et transmission hôtelière pour le voyage des patients.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-lg font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Actualiser la liste
            </button>
            <button
              onClick={() => setIsAdminLocked(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-lg font-semibold transition-all cursor-pointer"
            >
              Verrouiller
            </button>
          </div>
        </div>

        {/* TOP CONFIGURATION ROW: Update Booking Notifications Targets (French text constraint) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Email Notification Setter widget */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                <Mail className="w-5 h-5 text-teal-600" /> Notifications & Confirmations
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Ce paramètre définit l'adresse e-mail qui reçoit toutes les notifications de nouvelles réservations et envoie une confirmation automatique. Valeur initiale par défaut : <strong>rayanelasfar02@gmail.com</strong>.
              </p>

              <form onSubmit={handleEmailSave} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">E-mail Officiel Clinique Recipient</label>
                  <input
                    type="email"
                    required
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="rayanelasfar02@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-lg py-2.5 px-3 text-xs outline-none transition-all font-mono text-slate-800"
                  />
                </div>

                {emailUpdateSuccess && (
                  <p className="text-[11px] text-teal-700 font-semibold bg-teal-50 p-2 rounded border border-teal-100">
                    ✓ E-mail mis à jour et validé sur le serveur !
                  </p>
                )}

                <button
                  type="submit"
                  disabled={emailUpdateLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {emailUpdateLoading ? "Sauvegarde..." : "Appliquer l'Email"}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Statistics Tracker */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Demandes</span>
              <div>
                <span className="block text-4xl font-display font-black text-slate-900 mt-2">{bookings.length}</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Toutes interventions confondues</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <span>En attente hôtelière</span>
              </span>
              <div>
                <span className="block text-4xl font-display font-black text-amber-800 mt-2">
                  {bookings.filter(b => !b.hotelSentStatus).length}
                </span>
                <span className="text-[10px] text-amber-600 mt-1 block">Patient(s) non enregistrés à l'hôtel</span>
              </div>
            </div>

            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Enregistrements Activés</span>
              <div>
                <span className="block text-4xl font-display font-black text-teal-900 mt-2">
                  {bookings.filter(b => b.hotelSentStatus).length}
                </span>
                <span className="text-[10px] text-teal-600 mt-1 block">Détails d'arrivée transmis aux hôtels</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORK TABLE AND SEARCH CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden mb-12">
          
          {/* Active / Archive Switcher Tabs */}
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/20">
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setShowArchived(false);
                  setStatusFilter('all');
                }}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !showArchived ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Dossiers Patients Actifs ({bookings.filter(b => !b.archived).length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowArchived(true);
                  setStatusFilter('all');
                }}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  showArchived ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
                <span>Historique Archivé ({bookings.filter(b => b.archived).length})</span>
              </button>
            </div>

            {!showArchived && bookings.filter(b => !b.archived).length > 0 && (
              <button
                type="button"
                onClick={handleArchiveAllBookings}
                className="w-full md:w-auto px-4 py-2 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 hover:border-rose-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                <FolderArchive className="w-4 h-4 text-rose-600" />
                <span>Archiver Tout l'Espace Clinique</span>
              </button>
            )}
          </div>

          {/* Table Toolbar controls */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher nom, email..."
                className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-lg py-2 px-3 pl-9 text-xs outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto shrink-0 pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                En attente clinique
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'confirmed' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                Confirmés
              </button>
              <button
                onClick={() => setStatusFilter('dispatched')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'dispatched' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                ✓ Envoyés Hôtel
              </button>
            </div>
          </div>

          {/* Table display */}
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-600 border border-teal-100 shadow-sm">
                  <Archive className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold font-display text-slate-800 text-sm">
                    Aucun Dossier Patient Actif
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Pour planifier un séjour, attribuer des dates d'arrivée (Check-In / Check-Out) et tester l'envoi d'e-mails rédigés par l'IA à un hôtel partenaire d'Antalya, commencez par ajouter un patient dans le système.
                  </p>
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2 items-center">
                  <button
                    type="button"
                    onClick={handleCreateDemoPatient}
                    disabled={demoLoading}
                    className="w-full sm:w-auto px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{demoLoading ? "Génération clinique..." : "Générer un Patient de Démo"}</span>
                  </button>
                  <a
                    href="#reserve"
                    onClick={() => {
                      document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-xs bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Faire une Réservation Réelle</span>
                  </a>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Dossier / Patient</th>
                    <th className="p-4">Stay / Séjour (Antalya)</th>
                    <th className="p-4">Chirurgie</th>
                    <th className="p-4">Statut Transmit Hôtel</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredBookings.map((b) => {
                    const d1 = new Date(b.checkIn);
                    const d2 = new Date(b.checkOut);
                    const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 30 * 200 * 12)) || 7; // estimate safety
                    
                    return (
                      <tr 
                        key={b.id} 
                        onClick={() => {
                          setSelectedBooking(b);
                          setHotelEmail(b.hotelEmailSentTo || '');
                          setModalCheckIn(b.checkIn || '');
                          setModalCheckOut(b.checkOut || '');
                          setModalStatus(b.status || 'pending');
                          setEmailBody('');
                        }}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="p-4">
                          <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{b.fullName}</div>
                          <div className="text-slate-400 text-[10px] space-y-0.5 mt-0.5">
                            <span className="block">{b.email}</span>
                            <span className="block">{b.phone}</span>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          {b.checkIn && b.checkOut ? (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                                  In: {b.checkIn}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                                  Out: {b.checkOut}
                                </span>
                              </div>
                              <p className="text-[10px] text-teal-800 font-semibold italic">
                                Séjour d'hébergement enregistré
                              </p>
                            </>
                          ) : (
                            <div>
                              <span className="bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
                                📅 Saisir dates de séjour
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="bg-teal-50 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {b.surgeryType === 'primary' && 'Rhinoplastie Primaire'}
                            {b.surgeryType === 'revision' && 'Rhinoplastie Révision'}
                            {b.surgeryType === 'ethnic' && 'Rhinoplastie Ethnique'}
                            {b.surgeryType === 'septoplasty' && 'Septoplastie'}
                            {b.surgeryType === 'other' && 'Autre Esthétique'}
                          </span>
                          {b.notes && (
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic max-w-xs">
                              "{b.notes}"
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          {b.hotelSentStatus ? (
                            <div className="space-y-1">
                              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 self-start">
                                <CheckCircle className="w-3 h-3 text-green-600" /> Transmis à l'hôtel
                              </span>
                              <p className="text-[9px] text-slate-400 font-mono block">
                                Envoyé à: {b.hotelEmailSentTo}
                              </p>
                            </div>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-amber-600" /> Non transmis (À faire)
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(b);
                                setHotelEmail(b.hotelEmailSentTo || '');
                                setModalCheckIn(b.checkIn || '');
                                setModalCheckOut(b.checkOut || '');
                                setModalStatus(b.status || 'pending');
                                setEmailBody('');
                              }}
                              className="bg-slate-900 hover:bg-teal-700 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wider inline-flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                            >
                              <Calendar className="w-3 h-3 text-teal-400" /> Gérer Séjour &amp; Hôtel
                            </button>
                            
                            {!b.archived ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveBooking(b.id, true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-lg transition-all cursor-pointer"
                                title="Archiver ce patient"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveBooking(b.id, false);
                                }}
                                className="p-1.5 text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 rounded-lg transition-all cursor-pointer"
                                title="Restaurer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* DETAILED MODAL: DIAL REGISTRATION TO THE PARTNER HOTEL AND AI HELP */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8 space-y-6">
              
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-xl font-bold font-mono"
              >
                &times;
              </button>

              <div className="border-b border-slate-100 pb-4">
                <span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                  Routage Hôtel Sécurisé
                </span>
                <h3 className="text-xl font-display font-extrabold text-slate-900">
                  Transmettre les informations de {selectedBooking.fullName}
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Ce module transmet les informations d'identité légère, check-in et check-out à l'hôtel afin de faciliter leur réservation de chambre.
                </p>
              </div>

              {dispatchSuccessMsg ? (
                <div className="p-6 bg-teal-50 border border-teal-100 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold font-display text-slate-950">Transmission Réussie !</h4>
                  <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed">
                    Les coordonées de <strong>{selectedBooking.fullName}</strong> ont été dispatchées à l'adresse hôtelière demandée. Le secrétariat a validé l'action.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendToHotel} className="space-y-4">
                  
                  {/* Select Antalya Hotel Section */}
                  <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50 font-sans">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-teal-600" /> Hôtels recommandés d'Antalya &amp; Booking.com
                      </h4>
                      <span className="text-[10px] text-teal-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-teal-100">
                        Sélection 1-Clic
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Cliquez sur un hôtel ci-dessous pour pré-renseigner l'email et le nom, ou cliquez sur l'icône <ExternalLink className="w-2.5 h-2.5 inline" /> pour comparer sur Booking.com.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pt-2 pr-1">
                      {ANTALYA_HOTELS.map((h) => (
                        <div 
                          key={h.name}
                          type="button"
                          onClick={() => {
                            setHotelName(h.name);
                            setHotelEmail(h.email);
                          }}
                          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                            hotelName === h.name 
                              ? 'bg-teal-50 border-teal-500 shadow-sm' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <p className="font-bold text-xs text-slate-800 leading-tight">{h.name}</p>
                              <p className="text-[9px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
                                <span className="text-amber-500 font-mono">★</span> {h.rating}
                              </p>
                            </div>
                            <a 
                              href={h.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Voir sur Booking.com"
                              className="text-slate-400 hover:text-teal-600 p-1 rounded hover:bg-slate-100 shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                            {h.description}
                          </p>
                          
                          <div className="mt-2 flex items-center justify-between text-[8px] border-t border-slate-100/80 pt-1.5 text-slate-400">
                            <span className="font-mono">Email: {h.email}</span>
                            <span className={`font-semibold ${hotelName === h.name ? 'text-teal-600' : 'text-slate-400'}`}>
                              {hotelName === h.name ? '✓ Sélectionné' : 'Choisir'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Coordinates Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">E-mail de Contact de l'Hôtel *</label>
                      <input
                        type="email"
                        required
                        value={hotelEmail}
                        onChange={(e) => setHotelEmail(e.target.value)}
                        placeholder="Ex: concierge@akrahotels.com"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-lg py-2 px-3 text-xs outline-none transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom de l'Hôtel d'Accueil</label>
                      <input
                        type="text"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder="Ex: Akra Hotel / Rixos Downtown"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-lg py-2 px-3 text-xs outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Decided Stay & Status Editor Section (Decided by Staff) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-[10px] text-teal-950 uppercase tracking-wider">
                        Rendez-vous &amp; Dates Hôtelières (Staff)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Décidez des dates après confirmation avec le patient
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Date Check-In d'Hôtel</label>
                        <input
                          type="date"
                          value={modalCheckIn}
                          onChange={(e) => setModalCheckIn(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-lg py-1.5 px-3 text-xs outline-none transition-all font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Date Check-Out d'Hôtel</label>
                        <input
                          type="date"
                          value={modalCheckOut}
                          onChange={(e) => setModalCheckOut(e.target.value)}
                          disabled={!modalCheckIn}
                          min={modalCheckIn}
                          className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-lg py-1.5 px-3 text-xs outline-none transition-all font-mono disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Statut Dossier Patient</label>
                        <select
                          value={modalStatus}
                          onChange={(e: any) => setModalStatus(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-lg py-1.5 px-3 text-xs outline-none transition-all bg-white"
                        >
                          <option value="pending">En attente clinique</option>
                          <option value="confirmed">Confirmé (Rendez-vous fixé)</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px] text-slate-600 border-t border-slate-200/50">
                      <div>
                        Patient: <strong className="text-slate-900">{selectedBooking.fullName}</strong> | Téléphone: <strong className="text-slate-900">{selectedBooking.phone}</strong>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {saveStatusSuccess && (
                          <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-100 text-[10px]">
                            ✓ Données enregistrées !
                          </span>
                        )}
                        {saveStatusError && (
                          <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-100 text-[10px]">
                            {saveStatusError}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveDetailsAndSync}
                          disabled={saveStatusLoading}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-55"
                        >
                          {saveStatusLoading ? "Sauvegarde..." : "Enregistrer Informations"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Drafting configuration */}
                  <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-900 text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-teal-600" /> Rédaction automatique assistée par IA
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <select 
                          value={language} 
                          onChange={(e: any) => setLanguage(e.target.value)}
                          className="bg-white border border-teal-200 rounded px-1.5 py-0.5 text-[10px] outline-none"
                        >
                          <option value="French">Français</option>
                          <option value="English">English</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAiDraftCompose}
                          disabled={aiDraftLoading}
                          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-2.5 py-1 rounded text-[10px] transition-all cursor-pointer flex items-center gap-1"
                        >
                          {aiDraftLoading ? "Génération..." : "Générer le Brouillon IA"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-teal-800 font-semibold mb-1">Insérer une demande particulière au concierge hôtel (Ex: lit calme, lit d'appoint, etc.)</label>
                      <input
                        type="text"
                        value={specialHotelNotes}
                        onChange={(e) => setSpecialHotelNotes(e.target.value)}
                        placeholder="Ex: lit double calme rez-de-chaussée"
                        className="w-full bg-white/80 border border-teal-200 rounded px-2.5 py-1 text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Main Mail body preview text */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Contenu à envoyer à l'hôtel :</label>
                    <textarea
                      required
                      rows={7}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Générez d'abord le brouillon de mail IA ou tapez les details d'arrivée à l'hôtel manuellement."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-lg p-3 text-xs outline-none transition-all resize-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      disabled={dispatchLoading || !emailBody}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {dispatchLoading ? "Acheminement..." : "Confirmer & Envoyer à l'Hôtel"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
