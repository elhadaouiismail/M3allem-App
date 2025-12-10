import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Star, ShieldCheck, Phone, MessageCircle, User, Briefcase, 
  CheckCircle, Clock, Menu, X, Wallet, Hammer, Zap, Droplets, Home, ChevronRight, 
  LogOut, Map as MapIcon, List, Navigation, Loader2, Camera, Upload, Lock, Check, Trash2, Eye,
  Bell, Calendar, FileText
} from 'lucide-react';

/**
 * M3ALLEM - STANDALONE DEMO VERSION
 * Fix: Removed external dependencies to guarantee app runs without build errors.
 * Data is saved to your browser's LocalStorage.
 */

// --- CONSTANTS ---
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Fes", "Kenitra", "Agadir"];
const SERVICES = [
  { id: 'plombier', name: 'Plomberie', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
  { id: 'electricien', name: 'Électricité', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'menage', name: 'Ménage', icon: Home, color: 'bg-green-100 text-green-600' },
  { id: 'bricolage', name: 'Bricolage', icon: Hammer, color: 'bg-gray-100 text-gray-600' },
];

// Generic placeholder for seed data
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

// --- SEED DATA (For fresh start) ---
const SEED_PROS = [
  {
    id: 'seed_1',
    owner_id: 'seed_owner',
    name: "Ahmed Benali",
    service: "plombier",
    city: "Casablanca",
    quartier: "Maarif",
    price: "150",
    bio: "Plombier expert avec 10 ans d'expérience.",
    rating: 4.8,
    reviews: 124,
    verified: true,
    image: PLACEHOLDER_IMG,
    map_x: 45,
    map_y: 30
  },
  {
    id: 'seed_2',
    owner_id: 'seed_owner_2',
    name: "Fatima Zahra",
    service: "menage",
    city: "Rabat",
    quartier: "Agdal",
    price: "200",
    bio: "Nettoyage professionnel et ponctuel.",
    rating: 4.9,
    reviews: 85,
    verified: true,
    image: PLACEHOLDER_IMG,
    map_x: 48,
    map_y: 32
  }
];

// --- UTILS: Image to Base64 (Simulates Upload) ---
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target.result); // Returns base64 string
    };
  });
};

export default function App() {
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('home');
  const [userRole, setUserRole] = useState(null);
  
  // Data State
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
  
  // Terms State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Forms
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [cinImage, setCinImage] = useState(null);
  const [cinPreview, setCinPreview] = useState(null);
  
  const [regForm, setRegForm] = useState({ name: '', service: 'plombier', city: 'Casablanca', quartier: '', price: '', bio: '' });
  const [bookingForm, setBookingForm] = useState({ date: '', time: 'Matin', desc: '' });

  // --- INIT ---
  useEffect(() => {
    // Simulate Auth Session
    let storedId = localStorage.getItem('m3allem_user_id');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('m3allem_user_id', storedId);
    }
    setUserId(storedId);
    fetchData();
  }, []);

  // --- LOCAL DATA HANDLING ---
  const fetchData = async () => {
    // Simulate API delay
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
    const updated = [...current, newPro];
    localStorage.setItem('m3allem_pros', JSON.stringify(updated));
    fetchData();
  };

  const saveJob = (newJob) => {
    const current = JSON.parse(localStorage.getItem('m3allem_jobs')) || [];
    const updated = [...current, newJob];
    localStorage.setItem('m3allem_jobs', JSON.stringify(updated));
    fetchData();
  };

  const updateProStatus = (id, status) => {
    const current = JSON.parse(localStorage.getItem('m3allem_pros')) || SEED_PROS;
    let updated;
    if (status === 'deleted') {
      updated = current.filter(p => p.id !== id);
    } else {
      updated = current.map(p => p.id === id ? { ...p, verified: true } : p);
    }
    localStorage.setItem('m3allem_pros', JSON.stringify(updated));
    fetchData();
  };

  // --- ACTIONS ---

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
    if (!profileImage) { showNotification("Erreur: Photo de profil obligatoire !"); return; }
    if (!cinImage) { showNotification("Erreur: Photo CIN obligatoire !"); return; }

    setIsUploading(true);
    
    try {
      let profileUrl = PLACEHOLDER_IMG;
      let cinUrl = null;

      // Simulate upload by converting to base64
      if (profileImage) profileUrl = await compressImage(profileImage);
      if (cinImage) cinUrl = await compressImage(cinImage);

      const newPro = {
        id: 'pro_' + Date.now(),
        owner_id: userId,
        ...regForm,
        rating: 5.0,
        reviews: 0,
        verified: false,
        image: profileUrl,
        cin_image: cinUrl,
        map_x: Math.floor(Math.random() * 80) + 10,
        map_y: Math.floor(Math.random() * 80) + 10
      };

      savePro(newPro);
      showNotification("Profil créé ! En attente de validation.");
      setIsRegisteringPro(false);
      setProfilePreview(null);
      setCinPreview(null);
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const newJob = {
      id: 'job_' + Date.now(),
      client_id: userId,
      pro_id: selectedPro.id,
      pro_name: selectedPro.name,
      service: selectedPro.service,
      date: bookingForm.date,
      time: bookingForm.time,
      desc: bookingForm.desc,
      city: selectedCity,
      status: 'Pending'
    };
    saveJob(newJob);
    showNotification("Demande envoyée !");
    navigate('home');
  };

  // --- ADMIN ---
  const verifyProAction = (id) => {
    updateProStatus(id, 'verified');
    showNotification("Pro Validé !");
  };

  const rejectProAction = (id) => {
    if(!window.confirm("Supprimer ce profil ?")) return;
    updateProStatus(id, 'deleted');
    showNotification("Pro Supprimé.");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if(adminPass === 'admin2025') setView('admin_dashboard');
    else showNotification("Mot de passe incorrect");
  };

  // --- HELPERS ---
  const navigate = (v) => { window.scrollTo(0,0); setView(v); };
  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // --- DATA FILTERING ---
  const myProProfile = userRole === 'pro' 
    ? (pros.find(p => p.owner_id === userId) || pendingPros.find(p => p.owner_id === userId))
    : null;

  const myJobs = userRole === 'pro' && myProProfile
    ? jobs.filter(j => j.pro_id === myProProfile.id)
    : jobs.filter(j => j.client_id === userId);

  const filteredPros = pros.filter(p => {
    return (selectedCategory ? p.service === selectedCategory : true) &&
           (selectedCity ? p.city === selectedCity : true);
  });

  // --- VIEWS ---
  
  // Terms Modal Component
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900">Conditions d'Utilisation</h3>
          <button onClick={() => setShowTermsModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={18}/></button>
        </div>
        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          <p className="font-bold text-gray-900">1. Introduction</p>
          <p>Bienvenue sur M3allem. Cette application met en relation des particuliers et des prestataires de services indépendants. En utilisant l'application, vous acceptez ces conditions.</p>
          <p className="font-bold text-gray-900">2. Rôle de M3allem</p>
          <p>M3allem est un intermédiaire technique. Nous ne sommes pas l'employeur des Maallems. Le contrat est formé directement entre le client et le prestataire.</p>
          <p className="font-bold text-gray-900">3. Inscription & Vérification</p>
          <p>Les Maallems certifient l'authenticité de leurs documents (CIN, Photo). M3allem vérifie l'identité mais ne garantit pas la qualité finale des travaux.</p>
          <p className="font-bold text-gray-900">4. Paiements (Cash on Delivery)</p>
          <p>Le paiement se fait en espèces directement entre le Client et le Maallem. L'accès à l'application est gratuit pour le lancement.</p>
          <p className="font-bold text-gray-900">5. Responsabilité</p>
          <p>M3allem décline toute responsabilité en cas de dommages ou malfaçons. En cas de litige, nous pouvons agir comme médiateur amiable.</p>
          <p className="font-bold text-gray-900">6. Données (CNDP)</p>
          <p>Vos données (Nom, Tél, CIN) sont collectées uniquement pour la mise en relation, conformément à la loi 09-08.</p>
        </div>
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">J'accepte les conditions</button>
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 pb-safe">
      <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <Home size={24} strokeWidth={view === 'home' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">Accueil</span>
      </button>
      <button onClick={() => navigate('search')} className={`flex flex-col items-center gap-1 ${view === 'search' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <Search size={24} strokeWidth={view === 'search' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">Recherche</span>
      </button>
      <button onClick={() => navigate('bookings')} className={`flex flex-col items-center gap-1 ${view === 'bookings' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <Calendar size={24} strokeWidth={view === 'bookings' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">RDV</span>
      </button>
      <button onClick={() => navigate('profile')} className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}>
        <User size={24} strokeWidth={view === 'profile' ? 2.5 : 2}/>
        <span className="text-[10px] font-medium">Compte</span>
      </button>
    </div>
  );

  const renderLandingPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-emerald-600 text-white pt-12 pb-16 px-4 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="text-white" size={20}/>
            </div>
            <span className="font-bold text-lg tracking-wide">M3allem</span>
          </div>
          <button className="relative">
            <Bell size={24}/>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></span>
          </button>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 leading-tight">Besoin d'un <br/>Maallem ?</h1>
        <p className="text-emerald-100 text-sm mb-6">Trouvez un expert vérifié en 2 clics.</p>
        <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center gap-2 transform translate-y-8">
          <div className="bg-gray-50 p-2 rounded-xl text-gray-500"><MapPin size={20}/></div>
          <select className="flex-grow bg-transparent text-gray-800 font-medium outline-none text-sm" value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button onClick={()=>{navigate('search')}} className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 transition"><Search size={20}/></button>
        </div>
      </div>
      <div className="mt-12 px-4">
        <div className="flex justify-between items-end mb-4"><h3 className="font-bold text-gray-800 text-lg">Services</h3><button onClick={()=>navigate('search')} className="text-emerald-600 text-xs font-bold">Voir tout</button></div>
        <div className="grid grid-cols-4 gap-3">
          {SERVICES.map((s) => (
            <button key={s.id} onClick={()=>{setSelectedCategory(s.id); navigate('search')}} className="flex flex-col items-center gap-2 group">
              <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center shadow-sm group-active:scale-95 transition`}><s.icon size={28}/></div>
              <span className="text-xs font-medium text-gray-600 truncate w-full text-center">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 px-4">
        <div className="bg-gray-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
          <div className="relative z-10"><h4 className="font-bold text-lg mb-1">Devenez Pro</h4><p className="text-gray-400 text-xs mb-3">Gagnez plus de clients.</p><button onClick={()=>{setUserRole('pro'); navigate('pro_dashboard')}} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold">Commencer</button></div>
          <Briefcase size={80} className="text-gray-800 absolute -right-4 -bottom-4"/>
        </div>
      </div>
      <div className="mt-8 px-4 mb-4">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Maallems Populaires</h3>
        {pros.length === 0 ? <p className="text-sm text-gray-400">Aucun maallem disponible.</p> :
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {pros.slice(0,5).map(p => (
            <div key={p.id} onClick={()=>{setSelectedPro(p); navigate('pro_details')}} className="min-w-[140px] bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 mb-2 border-2 border-emerald-100 shadow-sm overflow-hidden flex items-center justify-center">
                 <img src={p.image || PLACEHOLDER_IMG} className="w-full h-full object-cover" alt={p.name}/>
              </div>
              <h4 className="font-bold text-sm text-gray-800 truncate w-full">{p.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{p.service}</p>
              <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full"><Star size={10} fill="currentColor"/> {p.rating}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );

  const renderSearchPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h2 className="font-bold text-xl mb-4">Recherche</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button onClick={()=>setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${!selectedCategory ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>Tous</button>
          {SERVICES.map(s => (
            <button key={s.id} onClick={()=>setSelectedCategory(s.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${selectedCategory === s.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{s.name}</button>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {filteredPros.length === 0 ? <div className="text-center py-20 text-gray-400"><Search size={48} className="mx-auto mb-2 opacity-20"/><p>Aucun pro trouvé.</p></div> : 
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Briefcase size={64} className="text-emerald-600 mb-4"/>
        <h2 className="text-2xl font-bold">Devenir Partenaire</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Rejoignez le réseau M3allem et trouvez des clients gratuitement.</p>
        <button onClick={() => setIsRegisteringPro(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200">Créer mon profil</button>
        <button onClick={() => navigate('login')} className="mt-6 text-gray-400 text-sm">Retour à l'accueil</button>
      </div>
    );

    if (isRegisteringPro) return (
      <div className="min-h-screen bg-gray-50 p-4">
        <h2 className="text-xl font-bold mb-6">Création Profil</h2>
        <form onSubmit={handleProRegistration} className="space-y-4">
          <input required placeholder="Nom Complet" className="w-full p-4 rounded-xl border-none shadow-sm" value={regForm.name} onChange={e=>setRegForm({...regForm, name: e.target.value})}/>
          <div className="grid grid-cols-2 gap-3">
            <select className="p-4 rounded-xl border-none shadow-sm bg-white" value={regForm.service} onChange={e=>setRegForm({...regForm, service: e.target.value})}>{SERVICES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
            <select className="p-4 rounded-xl border-none shadow-sm bg-white" value={regForm.city} onChange={e=>setRegForm({...regForm, city: e.target.value})}>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
          </div>
          <input required placeholder="Quartier (ex: Maarif)" className="w-full p-4 rounded-xl border-none shadow-sm" value={regForm.quartier} onChange={e=>setRegForm({...regForm, quartier: e.target.value})}/>
          <input required placeholder="Prix de base (DH)" className="w-full p-4 rounded-xl border-none shadow-sm" type="number" value={regForm.price} onChange={e=>setRegForm({...regForm, price: e.target.value})}/>
          <textarea placeholder="Votre expérience..." className="w-full p-4 rounded-xl border-none shadow-sm h-24" value={regForm.bio} onChange={e=>setRegForm({...regForm, bio: e.target.value})}/>
          
          <div className="space-y-4">
            <p className="font-bold text-gray-700">Photos</p>
            <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${profilePreview ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              {profilePreview ? <img src={profilePreview} className="h-full w-full object-contain rounded-lg p-2" alt="Preview"/> : <><Camera size={24} className="text-gray-400 mb-2"/><span className="text-sm font-medium text-gray-500">Photo de Profil (Obligatoire)</span><span className="text-xs text-gray-400">Appuyez pour ajouter</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'profile')} />
            </label>
            <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${cinPreview ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'}`}>
              {cinPreview ? <img src={cinPreview} className="h-full w-full object-contain rounded-lg p-2" alt="Preview"/> : <><ShieldCheck size={24} className="text-yellow-600 mb-2"/><span className="text-sm font-bold text-yellow-800">Photo CIN (Obligatoire)</span><span className="text-xs text-yellow-600">Preuve d'identité</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'cin')} />
            </label>
          </div>

          <button disabled={isUploading} className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center gap-2 mt-4">
            {isUploading ? <Loader2 className="animate-spin"/> : <Upload/>} {isUploading ? "Envoi..." : "Confirmer"}
          </button>
          <button type="button" onClick={()=>setIsRegisteringPro(false)} className="w-full text-gray-500 py-4">Annuler</button>
        </form>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">P</div><span className="font-bold">Espace Pro</span></div>
          <button onClick={() => navigate('login')}><LogOut size={18}/></button>
        </div>
        <div className="p-4">
          <div className={`p-4 rounded-xl shadow-sm mb-6 border-l-4 ${myProProfile.verified ? 'bg-white border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
            <h3 className="font-bold flex items-center gap-2 text-gray-800"><ShieldCheck size={20}/> {myProProfile.verified ? "Compte Vérifié" : "En attente de validation"}</h3>
            <p className="text-sm text-gray-500 mt-1">Bonjour {myProProfile.name}.</p>
          </div>
          <h3 className="font-bold text-gray-700 mb-4">Mes Jobs ({myJobs.length})</h3>
          {myJobs.length === 0 && <p className="text-gray-400 text-center py-8">Aucun job pour le moment.</p>}
          {myJobs.map(j => (
            <div key={j.id} className="bg-white p-4 rounded-xl shadow-sm mb-3">
              <div className="flex justify-between mb-1">
                <h4 className="font-bold text-emerald-800">{j.service}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{j.status}</span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={12}/> {j.date} • {j.time}</p>
              <p className="text-sm mt-3 bg-gray-50 p-2 rounded text-gray-600">"{j.desc}"</p>
              <div className="mt-3 flex gap-2">
                 <button className="flex-1 border border-emerald-600 text-emerald-600 text-sm font-bold py-2 rounded-lg">WhatsApp</button>
                 <button className="flex-1 bg-emerald-600 text-white text-sm font-bold py-2 rounded-lg">Terminer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- OTHERS ---
  const renderProfilePage = () => (
    <div className="min-h-screen bg-gray-50 pb-20 p-4">
      <h2 className="text-2xl font-bold mb-6">Mon Compte</h2>
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl"><User/></div>
        <div><h3 className="font-bold text-lg">Utilisateur</h3><p className="text-sm text-gray-500">Connecté</p></div>
      </div>
      <div className="space-y-2">
        <button onClick={()=>{setUserRole('pro'); navigate('pro_dashboard')}} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm"><span className="flex items-center gap-3 font-medium"><Briefcase size={20} className="text-emerald-600"/> Espace Pro</span><ChevronRight size={16} className="text-gray-400"/></button>
        <button onClick={()=>{setView('admin_login')}} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm"><span className="flex items-center gap-3 font-medium"><Lock size={20} className="text-gray-400"/> Admin</span><ChevronRight size={16} className="text-gray-400"/></button>
        <button onClick={()=>{setUserRole(null); setTermsAccepted(false); navigate('login');}} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm text-red-500"><span className="flex items-center gap-3 font-medium"><LogOut size={20}/> Déconnexion</span></button>
      </div>
    </div>
  );

  const renderMyBookings = () => (
    <div className="min-h-screen bg-gray-50 pb-20 p-4">
      <h2 className="text-2xl font-bold mb-6">Mes Rendez-vous</h2>
      {myJobs.length === 0 ? <div className="text-center py-20 text-gray-400"><Clock size={48} className="mx-auto mb-2 opacity-20"/><p>Aucun rendez-vous.</p></div> : 
      <div className="space-y-3">
        {myJobs.map(j => (
          <div key={j.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
            <div className="flex justify-between mb-2"><span className="font-bold text-gray-800">{j.service}</span><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{j.status}</span></div>
            <p className="text-sm text-gray-500 mb-1">{j.date} à {j.time}</p>
            <p className="text-xs text-gray-400 truncate">{j.desc}</p>
          </div>
        ))}
      </div>}
    </div>
  );

  function renderProDetailsPage() {
    if (!selectedPro) return null;
    return (
      <div className="min-h-screen bg-white">
         <div className="relative h-48 bg-emerald-600">
            <button onClick={() => navigate('search')} className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-sm"><ChevronRight className="rotate-180"/></button>
         </div>
         <div className="px-4 -mt-16 relative">
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-gray-100">
               <img src={selectedPro.image || PLACEHOLDER_IMG} className="w-28 h-28 rounded-full border-4 border-white shadow-md mx-auto -mt-20 bg-gray-200 object-cover"/>
               <h2 className="text-2xl font-bold mt-3 flex justify-center items-center gap-1">{selectedPro.name} <ShieldCheck size={20} className="text-emerald-500"/></h2>
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
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('pro_details')} className="p-2 bg-white rounded-full shadow-sm"><ChevronRight className="rotate-180"/></button>
          <h2 className="text-xl font-bold">Finaliser la demande</h2>
        </div>
        <form onSubmit={handleBooking} className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input type="date" required className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 ring-emerald-100" onChange={e=>setBookingForm({...bookingForm, date: e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Heure</label>
            <div className="grid grid-cols-3 gap-2">
              {['Matin', 'Après-midi', 'Soir'].map(t => (
                <button type="button" key={t} onClick={()=>setBookingForm({...bookingForm, time: t})} className={`p-3 rounded-xl text-sm font-medium transition ${bookingForm.time === t ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea required placeholder="Décrivez le problème..." className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none h-32 focus:ring-2 ring-emerald-100" onChange={e=>setBookingForm({...bookingForm, desc: e.target.value})}/>
          </div>
          <button className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-lg">Confirmer la demande</button>
        </form>
      </div>
    );
  }

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