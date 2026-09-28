import { ScrapeResult } from "./types";

export interface PresetSite {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
  badge: string;
  scrapeData: ScrapeResult;
  defaultCode: string;
}

export const PRESET_SITES: PresetSite[] = [
  {
    id: "linear",
    name: "Linear",
    category: "Developer Tool / SaaS",
    url: "https://linear.app",
    description: "Dark mode issue tracker with subtle neon gradients, keyboard shortcuts, and minimal glass cards.",
    badge: "Enterprise Dark",
    scrapeData: {
      success: true,
      url: "https://linear.app",
      title: "Linear — A better way to build products",
      description: "Linear is a purpose-built tool for planning and building products. Streamline issues, projects, and product roadmaps.",
      screenshotBase64: "",
      simplifiedDom: `<header><nav><a href="/">Linear</a><a href="/features">Features</a><a href="/docs">Docs</a><a href="/pricing">Pricing</a><button>Log in</button><button>Sign up</button></nav></header><main><section class="hero"><h1>Linear is a better way to build products</h1><p>Meet the new standard for modern software development. Streamline issues, sprints, and product roadmaps.</p><button>Start building</button></section></main>`,
      colors: [
        { hex: "#0b0c0e", usage: "Deep Background" },
        { hex: "#5e6ad2", usage: "Linear Purple / Accent" },
        { hex: "#1f2228", usage: "Card Surface" },
        { hex: "#94a3b8", usage: "Muted Text" },
      ],
      fonts: [
        { family: "Inter", type: "Display & Headings" },
        { family: "JetBrains Mono", type: "Monospace" },
      ],
      sections: [
        { tag: "nav", heading: "Navigation", summary: "Main navigation with product links and Sign In CTA" },
        { tag: "section", heading: "Hero Header", summary: "Hero headline with gradient glow and call to action" },
        { tag: "section", heading: "Feature Grid", summary: "Issue tracking, Cycles, and Roadmap modules" },
        { tag: "footer", heading: "Footer", summary: "Company links and documentation resources" },
      ],
    },
    defaultCode: `import React, { useState } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Layers, 
  Zap, 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  GitBranch, 
  Sparkles,
  Command
} from 'lucide-react';

export default function GeneratedWebsite() {
  const [activeTab, setActiveTab] = useState('issues');

  return (
    <div className="min-h-screen bg-[#08090a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090a]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <span>Linear</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#method" className="hover:text-white transition-colors">Method</a>
              <a href="#customers" className="hover:text-white transition-colors">Customers</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#changelog" className="hover:text-white transition-colors">Changelog</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-slate-400 hover:text-white px-3 py-1.5 transition-colors">
              Log in
            </button>
            <button className="text-sm bg-white text-black font-medium px-4 py-2 rounded-full hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-sm shadow-white/10">
              <span>Sign up</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Linear 2026 Release is now live</span>
            <ChevronRight className="w-3 h-3 text-indigo-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 mb-6 leading-[1.1]">
            Linear is a better way to build products
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Meet the new standard for modern software engineering. Streamline issues, projects, and roadmap execution with millisecond latency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all">
              <span>Start building for free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-sm flex items-center justify-center gap-2 transition-all">
              <Command className="w-4 h-4 text-slate-400" />
              <span>Explore keyboard shortcuts</span>
            </button>
          </div>
        </div>

        {/* Mock Interface Preview */}
        <div className="max-w-5xl mx-auto mt-16 rounded-xl border border-white/10 bg-[#0d0f12] shadow-2xl shadow-indigo-950/40 overflow-hidden">
          <div className="h-10 border-b border-white/10 bg-[#12151a] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-slate-400 font-mono">workspace / active-cycle</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">⌘K command bar</span>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-indigo-400">LIN-1402</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">In Progress</span>
              </div>
              <h4 className="text-sm font-medium text-slate-200 mb-1">Implement real-time collaboration canvas</h4>
              <p className="text-xs text-slate-500">Sync cursor states across web workers via WebSockets.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-indigo-400">LIN-1403</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Review</span>
              </div>
              <h4 className="text-sm font-medium text-slate-200 mb-1">Add zero-latency offline caching</h4>
              <p className="text-xs text-slate-500">Optimistic local mutation queue with IndexedDB.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-indigo-400">LIN-1404</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Done</span>
              </div>
              <h4 className="text-sm font-medium text-slate-200 mb-1">Multimodal vision prompt synthesis</h4>
              <p className="text-xs text-slate-500">Reconstruct frontends from pixel screenshots.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Engineered for velocity</h2>
            <p className="text-slate-400 text-sm">Every interaction is designed to keep you in flow state with sub-50ms feedback loops.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant responsiveness</h3>
              <p className="text-sm text-slate-400 leading-relaxed">No spinners. Real-time synchronizations happen quietly in the background.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automated git sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Link branch names and pull requests automatically to issues and release milestones.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise compliance</h3>
              <p className="text-sm text-slate-400 leading-relaxed">SOC-2 Type II certified, SAML SSO, granular role permissions, and audit logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">Linear Clone</span>
            <span>— Generated by AI Frontend Agent</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}`,
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Fintech / Payments",
    url: "https://stripe.com",
    description: "Iconic dual-angle gradient hero, clean corporate typography, and interactive payment tabs.",
    badge: "Fintech Gradient",
    scrapeData: {
      success: true,
      url: "https://stripe.com",
      title: "Stripe | Financial Infrastructure for the Internet",
      description: "Millions of businesses of all sizes use Stripe online and in person to accept payments, send payouts, and manage their businesses online.",
      screenshotBase64: "",
      simplifiedDom: `<header><nav><a href="/">Stripe</a><a href="/products">Products</a><a href="/solutions">Solutions</a><a href="/developers">Developers</a><a href="/pricing">Pricing</a><button>Sign in</button></nav></header><main><section class="hero"><h1>Financial infrastructure for the internet</h1><p>Millions of businesses use Stripe to accept payments and automate finance.</p><button>Start now</button><button>Contact sales</button></section></main>`,
      colors: [
        { hex: "#635bff", usage: "Stripe Violet" },
        { hex: "#00d4ff", usage: "Cyan Accent" },
        { hex: "#0a2540", usage: "Dark Slate Text" },
        { hex: "#f6f9fc", usage: "Off-white Background" },
      ],
      fonts: [
        { family: "Inter", type: "Fintech Sans" },
        { family: "SF Pro Display", type: "Display" },
      ],
      sections: [
        { tag: "nav", heading: "Header Navigation", summary: "Logo, products dropdown, and authentication CTAs" },
        { tag: "section", heading: "Dynamic Hero", summary: "Signature skewed vibrant multi-color gradient background" },
        { tag: "section", heading: "Payment Modules", summary: "Global scale cards and API code preview" },
        { tag: "footer", heading: "Footer", summary: "Regional compliance and solution links" },
      ],
    },
    defaultCode: `import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowRight, 
  Globe2, 
  Lock, 
  Check, 
  Code2, 
  ChevronRight,
  TrendingUp,
  Building2,
  DollarSign
} from 'lucide-react';

export default function GeneratedWebsite() {
  const [activeTab, setActiveTab] = useState('payments');

  return (
    <div className="min-h-screen bg-white text-[#0a2540] font-sans selection:bg-[#635bff] selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="#" className="text-2xl font-black tracking-tight text-[#0a2540] flex items-center gap-1.5">
              <span className="text-[#635bff]">stripe</span>
            </a>
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#425466]">
              <a href="#products" className="hover:text-[#0a2540] transition-colors">Products</a>
              <a href="#solutions" className="hover:text-[#0a2540] transition-colors">Solutions</a>
              <a href="#developers" className="hover:text-[#0a2540] transition-colors">Developers</a>
              <a href="#resources" className="hover:text-[#0a2540] transition-colors">Resources</a>
              <a href="#pricing" className="hover:text-[#0a2540] transition-colors">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#0a2540] hover:text-[#635bff] transition-colors">
              Sign in
            </button>
            <button className="text-sm bg-[#635bff] hover:bg-[#5346e0] text-white font-medium px-4 py-2 rounded-full transition-all shadow-md shadow-[#635bff]/25 flex items-center gap-1">
              <span>Start now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Vibrant Skewed Mesh Gradient */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Colorful Gradient Band */}
        <div 
          className="absolute -top-24 left-0 right-0 h-[520px] -skew-y-6 origin-top-left -z-10 opacity-90"
          style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 30%, #7028e4 70%, #00d4ff 100%)',
            filter: 'blur(70px)',
            opacity: 0.18
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635bff]/10 text-[#635bff] text-xs font-semibold mb-6">
              <span>Global Payments v4</span>
              <span className="w-1 h-1 rounded-full bg-[#635bff]" />
              <span>Available in 195+ Countries</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0a2540] leading-[1.08] mb-6">
              Financial infrastructure for the internet
            </h1>

            <p className="text-lg sm:text-xl text-[#425466] leading-relaxed mb-8 max-w-xl">
              Millions of businesses—from startups to Fortune 500s—use Stripe software and APIs to accept payments, send payouts, and manage online businesses.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#635bff] hover:bg-[#5346e0] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#635bff]/30 transition-all">
                <span>Start now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#f6f9fc] hover:bg-[#e6ebf1] text-[#0a2540] font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                <span>Contact sales</span>
              </button>
            </div>
          </div>

          {/* Interactive Card Widget Mock */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-2xl shadow-indigo-100 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Checkout Preview</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Live Sandbox
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Email address</label>
                  <input 
                    type="email" 
                    readOnly 
                    value="alex.turner@enterprise.com" 
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Card information</label>
                  <div className="flex items-center border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white shadow-sm">
                    <CreditCard className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm font-mono text-slate-800 tracking-wider">4242 •••• •••• 4242</span>
                    <span className="ml-auto text-xs text-slate-400 font-mono">12/28</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full py-3 rounded-lg bg-[#635bff] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#635bff]/25">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay $299.00 USD</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Guaranteed 99.999% Uptime</span>
                  <span>•</span>
                  <span>End-to-End Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="py-16 bg-[#f6f9fc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a2540] mb-1">250M+</div>
            <div className="text-xs sm:text-sm text-[#425466]">API requests processed daily</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a2540] mb-1">99.999%</div>
            <div className="text-xs sm:text-sm text-[#425466]">Historical system uptime</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a2540] mb-1">135+</div>
            <div className="text-xs sm:text-sm text-[#425466]">Currencies & payment methods</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a2540] mb-1">47+</div>
            <div className="text-xs sm:text-sm text-[#425466]">Countries with local acquiring</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-xs text-[#425466] border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Stripe Clone Frontend. Built with AI Vision Agent.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0a2540]">Privacy</a>
            <a href="#" className="hover:text-[#0a2540]">Terms</a>
            <a href="#" className="hover:text-[#0a2540]">Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}`,
  },
  {
    id: "bakery",
    name: "Artisan Bakery",
    category: "Culinary / E-Commerce",
    url: "https://levainbakery.com",
    description: "Warm, editorial bakery landing page with rich sourdough imagery, testimonials, and fresh pastry menu.",
    badge: "Editorial Warmth",
    scrapeData: {
      success: true,
      url: "https://levainbakery.com",
      title: "Maison Dorée — Artisan Sourdough & Viennoiserie",
      description: "Handcrafted, naturally leavened bread, flaky croissants, and specialty roasted espresso baked fresh daily.",
      screenshotBase64: "",
      simplifiedDom: `<header><nav><a href="/">Maison Dorée</a><a href="/menu">Daily Bake</a><a href="/story">Our Craft</a><a href="/locations">Café Locations</a><button>Order Pick-up</button></nav></header><main><section class="hero"><h1>Slow-fermented artisan sourdough baked at dawn</h1><p>Crafted with stone-milled heritage grains and natural spring water.</p><button>Order fresh today</button></section></main>`,
      colors: [
        { hex: "#b45309", usage: "Warm Amber Crust" },
        { hex: "#78350f", usage: "Dark Roast Brown" },
        { hex: "#fef3c7", usage: "Flour Cream" },
        { hex: "#fffbeb", usage: "Warm Linen Background" },
      ],
      fonts: [
        { family: "Playfair Display", type: "Serif Editorial" },
        { family: "Plus Jakarta Sans", type: "Body" },
      ],
      sections: [
        { tag: "nav", heading: "Boutique Navigation", summary: "Logo, menu categories, and morning reservation button" },
        { tag: "section", heading: "Artisan Hero", summary: "Large rustic typography with fresh golden loaf highlight" },
        { tag: "section", heading: "Daily Bake Menu", summary: "Card grid of sourdough, croissants, and pain au chocolat" },
        { tag: "footer", heading: "Bakery Footer", summary: "Opening hours, oven schedule, and address" },
      ],
    },
    defaultCode: `import React, { useState } from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  ArrowRight,
  Flame,
  Wheat
} from 'lucide-react';

export default function GeneratedWebsite() {
  const [cartCount, setCartCount] = useState(0);

  const menuItems = [
    {
      title: 'Wild Levain Sourdough',
      desc: '36-hour slow fermented country loaf with a caramelized crust and open crumb.',
      price: '$9.50',
      badge: 'Signature',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Isigny Ste Mère Croissant',
      desc: 'French Normandy butter rolled in 27 golden, flaky laminated layers.',
      price: '$5.25',
      badge: 'Daily Classic',
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Cardamom Morning Bun',
      desc: 'Croissant dough dusted in Ceylon cinnamon, crushed green cardamom, and cane sugar.',
      price: '$6.00',
      badge: 'Chef Favorite',
      img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c1810] font-sans selection:bg-[#b45309] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#2c1810] text-[#fef3c7] text-xs py-2 px-4 text-center font-medium tracking-wide">
        <span>Ovens fire at 4:30 AM • First warm sourdough loaves ready daily at 7:00 AM</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e7e1d8]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-[#2c1810]">
            <Wheat className="w-6 h-6 text-[#b45309]" />
            <span>Maison Dorée</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6e584f]">
            <a href="#menu" className="hover:text-[#b45309] transition-colors">Daily Bake</a>
            <a href="#craft" className="hover:text-[#b45309] transition-colors">Our Craft</a>
            <a href="#about" className="hover:text-[#b45309] transition-colors">Philosophy</a>
            <a href="#location" className="hover:text-[#b45309] transition-colors">Locations</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCartCount(c => c + 1)}
              className="relative p-2 rounded-full hover:bg-[#ece5dc] transition-colors text-[#2c1810]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#b45309] text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="bg-[#b45309] hover:bg-[#92400e] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-md shadow-[#b45309]/20">
              Order Online
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-xs font-semibold mb-6 border border-[#fde68a]">
              <Flame className="w-3.5 h-3.5" />
              <span>Baked Fresh Every Single Dawn</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#2c1810] leading-[1.15] mb-6">
              Naturally leavened bread, made with patience & stone-milled grains.
            </h1>

            <p className="text-[#6e584f] text-lg leading-relaxed mb-8">
              We slow-ferment each batch for 36 hours using heirloom wheat flours from regional organic mills, pure mountain water, and sea salt.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="#menu"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#2c1810] hover:bg-[#43261a] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2c1810]/20"
              >
                <span>Explore Today's Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2 text-xs text-[#6e584f]">
                <Clock className="w-4 h-4 text-[#b45309]" />
                <span>Mon-Sun: 7am — 3pm</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80" 
                alt="Golden Sourdough Loaf" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#b45309] font-bold text-lg">
                ★
              </div>
              <div>
                <p className="text-xs font-bold text-[#2c1810]">Named Best Bakery 2025</p>
                <p className="text-[11px] text-[#6e584f]">Over 1,200 verified 5-star morning reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section id="menu" className="py-20 px-6 bg-[#f4eee6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#b45309] block mb-2">From The Stone Hearth</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c1810] mb-4">Today's Morning Batch</h2>
            <p className="text-sm text-[#6e584f]">Limited quantities baked every morning. Pre-order recommended.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e7e1d8] hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#2c1810] backdrop-blur-sm">
                    {item.badge}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg font-bold text-[#2c1810]">{item.title}</h3>
                    <span className="font-bold text-[#b45309]">{item.price}</span>
                  </div>
                  <p className="text-xs text-[#6e584f] leading-relaxed mb-5">{item.desc}</p>
                  <button 
                    onClick={() => setCartCount(c => c + 1)}
                    className="w-full py-2.5 rounded-lg border border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#e7e1d8] text-xs text-[#6e584f]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Wheat className="w-4 h-4 text-[#b45309]" />
            <span className="font-serif font-bold text-[#2c1810]">Maison Dorée Bakery</span>
            <span>• 142 Mercer Street, New York, NY</span>
          </div>
          <div className="flex gap-6">
            <span>Instagram: @maisondoree</span>
            <span>Espresso Bar Open Daily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}`,
  },
];
