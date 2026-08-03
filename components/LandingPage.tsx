import React, { useState, useEffect, useRef } from 'react';
import {
  Video, Zap, ArrowRight, Play, Sparkles, Mic, Type,
  Music, Image, ChevronRight, Star, Globe, Layers,
  Film, Users, TrendingUp, Award, ChevronLeft,
  Gem, Home, Utensils, GraduationCap, Car, HeartPulse,
  ShoppingBag, Dumbbell, Gift, Clipboard, Smartphone,
  Sun, Moon, Monitor, Heart
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// ── Starfield background ───────────────────────────────────────────────────
const Starfield: React.FC = () => {
  const stars = useRef<{ x: number; y: number; size: number; delay: number }[]>([]);
  if (stars.current.length === 0) {
    for (let i = 0; i < 45; i++) {
      stars.current.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.6,
        delay: Math.random() * 5,
      });
    }
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.current.map((star, idx) => (
        <div
          key={idx}
          className="star-dot animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};

// ── Animated particle canvas background ─────────────────────────────────────
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.35 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections with theme colored lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(123, 187, 255, ${0.045 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles (alternating theme colors)
      particles.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? `rgba(184, 169, 255, ${p.opacity})` : `rgba(123, 187, 255, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
};

// ── Animated demo cards ───────────────────────────────────────────────────────
const JewelleryDemo: React.FC = () => (
  <div className="relative w-full h-full bg-gradient-to-br from-[#050F2A] via-[#081333] to-[#050F2A] overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute rounded-full border border-[#7BBBFF]/20"
          style={{
            width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
            animation: `ping ${2 + i * 0.4}s cubic-bezier(0, 0, 0.2, 1) infinite`,
            animationDelay: `${i * 0.3}s`, opacity: 0.25 - i * 0.03,
          }} />
      ))}
    </div>
    <div className="relative z-10 text-center">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF] flex items-center justify-center shadow-2xl shadow-indigo-500/20">
        <Gem className="w-8 h-8 text-white" />
      </div>
      <p className="text-[#7BBBFF] text-xs font-semibold tracking-widest uppercase">Luxury & Gold</p>
      <p className="text-white text-sm font-bold mt-1">Jewellery Reel</p>
    </div>
    {[...Array(12)].map((_, i) => (
      <div key={i} className="absolute w-1 h-1 rounded-full bg-[#7BBBFF]/60"
        style={{
          left: `${10 + (i * 7.5)}%`, top: `${20 + Math.sin(i) * 30}%`,
          animation: `float ${2 + (i % 3)}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
    ))}
  </div>
);

const WaveformDemo: React.FC = () => {
  const bars = [3, 6, 9, 12, 8, 14, 10, 7, 13, 9, 6, 11, 8, 5, 10, 7, 12, 9, 4, 11];
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#081333] via-[#050F2A] to-black overflow-hidden flex items-center justify-center">
      <div className="flex items-center gap-1">
        {bars.map((h, i) => (
          <div key={i} className="bg-[#7BBBFF] rounded-full"
            style={{
              width: '4px', height: `${h * 4}px`,
              animation: `pulse ${0.8 + (i % 4) * 0.2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.6 + (h / 20),
            }} />
        ))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-[#B8A9FF] text-xs font-semibold tracking-widest uppercase">AI Voiceover</p>
        <p className="text-white text-sm font-bold mt-0.5">Hindi · Female · Luxury</p>
      </div>
    </div>
  );
};

const CinematicDemo: React.FC = () => (
  <div className="relative w-full h-full bg-[#050F2A] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#B8A9FF]/10 to-black" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="absolute top-0 bottom-0 border-r border-[#7BBBFF]/5"
        style={{ left: `${25 * (i + 1)}%` }} />
    ))}
    <div className="absolute inset-0 flex flex-col justify-center px-6 z-10">
      <div className="space-y-1.5 mb-3">
        {['Scene 1: Opening Hook', 'Scene 2: Store Showcase', 'Scene 3: Products', 'Scene 4: CTA'].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#7BBBFF] animate-pulse' : 'bg-gray-700'}`} />
            <span className={`text-xs ${i === 1 ? 'text-white font-medium' : 'text-gray-500'}`}>{s}</span>
          </div>
        ))}
      </div>
      <p className="text-[#7BBBFF] text-[10px] font-semibold tracking-widest uppercase">Store Opening</p>
    </div>
  </div>
);

const NeonDemo: React.FC = () => (
  <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute"
          style={{
            left: `${i * 20}%`, top: 0, bottom: 0, width: '1px',
            background: `linear-gradient(to bottom, transparent, rgba(184,169,255,${0.1 + i * 0.05}), transparent)`,
          }} />
      ))}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute"
          style={{
            top: `${i * 25}%`, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(184,169,255,0.08), transparent)',
          }} />
      ))}
    </div>
    <div className="relative z-10 text-center">
      <div className="text-4xl font-black text-white mb-1" style={{ textShadow: '0 0 20px rgba(184,169,255,0.8), 0 0 40px rgba(184,169,255,0.4)' }}>
        SALE
      </div>
      <div className="text-[#B8A9FF] text-xs font-semibold tracking-widest">FLASH PROMO · 30% OFF</div>
      <div className="mt-2 px-3 py-1 border border-[#B8A9FF]/55 rounded text-[#7BBBFF] text-[10px] bg-black/40">Neon Cyberpunk</div>
    </div>
  </div>
);

const MinimalistDemo: React.FC = () => (
  <div className="relative w-full h-full bg-gradient-to-br from-[#081333] to-[#050F2A] overflow-hidden flex items-center justify-center">
    <div className="text-center">
      <div className="text-3xl font-extralight text-white/90 tracking-[0.3em] mb-2">PURE</div>
      <div className="w-8 h-[1px] bg-indigo-400 mx-auto mb-2" />
      <div className="text-[#7BBBFF] text-xs tracking-[0.2em] uppercase">Brand Awareness</div>
      <div className="mt-3 text-[10px] text-gray-500 tracking-widest">Clean Minimal</div>
    </div>
  </div>
);

const LifestyleDemo: React.FC = () => (
  <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#081333] via-[#050F2A] to-indigo-950">
    <div className="absolute inset-0 bg-black/20" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center z-10">
        <Sparkles className="w-10 h-10 text-white mx-auto mb-2 animate-pulse" />
        <div className="text-white font-black text-lg drop-shadow">SUMMER</div>
        <div className="text-white/80 text-xs tracking-widest">COLLECTION 2025</div>
        <div className="mt-2 text-[10px] text-[#7BBBFF]/80">Vibrant Lifestyle</div>
      </div>
    </div>
    {[...Array(8)].map((_, i) => (
      <div key={i} className="absolute rounded-full bg-white/5"
        style={{
          width: `${20 + i * 10}px`, height: `${20 + i * 10}px`,
          left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80}%`,
          animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
    ))}
  </div>
);

const DEMO_CARDS = [
  { title: 'Jewellery Reel', desc: 'Grand Opening · 30s · Hindi', component: JewelleryDemo },
  { title: 'AI Voiceover', desc: 'Female · Luxury · Auto-script', component: WaveformDemo },
  { title: 'Store Opening', desc: '4 Scenes · Cinematic · CTA', component: CinematicDemo },
  { title: 'Flash Sale', desc: 'Neon · Energetic · 15s', component: NeonDemo },
  { title: 'Brand Awareness', desc: 'Minimal · Apple-style · 60s', component: MinimalistDemo },
  { title: 'Summer Collection', desc: 'Vibrant · Fashion · Reel', component: LifestyleDemo },
];

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Layers,
    color: 'text-[#7BBBFF]',
    bg: 'bg-[#7BBBFF]/10',
    border: 'border-[#7BBBFF]/20',
    title: 'AI Storyboard',
    desc: 'Describe your campaign. AI generates a complete scene-by-scene storyboard automatically.',
  },
  {
    icon: Film,
    color: 'text-[#B8A9FF]',
    bg: 'bg-[#B8A9FF]/10',
    border: 'border-[#B8A9FF]/20',
    title: 'Veo Video Scenes',
    desc: 'Each scene is generated by Google Veo — cinematic, professional, commercial-grade.',
  },
  {
    icon: Mic,
    color: 'text-[#7BBBFF]',
    bg: 'bg-[#7BBBFF]/10',
    border: 'border-[#7BBBFF]/20',
    title: 'AI Voiceover (TTS)',
    desc: 'Male or female narration in English, Hindi, or Hinglish using Gemini TTS.',
  },
  {
    icon: Type,
    color: 'text-[#B8A9FF]',
    bg: 'bg-[#B8A9FF]/10',
    border: 'border-[#B8A9FF]/20',
    title: 'Auto Subtitles',
    desc: 'AI-written captions burned into video in 5 styles: Modern, Bold, Luxury, Minimal, TikTok.',
  },
  {
    icon: Music,
    color: 'text-[#7BBBFF]',
    bg: 'bg-[#7BBBFF]/10',
    border: 'border-[#7BBBFF]/20',
    title: 'Background Music',
    desc: 'Auto-matched music style based on your campaign type and mood.',
  },
  {
    icon: Image,
    color: 'text-[#B8A9FF]',
    bg: 'bg-[#B8A9FF]/10',
    border: 'border-[#B8A9FF]/20',
    title: 'Brand Assets',
    desc: 'Upload your logo and product images — used as watermarks and scene references.',
  },
];

// ── Use cases / templates ──────────────────────────────────────────────────────
const USE_CASES = [
  { icon: Gem, label: 'Jewellery & Fashion' },
  { icon: Home, label: 'Real Estate' },
  { icon: Utensils, label: 'Restaurant & Food' },
  { icon: GraduationCap, label: 'Education' },
  { icon: Car, label: 'Automobile' },
  { icon: HeartPulse, label: 'Healthcare' },
  { icon: ShoppingBag, label: 'E-Commerce' },
  { icon: Dumbbell, label: 'Fitness & Wellness' },
];

const PROJECT_CARDS = [
  {
    icon: Gem,
    title: 'Grand Opening Reel',
    desc: 'Luxury jewellery store opening in 30 seconds. Gold particles, Hindi voiceover, CTA.',
    tag: 'Jewellery · 30s',
    color: 'from-yellow-900/40 to-[#081333]/80',
    border: 'border-yellow-750/20',
    iconColor: 'text-yellow-400',
  },
  {
    icon: Home,
    title: 'Property Showcase',
    desc: 'Luxury apartment walkthrough with cinematic drone shots and professional narration.',
    tag: 'Real Estate · 60s',
    color: 'from-[#7BBBFF]/10 to-[#081333]/80',
    border: 'border-[#7BBBFF]/20',
    iconColor: 'text-[#7BBBFF]',
  },
  {
    icon: Gift,
    title: 'Festival Campaign',
    desc: 'Diwali sale promotion with vibrant colors, energetic music, and countdown CTA.',
    tag: 'Festival · 15s',
    color: 'from-[#B8A9FF]/10 to-[#081333]/80',
    border: 'border-[#B8A9FF]/20',
    iconColor: 'text-[#B8A9FF]',
  },
  {
    icon: Utensils,
    title: 'Restaurant Promo',
    desc: 'Mouth-watering food showcase with lifestyle shots and Book Now call-to-action.',
    tag: 'Restaurant · 30s',
    color: 'from-rose-900/20 to-[#081333]/80',
    border: 'border-rose-700/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: Smartphone,
    title: 'Product Launch',
    desc: 'Tech product launch with clean minimal style, 3D text and corporate voice.',
    tag: 'Technology · 45s',
    color: 'from-slate-800/40 to-[#081333]/80',
    border: 'border-slate-700/20',
    iconColor: 'text-slate-400',
  },
  {
    icon: GraduationCap,
    title: 'Course Promotion',
    desc: 'Online course ad with professional presenter, subtitles, and Learn More CTA.',
    tag: 'Education · 30s',
    color: 'from-[#7BBBFF]/10 to-[#081333]/80',
    border: 'border-[#7BBBFF]/25',
    iconColor: 'text-[#7BBBFF]',
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10+', label: 'Video Styles' },
  { value: '8', label: 'Campaign Types' },
  { value: '3', label: 'Languages' },
  { value: '60s', label: 'Max Duration' },
];

// ── Main Landing Page ─────────────────────────────────────────────────────────
export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Scroll depth tracking (throttled to a boolean to prevent unnecessary re-renders)
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Theme configuration on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Mouse coordinate tracking using high-performance CSS custom properties (avoids React re-renders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll visibility check for drawing the step connection line
  useEffect(() => {
    const handleScrollVisibility = () => {
      const el = howItWorksRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Trigger when the top of the container enters the bottom 85% of the viewport
      if (rect.top < window.innerHeight * 0.85) {
        setHowItWorksVisible(true);
        window.removeEventListener('scroll', handleScrollVisibility);
      }
    };

    // Check initial state
    handleScrollVisibility();

    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  // Scroll reveal trigger using IntersectionObserver (safe offscreen checking on mount)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-hidden');
            observer.unobserve(entry.target); // Trigger animation once
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const items = document.querySelectorAll('.reveal-item');
    items.forEach((item) => {
      // Check if item is already in the viewport
      const rect = item.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

      if (!isInViewport) {
        item.classList.add('reveal-hidden');
      }
      observer.observe(item);
    });

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (t === 'light') {
      root.classList.add('light');
    } else if (t === 'dark') {
      root.classList.remove('light');
    } else {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemIsDark) {
        root.classList.remove('light');
      } else {
        root.classList.add('light');
      }
    }
  };

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const scrollDemos = (dir: 'left' | 'right') => {
    if (demoRef.current) {
      demoRef.current.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
    }
  };

  const TABS = ['Featured', 'Jewellery & Fashion', 'Real Estate', 'Festival Campaigns', 'Restaurants'];

  return (
    <div className="min-h-screen bg-base-theme text-title-theme overflow-x-hidden relative transition-colors duration-500">

      {/* ── Noise texture overlay ── */}
      <div className="noise-overlay" />

      {/* ── Interactive Mouse Spotlight Glow ── */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 opacity-90"
        style={{
          background: 'radial-gradient(circle 500px at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--spotlight-color), transparent 80%)'
        }}
      />

      {/* Floating Aurora Accents are scoped to individual overflow-hidden sections below to prevent scroll bleeding */}

      {/* ── Floating Glass Capsule Navbar ──────────────────────────────────── */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-7xl rounded-2xl ${isScrolled
            ? 'top-2 sm:top-4 nav-bg-theme border border-theme-1 shadow-[0_12px_40px_-10px_rgba(5,15,42,0.25)] backdrop-blur-xl'
            : 'top-3 sm:top-6 bg-transparent border border-transparent'
          }`}
      >
        <div className="px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-tr from-[#7bbbff] to-[#b8a9ff] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-title-theme">
              CampaignOS
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-desc-theme">
            <a href="#features" className="hover:text-title-theme transition-colors duration-300">Features</a>
            <a href="#templates" className="hover:text-title-theme transition-colors duration-300">Templates</a>
            <a href="#how-it-works" className="hover:text-title-theme transition-colors duration-300">How it works</a>
            <a href="#pricing" className="hover:text-title-theme transition-colors duration-300">Pricing</a>
          </nav>

          {/* Theme switcher + CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-0.5 bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full p-0.5">
              <button
                onClick={() => updateTheme('light')}
                className={`p-1 sm:p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'}`}
                title="Light Mode"
              >
                <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => updateTheme('dark')}
                className={`p-1 sm:p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'}`}
                title="Dark Mode"
              >
                <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => updateTheme('system')}
                className={`hidden xs:inline-block p-1 sm:p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'}`}
                title="System Default"
              >
                <Monitor className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            <button
              onClick={onGetStarted}
              id="nav-get-started"
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black dark:bg-white text-white dark:text-black text-xs sm:text-sm font-semibold rounded-xl hover:bg-zinc-900 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-sm border border-transparent dark:border-white/10"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Get started</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-28 pb-16 overflow-hidden w-full max-w-full">
        {/* Ambient top-left aurora glow */}
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full aurora-glow-1 pointer-events-none z-0" />

        {/* Ambient starfield */}
        <Starfield />

        {/* Particle canvas */}
        <div className="absolute inset-0 z-0">
          <ParticleCanvas />
        </div>

        {/* Ambient central light glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[400px] rounded-full pointer-events-none z-0 overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, rgba(123,187,255,0.06) 0%, rgba(184,169,255,0.03) 55%, transparent 75%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full px-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-desc-theme text-xs sm:text-sm mb-6 sm:mb-8 backdrop-blur-sm"
            style={{ animation: 'fadeIn 0.6s ease' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0" />
            <span>Powered by Google Gemini + Veo AI</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] sm:leading-[0.95] mb-6 sm:mb-8 max-w-full break-words"
            style={{
              animation: 'fadeIn 0.8s ease 0.1s both',
              textShadow: '0 2px 20px rgba(123, 187, 255, 0.05)'
            }}>
            <span className="text-title-theme">Build Marketing Videos</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7BBBFF] via-[#9E97FF] to-[#B8A9FF]">
              with AI — in Minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-desc-theme max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ animation: 'fadeIn 0.8s ease 0.2s both' }}>
            Go from campaign idea to professional video. Storyboard, scenes, voiceover,
            subtitles, music — all generated automatically.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animation: 'fadeIn 0.8s ease 0.3s both' }}>
            <button
              onClick={onGetStarted}
              id="hero-get-started"
              className="group relative flex items-center gap-2.5 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-base font-bold rounded-2xl hover:bg-zinc-900 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-2xl shadow-indigo-500/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Zap className="w-5 h-5 fill-current" />
              Launch Studio Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="flex items-center gap-2 px-6 py-4 border border-theme-1 text-title-theme text-sm font-semibold rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all backdrop-blur-sm shadow-sm">
              <Play className="w-4 h-4 text-[#7BBBFF] fill-[#7BBBFF]/10" />
              Watch demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 mt-20"
            style={{ animation: 'fadeIn 0.8s ease 0.4s both' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center group cursor-default">
                <div className="text-3xl font-black text-title-theme tracking-tight group-hover:text-[#7BBBFF] transition-colors duration-300">{value}</div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-theme mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <div className="w-5 h-8 border border-black/20 dark:border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-[#7BBBFF] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Demo reel ──────────────────────────────────────────────────────── */}
      <section className="py-24 relative reveal-item overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-title-theme tracking-tight">
                Generate any video type
              </h2>
              <p className="text-desc-theme text-base mt-2">From luxury jewellery reels to real estate tours</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button onClick={() => scrollDemos('left')}
                className="w-11 h-11 rounded-full border border-theme-1 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90">
                <ChevronLeft className="w-5 h-5 text-desc-theme" />
              </button>
              <button onClick={() => scrollDemos('right')}
                className="w-11 h-11 rounded-full border border-theme-1 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90">
                <ChevronRight className="w-5 h-5 text-desc-theme" />
              </button>
            </div>
          </div>
        </div>

        <div ref={demoRef} className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-4 sm:px-8 max-w-7xl mx-auto scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
          {DEMO_CARDS.map(({ title, desc, component: DemoComp }, i) => (
            <div key={i} className="flex-shrink-0 w-72 sm:w-80 rounded-2xl overflow-hidden premium-glass-card group cursor-pointer">
              <div className="h-48 border-b border-theme-1/50">
                <DemoComp />
              </div>
              <div className="p-5">
                <p className="text-title-theme font-bold text-base transition-colors group-hover:text-[#7BBBFF]">{title}</p>
                <p className="text-desc-theme text-xs mt-1.5 font-medium">{desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-[#7BBBFF] text-xs font-semibold translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Play className="w-3.5 h-3.5 fill-[#7BBBFF]/10" />
                  Try this template
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 relative overflow-hidden reveal-item">
        {/* Middle aurora glow scoped here */}
        <div className="absolute top-[10%] right-[-15%] w-[60%] h-[60%] rounded-full aurora-glow-2 pointer-events-none z-0" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-title-theme tracking-tight mb-4">
              Everything included — nothing to install
            </h2>
            <p className="text-desc-theme text-lg max-w-xl mx-auto">
              One fluid, cloud-native platform handles your entire video production pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, bg, border, title, desc }) => (
              <div key={title}
                className="p-6 rounded-3xl premium-glass-card group cursor-default">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-title-theme font-bold text-lg mb-2 group-hover:text-[#7BBBFF] transition-colors duration-300">{title}</h3>
                <p className="text-desc-theme text-sm leading-relaxed">{desc}</p>
                <div className={`flex items-center gap-1.5 mt-5 ${color} text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0`}>
                  Start <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" ref={howItWorksRef} className="py-24 px-6 reveal-item">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-title-theme tracking-tight mb-4">
              5 steps. Zero editing skills.
            </h2>
            <p className="text-desc-theme text-base">Just describe your campaign idea and hit Generate</p>
          </div>

          {/* Defining SVG Gradients for Connectors */}
          <svg className="absolute w-0 h-0">
            <defs>
              <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7BBBFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#B8A9FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7BBBFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative">
            {/* Single continuous connecting line behind all step icons */}
            <div className="hidden md:block absolute top-7 left-0 right-0 h-1 pointer-events-none z-0">
              <svg className="w-full h-full overflow-visible" fill="none">
                {/* Background base dashed guide line */}
                <line
                  x1="10%" y1="2" x2="90%" y2="2"
                  stroke={theme === 'light' ? 'rgba(0, 122, 255, 0.08)' : 'rgba(123, 187, 255, 0.08)'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Sleek animating draw-in connector line */}
                <line
                  x1="10%" y1="2" x2="90%" y2="2"
                  stroke="url(#connectorGradient)"
                  strokeWidth="2.5"
                  style={{
                    strokeDasharray: 2000,
                    strokeDashoffset: howItWorksVisible ? 0 : 2000,
                    transition: 'stroke-dashoffset 2.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                    willChange: 'stroke-dashoffset'
                  }}
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
              {[
                { n: '01', label: 'Fill Campaign Brief', icon: Clipboard },
                { n: '02', label: 'AI Storyboard', icon: Layers },
                { n: '03', label: 'Veo Generates Scenes', icon: Video },
                { n: '04', label: 'Voiceover + Subtitles', icon: Mic },
                { n: '05', label: 'Download Final Video', icon: ArrowRight },
              ].map(({ n, label, icon: IconComponent }) => (
                <div
                  key={n}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-theme border border-theme-1 flex items-center justify-center mb-4 z-10 shadow-lg group-hover:border-[#7BBBFF] group-hover:shadow-[#7BBBFF]/5 transition-all duration-500">
                    <IconComponent className="w-6 h-6 text-[#7BBBFF] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-[10px] text-muted-theme font-mono tracking-widest font-semibold mb-1">{n}</div>
                  <p className="text-xs text-desc-theme font-semibold leading-tight max-w-[120px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Templates / Projects ───────────────────────────────────────────── */}
      <section id="templates" className="py-24 px-6 reveal-item">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-title-theme tracking-tight mb-4">
              Templates ready to generate
            </h2>
            <p className="text-desc-theme text-base">Pick a pre-configured layout and start editing immediately</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 mb-10 justify-center flex-wrap">
            {TABS.map((tab, i) => (
              <button key={tab}
                onClick={() => setActiveTab(i)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === i
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-indigo-500/5'
                    : 'bg-surface-theme border border-theme-1 text-desc-theme hover:border-gray-400 dark:hover:border-gray-700'
                  }`}>
                {i === 0 && <Star className="w-3.5 h-3.5 fill-current" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Project cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECT_CARDS.map(({ icon: IconComponent, title, desc, tag, color, border, iconColor }) => (
              <div key={title}
                className={`group relative rounded-3xl border ${border} bg-gradient-to-br ${color} p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.008] hover:shadow-[0_20px_40px_rgba(184,169,255,0.06)] keep-dark`}>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500" />
                <div className="relative z-10">
                  <div className="mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:translate-x-1">
                    <IconComponent className={`w-9 h-9 ${iconColor}`} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed mb-5">{desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2.5 py-1 bg-black/40 rounded-full text-gray-300 border border-white/10 font-medium">{tag}</span>
                    <div className="flex items-center gap-1 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
                      Use template <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-surface-theme border border-theme-1 hover:border-gray-400 dark:hover:border-gray-600 text-title-theme text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              Explore all templates
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Industries ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-theme-1 reveal-item">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-theme mb-10">Works for every industry verticals</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            {USE_CASES.map(({ icon: IconComponent, label }) => (
              <div key={label}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-card-theme border border-theme-2 rounded-2xl text-sm font-semibold text-desc-theme hover:border-gray-400 dark:hover:border-gray-700 hover:text-title-theme transition-all duration-300 cursor-default shadow-sm hover:scale-[1.03]">
                <IconComponent className="w-5 h-5 text-[#7BBBFF]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 reveal-item">
        <div className="relative max-w-4xl mx-auto rounded-3xl p-12 md:p-16 overflow-hidden border border-theme-1 bg-surface-theme/50 backdrop-blur-xl shadow-2xl text-center">
          {/* Internal glowing decorations */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#7BBBFF]/10 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#B8A9FF]/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7BBBFF]/10 border border-[#7BBBFF]/20 rounded-full text-[#7BBBFF] text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              No video editing skills required
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-title-theme mb-6 leading-tight tracking-tight">
              Start exploring and building<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7BBBFF] via-[#9E97FF] to-[#B8A9FF]">
                with Gemini + Veo.
              </span>
            </h2>

            <p className="text-desc-theme text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Describe your marketing idea and AI creates a complete ready-to-post professional video.
            </p>

            <button
              onClick={onGetStarted}
              id="cta-get-started"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-base font-bold rounded-2xl hover:bg-zinc-900 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-2xl shadow-indigo-500/10"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              Get started free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-theme-1 py-12 sm:py-20 px-4 sm:px-6 reveal-item relative overflow-hidden w-full max-w-full">
        {/* Bottom aurora glow scoped to footer limits */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full aurora-glow-1 pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-12 mb-12 sm:mb-20">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-desc-theme mb-6 leading-relaxed">
                Start exploring and building professional marketing videos with AI.
              </p>
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 border border-theme-1 text-title-theme text-sm font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm"
              >
                Launch Studio →
              </button>
            </div>

            {[
              {
                title: 'Models',
                links: ['Gemini 2.5 Flash', 'Veo 3.1', 'TTS', 'Gemini Vision'],
              },
              {
                title: 'Product',
                links: ['Campaign Builder', 'Voice Settings', 'Brand Assets', 'Templates'],
              },
              {
                title: 'Capabilities',
                links: ['Storyboard AI', 'Scene Generation', 'Auto Subtitles', 'Music Sync'],
              },
              {
                title: 'Info',
                links: ['Documentation', 'API Billing', 'Privacy', 'Terms'],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-title-theme font-bold text-sm mb-4 tracking-tight">{title}</p>
                <ul className="space-y-3">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-desc-theme text-sm hover:text-[#7BBBFF] transition-colors duration-300 font-medium">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Big branding at bottom */}
          <div className="relative overflow-hidden rounded-3xl py-8 sm:py-14 px-4 sm:px-8 border border-theme-1 bg-gradient-to-b from-surface-theme/40 to-card-theme/30 backdrop-blur-2xl shadow-inner">
            {/* Background decorative glow */}
            <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-tr from-[#7bbbff]/10 to-[#b8a9ff]/5 blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-3 relative z-10">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#7bbbff] to-[#b8a9ff] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
                <Video className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="text-3xl sm:text-5xl md:text-7xl font-black text-title-theme tracking-tighter opacity-95">
                CampaignOS
              </span>
            </div>
            <p className="text-desc-theme text-xs sm:text-sm ml-1 flex items-center gap-1.5 relative z-10 font-semibold">
              Powered by Google Gemini + Veo · Made by Jatin
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
