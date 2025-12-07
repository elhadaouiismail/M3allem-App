import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Star, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  User, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Menu, 
  X, 
  Wallet, 
  Hammer, 
  Zap, 
  Droplets, 
  Home, 
  ChevronRight,
  LogOut,
  Map as MapIcon,
  List,
  Navigation,
  Loader2,
  Camera,
  Upload,
  Lock,   
  Check,  
  Trash2, 
  Eye     
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp,
  orderBy,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

/**
 * M3ALLEM - Connected MVP v4 (With Image Compression)
 */

// --- CONFIGURATION & INIT ---
const firebaseConfig = {
  apiKey: "AIzaSyD2jsw6Sr9TKrgrXLJUm3Z514DDtNj8BhU",
  authDomain: "kounhany-6c244.firebaseapp.com",
  projectId: "kounhany-6c244",
  storageBucket: "kounhany-6c244.firebasestorage.app",
  messagingSenderId: "501183091490",
  appId: "1:501183091490:web:9416da7ddfac763f858b7b"
};

// Initialize only once
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // Ignore duplicate init errors in dev
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = 'kounhany-public'; 

// --- CONSTANTS ---
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Fes", "Kenitra", "Agadir"];
const SERVICES = [
  { id: 'plombier', name: 'Plomberie', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
  { id: 'electricien', name: 'Électricité', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'menage', name: 'Ménage', icon: Home, color: 'bg-green-100 text-green-600' },
  { id: 'bricolage', name: 'Bricolage', icon: Hammer, color: 'bg-gray-100 text-gray-600' },
];

// --- UTILS: IMAGE COMPRESSION ---
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Resize large photos to max 800px width
        const scaleSize = MAX_WIDTH / img.width;
        
        // If image is smaller than max, don't resize
        if (scaleSize >= 1) {
            resolve(file);
            return;
        }

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress to JPEG with 0.7 quality
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.7);
      };
    };
  });
};

// --- MAIN COMPONENT ---
export default function App() {
  // State
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [userRole, setUserRole] = useState(null);
  
  // Data State
  const [pros, setPros] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Admin State
  const [adminPass, setAdminPass] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [pendingPros, setPendingPros] = useState([]);
  
  // Selection State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [selectedPro, setSelectedPro] = useState(null);
  const [isMapView, setIsMapView] = useState(false);
  const [notification, setNotification] = useState(null);

  // Pro Registration State
  const [isRegisteringPro, setIsRegisteringPro] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [cinImage, setCinImage] = useState(null);

  const [regForm, setRegForm] = useState({ 
    name: '', 
    service: 'plombier', 
    city: 'Casablanca', 
    quartier: '', 
    price: '', 
    bio: '' 
  });
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({ date: '', time: 'Matin (09:00 - 12:00)', desc: '' });

  // --- 1. AUTHENTICATION & INIT ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    if (!user) return;

    // Fetch ALL pros (for admin) and Verified pros (for users)
    const prosQuery = query(collection(db, 'artifacts', appId, 'public', 'data', 'pros'));
    const unsubPros = onSnapshot(prosQuery, (snapshot) => {
      const allPros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPros(allPros.filter(p => p.verified === true)); 
      setPendingPros(allPros.filter(p => p.verified === false));
      setLoading(false);
    }, (error) => console.error("Error fetching pros:", error));

    const jobsQuery = query(collection(db, 'artifacts', appId, 'public', 'data', 'jobs'));
    const unsubJobs = onSnapshot(jobsQuery, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(fetchedJobs);
    }, (error) => console.error("Error fetching jobs:", error));

    return () => { unsubPros(); unsubJobs(); };
  }, [user]);

  // --- ACTIONS ---

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'jobs'), {
        client_id: user.uid,
        pro_id: selectedPro.id,
        pro_name: selectedPro.name,
        service: selectedPro.service,
        date: bookingForm.date,
        time: bookingForm.time,
        desc: bookingForm.desc,
        status: 'Pending',
        city: selectedCity,
        created_at: serverTimestamp()
      });
      showNotification("Demande envoyée avec succès !");
      navigate('home');
    } catch (err) {
      showNotification("Erreur lors de la réservation.");
    }
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleProRegistration = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsUploading(true);

    try {
      const timestamp = Date.now();
      let profileUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${regForm.name}`; 
      let cinUrl = null;

      // COMPRESS AND UPLOAD PROFILE IMAGE
      if (profileImage) {
        const compressedProfile = await compressImage(profileImage);
        profileUrl = await uploadFile(compressedProfile, `pros/${user.uid}/profile_${timestamp}.jpg`);
      }
      
      // COMPRESS AND UPLOAD CIN IMAGE
      if (cinImage) {
        const compressedCin = await compressImage(cinImage);
        cinUrl = await uploadFile(compressedCin, `pros/${user.uid}/cin_${timestamp}.jpg`);
      }

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'pros'), {
        owner_id: user.uid,
        ...regForm,
        rating: 5.0,
        reviews: 0,
        verified: false,
        image: profileUrl,
        cin_image: cinUrl,
        mapX: Math.floor(Math.random() * 80) + 10,
        mapY: Math.floor(Math.random() * 80) + 10
      });

      showNotification("Profil créé ! En attente de validation.");
      setIsRegisteringPro(false);
    } catch (err) {
      console.error(err);
      showNotification("Erreur d'inscription. Vérifiez votre connexion.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- ADMIN ACTIONS ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin2025') {
      setIsAdminAuth(true);
      setView('admin_dashboard');
    } else {
      showNotification("Mot de passe incorrect");
    }
  };

  const verifyPro = async (proId) => {
    try {
      const proRef = doc(db, 'artifacts', appId, 'public', 'data', 'pros', proId);
      await updateDoc(proRef, { verified: true });
      showNotification("Professionnel validé !");
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de la validation");
    }
  };

  const rejectPro = async (proId) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) return;
    try {
      const proRef = doc(db, 'artifacts', appId, 'public', 'data', 'pros', proId);
      await deleteDoc(proRef);
      showNotification("Profil supprimé.");
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de la suppression");
    }
  };

  const navigate = (target) => {
    window.scrollTo(0,0);
    setView(target);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- FILTERED DATA ---
  const myProProfile = user ? pros.find(p => p.owner_id === user.uid) || pendingPros.find(p => p.owner_id === user.uid) : null;
  
  const myRelevantJobs = userRole === 'pro' && myProProfile
    ? jobs.filter(j => j.pro_id === myProProfile.id)
    : user ? jobs.filter(j => j.client_id === user.uid)
    : [];

  const filteredPros = pros.filter(p => {
    const matchCity = selectedCity ? p.city === selectedCity : true;
    const matchCat = selectedCategory ? p.service === selectedCategory : true;
    return matchCity && matchCat;
  });

  // --- RENDER FUNCTIONS ---

  const renderAdminDashboard = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-red-600"/> Admin Dashboard
        </h2>
        <button onClick={() => setView('home')} className="text-gray-500"><LogOut size={20}/></button>
      </div>

      <h3 className="font-bold text-gray-700 mb-4">En attente de validation ({pendingPros.length})</h3>
      
      {pendingPros.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <CheckCircle size={48} className="mx-auto mb-2 opacity-20"/>
          <p>Tout est à jour !</p>
        </div>
      )}

      <div className="space-y-4">
        {pendingPros.map(pro => (
          <div key={pro.id} className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-400">
            <div className="flex gap-4">
              <img src={pro.image} className="w-16 h-16 rounded-full bg-gray-100 object-cover"/>
              <div>
                <h4 className="font-bold text-lg">{pro.name}</h4>
                <p className="text-sm text-gray-500">{pro.service} • {pro.city}</p>
                <p className="text-sm text-gray-500">{pro.phone || "Pas de téléphone"}</p>
              </div>
            </div>
            
            {/* CIN Display */}
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><Eye size={12}/> Preuve d'identité (CIN)</p>
              {pro.cin_image ? (
                <a href={pro.cin_image} target="_blank" rel="noreferrer">
                  <img src={pro.cin_image} className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90 cursor-pointer"/>
                </a>
              ) : (
                <p className="text-red-500 text-xs italic">Aucune image CIN téléchargée</p>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => verifyPro(pro.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                <Check size={18}/> Valider
              </button>
              <button onClick={() => rejectPro(pro.id)} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-bold hover:bg-red-200 flex items-center justify-center gap-2">
                <Trash2 size={18}/> Refuser
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdminLogin = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full text-center">
        <ShieldCheck size={48} className="text-red-500 mx-auto mb-4"/>
        <h2 className="text-2xl font-bold text-white mb-6">Accès Administrateur</h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="Mot de passe secret" 
            className="w-full p-4 rounded-xl bg-gray-800 border-gray-700 text-white text-center text-lg tracking-widest"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
          />
          <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700">
            Entrer
          </button>
          <button type="button" onClick={() => setView('login')} className="text-gray-500 text-sm mt-4">
            Retour
          </button>
        </form>
      </div>
    </div>
  );

  const renderLandingPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-emerald-600 text-white pb-12 pt-6 rounded-b-3xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-yellow-300" />
              M3allem
            </h1>
            {!userRole ? (
              <button onClick={() => navigate('login')} className="bg-white text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm hover:bg-emerald-50 transition">
                Connexion
              </button>
            ) : (
              <div className="flex items-center gap-3">
                 <span className="text-sm font-medium">{userRole === 'pro' ? 'Espace Pro' : 'Mon Compte'}</span>
                 <button onClick={() => { setUserRole(null); navigate('home'); }}><LogOut size={18}/></button>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Trouvez un Maallem de confiance</h2>
            <p className="text-emerald-100 mb-8 max-w-md mx-auto">Application 100% Gratuite et Connectée.</p>
            <div className="bg-white p-2 rounded-2xl shadow-lg max-w-lg mx-auto flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-gray-700 focus:outline-none appearance-none"
                  value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => navigate('search')} className="bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-2">
                <Search size={20} /> Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map((srv) => (
            <button key={srv.id} onClick={() => { setSelectedCategory(srv.id); navigate('search'); }} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col items-center gap-3">
              <div className={`p-4 rounded-full ${srv.color}`}><srv.icon size={28} /></div>
              <span className="font-semibold text-gray-700">{srv.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto bg-gray-800 text-gray-300 py-8 text-center">
        <p className="mb-4">Vous êtes un Maallem ?</p>
        <button onClick={() => { setUserRole('pro'); navigate('pro_dashboard'); }} className="text-emerald-400 font-bold hover:underline">
          Inscrivez-vous Gratuitement
        </button>
      </div>
    </div>
  );

  const renderSearchPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button onClick={() => navigate('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180 text-gray-600" /></button>
              <div>
                <h2 className="font-bold text-lg text-gray-800">{selectedCategory ? SERVICES.find(s=>s.id === selectedCategory).name : 'Tous les services'}</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {selectedCity}</p>
              </div>
           </div>
           <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setIsMapView(false)} className={`p-2 rounded-md transition ${!isMapView ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}><List size={20} /></button>
              <button onClick={() => setIsMapView(true)} className={`p-2 rounded-md transition ${isMapView ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}><MapIcon size={20} /></button>
           </div>
        </div>
        <div className="flex overflow-x-auto gap-2 px-4 pb-3 no-scrollbar">
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => setSelectedCategory(s.id)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${selectedCategory === s.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow relative">
        {filteredPros.length === 0 ? (
           <div className="text-center py-12 text-gray-500 container mx-auto">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>Aucun professionnel trouvé à {selectedCity}.</p>
           </div>
        ) : isMapView ? (
          <div className="absolute inset-0 bg-slate-100 overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-gray-600 shadow-md z-10 flex items-center gap-2">
               <Navigation size={12} className="text-emerald-600" /> Taskers à proximité
             </div>
             {filteredPros.map(pro => (
               <button key={pro.id} onClick={() => { setSelectedPro(pro); navigate('pro_details'); }} className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition duration-300 group" style={{ top: `${pro.mapY}%`, left: `${pro.mapX}%` }}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white"><img src={pro.image} alt={pro.name} className="w-full h-full object-cover" /></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-600 rotate-45 transform"></div>
                  </div>
               </button>
             ))}
          </div>
        ) : (
          <div className="container mx-auto px-4 py-6 space-y-4">
            {filteredPros.map(pro => (
              <div key={pro.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition" onClick={() => { setSelectedPro(pro); navigate('pro_details'); }}>
                <img src={pro.image} alt={pro.name} className="w-16 h-16 rounded-full bg-gray-100 object-cover" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center gap-1">{pro.name} {pro.verified && <ShieldCheck size={16} className="text-emerald-500" />}</h3>
                      <p className="text-sm text-gray-500">{pro.quartier}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg"><Star size={14} className="text-yellow-500 fill-current" /><span className="text-xs font-bold text-yellow-700">{pro.rating}</span></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-700">{pro.price} MAD <span className="text-gray-400 text-xs font-normal">/ visite</span></span>
                    <button className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg font-medium">Voir Profil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProDetailsPage = () => {
    if (!selectedPro) return null;
    return (
      <div className="min-h-screen bg-white">
         <div className="relative h-40 bg-emerald-600">
            <button onClick={() => navigate('search')} className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-sm"><ChevronRight className="rotate-180" /></button>
         </div>
         <div className="container mx-auto px-4 -mt-12 relative">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
               <img src={selectedPro.image} className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto -mt-16 bg-gray-100 object-cover" />
               <h2 className="text-xl font-bold mt-3 flex items-center justify-center gap-2">{selectedPro.name} {selectedPro.verified && <ShieldCheck size={20} className="text-emerald-500" />}</h2>
               <p className="text-gray-500 text-sm">{selectedPro.quartier}, {selectedPro.city}</p>
               <div className="flex justify-center gap-6 mt-6 border-t border-b border-gray-50 py-4">
                  <div className="text-center"><span className="block font-bold text-gray-800">{selectedPro.rating}</span><span className="text-xs text-gray-400">Étoiles</span></div>
                  <div className="text-center"><span className="block font-bold text-gray-800">{selectedPro.reviews}</span><span className="text-xs text-gray-400">Avis</span></div>
                  <div className="text-center"><span className="block font-bold text-gray-800">{selectedPro.price} MAD</span><span className="text-xs text-gray-400">Tarif</span></div>
               </div>
               <div className="text-left mt-6">
                 <h4 className="font-bold text-gray-800 mb-2">À propos</h4>
                 <p className="text-gray-600 text-sm leading-relaxed">{selectedPro.bio}</p>
               </div>
            </div>
            <div className="mt-6 pb-8">
              <button onClick={() => navigate('booking')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                Contacter Gratuitement
              </button>
            </div>
         </div>
      </div>
    );
  };

  const renderBookingPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Finaliser la demande</h2>
        <form onSubmit={handleBooking}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
              <input required type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <select value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200">
                <option>Matin (09:00 - 12:00)</option>
                <option>Après-midi (14:00 - 18:00)</option>
                <option>Urgence (Immédiat)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required value={bookingForm.desc} onChange={e => setBookingForm({...bookingForm, desc: e.target.value})} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 h-32 resize-none" placeholder="Ex: Robinet qui fuit..." />
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl flex items-start gap-3 mt-4">
              <CheckCircle className="text-emerald-600 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">Service Gratuit</h4>
                <p className="text-xs text-emerald-600 mt-1">Paiement direct au Tasker.</p>
              </div>
            </div>
            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4 hover:bg-gray-800">Envoyer la demande</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderProDashboard = () => {
    if (!myProProfile && !isRegisteringPro) {
      return (
         <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <Briefcase size={64} className="text-emerald-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Devenir Partenaire</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Vous n'avez pas encore de profil Pro. Créez-en un gratuitement pour recevoir des missions.</p>
            <button onClick={() => setIsRegisteringPro(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700">
               Créer mon profil
            </button>
         </div>
      );
    }

    if (isRegisteringPro) {
      return (
        <div className="min-h-screen bg-gray-50 p-4">
           <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
             <h2 className="text-xl font-bold mb-6">Création Profil Pro</h2>
             <form onSubmit={handleProRegistration} className="space-y-4">
               {/* 1. Name */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                 <input required placeholder="Votre Nom" className="w-full p-3 bg-gray-50 rounded-lg border" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
               </div>

               {/* 2. Photo Upload */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Camera size={16}/> Photo de Profil</label>
                 <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
               </div>

               {/* 3. CIN Upload (Critical) */}
               <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                 <label className="block text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2"><ShieldCheck size={16}/> Photo CIN (Obligatoire)</label>
                 <p className="text-xs text-yellow-700 mb-2">Pour vérifier votre identité. Ne sera pas visible publiquement.</p>
                 <input required type="file" accept="image/*" onChange={(e) => setCinImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
               </div>

               {/* 4. Details */}
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                   <select className="w-full p-3 bg-gray-50 rounded-lg border" value={regForm.service} onChange={e => setRegForm({...regForm, service: e.target.value})}>
                     {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                   <select className="w-full p-3 bg-gray-50 rounded-lg border" value={regForm.city} onChange={e => setRegForm({...regForm, city: e.target.value})}>
                     {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
               </div>

               <input required placeholder="Votre Quartier (ex: Maarif)" className="w-full p-3 bg-gray-50 rounded-lg border" value={regForm.quartier} onChange={e => setRegForm({...regForm, quartier: e.target.value})} />
               <input required type="number" placeholder="Prix de base (DH)" className="w-full p-3 bg-gray-50 rounded-lg border" value={regForm.price} onChange={e => setRegForm({...regForm, price: e.target.value})} />
               <textarea required placeholder="Courte bio (votre expérience, spécialités...)" className="w-full p-3 bg-gray-50 rounded-lg border h-24" value={regForm.bio} onChange={e => setRegForm({...regForm, bio: e.target.value})} />
               
               <button disabled={isUploading} type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                 {isUploading ? <Loader2 className="animate-spin"/> : <Upload size={20} />}
                 {isUploading ? "Téléchargement..." : "Confirmer l'inscription"}
               </button>
               <button type="button" onClick={() => setIsRegisteringPro(false)} className="w-full text-gray-500 py-2">Annuler</button>
             </form>
           </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gray-900 text-white p-4 sticky top-0 z-20 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">P</div>
              <span className="font-bold">Espace Pro</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                 <CheckCircle size={14} className="text-emerald-400" /><span className="text-xs font-medium text-emerald-100">Accès Gratuit</span>
               </div>
               <button onClick={() => { setUserRole(null); navigate('home'); }}><LogOut size={18} /></button>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4 max-w-2xl">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500 mb-6">
            <h3 className="font-bold flex items-center gap-2 text-gray-800"><ShieldCheck size={20} className="text-emerald-600"/> Statut: {myProProfile.verified ? "Vérifié" : "En attente de validation"}</h3>
            <p className="text-sm text-gray-500 mt-1">Bonjour {myProProfile.name}. {myProProfile.verified ? "Vous êtes visible !" : "Votre profil est en cours de vérification."}</p>
          </div>

          <h3 className="font-bold text-gray-700 mb-4 px-1">Demandes entrantes ({myRelevantJobs.length})</h3>
          <div className="space-y-4">
            {myRelevantJobs.length === 0 && <p className="text-center text-gray-400 py-8">Aucune demande pour le moment.</p>}
            {myRelevantJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
                <div className="flex gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full h-fit text-blue-600"><Droplets size={24} /></div>
                  <div>
                    <h4 className="font-bold text-lg">{job.service}</h4>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> {job.city}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><Clock size={14} /> {job.date} - {job.time}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-600 italic">"{job.desc}"</div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center justify-center gap-2" onClick={() => showNotification("Contact débloqué !")}>
                    Accepter le Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLoginPage = () => (
    <div className="min-h-screen bg-white flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Bienvenue</h2>
        <p className="text-gray-500 mb-8">Connectez-vous pour continuer</p>
        <div className="space-y-4">
          <button onClick={() => { setUserRole('client'); navigate('home'); }} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700">
            <User size={20} /> Continuer comme Client
          </button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Ou</span></div>
          </div>
          <button onClick={() => { setUserRole('pro'); navigate('pro_dashboard'); }} className="w-full bg-gray-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800">
            <Briefcase size={20} /> Espace Professionnel
          </button>
        </div>
        
        {/* SECRET ADMIN ACCESS */}
        <div className="mt-12 flex justify-center">
          <button onClick={() => setView('admin_login')} className="text-gray-200 hover:text-gray-400 p-2">
            <Lock size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-emerald-600" size={40}/></div>;

  return (
    <div className="font-sans text-gray-900 antialiased">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} className="text-emerald-400" /><span className="text-sm font-medium">{notification}</span>
        </div>
      )}
      {view === 'home' && renderLandingPage()}
      {view === 'search' && renderSearchPage()}
      {view === 'pro_details' && renderProDetailsPage()}
      {view === 'booking' && renderBookingPage()}
      {view === 'pro_dashboard' && renderProDashboard()}
      {view === 'login' && renderLoginPage()}
      {view === 'admin_login' && renderAdminLogin()}
      {view === 'admin_dashboard' && renderAdminDashboard()}
    </div>
  );
}