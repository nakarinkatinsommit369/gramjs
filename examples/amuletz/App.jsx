import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Search,
  Camera,
  Star,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Lock,
  Upload,
  Plus,
  LogOut,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Filter,
  Save,
  RotateCcw,
  BookOpen,
  PenTool,
  Book,
  Download,
  Facebook,
  Globe,
  Settings,
  Link as LinkIcon,
  Wifi,
  Sparkles,
  Key,
} from 'lucide-react';

// --- API CONFIGURATION ---
const apiKey = ''; // API Key จะถูกใส่โดยอัตโนมัติในสภาพแวดล้อมการทำงานจริง

// --- GEMINI API HANDLER ---
const callGemini = async (prompt, systemInstruction = '') => {
  if (!apiKey) {
    console.warn('Gemini API Key is missing.');
    return 'Error: API Key not found. Please verify configuration.';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'The spirits are silent (No response).'
    );
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Connection to the spiritual realm failed. Please try again.';
  }
};

// --- TRANSLATIONS (คลังคำศัพท์) ---
const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      gallery: 'Gallery',
      chronicles: 'Chronicles',
      library: 'Library',
      auth: 'Authentication',
      creator: 'CREATOR MODE',
    },
    hero: {
      tag: 'The New Standard of Sacred Arts',
      subtitle:
        'Experience spiritual beauty through precise categorization, accessing the true essence of Buddhist arts.',
      view_all: 'View All Collection',
      slot: 'Available Slot',
      view: 'View',
    },
    gallery: {
      title: 'Masterpiece Collection',
      subtitle: 'Curated selection of rare and supreme sacred artifacts',
      collection_btn: 'Collection',
      view_details: 'View Details',
    },
    chronicles: {
      title: 'The Chronicles',
      subtitle:
        'Legends, history, and knowledge of sacred arts meticulously compiled.',
      read_more: 'Read Full Story',
      write_new: 'Write New Chronicle',
    },
    library: {
      title: 'The Sacred Library',
      subtitle:
        'Digital wisdom archive collecting profound scriptures and amulet study guides.',
      read_now: 'Read Now',
      add_book: 'Add New Book',
      pages: 'Pages',
      ebook: 'E-Book',
    },
    auth: {
      title: 'Trust Protocol',
      subtitle:
        'Digital Certificate verification system. Immutable and 100% secure.',
      placeholder: 'Enter Certificate ID (e.g., AX-2024-001)',
      not_found: 'Data not found or invalid ID',
      verified: 'Authenticated',
      cert_id: 'Cert ID',
      material: 'Material',
      era: 'Era',
    },
    admin: {
      title: 'Creator Studio',
      access_granted: 'Admin Access Granted',
      end_session: 'End Session',
      manage_artifacts: 'Manage Artifacts',
      manage_chronicles: 'Manage Chronicles',
      manage_ebooks: 'Manage E-Books',
      system_settings: 'System Settings',
      upload_images: 'Upload Images',
      select_multiple: '(Select Multiple)',
      max_size: 'Max 5MB per file',
      images_selected: 'images selected',
      name: 'Name',
      category: 'Category',
      price: 'Price',
      status: 'Status',
      era: 'Era',
      material: 'Material',
      story: 'The Story',
      save_artifact: 'Save Artifact',
      consecrate: 'Consecrate (Add)',
      cancel: 'Cancel',
      c_title: 'Title',
      c_excerpt: 'Excerpt',
      c_content: 'Full Content',
      c_upload_cover: 'Upload Cover',
      c_change_cover: 'Change Cover',
      c_update: 'Update Chronicle',
      c_publish: 'Publish Chronicle',
      b_upload_cover: 'Upload Cover',
      b_portrait: '(Portrait)',
      b_title: 'Book Title',
      b_author: 'Author',
      b_pages: 'Pages',
      b_desc: 'Description',
      b_update: 'Update Book',
      b_publish: 'Publish to Library',
      api_config_title: 'API Configuration',
      api_desc: 'Directly connect to external services using your API Key.',
      api_key_label: 'Paste your API Key here',
      api_connect: 'Verify & Connect',
      api_status: 'Status',
      api_disconnected: 'No Key Detected',
      api_connected: 'Key Verified & Active',
      ai_draft: '✨ Draft with AI',
    },
    footer: {
      rights: '© 2024 Digital Sanctuary for Sacred Arts. All rights reserved.',
      system_unlocked: 'System Unlocked',
      admin_access: 'Admin Access',
    },
    modal: {
      verified: 'Blockchain Verified',
      contact: 'Contact for Inquiry',
      ai_oracle: '✨ Consult Oracle',
      ai_analyze: 'Analyzing spiritual energy...',
    },
    status: { available: 'Available', reserved: 'Reserved', sold: 'Sold' },
  },
  th: {
    nav: {
      home: 'หน้าหลัก',
      gallery: 'แกลเลอรี',
      chronicles: 'ตำนาน',
      library: 'หอสมุด',
      auth: 'ตรวจสอบพระ',
      creator: 'โหมดผู้สร้าง',
    },
    hero: {
      tag: 'มาตรฐานใหม่แห่งพุทธศิลป์',
      subtitle:
        'สัมผัสความงามระดับจิตวิญญาณผ่านการจัดหมวดหมู่ที่แม่นยำ เพื่อให้คุณเข้าถึงแก่นแท้ของพุทธศิลป์',
      view_all: 'ดูคอลเลกชันทั้งหมด',
      slot: 'พื้นที่ว่าง',
      view: 'ดูรายละเอียด',
    },
    gallery: {
      title: 'คอลเลกชันระดับตำนาน',
      subtitle:
        'คัดสรรเฉพาะสุดยอดพุทธศิลป์ที่หาชมยากและทรงคุณค่า',
      collection_btn: 'คอลเลกชัน',
      view_details: 'ดูรายละเอียด',
    },
    chronicles: {
      title: 'บันทึกตำนาน',
      subtitle:
        'รวบรวมประวัติศาสตร์ เรื่องเล่าขาน และเกร็ดความรู้แห่งวงการพระเครื่อง',
      read_more: 'อ่านเรื่องราวเต็ม',
      write_new: 'เขียนบันทึกใหม่',
    },
    library: {
      title: 'หอสมุดศักดิ์สิทธิ์',
      subtitle:
        'คลังปัญญาดิจิทัล รวบรวมตำราและคู่มือศึกษาพระเครื่องฉบับเจาะลึก',
      read_now: 'อ่านทันที',
      add_book: 'เพิ่มหนังสือใหม่',
      pages: 'หน้า',
      ebook: 'อีบุ๊ก',
    },
    auth: {
      title: 'ระบบตรวจสอบ',
      subtitle:
        'ระบบตรวจสอบใบรับรองดิจิทัล (Digital Certificate) ที่ไม่สามารถปลอมแปลงได้ มั่นใจ 100%',
      placeholder: 'กรอกรหัสใบรับรอง (เช่น AX-2024-001)',
      not_found: 'ไม่พบข้อมูลในระบบ หรือรหัสไม่ถูกต้อง',
      verified: 'ตรวจสอบแล้ว',
      cert_id: 'เลขที่ใบรับรอง',
      material: 'มวลสาร',
      era: 'ยุคสมัย',
    },
    admin: {
      title: 'สตูดิโอผู้สร้าง',
      access_granted: 'เข้าถึงระบบแล้ว',
      end_session: 'จบการทำงาน',
      manage_artifacts: 'จัดการวัตถุมงคล',
      manage_chronicles: 'จัดการบทความ',
      manage_ebooks: 'จัดการหนังสือ',
      system_settings: 'ตั้งค่าระบบ',
      upload_images: 'อัปโหลดรูปภาพ',
      select_multiple: '(เลือกได้หลายรูป)',
      max_size: 'สูงสุด 5MB ต่อไฟล์',
      images_selected: 'รูปที่เลือก',
      name: 'ชื่อพระ',
      category: 'หมวดหมู่',
      price: 'ราคาเช่าบูชา',
      status: 'สถานะ',
      era: 'ยุคสมัย',
      material: 'มวลสาร',
      story: 'ประวัติความเป็นมา',
      save_artifact: 'บันทึกข้อมูล',
      consecrate: 'เพิ่มรายการใหม่',
      cancel: 'ยกเลิก',
      c_title: 'หัวข้อเรื่อง',
      c_excerpt: 'เกริ่นนำ',
      c_content: 'เนื้อหาฉบับเต็ม',
      c_upload_cover: 'อัปโหลดภาพปก',
      c_change_cover: 'เปลี่ยนภาพปก',
      c_update: 'อัปเดตบทความ',
      c_publish: 'เผยแพร่บทความ',
      b_upload_cover: 'อัปโหลดปก',
      b_portrait: '(แนวตั้ง)',
      b_title: 'ชื่อหนังสือ',
      b_author: 'ผู้แต่ง',
      b_pages: 'จำนวนหน้า',
      b_desc: 'คำโปรย',
      b_update: 'อัปเดตหนังสือ',
      b_publish: 'นำเข้าห้องสมุด',
      api_config_title: 'การเชื่อมต่อ API',
      api_desc:
        'เชื่อมต่อกับระบบภายนอกโดยใช้รหัสผ่าน API (API Key) เพียงอย่างเดียว',
      api_key_label: 'วางรหัส API Key ที่นี่',
      api_connect: 'ตรวจสอบและบันทึก',
      api_status: 'สถานะ',
      api_disconnected: 'ยังไม่ระบุ Key',
      api_connected: 'คีย์ถูกต้อง (Active)',
      ai_draft: '✨ ให้ AI ช่วยเขียน',
    },
    footer: {
      rights:
        '© 2024 พื้นที่ศักดิ์สิทธิ์ดิจิทัลสำหรับพุทธศิลป์ สงวนลิขสิทธิ์',
      system_unlocked: 'ระบบปลดล็อกแล้ว',
      admin_access: 'เข้าสู่ระบบผู้ดูแล',
    },
    modal: {
      verified: 'ยืนยันด้วยบล็อกเชน',
      contact: 'ติดต่อสอบถาม',
      ai_oracle: '✨ ปรึกษาผู้ทำนาย',
      ai_analyze: 'กำลังตรวจจับพุทธคุณ...',
    },
    status: { available: 'เปิดให้บูชา', reserved: 'จองแล้ว', sold: 'ปิดรายการ' },
  },
};

// --- DATA SIMULATION ---
const INITIAL_DATA = [
  {
    id: 1,
    name: 'Phra Somdej Wat Rakang',
    category: 'Benjapakee',
    era: 'Rattanakosin (King Rama IV)',
    material: 'Sacred Powder (Pong Wiset)',
    price: '฿ 15,000,000',
    status: 'Available',
    color: 'bg-gradient-to-br from-[#eecda3] to-[#ef629f]',
    story:
      'จักรพรรดิแห่งพระเครื่อง สร้างโดยสมเด็จโต พรหมรังสี เนื้อหามวลสารศักดิ์สิทธิ์ พุทธคุณครอบจักรวาล เมตตามหานิยมแคล้วคลาด',
    certId: 'AX-2024-001',
    images: [],
  },
  {
    id: 2,
    name: 'Phra Rod Mahawan',
    category: 'Benjapakee',
    era: 'Hariphunchai (1,200 Years)',
    material: 'Baked Clay',
    price: '฿ 5,500,000',
    status: 'Reserved',
    color: 'bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0]',
    story:
      'พระรอด หนึ่งในชุดเบญจภาคี เก่าแก่ที่สุดในบรรดาพระเครื่อง พุทธคุณเน้นความแคล้วคลาดรอดพ้นภัยอันตราย',
    certId: 'AX-2024-002',
    images: [],
  },
  {
    id: 3,
    name: 'Phra Nang Phaya',
    category: 'Benjapakee',
    era: 'Ayutthaya',
    material: 'Baked Clay',
    price: '฿ 3,200,000',
    status: 'Sold',
    color: 'bg-gradient-to-br from-[#c0392b] to-[#8e44ad]',
    story:
      'ราชินีแห่งพระเครื่อง สร้างโดยพระวิสุทธิกษัตรีย์ เด่นด้านเมตตามหานิยมและอำนาจบารมี เหมาะสำหรับผู้นำ',
    certId: 'AX-2024-003',
    images: [],
  },
  {
    id: 4,
    name: 'Rian Luang Phor Klan',
    category: 'Metal Coin',
    era: 'Ayutthaya (2469 B.E.)',
    material: 'Copper',
    price: '฿ 4,800,000',
    status: 'Available',
    color: 'bg-gradient-to-br from-[#D38312] to-[#A83279]',
    story:
      'เหรียญหลวงพ่อกลั่น วัดพระญาติฯ พิมพ์ขอเบ็ด ยอดนิยมอันดับหนึ่งของเหรียญคณาจารย์',
    certId: 'AX-2024-004',
    images: [],
  },
];

const INITIAL_CHRONICLES = [
  {
    id: 1,
    title: 'ตำนานสมเด็จพุฒาจารย์ (โต พรหมรังสี)',
    excerpt:
      'เปิดบันทึกประวัติอริยสงฆ์ผู้ทรงอภิญญา ผู้สร้างจักรพรรดิแห่งพระเครื่อง',
    content:
      'สมเด็จพระพุฒาจารย์ (โต พรหมรังสี) เป็นพระเกจิเถราจารย์ผู้มีชื่อเสียงโด่งดังที่สุดรูปหนึ่งของไทย ท่านเป็นผู้สร้างพระสมเด็จวัดระฆัง...',
    image: null,
    date: '25 Oct 2024',
  },
  {
    id: 2,
    title: 'เบญจภาคี: 5 สุดยอดพระเครื่อง',
    excerpt:
      'ทำความรู้จักกับชุดพระเครื่องที่ทรงคุณค่าและเป็นที่ต้องการมากที่สุดในวงการ',
    content:
      'เบญจภาคี คือ ชุดพระเครื่อง 5 องค์ที่ได้รับการยกย่องว่าเป็นสุดยอดของพุทธศิลป์และพุทธคุณ ประกอบด้วย พระสมเด็จ พระรอด พระนางพญา พระผงสุพรรณ และพระซุ้มกอ...',
    image: null,
    date: '20 Oct 2024',
  },
];

const INITIAL_EBOOKS = [
  {
    id: 1,
    title: 'คู่มือส่องพระสมเด็จฉบับเซียน',
    author: 'อ.วิชาญ พุทธศิลป์',
    description:
      'เจาะลึกมวลสาร ตำหนิพิมพ์ทรง และวิธีการดูพระสมเด็จวัดระฆังอย่างละเอียดทุกจุดตาย',
    cover: null,
    pages: 128,
  },
  {
    id: 2,
    title: 'เหรียญคณาจารย์ยอดนิยม',
    author: 'สมาคมพระเครื่องไทย',
    description: 'รวบรวมประวัติและภาพเหรียญหายากมูลค่าสูงทั่วฟ้าเมืองไทย',
    cover: null,
    pages: 256,
  },
];

const CATEGORIES = ['All', 'Benjapakee', 'Powder', 'Metal Coin', 'Clay', 'Relic'];

const App = () => {
  const [lang, setLang] = useState('th');
  const t = TRANSLATIONS[lang];

  const [amulets, setAmulets] = useState(INITIAL_DATA);
  const [chronicles, setChronicles] = useState(INITIAL_CHRONICLES);
  const [ebooks, setEbooks] = useState(INITIAL_EBOOKS);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAmulet, setSelectedAmulet] = useState(null);
  const [selectedChronicle, setSelectedChronicle] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // API & State
  const [apiConfig, setApiConfig] = useState({ key: '' });
  const [isApiConnected, setIsApiConnected] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [adminMode, setAdminMode] = useState('amulets');

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: 'Benjapakee',
    era: '',
    material: '',
    price: '',
    status: 'Available',
    story: '',
    certId: '',
    images: [],
  });
  const [chronicleForm, setChronicleForm] = useState({
    id: null,
    title: '',
    excerpt: '',
    content: '',
    image: null,
  });
  const [ebookForm, setEbookForm] = useState({
    id: null,
    title: '',
    author: '',
    description: '',
    cover: null,
    pages: '',
  });

  // AI Loading States
  const [isGeneratingChronicle, setIsGeneratingChronicle] = useState(false);

  const fileInputRef = useRef(null);
  const chronicleImageRef = useRef(null);
  const ebookCoverRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => setLang((prev) => (prev === 'th' ? 'en' : 'th'));

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin666666') {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab('admin');
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('Invalid Celestial Key');
    }
  };

  const handleSaveApiConfig = (e) => {
    e.preventDefault();
    // Simulate connection check by checking if key exists
    if (apiConfig.key && apiConfig.key.length > 5) {
      setIsApiConnected(true);
      alert(
        lang === 'th'
          ? 'บันทึกการตั้งค่า API เรียบร้อยแล้ว ระบบกำลังเชื่อมต่อ...'
          : 'API Configuration Saved. System connecting...'
      );
    } else {
      setIsApiConnected(false);
      alert(
        lang === 'th'
          ? 'กรุณากรอก API Key ที่ถูกต้อง'
          : 'Please enter a valid API Key.'
      );
    }
  };

  // --- AI HANDLERS ---

  // 1. AI for Chronicle Drafting
  const handleAiDraftChronicle = async () => {
    if (!chronicleForm.title) {
      alert('Please enter a title first.');
      return;
    }
    setIsGeneratingChronicle(true);
    const systemPrompt =
      lang === 'th'
        ? 'คุณคือเซียนพระผู้รอบรู้ เขียนบทความเกี่ยวกับประวัติศาสตร์พระเครื่อง โดยใช้ภาษาที่สละสลวย ขลัง และน่าเลื่อมใส ความยาวประมาณ 3-4 ย่อหน้า'
        : 'You are a master of Thai sacred arts. Write a respectful and mystical history article about Thai Amulets.';

    const userPrompt = `Write a detailed chronicle about: "${chronicleForm.title}". Focus on history, beliefs, and spiritual power.`;

    const content = await callGemini(userPrompt, systemPrompt);
    setChronicleForm((prev) => ({ ...prev, content: content }));
    setIsGeneratingChronicle(false);
  };

  // Standard Handlers (Image, Submit, etc.)
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImageUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }));
    }
  };
  const handleChronicleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setChronicleForm((prev) => ({ ...prev, image: imageUrl }));
    }
  };
  const handleEbookCoverUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setEbookForm((prev) => ({ ...prev, cover: imageUrl }));
    }
  };
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gradients = [
      'bg-gradient-to-br from-emerald-500 to-teal-900',
      'bg-gradient-to-br from-slate-500 to-slate-900',
      'bg-gradient-to-br from-amber-200 to-yellow-500',
      'bg-gradient-to-br from-indigo-500 to-purple-900',
    ];
    const randomColor = gradients[Math.floor(Math.random() * gradients.length)];
    if (formData.id) {
      const updatedAmulets = amulets.map((item) =>
        item.id === formData.id ? { ...formData, color: item.color } : item
      );
      setAmulets(updatedAmulets);
    } else {
      const newId = Math.max(...amulets.map((a) => a.id), 0) + 1;
      const newItem = {
        ...formData,
        id: newId,
        color: randomColor,
        certId: formData.certId || `AX-2024-00${newId}`,
      };
      setAmulets([newItem, ...amulets]);
    }
    setActiveTab('gallery');
    resetForm();
  };
  const handleChronicleSubmit = (e) => {
    e.preventDefault();
    if (chronicleForm.id) {
      const updated = chronicles.map((c) =>
        c.id === chronicleForm.id ? { ...chronicleForm, date: c.date } : c
      );
      setChronicles(updated);
    } else {
      const newId = Math.max(...chronicles.map((c) => c.id), 0) + 1;
      const newChronicle = {
        ...chronicleForm,
        id: newId,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      setChronicles([newChronicle, ...chronicles]);
    }
    setActiveTab('chronicles');
    resetChronicleForm();
  };
  const handleEbookSubmit = (e) => {
    e.preventDefault();
    if (ebookForm.id) {
      const updated = ebooks.map((b) =>
        b.id === ebookForm.id ? ebookForm : b
      );
      setEbooks(updated);
    } else {
      const newId = Math.max(...ebooks.map((b) => b.id), 0) + 1;
      const newBook = { ...ebookForm, id: newId };
      setEbooks([newBook, ...ebooks]);
    }
    setActiveTab('library');
    resetEbookForm();
  };

  const handleEditClick = (amulet, e) => {
    e.stopPropagation();
    setFormData(amulet);
    setAdminMode('amulets');
    setActiveTab('admin');
  };
  const handleEditChronicle = (chronicle, e) => {
    e.stopPropagation();
    setChronicleForm(chronicle);
    setAdminMode('chronicles');
    setActiveTab('admin');
  };
  const handleEditEbook = (book, e) => {
    e.stopPropagation();
    setEbookForm(book);
    setAdminMode('ebooks');
    setActiveTab('admin');
  };
  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Confirm deletion?'))
      setAmulets(amulets.filter((a) => a.id !== id));
  };
  const handleDeleteChronicle = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Confirm deletion?'))
      setChronicles(chronicles.filter((c) => c.id !== id));
  };
  const handleDeleteEbook = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this book?'))
      setEbooks(ebooks.filter((b) => b.id !== id));
  };

  const resetForm = () =>
    setFormData({
      id: null,
      name: '',
      category: 'Benjapakee',
      era: '',
      material: '',
      price: '',
      status: 'Available',
      story: '',
      certId: '',
      images: [],
    });
  const resetChronicleForm = () =>
    setChronicleForm({ id: null, title: '', excerpt: '', content: '', image: null });
  const resetEbookForm = () =>
    setEbookForm({
      id: null,
      title: '',
      author: '',
      description: '',
      cover: null,
      pages: '',
    });

  const handleAuthSearch = (e) => {
    e.preventDefault();
    const found = amulets.find(
      (a) => a.certId === searchQuery || a.name.includes(searchQuery)
    );
    setSearchResult(found ? found : 'not_found');
  };
  const filteredAmulets =
    selectedCategory === 'All'
      ? amulets
      : amulets.filter((a) => a.category === selectedCategory);

  // --- UI COMPONENTS ---

  const Navbar = () => (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer text-2xl font-light tracking-[0.3em] text-amber-500 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="border border-amber-500/30 px-2 py-1 bg-amber-500/5">
            AMULETZ
          </span>
          <span className="font-bold">- X</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] tracking-[0.2em] uppercase font-medium items-center">
          {['home', 'gallery', 'chronicles', 'library', 'auth'].map((itemKey) => (
            <button
              key={itemKey}
              onClick={() =>
                setActiveTab(itemKey === 'auth' ? 'authentication' : itemKey)
              }
              className={`hover:text-amber-500 transition-all duration-300 relative group ${
                activeTab === (itemKey === 'auth' ? 'authentication' : itemKey)
                  ? 'text-amber-500'
                  : 'text-slate-400'
              }`}
            >
              {t.nav[itemKey]}
              <span
                className={`absolute -bottom-2 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full ${
                  activeTab === (itemKey === 'auth' ? 'authentication' : itemKey)
                    ? 'w-full'
                    : ''
                }`}
              ></span>
            </button>
          ))}
          {isAdminLoggedIn && (
            <button
              onClick={() => {
                resetForm();
                setActiveTab('admin');
              }}
              className={`hover:text-green-400 transition-all duration-300 ${
                activeTab === 'admin' ? 'text-green-400' : 'text-slate-400'
              }`}
            >
              {t.nav.creator}
            </button>
          )}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-slate-500 hover:text-amber-500 transition-colors border border-white/10 px-3 py-1 rounded-full"
          >
            <Globe className="w-3 h-3" /> <span>{lang.toUpperCase()}</span>
          </button>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-amber-500"
        >
          <Menu />
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-b border-white/10 py-4 px-6 md:hidden flex flex-col gap-4">
          {['home', 'gallery', 'chronicles', 'library', 'auth'].map((itemKey) => (
            <button
              key={itemKey}
              onClick={() => {
                setActiveTab(itemKey === 'auth' ? 'authentication' : itemKey);
                setIsMenuOpen(false);
              }}
              className="text-left text-sm uppercase tracking-widest text-slate-300 hover:text-amber-500 py-2"
            >
              {t.nav[itemKey]}
            </button>
          ))}
        </div>
      )}
    </nav>
  );

  const Modal = () => {
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [aiInsight, setAiInsight] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);

    // 2. AI Oracle Logic
    const handleConsultOracle = async () => {
      setLoadingAi(true);
      const systemPrompt =
        'You are a mystical oracle of Thai Buddhism. Interpret the spiritual energy and history of this amulet deeply and respectfully.';
      const userPrompt = `Analyze this amulet: Name: ${selectedAmulet.name}, Material: ${selectedAmulet.material}, Era: ${selectedAmulet.era}, Story: ${selectedAmulet.story}. Tell me about its powers (Buddhakun) and who should worship it. Answer in ${
        lang === 'th' ? 'Thai' : 'English'
      }.`;

      const insight = await callGemini(userPrompt, systemPrompt);
      setAiInsight(insight);
      setLoadingAi(false);
    };

    if (selectedAmulet) {
      useEffect(() => {
        setCurrentImageIdx(0);
        setAiInsight('');
      }, [selectedAmulet]);
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedAmulet(null)}
          ></div>
          <div className="relative bg-[#1a1a1a] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedAmulet(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:text-amber-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full md:w-3/5 bg-black relative min-h-[500px] flex flex-col">
              <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden group">
                {selectedAmulet.images && selectedAmulet.images.length > 0 ? (
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-500/10 blur-[80px]"></div>
                    <img
                      src={selectedAmulet.images[currentImageIdx]}
                      alt={selectedAmulet.name}
                      className="max-w-full max-h-[450px] object-contain drop-shadow-2xl transition-all duration-500"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className={`absolute inset-0 ${selectedAmulet.color} opacity-20 blur-3xl`}
                    ></div>
                    <div
                      className={`w-64 h-80 ${selectedAmulet.color} rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 transform`}
                    ></div>
                  </>
                )}
              </div>
              {selectedAmulet.images && selectedAmulet.images.length > 1 && (
                <div className="h-24 bg-[#0a0a0a] border-t border-white/10 flex items-center px-6 gap-3 overflow-x-auto no-scrollbar">
                  {selectedAmulet.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 transition-all ${
                        currentImageIdx === idx
                          ? 'ring-2 ring-amber-500 opacity-100'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-2/5 p-8 md:p-12 text-left bg-[#151515] flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 border border-amber-500/30 text-amber-500 text-[10px] tracking-widest uppercase rounded-full">
                  {selectedAmulet.certId}
                </span>
                <span className="text-slate-500 text-xs ml-auto flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {t.modal.verified}
                </span>
              </div>
              <h2 className="text-3xl font-light text-white mb-2 leading-tight">
                {selectedAmulet.name}
              </h2>
              <p className="text-amber-500 text-xl font-medium mb-8">
                {selectedAmulet.price}
              </p>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6 mb-10">
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                      {t.admin.story}
                    </h4>
                    <p className="text-slate-300 font-light leading-relaxed text-sm border-l-2 border-amber-500/20 pl-4">
                      {selectedAmulet.story}
                    </p>
                  </div>

                  {/* AI Insight Section */}
                  {aiInsight && (
                    <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                      <h4 className="text-xs text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Oracle's Insight
                      </h4>
                      <p className="text-slate-200 text-sm font-light leading-relaxed">
                        {aiInsight}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                        {t.admin.material}
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {selectedAmulet.material}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                        {t.admin.era}
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {selectedAmulet.era}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleConsultOracle}
                  disabled={loadingAi}
                  className="w-full border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 py-3 rounded-sm font-medium tracking-wide transition-all uppercase text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAi ? (
                    <>
                      <span className="animate-spin">✦</span>{' '}
                      {t.modal.ai_analyze}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> {t.modal.ai_oracle}
                    </>
                  )}
                </button>
                <button className="w-full bg-amber-600 hover:bg-amber-500 text-black py-4 rounded-sm font-medium tracking-wide transition-all uppercase text-sm shadow-[0_4px_20px_rgba(217,119,6,0.2)]">
                  {t.modal.contact}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (selectedChronicle) {
      /* ... Chronicle Modal ... */
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedChronicle(null)}
          ></div>
          <div className="relative bg-[#1a1a1a] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedChronicle(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:text-amber-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-64 relative overflow-hidden">
              {selectedChronicle.image ? (
                <img
                  src={selectedChronicle.image}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-neutral-800 to-neutral-900 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <span className="text-amber-500 text-xs tracking-widest uppercase mb-2 block">
                  {selectedChronicle.date}
                </span>
                <h2 className="text-3xl text-white font-light">
                  {selectedChronicle.title}
                </h2>
              </div>
            </div>
            <div className="p-8 md:p-12 text-slate-300 font-light leading-relaxed whitespace-pre-line">
              {selectedChronicle.content}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const AdminDashboard = () => (
    /* ... Same structure but adding AI button to Chronicle form ... */
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-light text-white mb-2">
            {t.admin.title}
          </h2>
          <p className="text-green-400 text-xs tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {t.admin.access_granted}
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdminLoggedIn(false);
            setActiveTab('home');
          }}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-2 border border-red-500/30 px-4 py-2 rounded-full hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> {t.admin.end_session}
        </button>
      </div>
      <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
        {['amulets', 'chronicles', 'ebooks', 'settings'].map((mode) => (
          <button
            key={mode}
            onClick={() => setAdminMode(mode)}
            className={`flex-1 min-w-[120px] py-4 text-center text-xs uppercase tracking-widest border rounded-lg transition-all ${
              adminMode === mode
                ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                : 'border-white/10 text-slate-500 hover:border-white/30'
            }`}
          >
            {mode === 'amulets'
              ? t.admin.manage_artifacts
              : mode === 'chronicles'
              ? t.admin.manage_chronicles
              : mode === 'ebooks'
              ? t.admin.manage_ebooks
              : t.admin.system_settings}
          </button>
        ))}
      </div>

      {adminMode === 'amulets' && (
        /* ... Amulet Form ... */ <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="md:col-span-1 space-y-4">
            <div
              onClick={() => fileInputRef.current.click()}
              className={`aspect-[3/4] border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group ${
                formData.id
                  ? 'border-amber-500/30'
                  : 'border-white/10 hover:border-amber-500/50'
              }`}
            >
              <Upload className="w-8 h-8 text-slate-500 mb-4 group-hover:text-amber-500" />
              <span className="text-xs text-slate-500 uppercase tracking-widest text-center px-4">
                {t.admin.upload_images}
                <br />
                {t.admin.select_multiple}
              </span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded overflow-hidden group"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.name}
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.category}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors appearance-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.price}
                  </label>
                  <input
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.status}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors appearance-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.era}
                  </label>
                  <input
                    required
                    value={formData.era}
                    onChange={(e) =>
                      setFormData({ ...formData, era: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.material}
                  </label>
                  <input
                    required
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {t.admin.story}
                </label>
                <textarea
                  required
                  value={formData.story}
                  onChange={(e) =>
                    setFormData({ ...formData, story: e.target.value })
                  }
                  rows="4"
                  className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm transition-colors resize-none"
                />
              </div>
              <div className="flex justify-end pt-6 gap-4">
                {formData.id && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-xs uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    {t.admin.cancel}
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-8 py-3 rounded-sm font-medium uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${
                    formData.id
                      ? 'bg-amber-600 hover:bg-amber-500 text-black'
                      : 'bg-green-600 hover:bg-green-500 text-black'
                  }`}
                >
                  {formData.id ? (
                    <>
                      <Save className="w-4 h-4" /> {t.admin.save_artifact}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> {t.admin.consecrate}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {adminMode === 'chronicles' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <form
            onSubmit={handleChronicleSubmit}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div
              onClick={() => chronicleImageRef.current.click()}
              className="w-full h-48 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-white/5 transition-all relative overflow-hidden group"
            >
              {chronicleForm.image ? (
                <>
                  <img
                    src={chronicleForm.image}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur">
                      {t.admin.c_change_cover}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-xs text-slate-500 uppercase tracking-widest">
                    {t.admin.c_upload_cover}
                  </span>
                </>
              )}
              <input
                type="file"
                ref={chronicleImageRef}
                className="hidden"
                accept="image/*"
                onChange={handleChronicleImageUpload}
              />
            </div>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {t.admin.c_title}
                </label>
                <input
                  required
                  value={chronicleForm.title}
                  onChange={(e) =>
                    setChronicleForm({ ...chronicleForm, title: e.target.value })
                  }
                  className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none rounded-lg text-lg font-light"
                />
              </div>
              <div className="group">
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {t.admin.c_excerpt}
                </label>
                <input
                  required
                  value={chronicleForm.excerpt}
                  onChange={(e) =>
                    setChronicleForm({
                      ...chronicleForm,
                      excerpt: e.target.value,
                    })
                  }
                  className="w-full bg-black border border-white/10 p-3 text-slate-300 focus:border-amber-500 outline-none rounded-lg"
                />
              </div>

              {/* AI Draft Button for Content */}
              <div className="group relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest">
                    {t.admin.c_content}
                  </label>
                  <button
                    type="button"
                    onClick={handleAiDraftChronicle}
                    disabled={isGeneratingChronicle}
                    className="text-[10px] uppercase tracking-widest text-amber-500 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingChronicle ? (
                      <span className="animate-pulse">Generating...</span>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" /> {t.admin.ai_draft}
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  required
                  value={chronicleForm.content}
                  onChange={(e) =>
                    setChronicleForm({
                      ...chronicleForm,
                      content: e.target.value,
                    })
                  }
                  rows="10"
                  className="w-full bg-black border border-white/10 p-4 text-slate-300 focus:border-amber-500 outline-none rounded-lg leading-relaxed resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 gap-4">
              {chronicleForm.id && (
                <button
                  type="button"
                  onClick={resetChronicleForm}
                  className="px-6 py-3 text-xs uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  {t.admin.cancel}
                </button>
              )}
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-black px-10 py-3 rounded-full font-medium uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.3)]"
              >
                <PenTool className="w-4 h-4" />{' '}
                {chronicleForm.id ? t.admin.c_update : t.admin.c_publish}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ... Settings Form (Only Key) ... */}
      {adminMode === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                <LinkIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl text-white font-light">
                  {t.admin.api_config_title}
                </h3>
                <p className="text-slate-500 text-xs">{t.admin.api_desc}</p>
              </div>
            </div>
            <form onSubmit={handleSaveApiConfig} className="space-y-6">
              <div className="group">
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  {t.admin.api_key_label}
                  <span
                    className="w-1.5 h-1.5 bg-red-500 rounded-full"
                    title="Required"
                  ></span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiConfig.key}
                    onChange={(e) =>
                      setApiConfig({ ...apiConfig, key: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-4 pl-12 text-white focus:border-amber-500 outline-none rounded-lg font-mono text-sm"
                    placeholder="sk_live_..."
                  />
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs">
                  <Wifi
                    className={`w-4 h-4 ${
                      isApiConnected ? 'text-green-500' : 'text-slate-500'
                    }`}
                  />
                  <span
                    className={isApiConnected ? 'text-green-500' : 'text-slate-500'}
                  >
                    {isApiConnected
                      ? t.admin.api_connected
                      : t.admin.api_disconnected}
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-white text-black px-8 py-3 rounded-full font-medium uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {t.admin.api_connect}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {adminMode === 'ebooks' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <form onSubmit={handleEbookSubmit} className="space-y-8 max-w-2xl mx-auto">
            <div
              onClick={() => ebookCoverRef.current.click()}
              className="w-48 h-72 mx-auto border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-white/5 transition-all relative overflow-hidden group shadow-xl"
            >
              {ebookForm.cover ? (
                <>
                  <img src={ebookForm.cover} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <span className="text-white text-[10px] uppercase tracking-widest px-2 py-1 border border-white rounded">
                      {t.admin.c_change_cover}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Book className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest text-center">
                    {t.admin.b_upload_cover}
                    <br />
                    {t.admin.b_portrait}
                  </span>
                </>
              )}
              <input
                type="file"
                ref={ebookCoverRef}
                className="hidden"
                accept="image/*"
                onChange={handleEbookCoverUpload}
              />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.b_title}
                  </label>
                  <input
                    required
                    value={ebookForm.title}
                    onChange={(e) =>
                      setEbookForm({ ...ebookForm, title: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-lg"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                    {t.admin.b_author}
                  </label>
                  <input
                    required
                    value={ebookForm.author}
                    onChange={(e) =>
                      setEbookForm({ ...ebookForm, author: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-lg"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {t.admin.b_pages}
                </label>
                <input
                  required
                  value={ebookForm.pages}
                  onChange={(e) =>
                    setEbookForm({ ...ebookForm, pages: e.target.value })
                  }
                  className="w-full bg-black border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-lg"
                />
              </div>
              <div className="group">
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {t.admin.b_desc}
                </label>
                <textarea
                  required
                  value={ebookForm.description}
                  onChange={(e) =>
                    setEbookForm({ ...ebookForm, description: e.target.value })
                  }
                  rows="5"
                  className="w-full bg-black border border-white/10 p-3 text-slate-300 focus:border-amber-500 outline-none rounded-lg resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 gap-4">
              {ebookForm.id && (
                <button
                  type="button"
                  onClick={resetEbookForm}
                  className="px-6 py-3 text-xs uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  {t.admin.cancel}
                </button>
              )}
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-black px-10 py-3 rounded-full font-medium uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.3)]"
              >
                <Book className="w-4 h-4" />{' '}
                {ebookForm.id ? t.admin.b_update : t.admin.b_publish}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  // ... (Other components: Authentication, LoginModal, Footer kept same) ...
  const Authentication = () => (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-light mb-4 text-white">
          {t.auth.title}
        </h2>
      </div>
      <form onSubmit={handleAuthSearch} className="relative mb-12 group">
        <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
        <input
          type="text"
          placeholder={t.auth.placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black border border-white/10 focus:border-amber-500 text-center py-6 px-8 rounded-full text-white placeholder-slate-600 outline-none transition-all relative z-10 text-lg"
        />
      </form>
      {searchResult && (
        <div className="animate-fade-in border border-white/10 bg-neutral-900/50 p-8 rounded-2xl backdrop-blur-md">
          {searchResult === 'not_found' ? (
            <div className="text-center text-red-400 flex flex-col items-center gap-2">
              <X className="w-8 h-8" />
              <span>{t.auth.not_found}</span>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 text-green-400 text-xs uppercase tracking-widest mb-2">
                  <CheckCircle className="w-4 h-4" /> {t.auth.verified}
                </div>
                <h3 className="text-xl text-white mb-1">
                  {searchResult.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {t.auth.cert_id}: {searchResult.certId}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 border-t border-white/5 pt-4">
                  <div>
                    <span className="block mb-1 text-slate-600">
                      {t.auth.material}
                    </span>
                    {searchResult.material}
                  </div>
                  <div>
                    <span className="block mb-1 text-slate-600">{t.auth.era}</span>
                    {searchResult.era}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  const LoginModal = () => {
    if (!showLoginModal) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        ></div>
        <div className="relative bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-sm text-center">
          <h3 className="text-xl text-white mb-6 font-light">Keeper Access</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-black border border-white/10 p-3 rounded text-white text-center outline-none focus:border-amber-500"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Passcode"
              className="w-full bg-black border border-white/10 p-3 rounded text-white text-center outline-none focus:border-amber-500"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded uppercase tracking-widest text-xs transition-all">
              Unlock System
            </button>
          </form>
        </div>
      </div>
    );
  };

  const Hero = ({ featuredAmulets }) => (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.08),transparent_60%)] animate-pulse"></div>
      <div className="text-center z-10 px-6 max-w-6xl mx-auto w-full">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] tracking-[0.2em] uppercase">
          <Star className="w-3 h-3" />
          {t.hero.tag}
        </div>
        <h1 className="text-4xl md:text-6xl font-thin tracking-tighter mb-4 leading-[0.9] text-white">
          A M U L E T Z <br />
          <span className="font-serif italic text-amber-500/90">- X</span>
        </h1>
        <p className="text-slate-400 font-light text-xs md:text-sm leading-relaxed max-w-lg mx-auto mb-10">
          {t.hero.subtitle}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {featuredAmulets.slice(0, 4).map((amulet) => (
            <div
              key={amulet.id}
              onClick={() => setSelectedAmulet(amulet)}
              className="group relative bg-white/5 border border-white/10 hover:border-amber-500/50 rounded-xl p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="aspect-[4/5] w-full rounded-lg mb-3 overflow-hidden relative bg-black/40">
                {amulet.images && amulet.images.length > 0 ? (
                  <img
                    src={amulet.images[0]}
                    alt={amulet.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${amulet.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                  ></div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white border border-white/30 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest">
                    {t.hero.view}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[9px] text-amber-500 tracking-widest uppercase mb-1">
                  {amulet.category}
                </div>
                <div className="text-sm text-white font-light truncate">
                  {amulet.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {amulet.price}
                </div>
              </div>
            </div>
          ))}
          {[...Array(Math.max(0, 4 - featuredAmulets.length))].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center aspect-[4/5] opacity-30 text-slate-500"
            >
              <span className="text-[9px] uppercase tracking-widest">
                {t.hero.slot}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
          <button
            onClick={() => setActiveTab('gallery')}
            className="group relative px-8 py-3 bg-amber-600 text-black font-medium rounded-full overflow-hidden transition-all hover:bg-amber-500 text-xs tracking-widest uppercase"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.hero.view_all}{' '}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none"></div>
    </div>
  );

  const Gallery = () => (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8 gap-6">
        <div>
          <h2 className="text-3xl font-light mb-2 text-white">
            {t.gallery.title}
          </h2>
          <p className="text-slate-500 text-sm font-light">
            {t.gallery.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-1 text-[10px] uppercase tracking-widest rounded-full transition-all border bg-amber-500 text-black border-amber-500 cursor-default shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            {t.gallery.collection_btn}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredAmulets.map((amulet) => (
          <div
            key={amulet.id}
            onClick={() => setSelectedAmulet(amulet)}
            className="group cursor-pointer relative"
          >
            {isAdminLoggedIn && (
              <div className="absolute top-2 left-2 z-30 flex gap-2">
                <button
                  onClick={(e) => handleEditClick(amulet, e)}
                  className="p-2 bg-green-500 text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(amulet.id, e)}
                  className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-6 border border-white/5 group-hover:border-amber-500/40 transition-all duration-500 bg-neutral-900">
              {amulet.images && amulet.images.length > 0 ? (
                <img
                  src={amulet.images[0]}
                  alt={amulet.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-4 rounded-sm opacity-60 group-hover:opacity-80 transition-opacity duration-700 ${amulet.color} blur-sm`}
                ></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px] z-10">
                <span className="text-white border border-white/30 px-6 py-2 rounded-full text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
                  {t.gallery.view_details}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-light text-slate-200 group-hover:text-amber-500 transition-colors mb-1 truncate">
                {amulet.name}
              </h3>
              <p className="text-sm text-amber-500/80 mt-2 font-medium">
                {amulet.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const Chronicles = () => (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
          {t.chronicles.title}
        </h2>
      </div>
      <div className="grid gap-12">
        {chronicles.map((article) => (
          <div
            key={article.id}
            className="group relative border border-white/10 bg-neutral-900/40 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500"
          >
            {isAdminLoggedIn && (
              <div className="absolute top-4 right-4 z-30 flex gap-2">
                <button
                  onClick={(e) => handleEditChronicle(article, e)}
                  className="p-2 bg-green-500 text-black rounded-full"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteChronicle(article.id, e)}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 aspect-video md:aspect-auto relative bg-black/50 overflow-hidden">
                {article.image ? (
                  <img src={article.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/10" />
                  </div>
                )}
              </div>
              <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-2xl font-light text-white mb-4 leading-tight">
                  {article.title}
                </h3>
                <button
                  onClick={() => setSelectedChronicle(article)}
                  className="self-start text-xs uppercase tracking-widest text-slate-300 hover:text-white border-b border-transparent hover:border-amber-500 transition-all pb-1"
                >
                  {t.chronicles.read_more}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const EBookLibrary = () => (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
          {t.library.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {ebooks.map((book) => (
          <div key={book.id} className="group relative">
            {isAdminLoggedIn && (
              <div className="absolute top-0 right-0 z-30 flex gap-2 p-2 translate-x-2 -translate-y-2">
                <button
                  onClick={(e) => handleEditEbook(book, e)}
                  className="p-2 bg-green-500 text-black rounded-full"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteEbook(book.id, e)}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="aspect-[2/3] bg-neutral-900 border border-white/10 rounded-r-lg rounded-l-sm relative shadow-xl overflow-hidden group-hover:-translate-y-2 transition-all">
              {book.cover ? (
                <img src={book.cover} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Book className="w-12 h-12 text-white/10 mb-4" />
                  <h3 className="text-amber-500 font-serif text-lg leading-tight mb-2">
                    {book.title}
                  </h3>
                </div>
              )}
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="border border-amber-500 text-amber-500 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest">
                  {t.library.read_now}
                </button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white text-sm font-medium truncate px-2">
                {book.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 font-sans selection:bg-amber-900/50">
      <Navbar />
      <main>
        {activeTab === 'home' && <Hero featuredAmulets={amulets} />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'chronicles' && <Chronicles />}
        {activeTab === 'library' && <EBookLibrary />}
        {activeTab === 'authentication' && <Authentication />}
        {activeTab === 'admin' && isAdminLoggedIn && <AdminDashboard />}
      </main>
      <Modal />
      <LoginModal />
      <footer className="py-20 px-6 border-t border-white/5 text-center relative">
        <div className="text-xl font-light tracking-[0.5em] text-amber-500/50 mb-8">
          AMULETZ-X
        </div>
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <a
            href="https://www.facebook.com/search/top?q=นครินทร์%20เอ็นเคอมูเล็ท"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase"
          >
            <Facebook className="w-4 h-4" /> นครินทร์ เอ็นเคอมูเล็ท
          </a>
          <a
            href="https://www.tiktok.com/@nkamuletz369"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-pink-500 transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 3.13-1.88 5.74-4.66 6.96-1.29.57-2.68.79-4.06.63-2.35-.28-4.41-1.62-5.75-3.66-2.61-3.95-1.13-9.45 3.19-11.45.69-.32 1.41-.53 2.15-.65V9.9c-.39.06-.77.17-1.13.34-1.62.77-2.36 2.72-1.74 4.38.6 1.62 2.45 2.5 4.08 2.03 1.49-.43 2.53-1.84 2.53-3.41v-13.2Z" />
            </svg>{' '}
            NK Amuletz 369
          </a>
          <a
            href="https://www.amuletz-x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-emerald-500 transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase"
          >
            <Globe className="w-4 h-4" /> www.amuletz-x.com
          </a>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-8">
          {t.footer.rights}
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="text-[9px] uppercase tracking-widest text-slate-800 hover:text-slate-600 transition-colors"
        >
          {isAdminLoggedIn ? t.footer.system_unlocked : t.footer.admin_access}
        </button>
      </footer>
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 mix-blend-screen">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white rounded-full blur-[2px] animate-pulse"></div>
        <div
          className="absolute top-[60%] right-[15%] w-3 h-3 bg-amber-500 rounded-full blur-[4px] animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>
    </div>
  );
};

export default App;
