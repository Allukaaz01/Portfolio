import React, { useState } from 'react';
import { Calendar, User, Mail, Phone, FileText, ChevronRight, Activity, Clock, ShieldCheck } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../translations';

interface BookingFormProps {
  onBookingSuccess: () => void;
  lang: LanguageCode;
}

const SUCCESS_LABELS: Record<LanguageCode, { patient: string; checkIn: string; checkOut: string; duration: string }> = {
  fr: { patient: "Patient :", checkIn: "Arrivée (Check-In) :", checkOut: "Départ (Check-Out) :", duration: "Durée Logement :" },
  en: { patient: "Patient:", checkIn: "Arrival (Check-In):", checkOut: "Departure (Check-Out):", duration: "Stay Duration:" },
  es: { patient: "Paciente:", checkIn: "Llegada (Check-In):", checkOut: "Salida (Check-Out):", duration: "Duración de Estancia:" },
  ru: { patient: "Пациент:", checkIn: "Заезд (Check-In):", checkOut: "Выезд (Check-Out):", duration: "Длительность:" },
  pl: { patient: "Pacjent:", checkIn: "Zameldowanie (Check-In):", checkOut: "Wymeldowanie (Check-Out):", duration: "Długość Pobytu:" },
  de: { patient: "Patient:", checkIn: "Anreise (Check-In):", checkOut: "Abreise (Check-Out):", duration: "Aufenthaltsdauer:" },
  ja: { patient: "患者名:", checkIn: "チェックイン:", checkOut: "チェックアウト:", duration: "ご滞在期間:" },
  ko: { patient: "환자명:", checkIn: "체크인:", checkOut: "체크아웃:", duration: "숙박 기간:" },
  ar: { patient: "المريض:", checkIn: "الوصول (تسجيل الدخول):", checkOut: "المغادرة (تسجيل الخروج):", duration: "مدة الإقامة:" }
};

export default function BookingForm({ onBookingSuccess, lang }: BookingFormProps) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['fr'];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    surgeryType: 'primary',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError(t.formErrorObligatory || "Veuillez remplir tous les champs obligatoires (*).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn: "",
          checkOut: ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite.");
      }

      setSuccess(data);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        surgeryType: 'primary',
        notes: ''
      });
      
      // Callback to refresh bookings table in admin panel
      onBookingSuccess();
    } catch (err: any) {
      setError(err.message || "Impossible de soumettre la demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reserve" className="py-20 bg-slate-100/50 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Visual background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header styling */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-teal-50 text-teal-800 text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            {t.formSectionSub}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            {t.formSectionTitle}
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            {t.formSectionDesc}
          </p>
        </div>

        {/* Outer Split Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Clinic Guidelines Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" /> {t.formInfoTitle}
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800">{t.formRecommendTitle}</h4>
                    <p className="text-slate-500 text-xs mt-1">
                      {t.formRecommendDesc}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800">{t.formHotelTitle}</h4>
                    <p className="text-slate-500 text-xs mt-1">
                      {t.formHotelDesc}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800">{t.formNotifyTitle}</h4>
                    <p className="text-slate-500 text-xs mt-1">
                      {t.formNotifyDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recovery notice banner */}
              <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-700 shrink-0" />
                <span className="text-teal-900 text-[11px] leading-relaxed">
                  {t.formSupportBadge}
                </span>
              </div>
            </div>

            {/* Travel info Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 opacity-10">
                <Activity className="w-40 h-40 text-white" />
              </div>
              <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-teal-400">{t.formWhyAntalyaTitle}</h4>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                {t.formWhyAntalyaDesc}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-teal-300">
                <span>{t.formWhyAntalyaTags}</span>
              </div>
            </div>
          </div>

          {/* Core Interactive Form Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-md">
            
            {success ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900">{t.formSuccessTitle}</h3>
                  <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                    {t.formSuccessDesc || "Votre demande a été enregistrée."}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 space-y-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{(SUCCESS_LABELS[lang] || SUCCESS_LABELS['en']).patient}</span>
                    <strong className="text-slate-900">{success.booking.fullName}</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Email &nbsp;</span>
                    <strong className="text-[11px] font-mono text-slate-900">{success.booking.email}</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{t.formLabelPhone}</span>
                    <strong className="text-[11px] font-mono text-slate-900">{success.booking.phone}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => setSuccess(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all text-xs"
                >
                  {t.formSuccessBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl font-medium">
                    {error}
                  </div>
                )}

                {/* Patient Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-600" /> {t.formLabelName}
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.formLabelName}</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Amélie Dubois"
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 pl-10 text-xs outline-none transition-all placeholder:text-slate-400"
                      />
                      <User className={`w-4 h-4 text-slate-400 absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-3.5`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.formLabelEmail}</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Ex: amelie@example.com"
                          className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 pl-10 text-xs outline-none transition-all font-mono"
                        />
                        <Mail className={`w-4 h-4 text-slate-400 absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-3.5`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.formLabelPhone}</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="Ex: +33 6 12 34 56 78"
                          className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 pl-10 text-xs outline-none transition-all font-mono"
                        />
                        <Phone className={`w-4 h-4 text-slate-400 absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-3.5`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surgical Specifications Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" /> {t.formLabelSurgery}
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.formLabelSurgery}</label>
                    <select
                      name="surgeryType"
                      value={formData.surgeryType}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 text-xs outline-none transition-all bg-white"
                    >
                      <option value="primary">{t.formOpPrimary}</option>
                      <option value="revision">{t.formOpRevision}</option>
                      <option value="ethnic">{t.formOpEthnic}</option>
                      <option value="septoplasty">{t.formOpSeptoplasty}</option>
                      <option value="other">{t.formOpOther}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.formLabelNotes}</label>
                    <div className="relative">
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder={t.formPlaceholderNotes}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 pl-10 text-xs outline-none transition-all resize-none"
                      />
                      <FileText className={`w-4 h-4 text-slate-400 absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-3.5`} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-display font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 text-xs uppercase tracking-wider"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t.formBtnSubmit} <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 leading-relaxed font-light">
                  {t.formConsent}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
