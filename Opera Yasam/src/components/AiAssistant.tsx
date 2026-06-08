import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles, Send, X, Shield, User, BrainCircuit } from 'lucide-react';
import { LanguageCode } from '../translations';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const ASSISTANT_GREETINGS: Record<LanguageCode, string> = {
  fr: "Bonjour ! Je suis l'assistant clinique virtuel du Dr. Hüseyin Balıkçı. Comment puis-je vous renseigner sur nos rhinoplasties, nos conseils post-opératoires ou la logistique d'arrivée à Antalya ?",
  en: "Hello! I am Dr. Hüseyin Balıkçı's virtual clinic assistant. How can I help you regarding our rhinoplasties, post-operative guidelines, or arrival arrangements in Antalya?",
  es: "¡Hola! Soy el asistente clínico virtual del Dr. Hüseyin Balıkçı. ¿Cómo puedo informarle sobre nuestras rinoplastias, pautas postoperatorias o la logística de llegada a Antalya?",
  ru: "Здравствуйте! Я виртуальный клинический ассистент доктора Хюсейна Балыкчи. Как я могу помочь вам узнать о ринопластике, послеоперационном уходе или прибытии в Анталью?",
  pl: "Witaj! Jestem wirtualnym asystentem klinicznym dr. Hüseyina Balıkçı. Jak mogę pomóc Ci w temacie korekty nosa, wskazówek pooperacyjnych lub zakwaterowania w Antalyi?",
  de: "Hallo! Ich bin der virtuelle Praxisassistent von Dr. Hüseyin Balıkçı. Wie kann ich Ihnen bei Fragen zu Nasenkorrekturen, postoperativen Richtlinien oder der Ankunft in Antalya helfen?",
  ja: "こんにちは！ヒュセイン・バルクチュ医師のバーチャル医療アシスタントです。鼻整形術、術後のご案内、アンタルヤ到着後の手配についてどのようなことでもお気軽にご質問ください。",
  ko: "안녕하세요! 후세인 발륵츠 박사의 버추얼 행정 의료 비서입니다. 코 성형 수술 정보, 수술 후 조치 관리 계획, 또는 안탈리아 도착 일정 관리에 대해 궁금한 점을 편하게 보내주세요.",
  ar: "مرحباً! أنا المساعد السريري الافتراضي للدكتور حسين بالكتشي. كيف يمكنني مساعدتك اليوم في تجميل الأنف، إرشادات ما بعد الجراحة، أو ترتيبات الوصول والإقامة في أنطاليا؟"
};

const ASSISTANT_UI_TRANSLATIONS: Record<LanguageCode, {
  triggerBtn: string;
  headerTitle: string;
  specialistBadge: string;
  disclaimer: string;
  placeholder: string;
  errorTechnical: string;
  errorUnavailable: string;
}> = {
  fr: {
    triggerBtn: "Conseil Chirurgical IA",
    headerTitle: "Assistant Virtuel Dr. Hüseyin",
    specialistBadge: "Spécialiste Rhinoplastie IA",
    disclaimer: "Les avis de l'IA ne remplacent pas la consultation physique finale à Antalya.",
    placeholder: "Posez votre question (ex: gonflement, hôtel...)",
    errorTechnical: "Une erreur technique s'est produite.",
    errorUnavailable: "Service temporairement indisponible. Veuillez vérifier votre connexion."
  },
  en: {
    triggerBtn: "AI Surgical Advisor",
    headerTitle: "Dr. Hüseyin's Virtual Assistant",
    specialistBadge: "AI Rhinoplasty Specialist",
    disclaimer: "AI guidance does not replace final in-person consultation in Antalya.",
    placeholder: "Ask your question (e.g., swelling, hotel...)",
    errorTechnical: "A technical error occurred.",
    errorUnavailable: "Service temporarily unavailable. Please check your connection."
  },
  es: {
    triggerBtn: "Asesor Quirúrgico IA",
    headerTitle: "Asistente Virtual del Dr. Hüseyin",
    specialistBadge: "Especialista en Rinoplastia IA",
    disclaimer: "La orientación de la IA no reemplaza la consulta presencial en Antalya.",
    placeholder: "Haga su pregunta (ej: hinchazón, hotel...)",
    errorTechnical: "Ocurrió un error técnico.",
    errorUnavailable: "Servicio temporalmente indisponible. Verifique su conexión."
  },
  ru: {
    triggerBtn: "ИИ Хирургический советник",
    headerTitle: "Виртуальный ассистент доктора Хюсейна",
    specialistBadge: "ИИ Специалист по ринопластике",
    disclaimer: "Рекомендации ИИ не заменяют очную консультацию в Анталье.",
    placeholder: "Задайте вопрос (например: отек, отель...)",
    errorTechnical: "Произошла техническая ошибка.",
    errorUnavailable: "Сервис временно недоступен. Проверьте ваше подключение."
  },
  pl: {
    triggerBtn: "Asystent Chirurgiczny IA",
    headerTitle: "Wirtualny Asystent dr. Hüseyina",
    specialistBadge: "Specjalista ds. Rhinoplastyki IA",
    disclaimer: "Porady IA nie zastępują ostatecznej konsultacji stacjonarnej w Antalyi.",
    placeholder: "Zadaj pytanie (np. obrzęk, hotel...)",
    errorTechnical: "Wystąpił błąd techniczny.",
    errorUnavailable: "Usługa tymczasowo niedostępna. Sprawdź swoje połączenie."
  },
  de: {
    triggerBtn: "KI-Chirurgieberater",
    headerTitle: "Dr. Hüseyins Virtueller Assistent",
    specialistBadge: "KI-Nasenkorrektur-Spezialist",
    disclaimer: "Die KI-Beratung ersetzt nicht die persönliche Konsultation vor Ort in Antalya.",
    placeholder: "Frage stellen (z. B. Schwellung, Hotel...)",
    errorTechnical: "Ein technischer Fehler ist aufgetreten.",
    errorUnavailable: "Dienst vorübergehend nicht verfügbar. Bitte Verbindung prüfen."
  },
  ja: {
    triggerBtn: "AI 鼻整形カウンセラー",
    headerTitle: "ヒュセイン医師のバーチャル助手",
    specialistBadge: "AI 鼻整形スペシャリスト",
    disclaimer: "AIによる回答はアンタルヤ現地での医師の診断に代わるものではありません。",
    placeholder: "質問を入力（例：腫れ、宿泊ホテルなど）",
    errorTechnical: "技術的エラーが発生しました。",
    errorUnavailable: "サービスは現在ご利用いただけません。ネット環境をご確認ください。"
  },
  ko: {
    triggerBtn: "AI 성형 수술 자문",
    headerTitle: "발륵츠 박사 버추얼 비서",
    specialistBadge: "AI 코 성형 스페셜리스트",
    disclaimer: "AI 조언은 안탈리아 현지에서의 최종 전문의 진단을 대체할 수 없습니다.",
    placeholder: "질문을 입력하세요 (예: 붓기, 호텔 수속 등)",
    errorTechnical: "기술적 오류가 발생했습니다.",
    errorUnavailable: "서비스를 일시적으로 이용할 수 없습니다. 네트워크 연결을 확인하세요."
  },
  ar: {
    triggerBtn: "مستشار الجراحة الذكي",
    headerTitle: "مساعد الدكتور حسين الافتراضي",
    specialistBadge: "أخصائي تجميل الأنف الذكي",
    disclaimer: "إرشادات الذكاء الاصطناعي لا تغني عن الاستشارة الشخصية النهائية في أنطاليا.",
    placeholder: "اسأل سؤالك (مثال: الانتفاخ، الفندق...)",
    errorTechnical: "حدث خطأ فني.",
    errorUnavailable: "الخدمة غير متوفرة حالياً. يرجى التحقق من اتصالك."
  }
};

interface AiAssistantProps {
  lang: LanguageCode;
}

export default function AiAssistant({ lang }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const ui = ASSISTANT_UI_TRANSLATIONS[lang] || ASSISTANT_UI_TRANSLATIONS['en'];

  // Init/Reset greetings when lang changes
  useEffect(() => {
    setMessages([
      {
        role: 'model',
        text: ASSISTANT_GREETINGS[lang] || ASSISTANT_GREETINGS['fr']
      }
    ]);
  }, [lang]);

  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    // Append to message history
    const updatedMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setInputMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          history: updatedMessages.slice(0, -1), // All except current to build conversation sequence
          language: lang
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: data.error || ui.errorTechnical }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: ui.errorUnavailable }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger button at bottom-right viewport */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 border border-slate-700/50 text-white hover:bg-slate-800 transition-all shadow-2xl p-4 rounded-full flex items-center justify-center gap-2 group cursor-pointer animate-pulse"
      >
        <MessageSquare className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-xs font-semibold whitespace-nowrap hidden sm:inline-block">
          {ui.triggerBtn}
        </span>
      </button>

      {/* Expanded Clinical AI Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[520px] transition-all" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          
          {/* Panel Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center relative shrink-0">
                <BrainCircuit className="w-4.5 h-4.5 text-teal-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-900" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-white">{ui.headerTitle}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  <span className="text-[10px] text-teal-400/90 font-medium">{ui.specialistBadge}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white text-lg transition-colors cursor-pointer w-7 h-7 rounded-full hover:bg-white/10 flex flex-col items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Guidelines warning */}
          <div className="bg-amber-50 text-amber-950 p-2 text-[10px] border-b border-amber-100 flex items-center gap-1.5 px-4 shrink-0 font-medium">
            <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{ui.disclaimer}</span>
          </div>

          {/* Messages Display Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.role === 'user' ? (lang === 'ar' ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : ''
                }`}
              >
                {/* Avatar Icon placeholder */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-teal-400'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : 'H'}
                </div>

                <div className={`rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-wrap'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-teal-400 shrink-0 flex items-center justify-center font-bold text-xs">
                  H
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={ui.placeholder}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-2 px-4 text-xs outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-full transition-all disabled:opacity-40 shrink-0 cursor-pointer flex flex-col items-center justify-center"
            >
              <Send className="w-4 h-4 text-teal-400" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
