import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Star, ShieldCheck, Phone, MessageCircle, User, Briefcase, 
  CheckCircle, Clock, Menu, X, Wallet, Hammer, Zap, Droplets, Home, ChevronRight, 
  LogOut, Map as MapIcon, List, Navigation, Loader2, Camera, Upload, Lock, Check, Trash2, Eye,
  Bell, Calendar, FileText, ArrowRight, Languages, ArrowLeft, ThumbsUp, HelpCircle, AlertCircle, Smartphone, Award,
  Siren, XCircle, BarChart3, TrendingUp, Users
} from 'lucide-react';

/**
 * M3ALLEM - ADVANCED MVP
 * Updates:
 * - Urgency System (Flag jobs as Urgent)
 * - Cancellation Workflow (With Reasons)
 * - Admin Analytics Dashboard
 * - Smart Sorting (Urgent jobs first)
 */

// --- TRANSLATIONS (DICTIONARY) ---
const T = {
  fr: {
    welcome: "Bienvenue",
    subtitle: "Services à domicile de confiance",
    client_btn: "Continuer comme Client",
    pro_btn: "Espace Professionnel",
    admin_btn: "Admin",
    logout: "Déconnexion",
    hero_title: "Besoin d'un \nMaallem ?",
    hero_subtitle: "Trouvez un expert vérifié en 2 clics.",
    become_pro: "Devenez\nPro",
    search_placeholder: "Rechercher",
    services_title: "Services",
    see_all: "Voir tout",
    popular_title: "Maallems Populaires",
    no_pros: "Aucun maallem disponible pour le moment.",
    nav_home: "Accueil",
    nav_search: "Recherche",
    nav_bookings: "RDV",
    nav_account: "Compte",
    
    // Quote Flow
    quote_title: "Demander un devis",
    quote_desc: "Dites-nous ce que vous cherchez, nous transmettons votre demande à 3 artisans approuvés.",
    quote_btn: "Commencer",
    quote_note: "Recevez 3 devis sous 24h.",
    
    // Auth & Forms
    login_terms: "J'accepte les ",
    terms_link: "conditions d'utilisation",
    pro_create_title: "Création Profil",
    pro_name: "Nom Complet",
    pro_quartier: "Quartier (ex: Maarif)",
    pro_price: "Prix de base (DH)",
    pro_bio: "Votre expérience...",
    photo_profile: "Photo Profil (Obligatoire)",
    photo_cin: "Photo CIN (Obligatoire)",
    photo_tap: "Appuyez pour ajouter",
    btn_confirm: "Confirmer",
    btn_sending: "Envoi...",
    btn_cancel: "Annuler",
    status_verified: "Compte Vérifié",
    status_pending: "En attente de validation",
    my_jobs: "Mes Jobs",
    no_jobs: "Aucun job pour le moment.",
    book_title: "Finaliser la demande",
    book_date: "Date",
    book_time: "Heure",
    book_desc: "Description",
    book_desc_ph: "Décrivez le problème...",
    book_confirm: "Confirmer la demande",
    
    // Job Status & Actions
    status_pending_label: "En attente",
    status_confirmed_label: "Confirmé",
    status_completed_label: "Terminé",
    status_cancelled_label: "Annulé",
    
    btn_accept: "Accepter",
    btn_reject: "Refuser",
    btn_complete: "Terminer",
    btn_cancel_job: "Annuler le RDV",
    pro_new_requests: "Nouvelles Demandes",
    pro_schedule: "Mon Planning",
    
    // Notifications
    success_pro: "Profil créé ! En attente de validation.",
    success_booking: "Demande envoyée !",
    success_status: "Statut mis à jour !",
    error_photo: "Erreur: Photos obligatoires !",
    error_terms: "Erreur: Acceptez les conditions !",
    
    // Dropdowns
    service_plumber: "Plomberie",
    service_electric: "Électricité",
    service_cleaning: "Ménage",
    service_diy: "Bricolage",
    time_morning: "Matin",
    time_afternoon: "Après-midi",
    time_evening: "Soir",
    city: "Ville",
    service: "Service",
    details: "Détails de la demande",
    send_request: "Envoyer la demande",

    // How it works (Refined)
    how_title: "Comment ça marche ?",
    step1_title: "Demandez",
    step1_desc: "Décrivez votre besoin en quelques secondes.",
    step2_title: "Recevez",
    step2_desc: "Des pros vérifiés vous répondent.",
    step3_title: "Choisissez",
    step3_desc: "Comparez et validez le meilleur.",

    // Trust & Stats
    stat_pros: "Pros Vérifiés",
    stat_jobs: "Jobs Réalisés",
    stat_rating: "Note Moyenne",
    urgency_txt: "professionnels disponibles aujourd'hui à",

    // Guarantees
    guarantee_title: "Notre Engagement",
    g1_title: "Identité Vérifiée",
    g1_desc: "CIN et dossier contrôlés.",
    g2_title: "Prix Transparents",
    g2_desc: "Pas de coûts cachés.",
    g3_title: "Satisfaction",
    g3_desc: "Suivi qualité après service.",

    // FAQ
    faq_title: "Questions Fréquentes",
    q1: "Combien de temps pour une réponse ?",
    a1: "En moyenne, vous recevez une réponse sous 2 heures.",
    q2: "Les pros sont-ils assurés ?",
    a2: "Nous vérifions leur identité (CIN), mais l'assurance dépend de chaque pro.",
    q3: "Puis-je payer en espèces ?",
    a3: "Oui, le paiement se fait à 100% en cash après le service.",
    
    // App Teaser
    app_teaser_title: "Bientôt sur les Stores",
    app_teaser_desc: "L'expérience complète arrive bientôt sur iOS et Android.",
    
    coverage_title: "Zones Couvertes",
    coverage_desc: "Nous sommes actifs à :",

    // NEW FEATURES
    urgent_label: "URGENCE",
    urgent_desc: "Intervention rapide demandée",
    cancel_reason_title: "Pourquoi annuler ?",
    reason_changed_mind: "Changé d'avis",
    reason_pro_absent: "Pro absent",
    reason_found_another: "Trouvé un autre",
    admin_stats_title: "Statistiques",
    stat_total_users: "Utilisateurs",
    stat_active_jobs: "Jobs Actifs"
  },
  ar: {
    welcome: "مرحبا",
    subtitle: "خدمات منزلية موثوقة",
    client_btn: "دخول كزبون",
    pro_btn: "فضاء المهنيين",
    admin_btn: "إدارة",
    logout: "خروج",
    hero_title: "محتاج \nلمعلم؟",
    hero_subtitle: "جبر خبير موثوق في جوج كليكات.",
    become_pro: "ولي\nمعلم",
    search_placeholder: "بحث",
    services_title: "خدمات",
    see_all: "شوف الكل",
    popular_title: "معلمين معروفين",
    no_pros: "ماكين حتى معلم دابا.",
    nav_home: "الرئيسية",
    nav_search: "بحث",
    nav_bookings: "مواعيد",
    nav_account: "حسابي",
    quote_title: "طلب دفي (Devis)",
    quote_desc: "قول لينا شنو خاصك، وحنا نوصلو طلبك لـ 3 ديال المعلمين ثقة.",
    quote_btn: "بدا دابا",
    quote_note: "غتوصل بـ 3 دفيات في أقل من 24 ساعة.",
    login_terms: "أوافق على ",
    terms_link: "شروط الاستخدام",
    pro_create_title: "إنشاء حساب",
    pro_name: "الاسم الكامل",
    pro_quartier: "الحي (مثلا: المعاريف)",
    pro_price: "ثمن الخدمة (درهم)",
    pro_bio: "التجربة ديالك...",
    photo_profile: "صورة الملف (ضروري)",
    photo_cin: "صورة لاكارط (ضروري)",
    photo_tap: "ورك باش تزيد تصويرة",
    btn_confirm: "تأكيد التسجيل",
    btn_sending: "جاري الإرسال...",
    btn_cancel: "إلغاء",
    status_verified: "حساب موثق",
    status_pending: "في انتظار التفعيل",
    my_jobs: "الخدمات ديالي",
    no_jobs: "ماكاين والو دابا.",
    book_title: "تأكيد الطلب",
    book_date: "التاريخ",
    book_time: "الوقت",
    book_desc: "الوصف",
    book_desc_ph: "وصف لينا المشكل...",
    book_confirm: "تأكيد الطلب",
    
    // Job Status & Actions
    status_pending_label: "في الانتظار",
    status_confirmed_label: "مقبول",
    status_completed_label: "مسالي",
    status_cancelled_label: "ملغي",
    
    btn_accept: "قبل الطلب",
    btn_reject: "رفض",
    btn_complete: "سالي الخدمة",
    btn_cancel_job: "لغي الموعد",
    pro_new_requests: "طلبات جديدة",
    pro_schedule: "البرنامج ديالي",

    success_pro: "تم التسجيل! كنتسناو التفعيل.",
    success_booking: "تم إرسال الطلب!",
    success_status: "تم التحديث!",
    error_photo: "خطأ: التصاور ضروريين!",
    error_terms: "خطأ: خاصك توافق على الشروط!",
    service_plumber: "السباكة",
    service_electric: "الكهرباء",
    service_cleaning: "التنظيف",
    service_diy: "الإصلاحات",
    time_morning: "صباح",
    time_afternoon: "عشية",
    time_evening: "ليل",
    city: "المدينة",
    service: "الخدمة",
    details: "تفاصيل الطلب",
    send_request: "صيفط الطلب",

    // How it works
    how_title: "كيفاش كيخدم؟",
    step1_title: "طلب",
    step1_desc: "وصف لينا شنو محتاج.",
    step2_title: "توصل",
    step2_desc: "معلمين موثقين غيجاوبوك.",
    step3_title: "ختار",
    step3_desc: "قارن و ختار اللي مسلكك.",

    // Trust & Stats
    stat_pros: "معلم موثق",
    stat_jobs: "خدمة كملات",
    stat_rating: "تقييم عام",
    urgency_txt: "معلم واجدين اليوم ف",

    // Guarantees
    guarantee_title: "الالتزام ديالنا",
    g1_title: "هوية موثقة",
    g1_desc: "لاكارط والمعلومات مريكلين.",
    g2_title: "أثمنة واضحة",
    g2_desc: "بلا زيادات مخبية.",
    g3_title: "الجودة",
    g3_desc: "متبعين الجودة مور الخدمة.",

    // FAQ
    faq_title: "أسئلة متكررة",
    q1: "شحال خاص دالوقت باش يجاوبوني؟",
    a1: "في المتوسط، كيوصلك الجواب في ساعتين.",
    q2: "واش المعلمين عندهم تأمين؟",
    a2: "حنا كنتأكدو من الهوية (لاكارط)، ولكن التأمين كيبقى مسؤولية المعلم.",
    q3: "واش نخلص كاش؟",
    a3: "آه، الخلاص 100٪ كاش ملي تسالي الخدمة.",
    
    // App Teaser
    app_teaser_title: "قريبا فالبلاي ستور",
    app_teaser_desc: "النسخة الكاملة جاية للتلفون قريبا.",
    
    coverage_title: "المناطق اللي حنا فيها",
    coverage_desc: "حنا خدامين دابا ف:",

    // NEW FEATURES
    urgent_label: "مستعجل",
    urgent_desc: "تدخل سريع مطلوب",
    cancel_reason_title: "علاش بغيتي تلغي؟",
    reason_changed_mind: "بدلت الرأي",
    reason_pro_absent: "المعلم ماجاش",
    reason_found_another: "لقيت واحد آخر",
    admin_stats_title: "إحصائيات",
    stat_total_users: "المستخدمين",
    stat_active_jobs: "الطلبات الحالية"
  }
};

// --- CONSTANTS ---
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Fes", "Kenitra", "Agadir"];
const SERVICES = [
  { id: 'plombier', name_fr: 'Plomberie', name_ar: 'السباكة', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
  { id: 'electricien', name_fr: 'Électricité', name_ar: 'الكهرباء', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'menage', name_fr: 'Ménage', name_ar: 'التنظيف', icon: Home, color: 'bg-green-100 text-green-600' },
  { id: 'bricolage', name_fr: 'Bricolage', name_ar: 'الإصلاحات', icon: Hammer, color: 'bg-gray-100 text-gray-600' },
];

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

const SEED_PROS = []; 

// --- UTILS ---
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
  });
};

export default function App() {
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('home'); 
  const [userRole, setUserRole] = useState(null);
  const [lang, setLang] = useState('fr'); 
  
  // Data
  const [pros, setPros] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pendingPros, setPendingPros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [selectedPro, setSelectedPro] = useState(null);
  const [isMapView, setIsMapView] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isRegisteringPro, setIsRegisteringPro] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  
  // Terms & Modals
  const [termsAccepted, setTermsAccepted] = useState(false); 
  const [proTermsAccepted, setProTermsAccepted] = useState(false); 
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Forms & Previews
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null); 
  const [cinImage, setCinImage] = useState(null);
  const [cinPreview, setCinPreview] = useState(null); 
  
  const [regForm, setRegForm] = useState({ name: '', service: 'plombier', city: 'Casablanca', quartier: '', price: '', bio: '' });
  const [bookingForm, setBookingForm] = useState({ date: '', time: 'Matin', desc: '', isUrgent: false }); // Added isUrgent
  const [quoteForm, setQuoteForm] = useState({ description: '', city: 'Casablanca', service: 'plombier' });
  const [activeFaq, setActiveFaq] = useState(null); 

  // --- INIT ---
  useEffect(() => {
    let storedId = localStorage.getItem('m3allem_user_id');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('m3allem_user_id', storedId);
    }
    setUserId(storedId);
    fetchData();
  }, []);

  const fetchData = async () => {
    setTimeout(() => {
      const storedPros = JSON.parse(localStorage.getItem('m3allem_pros')) || SEED_PROS;
      const storedJobs = JSON.parse(localStorage.getItem('m3allem_jobs')) || [];
      setPros(storedPros.filter(p => p.verified));
      setPendingPros(storedPros.filter(p => !p.verified));
      setJobs(storedJobs);
      setLoading(false);
    }, 300);
  };

  const savePro = (newPro) => {
    const current = JSON.parse(localStorage.getItem('m3allem_pros')) || SEED_PROS;
    localStorage.setItem('m3allem_pros', JSON.stringify([...current, newPro]));
    fetchData();
  };
  const saveJob = (newJob) => {
    const current = JSON.parse(localStorage.getItem('m3allem_jobs')) || [];
    localStorage.setItem('m3allem_jobs', JSON.stringify([...current, newJob]));
    fetchData();
  };
  
  const updateJobStatus = (jobId, newStatus, reason = null) => {
    const currentJobs = JSON.parse(localStorage.getItem('m3allem_jobs')) || [];
    const updatedJobs = currentJobs.map(j => j.id === jobId ? { ...j, status: newStatus, reason: reason } : j);
    localStorage.setItem('m3allem_jobs', JSON.stringify(updatedJobs));
    fetchData();
    showNotification(txt('success_status'));
  };

  const updateProStatus = (id, status) => {
    const current = JSON.parse(localStorage.getItem('m3allem_pros')) || SEED_PROS;
    const updated = status === 'deleted' ? current.filter(p => p.id !== id) : current.map(p => p.id === id ? { ...p, verified: true } : p);
    localStorage.setItem('m3allem_pros', JSON.stringify(updated));
    fetchData();
  };

  // --- HELPER FOR TEXT ---
  const txt = (key) => T[lang][key] || key;
  const isRTL = lang === 'ar';

  // --- ACTIONS ---
  
  const handleLogout = () => {
    setUserRole(null);
    setTermsAccepted(false);
    setIsRegisteringPro(false);
    setProfileImage(null);
    setCinImage(null);
    setProfilePreview(null);
    setCinPreview(null);
    setProTermsAccepted(false);
    setRegForm({ name: '', service: 'plombier', city: 'Casablanca', quartier: '', price: '', bio: '' });
    navigate('login');
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'profile') {
        setProfileImage(file);
        setProfilePreview(previewUrl);
      } else {
        setCinImage(file);
        setCinPreview(previewUrl);
      }
    }
  };

  const handleProRegistration = async (e) => {
    e.preventDefault();
    if (!profileImage) { showNotification(txt('error_photo')); return; }
    if (!cinImage) { showNotification(txt('error_photo')); return; }
    if (!proTermsAccepted) { showNotification(txt('error_terms')); return; }

    setIsUploading(true);
    try {
      let profileUrl = await compressImage(profileImage);
      let cinUrl = await compressImage(cinImage);

      const newPro = { 
        id: 'pro_' + Date.now(), 
        owner_id: userId, 
        ...regForm, 
        rating: 5.0, 
        reviews: 0, 
        verified: false, 
        image: profileUrl, 
        cin_image: cinUrl 
      };
      
      savePro(newPro);
      showNotification(txt('success_pro'));
      setIsRegisteringPro(false);
      setProfilePreview(null);
      setCinPreview(null);
    } catch (err) { 
      showNotification("Erreur."); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const newJob = { id: 'job_' + Date.now(), client_id: userId, pro_id: selectedPro.id, pro_name: selectedPro.name, service: selectedPro.service, ...bookingForm, city: selectedCity, status: 'Pending' };
    saveJob(newJob);
    showNotification(txt('success_booking'));
    navigate('home');
  };
  
  // Updated Cancel Logic with prompt
  const handleClientCancel = (jobId) => {
    const reason = prompt("Raison de l'annulation ? (ex: Changé d'avis)");
    if(reason) updateJobStatus(jobId, 'Cancelled', reason);
  };

  const handleGeneralQuote = (e) => {
    e.preventDefault();
    const newJob = {
      id: 'quote_' + Date.now(),
      client_id: userId,
      pro_id: 'GENERAL_REQUEST', 
      pro_name: 'Demande Générale',
      service: quoteForm.service,
      date: new Date().toLocaleDateString(),
      time: 'Flexible',
      desc: quoteForm.description,
      city: quoteForm.city,
      status: 'Open'
    };
    saveJob(newJob);
    showNotification(txt('success_booking'));
    navigate('home');
  }

  const verifyProAction = (id) => { updateProStatus(id, 'verified'); showNotification("Validé !"); };
  const rejectProAction = (id) => { if(confirm("Supprimer ?")) updateProStatus(id, 'deleted'); showNotification("Supprimé."); };
  const handleAdminLogin = (e) => { e.preventDefault(); if(adminPass === 'admin2025') setView('admin_dashboard'); else showNotification("Incorrect"); };

  const navigate = (v) => { window.scrollTo(0,0); setView(v); };
  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const myProProfile = userRole === 'pro' ? (pros.find(p => p.owner_id === userId) || pendingPros.find(p => p.owner_id === userId)) : null;
  
  // Sort Jobs: Urgent first, then recent
  const myJobs = (userRole === 'pro' && myProProfile ? jobs.filter(j => j.pro_id === myProProfile.id) : jobs.filter(j => j.client_id === userId))
                 .sort((a,b) => (b.isUrgent === true) - (a.isUrgent === true));
                 
  const filteredPros = pros.filter(p => (selectedCategory ? p.service === selectedCategory : true) && (selectedCity ? p.city === selectedCity : true));

  // --- COMPONENTS ---

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200" dir={isRTL ? "rtl" : "ltr"}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900">{txt('terms_link')}</h3>
          <button onClick={() => setShowTermsModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={18}/></button>
        </div>
        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
           <p className="font-bold">1. Introduction</p>
           <p>{lang === 'ar' ? "مرحبا بك في معلم. باستعمالك للتطبيق كتوافق على هاد الشروط." : "Bienvenue sur M3allem. En utilisant l'application, vous acceptez ces conditions."}</p>
           <p className="font-bold">2. Responsabilité</p>
           <p>{lang === 'ar' ? "حنا غير وسيط بينك وبين المعلم. الاتفاق كيتم بيناتكم." : "M3allem est un intermédiaire. Le contrat est formé directement entre le client et le prestataire."}</p>
        </div>
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button 
            onClick={() => { 
                if(!userRole) setTermsAccepted(true); 
                else setProTermsAccepted(true); 
                setShowTermsModal(false); 
            }}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            {lang === 'ar' ? "موافق" : "J'accepte"}
          </button>
        </div>
      </div>
    </div>
  );

  const LangSwitcher = () => (
    <button 
      onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')} 
      className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition border border-gray-200"
    >
      <Languages size={14}/> {lang === 'fr' ? 'العربية' : 'Français'}
    </button>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 pb-safe" dir={isRTL ? "rtl" : "ltr"}>
      <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <Home size={24} strokeWidth={view === 'home' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">{txt('nav_home')}</span>
      </button>
      <button onClick={() => navigate('search')} className={`flex flex-col items-center gap-1 ${view === 'search' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <Search size={24} strokeWidth={view === 'search' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">{txt('nav_search')}</span>
      </button>
      <button onClick={() => navigate('bookings')} className={`flex flex-col items-center gap-1 ${view === 'bookings' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <Calendar size={24} strokeWidth={view === 'bookings' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">{txt('nav_bookings')}</span>
      </button>
      <button onClick={() => navigate('profile')} className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <User size={24} strokeWidth={view === 'profile' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">{txt('nav_account')}</span>
      </button>
    </div>
  );

  const renderLandingPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      {/* HERO SECTION */}
      <div className="bg-emerald-600 text-white pt-12 pb-16 px-4 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="text-white" size={20}/>
            </div>
            <span className="font-bold text-lg tracking-wide">M3allem</span>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')} className="bg-white/10 p-2 rounded-full hover:bg-white/20 text-white text-xs font-bold px-3">
              {lang === 'fr' ? 'AR' : 'FR'}
            </button>
            <button onClick={handleLogout} className="relative bg-white/10 p-2 rounded-full hover:bg-white/20">
               <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 relative z-10">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold mb-1 leading-tight whitespace-pre-line">{txt('hero_title')}</h1>
            <p className="text-emerald-100 text-sm">{txt('hero_subtitle')}</p>
          </div>
          
          <div 
            onClick={()=>{setUserRole('pro'); navigate('pro_dashboard')}} 
            className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/20 active:scale-95 transition w-24 shrink-0 shadow-lg"
          >
            <div className="bg-yellow-400 p-1.5 rounded-full mb-1 shadow-sm">
              <Briefcase size={16} className="text-emerald-900"/>
            </div>
            <span className="font-bold text-xs leading-tight whitespace-pre-line">{txt('become_pro')}</span>
          </div>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center gap-2 transform translate-y-8 z-20 relative">
          <div className="bg-gray-50 p-2 rounded-xl text-gray-500"><MapPin size={20}/></div>
          <select className="flex-grow bg-transparent text-gray-800 font-medium outline-none text-sm" value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button onClick={()=>{navigate('search')}} className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 transition"><Search size={20}/></button>
        </div>
      </div>
      
      {/* 1. URGENCY BANNER */}
      <div className="mt-12 px-4 flex justify-center">
        <div className="bg-orange-50 text-orange-800 px-4 py-2 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-2 shadow-sm animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          {Math.floor(Math.random() * 5) + 8} {txt('urgency_txt')} {selectedCity}
        </div>
      </div>

      {/* 2. TRUST STATS */}
      <div className="mt-4 px-6 grid grid-cols-3 gap-4 text-center divide-x divide-gray-200">
        <div>
           <span className="block font-extrabold text-emerald-600 text-lg">50+</span>
           <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{txt('stat_pros')}</span>
        </div>
        <div>
           <span className="block font-extrabold text-emerald-600 text-lg">120+</span>
           <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{txt('stat_jobs')}</span>
        </div>
        <div>
           <span className="block font-extrabold text-emerald-600 text-lg">4.9</span>
           <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{txt('stat_rating')}</span>
        </div>
      </div>

      <div className="mt-6 px-4">
        <div className="flex justify-between items-end mb-4"><h3 className="font-bold text-gray-800 text-lg">{txt('services_title')}</h3><button onClick={()=>navigate('search')} className="text-emerald-600 text-xs font-bold">{txt('see_all')}</button></div>
        <div className="grid grid-cols-4 gap-3">
          {SERVICES.map((s) => (
            <button key={s.id} onClick={()=>{setSelectedCategory(s.id); navigate('search')}} className="flex flex-col items-center gap-2 group">
              <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center shadow-sm group-active:scale-95 transition`}><s.icon size={28}/></div>
              <span className="text-xs font-medium text-gray-600 truncate w-full text-center">{isRTL ? s.name_ar : s.name_fr}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 3. HOW IT WORKS */}
      <div className="mt-8 px-4">
         <h3 className="font-bold text-gray-800 text-lg mb-4">{txt('how_title')}</h3>
         <div className="grid grid-cols-3 gap-3">
           <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2"><Search size={20}/></div>
             <h4 className="font-bold text-xs mb-1">{txt('step1_title')}</h4>
             <p className="text-[10px] text-gray-500 leading-tight">{txt('step1_desc')}</p>
           </div>
           <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2"><CheckCircle size={20}/></div>
             <h4 className="font-bold text-xs mb-1">{txt('step2_title')}</h4>
             <p className="text-[10px] text-gray-500 leading-tight">{txt('step2_desc')}</p>
           </div>
           <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2"><FileText size={20}/></div>
             <h4 className="font-bold text-xs mb-1">{txt('step3_title')}</h4>
             <p className="text-[10px] text-gray-500 leading-tight">{txt('step3_desc')}</p>
           </div>
         </div>
      </div>

      {/* REQUEST QUOTE */}
      <div className="mt-8 px-4">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-[80%]">
            <h4 className="font-bold text-lg mb-2">{txt('quote_title')}</h4>
            <p className="text-gray-300 text-xs mb-4 leading-relaxed">
              {txt('quote_desc')}
            </p>
            <button onClick={() => navigate('quote')} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition flex items-center gap-2">
              {txt('quote_btn')} {isRTL ? <ArrowLeft size={14}/> : <ArrowRight size={14}/>}
            </button>
          </div>
          <FileText size={100} className="text-gray-700 absolute -right-6 -bottom-6 opacity-40 rotate-12"/>
        </div>
      </div>
      
      {/* 5. GUARANTEES */}
      <div className="mt-8 px-4">
        <h3 className="font-bold text-gray-800 text-lg mb-4">{txt('guarantee_title')}</h3>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 space-y-4">
           <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full text-emerald-600 shadow-sm shrink-0"><ShieldCheck size={18}/></div>
             <div>
               <h4 className="font-bold text-sm text-emerald-900">{txt('g1_title')}</h4>
               <p className="text-xs text-emerald-700">{txt('g1_desc')}</p>
             </div>
           </div>
           <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full text-emerald-600 shadow-sm shrink-0"><Wallet size={18}/></div>
             <div>
               <h4 className="font-bold text-sm text-emerald-900">{txt('g2_title')}</h4>
               <p className="text-xs text-emerald-700">{txt('g2_desc')}</p>
             </div>
           </div>
           <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full text-emerald-600 shadow-sm shrink-0"><Star size={18}/></div>
             <div>
               <h4 className="font-bold text-sm text-emerald-900">{txt('g3_title')}</h4>
               <p className="text-xs text-emerald-700">{txt('g3_desc')}</p>
             </div>
           </div>
        </div>
      </div>

      {/* 6. FAQ (Accordion) */}
      <div className="mt-8 px-4 mb-4">
        <h3 className="font-bold text-gray-800 text-lg mb-4">{txt('faq_title')}</h3>
        <div className="space-y-2">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="font-bold text-sm text-gray-700">{txt(`q${i}`)}</span>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${activeFaq === i ? 'rotate-90' : ''}`}/>
              </button>
              {activeFaq === i && (
                <div className="p-4 pt-0 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                  {txt(`a${i}`)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. APP TEASER FOOTER */}
      <div className="mt-8 mb-4 px-6 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-3">
           <Smartphone size={24} className="text-gray-400"/>
        </div>
        <h5 className="font-bold text-gray-400 text-sm mb-1">{txt('app_teaser_title')}</h5>
        <p className="text-gray-400 text-xs">{txt('app_teaser_desc')}</p>
      </div>

      {/* Popular Pros */}
      <div className="mt-8 px-4 mb-4">
        <h3 className="font-bold text-gray-800 text-lg mb-4">{txt('popular_title')}</h3>
        {pros.length === 0 ? <p className="text-sm text-gray-400 italic">{txt('no_pros')}</p> :
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {pros.slice(0,5).map(p => (
            <div key={p.id} onClick={()=>{setSelectedPro(p); navigate('pro_details')}} className="min-w-[140px] bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 mb-2 border-2 border-emerald-100 shadow-sm overflow-hidden flex items-center justify-center">
                 <img src={p.image || PLACEHOLDER_IMG} className="w-full h-full object-cover" alt={p.name}/>
              </div>
              <h4 className="font-bold text-sm text-gray-800 truncate w-full">{p.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{isRTL ? SERVICES.find(s=>s.id === p.service)?.name_ar : SERVICES.find(s=>s.id === p.service)?.name_fr}</p>
              <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full"><Star size={10} fill="currentColor"/> {p.rating}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );

  // ... (Keep renderSearchPage, renderProDashboard, renderProDetailsPage etc. exactly as they were) ...
  const renderSearchPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h2 className="font-bold text-xl mb-4">{txt('nav_search')}</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button onClick={()=>setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${!selectedCategory ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>{txt('see_all')}</button>
          {SERVICES.map(s => (
            <button key={s.id} onClick={()=>setSelectedCategory(s.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${selectedCategory === s.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{isRTL ? s.name_ar : s.name_fr}</button>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {filteredPros.length === 0 ? <div className="text-center py-20 text-gray-400"><Search size={48} className="mx-auto mb-2 opacity-20"/><p>{txt('no_pros')}</p></div> : 
        filteredPros.map(p => (
          <div key={p.id} onClick={()=>{setSelectedPro(p); navigate('pro_details')}} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <img src={p.image || PLACEHOLDER_IMG} className="w-20 h-20 rounded-xl bg-gray-200 object-cover"/>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div><h3 className="font-bold text-gray-900">{p.name}</h3><p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {p.quartier}</p></div>
                <div className="flex items-center gap-1 text-yellow-600 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-lg"><Star size={10} fill="currentColor"/> {p.rating}</div>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <span className="text-emerald-700 font-bold text-lg">{p.price} <span className="text-xs font-normal text-gray-400">DH</span></span>
                <button className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg font-bold">Réserver</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function renderProDashboard() {
    if (!myProProfile && !isRegisteringPro) return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <Briefcase size={64} className="text-emerald-600 mb-4"/>
        <h2 className="text-2xl font-bold">{txt('pro_btn')}</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Rejoignez le réseau M3allem et trouvez des clients gratuitement.</p>
        <button onClick={() => setIsRegisteringPro(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200">{txt('pro_create_title')}</button>
        <button onClick={() => navigate('home')} className="mt-6 text-gray-400 text-sm">Retour à l'accueil</button>
      </div>
    );

    if (isRegisteringPro) return (
      <div className="min-h-screen bg-gray-50 p-4" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-xl font-bold mb-6">{txt('pro_create_title')}</h2>
        <form onSubmit={handleProRegistration} className="space-y-4">
          <input required placeholder={txt('pro_name')} className="w-full p-4 rounded-xl border-none shadow-sm" value={regForm.name} onChange={e=>setRegForm({...regForm, name: e.target.value})}/>
          <div className="grid grid-cols-2 gap-3">
            <select className="p-4 rounded-xl border-none shadow-sm bg-white" value={regForm.service} onChange={e=>setRegForm({...regForm, service: e.target.value})}>{SERVICES.map(s=><option key={s.id} value={s.id}>{isRTL ? s.name_ar : s.name_fr}</option>)}</select>
            <select className="p-4 rounded-xl border-none shadow-sm bg-white" value={regForm.city} onChange={e=>setRegForm({...regForm, city: e.target.value})}>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
          </div>
          <input required placeholder={txt('pro_quartier')} className="w-full p-4 rounded-xl border-none shadow-sm" value={regForm.quartier} onChange={e=>setRegForm({...regForm, quartier: e.target.value})}/>
          <input required placeholder={txt('pro_price')} className="w-full p-4 rounded-xl border-none shadow-sm" type="number" value={regForm.price} onChange={e=>setRegForm({...regForm, price: e.target.value})}/>
          <textarea placeholder={txt('pro_bio')} className="w-full p-4 rounded-xl border-none shadow-sm h-24" value={regForm.bio} onChange={e=>setRegForm({...regForm, bio: e.target.value})}/>
          
          <div className="space-y-4">
            <p className="font-bold text-gray-700">{isRTL ? "الصور" : "Photos"}</p>
            <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${profilePreview ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              {profilePreview ? <img src={profilePreview} className="h-full w-full object-contain rounded-lg p-2" alt="Preview"/> : <><Camera size={24} className="text-gray-400 mb-2"/><span className="text-sm font-medium text-gray-500">{txt('photo_profile')}</span><span className="text-xs text-gray-400">{txt('photo_tap')}</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'profile')} />
            </label>
            <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${cinPreview ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'}`}>
              {cinPreview ? <img src={cinPreview} className="h-full w-full object-contain rounded-lg p-2" alt="Preview"/> : <><ShieldCheck size={24} className="text-yellow-600 mb-2"/><span className="text-sm font-bold text-yellow-800">{txt('photo_cin')}</span><span className="text-xs text-yellow-600">Preuve d'identité</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'cin')} />
            </label>
          </div>

          <div className="flex items-center justify-start gap-2 pt-2">
            <input 
              type="checkbox" 
              id="pro-terms" 
              className="w-5 h-5 accent-emerald-600 rounded"
              checked={proTermsAccepted}
              onChange={(e) => setProTermsAccepted(e.target.checked)}
            />
            <label htmlFor="pro-terms" className="text-sm text-gray-600">
              {txt('login_terms')} <span onClick={() => setShowTermsModal(true)} className="underline font-bold text-emerald-700 cursor-pointer">{txt('terms_link')}</span>
            </label>
          </div>

          <button disabled={isUploading || !proTermsAccepted} className={`w-full text-white py-4 rounded-xl font-bold flex justify-center gap-2 mt-4 ${proTermsAccepted ? 'bg-black' : 'bg-gray-300 cursor-not-allowed'}`}>
            {isUploading ? <Loader2 className="animate-spin"/> : <Upload/>} {isUploading ? txt('btn_sending') : txt('btn_confirm')}
          </button>
          <button type="button" onClick={()=>setIsRegisteringPro(false)} className="w-full text-gray-500 py-4">{txt('btn_cancel')}</button>
        </form>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-100" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">P</div><span className="font-bold">Espace Pro</span></div>
          <button onClick={handleLogout}><LogOut size={18}/></button>
        </div>
        <div className="p-4">
          <div className={`p-4 rounded-xl shadow-sm mb-6 border-l-4 ${myProProfile.verified ? 'bg-white border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
            <h3 className="font-bold flex items-center gap-2 text-gray-800"><ShieldCheck size={20}/> {myProProfile.verified ? txt('status_verified') : txt('status_pending')}</h3>
            <p className="text-sm text-gray-500 mt-1">Bonjour {myProProfile.name}.</p>
          </div>
          
          {/* UPDATED PRO DASHBOARD WITH JOB WORKFLOW */}
          <div className="space-y-6">
            
            {/* 1. NEW REQUESTS (PENDING) */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Bell size={18} className="text-orange-500"/> {txt('pro_new_requests')}
              </h3>
              {myJobs.filter(j => j.status === 'Pending').length === 0 ? (
                <p className="text-sm text-gray-400 italic bg-white p-4 rounded-xl border border-dashed border-gray-300 text-center">Aucune nouvelle demande.</p>
              ) : (
                myJobs.filter(j => j.status === 'Pending').map(j => (
                  <div key={j.id} className={`bg-white p-4 rounded-xl shadow-md border-l-4 mb-3 ${j.isUrgent ? 'border-red-500' : 'border-orange-400'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-gray-900">{j.service}</h4>
                      {j.isUrgent ? 
                         <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><Siren size={12}/> {txt('urgent_label')}</span>
                         :
                         <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">{txt('status_pending_label')}</span>
                      }
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                       <p className="flex items-center gap-2"><Calendar size={14}/> {j.date} - {j.time}</p>
                       <p className="flex items-center gap-2"><MapPin size={14}/> {j.city}</p>
                       <p className="italic bg-gray-50 p-2 rounded">"{j.desc}"</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => updateJobStatus(j.id, 'Confirmed')} className="flex-1 bg-black text-white py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-emerald-700 transition flex justify-center items-center gap-1"><CheckCircle size={16}/> {txt('btn_accept')}</button>
                      <button onClick={() => updateJobStatus(j.id, 'Cancelled')} className="flex-1 bg-white text-red-500 border border-red-100 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition">{txt('btn_reject')}</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 2. SCHEDULE (ACCEPTED) */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-emerald-600"/> {txt('pro_schedule')}
              </h3>
              {myJobs.filter(j => j.status === 'Confirmed').length === 0 ? (
                <p className="text-sm text-gray-400 italic">Agenda vide.</p>
              ) : (
                myJobs.filter(j => j.status === 'Confirmed').map(j => (
                  <div key={j.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{j.service}</h4>
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">{txt('status_confirmed_label')}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{j.date} à {j.time}</p>
                    {j.isUrgent && <p className="text-xs text-red-500 font-bold mb-2">⚠️ {txt('urgent_desc')}</p>}
                    <div className="flex gap-2">
                       <button className="flex-1 border border-emerald-200 text-emerald-700 bg-emerald-50 text-sm font-bold py-2 rounded-lg flex justify-center items-center gap-2"><MessageCircle size={16}/> WhatsApp</button>
                       <button onClick={() => updateJobStatus(j.id, 'Completed')} className="flex-1 bg-emerald-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-emerald-700 transition">{txt('btn_complete')}</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 3. HISTORY (COMPLETED) */}
            {myJobs.filter(j => j.status === 'Completed').length > 0 && (
               <div className="opacity-60">
                 <h3 className="font-bold text-gray-500 mb-3 text-sm uppercase tracking-wide">Historique</h3>
                 {myJobs.filter(j => j.status === 'Completed').map(j => (
                   <div key={j.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2 flex justify-between items-center">
                     <div>
                       <span className="font-bold text-gray-600 block">{j.service}</span>
                       <span className="text-xs text-gray-400">{j.date}</span>
                     </div>
                     <span className="text-xs font-bold text-blue-600 flex items-center gap-1"><Check size={12}/> {txt('status_completed_label')}</span>
                   </div>
                 ))}
               </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // --- OTHERS ---
  const renderProfilePage = () => (
    <div className="min-h-screen bg-gray-50 pb-20 p-4" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="text-2xl font-bold mb-6">{txt('nav_account')}</h2>
      
      {/* Language Switcher */}
      <div className="flex justify-end mb-4">
        <LangSwitcher />
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl"><User/></div>
        <div><h3 className="font-bold text-lg">Utilisateur</h3><p className="text-sm text-gray-500">Connecté</p></div>
      </div>
      <div className="space-y-2">
        <button onClick={()=>{setUserRole('pro'); navigate('pro_dashboard')}} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm"><span className="flex items-center gap-3 font-medium"><Briefcase size={20} className="text-emerald-600"/> {txt('pro_btn')}</span><ChevronRight size={16} className={`text-gray-400 ${isRTL ? 'rotate-180' : ''}`}/></button>
        <button onClick={()=>{setView('admin_login')}} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm"><span className="flex items-center gap-3 font-medium"><Lock size={20} className="text-gray-400"/> {txt('admin_btn')}</span><ChevronRight size={16} className={`text-gray-400 ${isRTL ? 'rotate-180' : ''}`}/></button>
        <button onClick={handleLogout} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm text-red-500"><span className="flex items-center gap-3 font-medium"><LogOut size={20}/> {txt('logout')}</span></button>
      </div>
    </div>
  );

  const renderMyBookings = () => (
    <div className="min-h-screen bg-gray-50 pb-20 p-4" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="text-2xl font-bold mb-6">{txt('nav_bookings')}</h2>
      {myJobs.length === 0 ? <div className="text-center py-20 text-gray-400"><Clock size={48} className="mx-auto mb-2 opacity-20"/><p>{txt('no_jobs')}</p></div> : 
      <div className="space-y-3">
        {myJobs.map(j => (
          <div key={j.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-800">{j.service}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  j.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  j.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                  j.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
              }`}>
                {j.status === 'Pending' ? txt('status_pending_label') :
                 j.status === 'Confirmed' ? txt('status_confirmed_label') :
                 j.status === 'Completed' ? txt('status_completed_label') :
                 txt('status_cancelled_label')}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{j.date} à {j.time}</p>
            <p className="text-xs text-gray-400 truncate mb-3">{j.desc}</p>
            
            {/* CLIENT CAN CANCEL IF PENDING */}
            {j.status === 'Pending' && (
               <button onClick={() => handleClientCancel(j.id)} className="w-full border border-red-200 text-red-500 text-xs font-bold py-2 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1">
                 <XCircle size={14}/> {txt('btn_cancel_job')}
               </button>
            )}
            
             {/* CLIENT SEES SUCCESS IF COMPLETED */}
            {j.status === 'Completed' && (
               <div className="w-full bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                 <Award size={14}/> Service Noté 5★
               </div>
            )}

            {/* Cancel Reason Display */}
            {j.status === 'Cancelled' && j.reason && (
               <p className="text-xs text-red-400 italic mt-2">Motif: {j.reason}</p>
            )}
          </div>
        ))}
      </div>}
    </div>
  );

  function renderProDetailsPage() {
    if (!selectedPro) return null;
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
         <div className="relative h-48 bg-emerald-600">
            <button onClick={() => navigate('search')} className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-sm"><ChevronRight className="rotate-180"/></button>
         </div>
         <div className="px-4 -mt-16 relative">
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-gray-100">
               <img src={selectedPro.image || PLACEHOLDER_IMG} className="w-28 h-28 rounded-full border-4 border-white shadow-md mx-auto -mt-20 bg-gray-200 object-cover"/>
               {/* Verified Badge */}
               <div className="flex justify-center items-center gap-2 mt-3">
                 <h2 className="text-2xl font-bold">{selectedPro.name}</h2>
                 <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full"><ShieldCheck size={18}/></div>
               </div>
               <p className="text-gray-500 text-sm mb-6 flex justify-center items-center gap-1"><MapPin size={12}/> {selectedPro.quartier}, {selectedPro.city}</p>
               
               <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-4 mb-6">
                 <div><span className="block font-bold text-lg">{selectedPro.rating}</span><span className="text-xs text-gray-400">Étoiles</span></div>
                 <div><span className="block font-bold text-lg">{selectedPro.reviews}</span><span className="text-xs text-gray-400">Avis</span></div>
                 <div><span className="block font-bold text-lg text-emerald-700">{selectedPro.price}</span><span className="text-xs text-gray-400">DH</span></div>
               </div>

               <h4 className="font-bold text-left mb-2">À propos</h4>
               <p className="text-left text-sm text-gray-600 leading-relaxed mb-6">"{selectedPro.bio}"</p>
               
               <button onClick={()=>navigate('booking')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:scale-[1.02] transition">Réserver Maintenant</button>
            </div>
         </div>
      </div>
    );
  }

  function renderBookingPage() {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('pro_details')} className="p-2 bg-white rounded-full shadow-sm"><ChevronRight className="rotate-180"/></button>
          <h2 className="text-xl font-bold">{txt('book_title')}</h2>
        </div>
        <form onSubmit={handleBooking} className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
          
          {/* URGENCY TOGGLE */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-red-100 p-2 rounded-full text-red-600"><Siren size={20}/></div>
               <div>
                  <h4 className="font-bold text-sm text-red-800">{txt('urgent_label')}</h4>
                  <p className="text-xs text-red-600">{txt('urgent_desc')}</p>
               </div>
            </div>
            <div 
              onClick={() => setBookingForm({...bookingForm, isUrgent: !bookingForm.isUrgent})}
              className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${bookingForm.isUrgent ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${bookingForm.isUrgent ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{txt('book_date')}</label>
            <input type="date" required className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 ring-emerald-100" onChange={e=>setBookingForm({...bookingForm, date: e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{txt('book_time')}</label>
            <div className="grid grid-cols-3 gap-2">
              {[txt('time_morning'), txt('time_afternoon'), txt('time_evening')].map(t => (
                <button type="button" key={t} onClick={()=>setBookingForm({...bookingForm, time: t})} className={`p-3 rounded-xl text-sm font-medium transition ${bookingForm.time === t ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{txt('book_desc')}</label>
            <textarea required placeholder={txt('book_desc_ph')} className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none h-32 focus:ring-2 ring-emerald-100" onChange={e=>setBookingForm({...bookingForm, desc: e.target.value})}/>
          </div>
          <button className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-lg">{txt('book_confirm')}</button>
        </form>
      </div>
    );
  }

  function renderQuotePage() {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full shadow-sm"><ChevronRight className="rotate-180"/></button>
          <h2 className="text-xl font-bold">{txt('quote_title')}</h2>
        </div>
        <form onSubmit={handleGeneralQuote} className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{txt('service')}</label>
            <select className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 ring-emerald-100" value={quoteForm.service} onChange={e=>setQuoteForm({...quoteForm, service: e.target.value})}>
               {SERVICES.map(s=><option key={s.id} value={s.id}>{isRTL ? s.name_ar : s.name_fr}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{txt('city')}</label>
            <select className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 ring-emerald-100" value={quoteForm.city} onChange={e=>setQuoteForm({...quoteForm, city: e.target.value})}>
               {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{txt('details')}</label>
            <textarea required placeholder={txt('book_desc_ph')} className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none h-32 focus:ring-2 ring-emerald-100" onChange={e=>setQuoteForm({...quoteForm, description: e.target.value})}/>
            <p className="text-xs text-gray-500 mt-2">{txt('quote_note')}</p>
          </div>
          <button className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg">{txt('send_request')}</button>
        </form>
      </div>
    );
  }

  function renderAdminLogin() {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center p-6 text-center">
        <ShieldCheck size={48} className="text-red-500 mx-auto mb-4"/>
        <h2 className="text-2xl font-bold text-white mb-6">Accès Admin</h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input type="password" placeholder="Code Secret" className="w-full p-4 rounded-xl bg-gray-800 text-white text-center border-none outline-none focus:ring-2 ring-red-500" value={adminPass} onChange={e=>setAdminPass(e.target.value)}/>
          <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold">Entrer</button>
          <button type="button" onClick={() => setView('login')} className="text-gray-500">Retour</button>
        </form>
      </div>
    );
  }

  function renderAdminDashboard() {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2><button onClick={handleLogout}><LogOut/></button></div>
        
        {/* NEW: ADMIN STATS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500"><Users size={16}/><span className="text-xs font-bold uppercase">{txt('stat_total_users')}</span></div>
              <span className="text-2xl font-extrabold text-gray-900">{pros.length}</span>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500"><TrendingUp size={16}/><span className="text-xs font-bold uppercase">{txt('stat_active_jobs')}</span></div>
              <span className="text-2xl font-extrabold text-emerald-600">{jobs.length}</span>
           </div>
        </div>

        <h3 className="font-bold text-gray-600 mb-2">En attente ({pendingPros.length})</h3>
        {pendingPros.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow mb-4 border-l-4 border-yellow-400">
            <div className="flex gap-4 mb-2">
              <img src={p.image || PLACEHOLDER_IMG} className="w-12 h-12 rounded-full bg-gray-200 object-cover"/>
              <div><h4 className="font-bold">{p.name}</h4><p className="text-sm text-gray-500">{p.service} • {p.city}</p></div>
            </div>
            <div className="bg-gray-50 p-2 rounded mb-2">
               <p className="text-xs font-bold text-gray-500 mb-1">CIN / ID:</p>
               {p.cin_image ? <img src={p.cin_image} className="w-full h-32 object-cover rounded border"/> : <span className="text-red-500 text-xs">Pas d'image</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => verifyProAction(p.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex justify-center gap-1"><Check/> Valider</button>
              <button onClick={() => rejectProAction(p.id)} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-bold flex justify-center gap-1"><Trash2/> Refuser</button>
            </div>
          </div>
        ))}
        {pendingPros.length === 0 && <p className="text-center text-gray-400 mt-10">Aucune demande.</p>}
        
        <h3 className="font-bold text-gray-600 mb-2 mt-8">Validés ({pros.length})</h3>
        {pros.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm mb-2 flex justify-between items-center opacity-75">
             <div className="flex gap-2 items-center">
                <img src={p.image || PLACEHOLDER_IMG} className="w-8 h-8 rounded-full bg-gray-200 object-cover"/>
                <span className="text-sm font-bold">{p.name}</span>
             </div>
             <button onClick={() => rejectProAction(p.id)} className="bg-gray-100 p-2 rounded text-red-500"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    );
  }

  function renderLoginPage() {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <div className="absolute top-6 right-6">
          <LangSwitcher />
        </div>
        
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <ShieldCheck size={40} className="text-emerald-600"/>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">M3allem</h2>
        <p className="text-gray-500 mb-8">{txt('subtitle')}</p>
        
        <div className="mb-8 flex items-center justify-center gap-2">
          <input 
            type="checkbox" 
            id="terms" 
            className="w-5 h-5 accent-emerald-600 rounded"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            {txt('login_terms')} <span onClick={() => setShowTermsModal(true)} className="underline font-bold text-emerald-700 cursor-pointer">{txt('terms_link')}</span>
          </label>
        </div>

        <div className="space-y-3">
          <button 
            disabled={!termsAccepted}
            onClick={() => { setUserRole('client'); navigate('home'); }} 
            className={`w-full p-4 rounded-2xl font-bold transition ${termsAccepted ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {txt('client_btn')}
          </button>
          
          <button 
            disabled={!termsAccepted}
            onClick={() => { setUserRole('pro'); navigate('pro_dashboard'); }} 
            className={`w-full border p-4 rounded-2xl font-bold transition ${termsAccepted ? 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'}`}
          >
            {txt('pro_btn')}
          </button>
        </div>
        <div className="mt-12"><button onClick={() => setView('admin_login')} className="text-gray-300 p-4"><Lock size={16}/></button></div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-emerald-600" size={40}/></div>;

  if (view === 'login') return (
    <>
      {showTermsModal && <TermsModal />}
      {renderLoginPage()}
    </>
  );
  if (view === 'admin_login') return renderAdminLogin();
  if (view === 'admin_dashboard') return renderAdminDashboard();
  if (view === 'pro_dashboard') return renderProDashboard();
  if (view === 'pro_details') return renderProDetailsPage();
  if (view === 'booking') return renderBookingPage();
  if (view === 'quote') return renderQuotePage(); 

  return (
    <div className="font-sans text-gray-900 antialiased bg-gray-50 min-h-screen">
      {notification && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-bounce flex gap-2"><CheckCircle size={16}/>{notification}</div>}
      {view === 'home' && renderLandingPage()}
      {view === 'search' && renderSearchPage()}
      {view === 'bookings' && renderMyBookings()}
      {view === 'profile' && renderProfilePage()}
      <BottomNav />
    </div>
  );
}