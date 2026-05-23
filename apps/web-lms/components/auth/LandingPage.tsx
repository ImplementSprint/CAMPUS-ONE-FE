'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  FileText,
  Globe2,
  GraduationCap,
  Grid2X2,
  Home,
  Lock,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  PieChart,
  Puzzle,
  School,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { loginWithSupabase } from '@/lib/auth.service';

type AuthTab = 'login' | 'signup';
type RegistrationErrors = Partial<Record<'name' | 'representative' | 'email' | 'contactNumber' | 'schoolType' | 'targetSubdomain', string>>;

const SCHOOL_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESERVED_SCHOOL_SLUGS = new Set(['api', 'app', 'www', 'admin', 'status', 'portal', 'campus', 'localhost']);

const navItems = [
  { label: 'Product', target: 'product', hasMenu: true },
  { label: 'Schools', target: 'schools' },
  { label: 'Developers', target: 'workflow' },
  { label: 'Resources', target: 'proof', hasMenu: true },
];

const featureCards = [
  {
    title: 'Multi-tenant LMS',
    description: 'Run unlimited school instances under one platform.',
    icon: Users,
    accent: 'from-[#ff7920] to-[#ff4f00]',
  },
  {
    title: 'SIS',
    description: 'Manage students, staff, classes, and records with ease.',
    icon: UserRound,
    accent: 'from-[#33b67a] to-[#16985f]',
  },
  {
    title: 'Enrollment',
    description: 'Streamline admissions and enrollment from inquiry to onboarding.',
    icon: FileText,
    accent: 'from-[#2d8cff] to-[#0f65d8]',
  },
  {
    title: 'Analytics',
    description: 'Data-driven insights to improve outcomes across your campuses.',
    icon: BarChart3,
    accent: 'from-[#1bb3b0] to-[#0f8b98]',
  },
  {
    title: 'Communications',
    description: 'Keep your community informed with targeted, timely messages.',
    icon: MessageCircle,
    accent: 'from-[#7256d9] to-[#5a3bc4]',
  },
];

const proofCards = [
  {
    title: 'Secure by design',
    description: 'Your data is protected with enterprise-grade security, privacy controls, and compliance built in from day one.',
    icon: ShieldCheck,
    bullets: ['SOC 2 Type II', 'Role-based access', 'Data encryption'],
    tint: 'green',
  },
  {
    title: 'Reliable operations',
    description: 'Enjoy high availability and continuous monitoring so your learning never stops, anytime, anywhere.',
    icon: Bell,
    bullets: ['99.9% uptime', 'Automated backups', '24/7 monitoring'],
    tint: 'blue',
  },
  {
    title: 'Ready for scale',
    description: 'Manage a single campus or thousands. Campus One grows with your network without complexity.',
    icon: TrendingUp,
    bullets: ['Multi-campus oversight', 'Centralized analytics', 'Scalable infrastructure'],
    tint: 'green',
  },
];

const roleCards = [
  {
    title: 'School Owners',
    description: 'Oversee growth, performance, and compliance.',
    icon: School,
    color: 'text-[#1f7ae0] bg-[#edf5ff]',
    bullets: ['Manage campus instances', 'Track school performance', 'View financial overview', 'Ensure compliance'],
  },
  {
    title: 'Administrators',
    description: 'Run daily operations and keep everything connected.',
    icon: UserRound,
    color: 'text-[#15945d] bg-[#edf9f3]',
    bullets: ['Manage students & staff', 'Configure courses & classes', 'Monitor attendance', 'Generate reports'],
  },
  {
    title: 'Teachers',
    description: 'Create engaging learning experiences and track progress.',
    icon: BookOpen,
    color: 'text-[#ff5b00] bg-[#fff2e9]',
    bullets: ['Build & manage courses', 'Share content & assignments', 'Grade & provide feedback', 'Communicate with classes'],
  },
  {
    title: 'Students & Parents',
    description: 'Stay informed, engaged, and in the loop.',
    icon: Users,
    color: 'text-[#7447c6] bg-[#f5efff]',
    bullets: ['View schedules & grades', 'Submit assignments', 'See attendance & announcements', 'Communicate with teachers'],
  },
];

const footerLinks = {
  Product: ['LMS', 'SIS', 'Enrollment', 'Analytics', 'Communications', 'Mobile App'],
  Platform: ['Multi-tenant', 'Security', 'Integrations', 'API', 'Uptime', 'Compliance'],
  Resources: ['Docs', 'Help Center', 'Guides', 'Webinars', 'Release Notes', 'Status'],
  Company: ['About', 'Customers', 'Partners', 'Careers', 'Contact'],
};

function CampusOneMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <span className={`relative inline-flex ${className} overflow-hidden rounded-[8px]`} aria-hidden="true">
      <Image
        src="/brand/tigo-app-icon.png"
        alt=""
        fill
        sizes="44px"
        className="object-cover"
        priority
      />
    </span>
  );
}

function CampusOneWordmark({ className = 'text-[27px]' }: { className?: string }) {
  return (
    <span
      className={`${className} font-black text-[#071943]`}
      style={{ fontFamily: '"Arial Rounded MT Bold", "Nunito", "Baloo 2", system-ui, sans-serif', letterSpacing: '0' }}
    >
      CampusOne
    </span>
  );
}

function FeatureIcon({ icon: Icon, accent }: { icon: typeof Users; accent: string }) {
  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br ${accent} text-white shadow-[0_10px_20px_rgba(17,30,64,0.12)]`}>
      <Icon className="h-6 w-6" />
    </span>
  );
}

function StatusPill({ children, color = 'green' }: { children: React.ReactNode; color?: 'green' | 'orange' }) {
  return (
    <span className={`rounded-[6px] px-2 py-1 text-[11px] font-bold ${color === 'green' ? 'bg-[#eaf8ef] text-[#16804d]' : 'bg-[#fff1df] text-[#c75700]'}`}>
      {children}
    </span>
  );
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [targetSubdomain, setTargetSubdomain] = useState('');
  const [registrationErrors, setRegistrationErrors] = useState<RegistrationErrors>({});
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const openAuth = (tab: AuthTab) => {
    setMobileMenuOpen(false);

    if (tab === 'login') {
      window.location.href = '/login';
      return;
    }

    setAuthTab('signup');
    setAuthModalOpen(true);
  };

  const validateRegistration = () => {
    const errors: RegistrationErrors = {};
    const slug = targetSubdomain.trim().toLowerCase();
    const contactDigits = contactNumber.replace(/\D/g, '');

    if (schoolName.trim().length < 2) errors.name = 'Enter the institution name.';
    if (fullName.trim().length < 2) errors.representative = 'Enter the representative name.';
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid official email address.';
    if (contactDigits.length < 7 || contactDigits.length > 15) errors.contactNumber = 'Enter a valid contact number.';
    if (!schoolType.trim()) errors.schoolType = 'Select a school type.';
    if (!SCHOOL_SLUG_PATTERN.test(slug)) {
      errors.targetSubdomain = 'Use 3-63 lowercase letters, numbers, or hyphens. Start and end with a letter or number.';
    } else if (RESERVED_SCHOOL_SLUGS.has(slug)) {
      errors.targetSubdomain = 'That subdomain is reserved. Choose another school slug.';
    }

    setRegistrationErrors(errors);
    return { isValid: Object.keys(errors).length === 0, slug };
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setRegistrationMessage('');
    setAuthSuccess(false);
    setAuthLoading(true);

    try {
      if (authTab === 'login') {
        const result = await loginWithSupabase(email, password);
        if (result.success && result.user) {
          setAuthSuccess(true);
          window.setTimeout(() => {
            window.location.href = '/dashboard';
          }, 900);
        } else {
          setAuthError(result.error ?? 'Invalid credentials.');
        }
      } else {
        const { isValid, slug } = validateRegistration();
        if (!isValid) return;

        const availabilityResponse = await fetch(`/api/school/slug-availability?slug=${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });
        const availability = await availabilityResponse.json();
        if (availabilityResponse.ok && availability.available === false) {
          setRegistrationErrors((errors) => ({
            ...errors,
            targetSubdomain:
              availability.reason === 'existing'
                ? 'That subdomain is already registered.'
                : availability.reason === 'reserved'
                  ? 'That subdomain is reserved. Choose another school slug.'
                  : 'Use a valid school subdomain.',
          }));
          return;
        }

        const response = await fetch('/api/school/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: schoolName.trim(),
            representative: fullName.trim(),
            email: email.trim(),
            contactNumber: contactNumber.trim(),
            schoolType: schoolType.trim(),
            targetSubdomain: slug,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          setAuthSuccess(true);
          setRegistrationMessage(data.message ?? 'School registration submitted for review.');
          window.setTimeout(() => {
            window.location.href = `/school/submitted?school=${encodeURIComponent(slug)}`;
          }, 900);
        } else {
          setAuthError(data.message ?? 'School registration failed. Please try again.');
        }
      }
    } catch {
      setAuthError('Connection failed. Please check that the server is running.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#06163c] selection:bg-[#ffcfb3] selection:text-[#06163c]">
      <header className="sticky top-0 z-50 border-b border-[#e8edf4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[102px] max-w-[1440px] items-center justify-between px-6 lg:px-11">
          <button type="button" onClick={() => scrollTo('hero')} className="flex items-center gap-3 text-left" aria-label="CampusOne home">
            <CampusOneMark className="h-11 w-11" />
            <CampusOneWordmark />
          </button>

          <nav className="hidden items-center gap-11 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollTo(item.target)}
                className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#071333] transition hover:text-[#ff5b00]"
              >
                {item.label}
                {item.hasMenu && <ChevronDown className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="h-12 rounded-[8px] border border-[#dbe2ec] bg-white px-7 text-[16px] font-bold text-[#071333] shadow-[0_4px_14px_rgba(17,30,64,0.04)] transition hover:border-[#c8d2e0] hover:bg-[#f8fafc] hover:text-[#ff5b00]"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => openAuth('signup')}
              className="h-12 rounded-[8px] bg-[#ff5b00] px-7 text-[16px] font-bold text-white shadow-[0_12px_24px_rgba(255,91,0,0.18)] transition hover:bg-[#e94f00]"
            >
              Sign up now
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#dbe2ec] bg-white text-[#071333] lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#e8edf4] bg-white px-6 py-5 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => scrollTo(item.target)}
                  className="rounded-[8px] px-3 py-3 text-left text-[15px] font-semibold text-[#071333] hover:bg-[#f6f8fb]"
                >
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={() => openAuth('login')} className="mt-3 rounded-[8px] border border-[#dbe2ec] py-3 text-sm font-bold">
                Login
              </button>
              <button type="button" onClick={() => openAuth('signup')} className="rounded-[8px] bg-[#ff5b00] py-3 text-sm font-bold text-white">
                Sign up now
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="hero" className="relative border-b border-[#e8edf4] bg-white">
          <div className="pointer-events-none absolute right-[7%] top-[96px] h-44 w-44 opacity-40 [background-image:radial-gradient(#ff9b66_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="mx-auto grid min-h-[760px] max-w-[1440px] gap-10 px-6 pb-16 pt-16 lg:grid-cols-[0.95fr_1.1fr] lg:px-12 lg:pb-20 lg:pt-[66px]">
            <div className="relative z-10 flex flex-col justify-center">
              <div className="mb-9 flex w-fit items-center gap-2 rounded-[999px] border border-[#ffd7bf] bg-[#fff8f4] px-4 py-2 text-[14px] font-bold text-[#ff5b00]">
                <Sparkles className="h-4 w-4 fill-[#ff5b00]" />
                The platform schools trust
              </div>

              <h1 className="max-w-[620px] text-[46px] font-black leading-[1.09] tracking-[-0.035em] text-[#06163c] sm:text-[62px] lg:text-[70px]">
                Build, brand, and manage every <span className="text-[#ff5b00]">learning portal.</span>
              </h1>

              <p className="mt-8 max-w-[590px] text-[18px] leading-[1.65] text-[#435176]">
                Campus One gives each institution its own LMS, student records, communication tools, and admin controls under one managed platform.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="inline-flex h-14 items-center justify-center gap-4 rounded-[8px] bg-[#ff5b00] px-9 text-[16px] font-bold text-white shadow-[0_16px_28px_rgba(255,91,0,0.18)] transition hover:bg-[#e94f00]"
                >
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('workflow')}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-[8px] border border-[#dbe2ec] bg-white px-7 text-[16px] font-bold text-[#142247] shadow-[0_4px_14px_rgba(17,30,64,0.04)] transition hover:border-[#c8d2e0] hover:bg-[#f8fafc]"
                >
                  <CirclePlay className="h-6 w-6" />
                  Watch overview
                </button>
              </div>

              <div className="mt-12 grid max-w-[640px] gap-5 sm:grid-cols-3">
                {[
                  [ShieldCheck, 'Enterprise security', 'SSO, roles, permissions, and audit logs.'],
                  [Globe2, 'Always reliable', '99.9% uptime SLA and global infrastructure.'],
                  [Users, 'Built for education', 'Tools that teachers, students, and admins love.'],
                ].map(([Icon, title, description]) => (
                  <div key={String(title)} className="border-r border-[#dfe5ee] pr-5 last:border-r-0">
                    <Icon className="mb-3 h-6 w-6 text-[#06163c]" />
                    <p className="text-[13px] font-bold text-[#071333]">{String(title)}</p>
                    <p className="mt-1 text-[12px] leading-5 text-[#52607e]">{String(description)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[650px] lg:min-h-0">
              <div className="absolute left-[30%] top-0 z-50 flex h-[62px] min-w-[312px] items-center gap-4 rounded-[999px] border border-[#dfe5ee] bg-white px-7 text-[20px] font-semibold text-[#142247] shadow-[0_10px_24px_rgba(17,30,64,0.10)]">
                <Globe2 className="h-6 w-6" />
                portal.campusone.app
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#1faf5c] text-white">
                  <Check className="h-4 w-4" />
                </span>
              </div>

              <div
                className="absolute left-[1%] top-[150px] z-30 w-[39%] min-w-[292px] overflow-hidden rounded-[14px] border border-[#dce3ec] bg-white shadow-[0_18px_34px_rgba(17,30,64,0.12)]"
                style={{ transform: 'perspective(1200px) rotateY(-7deg) rotateZ(-0.6deg)', transformOrigin: 'right center' }}
              >
                <div className="grid min-h-[460px] grid-cols-[58px_1fr]">
                  <div className="flex flex-col items-center gap-8 border-r border-[#edf1f6] bg-[#fbfcfe] py-8 text-[#0b1b45]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-[#ff5b00] text-white">
                      <Globe2 className="h-5 w-5" />
                    </span>
                    {[Grid2X2, PieChart, Building2, FileText, Users].map((Icon) => (
                      <Icon key={Icon.displayName} className="h-5 w-5 text-[#435176]" />
                    ))}
                  </div>
                  <div className="p-7">
                    <h2 className="text-[21px] font-extrabold text-[#071943]">Portal Builder</h2>
                    <p className="mt-1 text-[12px] text-[#52607e]">Create your branded learning portal</p>
                    <div className="mt-7">
                      <p className="mb-2 text-[12px] font-bold text-[#071943]">Your Subdomain</p>
                      <div className="flex h-11 items-center rounded-[8px] border border-[#dfe5ee] px-3 text-[12px] text-[#142247]">
                        greenfield.portal.campusone.app
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#1faf5c] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="mb-3 text-[12px] font-bold text-[#071943]">Branding</p>
                      <div className="flex gap-4 rounded-[8px] border border-[#dfe5ee] p-4">
                        {['#ff5b00', '#11b4a8', '#116de8', '#071943', '#20a957'].map((color) => (
                          <span key={color} className="h-7 w-7 rounded-[5px]" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 rounded-[8px] border border-[#dfe5ee] p-4">
                      <p className="mb-3 text-[11px] font-bold text-[#52607e]">Logo</p>
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#e8f6ee] text-[#15774b]">
                          <School className="h-7 w-7" />
                        </span>
                        <div>
                          <p className="text-[18px] font-extrabold tracking-[0.02em] text-[#13713f]">GREENFIELD</p>
                          <p className="text-[11px] font-bold tracking-[0.35em] text-[#13713f]">ACADEMY</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="mb-3 text-[12px] font-bold text-[#071943]">Theme Preview</p>
                      <div className="h-20 overflow-hidden rounded-[8px] border border-[#dfe5ee] bg-[#eef9f2]">
                        <div className="flex h-8 items-center gap-2 border-b border-[#dfe5ee] bg-white px-3 text-[8px] font-bold text-[#071943]">
                          <School className="h-4 w-4 text-[#13713f]" />
                          GREENFIELD ACADEMY
                          <span className="ml-auto">Home</span>
                          <span>Courses</span>
                          <span>News</span>
                        </div>
                        <div className="h-12 bg-[#7bd0ac]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute left-[47%] top-[126px] z-20 h-[500px] w-[45%] min-w-[318px] overflow-hidden rounded-[14px] border border-[#dce3ec] bg-white p-6 shadow-[0_18px_34px_rgba(17,30,64,0.12)]"
                style={{ transform: 'perspective(1200px) rotateY(-6deg) rotateZ(-0.35deg)', transformOrigin: 'left center' }}
              >
                <h2 className="text-[21px] font-extrabold text-[#071943]">Course Workspace</h2>
                <p className="mt-1 text-[12px] text-[#52607e]">Manage learning and activities</p>
                <div className="mt-6 flex gap-7 border-b border-[#e6ebf2] text-[12px] font-semibold text-[#52607e]">
                  {['Dashboard', 'Courses', 'Assignments', 'Grades'].map((tab) => (
                    <span key={tab} className={tab === 'Dashboard' ? 'border-b-2 border-[#ff5b00] pb-3 text-[#ff5b00]' : 'pb-3'}>
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#071943]">Recent Courses</p>
                  <span className="text-[12px] font-bold text-[#1f65d6]">View all</span>
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    ['Introduction to Biology', '42 students', '#3c82ea', BookOpen],
                    ['World History 101', '38 students', '#e07517', GraduationCap],
                    ['Business Mathematics', '29 students', '#15a0a2', BarChart3],
                  ].map(([title, meta, color, Icon]) => (
                    <div key={String(title)} className="flex items-center gap-3 rounded-[8px] border border-[#e6ebf2] p-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[7px] text-white" style={{ backgroundColor: String(color) }}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#071943]">{String(title)}</p>
                        <p className="text-[11px] text-[#52607e]">{String(meta)}</p>
                      </div>
                      <StatusPill>Published</StatusPill>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <p className="mb-3 text-[12px] font-bold text-[#071943]">Activity Feed</p>
                  <div className="flex items-center gap-3 rounded-[8px] border border-[#e6ebf2] p-3">
                    <CalendarDays className="h-7 w-7 rounded-[6px] bg-[#fff1e6] p-1.5 text-[#ff5b00]" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#071943]">Quiz due in World History 101</p>
                      <p className="text-[11px] text-[#52607e]">Today, 11:59 PM</p>
                    </div>
                    <span className="ml-auto h-4 w-4 rounded-full border border-[#435176]" />
                  </div>
                </div>
              </div>

              <div
                className="absolute right-[-9%] top-[192px] z-40 h-[455px] w-[35%] min-w-[270px] overflow-hidden rounded-[14px] border border-[#dce3ec] bg-white p-5 shadow-[0_18px_34px_rgba(17,30,64,0.12)]"
                style={{ transform: 'perspective(1200px) rotateY(-5deg) rotateZ(0.45deg)', transformOrigin: 'left center' }}
              >
                <div className="flex items-start gap-3">
                  <Globe2 className="h-8 w-8 rounded-[8px] border border-[#e6ebf2] p-1.5 text-[#071943]" />
                  <div>
                    <h2 className="text-[17px] font-extrabold text-[#071943]">Student Management</h2>
                    <p className="text-[11px] text-[#52607e]">Profiles, records, and progress</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-6 border-b border-[#e6ebf2] text-[11px] font-semibold text-[#52607e]">
                  {['Students', 'Records', 'Attendance', 'Reports'].map((tab) => (
                    <span key={tab} className={tab === 'Students' ? 'border-b-2 border-[#ff5b00] pb-2.5 text-[#ff5b00]' : 'pb-2.5'}>
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="mt-4 h-10 rounded-[8px] border border-[#e0e6ef] px-3 py-2 text-[12px] text-[#8190aa]">Search students...</div>
                <div className="mt-4 grid gap-3">
                  {[
                    ['Maria Santos', 'Grade 11 - STEM'],
                    ['Liam Reyes', 'Grade 10 - ABM'],
                    ['Zoe Garcia', 'Grade 12 - HUMSS'],
                    ['Noah Cruz', 'Grade 9 - STEM'],
                  ].map(([name, grade], index) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf3fb] text-[12px] font-bold text-[#071943]">{name.charAt(0)}</span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-[#071943]">{name}</p>
                        <p className="text-[11px] text-[#52607e]">{grade}</p>
                      </div>
                      <StatusPill>{index === 0 ? 'Active' : 'Active'}</StatusPill>
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-5 flex h-10 w-full items-center justify-between rounded-[8px] border border-[#e0e6ef] px-4 text-[12px] font-bold text-[#1f65d6]">
                  View all students
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <Image
                src="/mascot/tigo/transparent-square/landing/tigo-sitting-solo-transparent.png"
                alt="Tigo, the Campus One mascot, sitting on the portal builder"
                width={1536}
                height={1024}
                priority
                className="absolute left-[10%] top-[18px] z-50 w-[164px] object-contain drop-shadow-[0_12px_18px_rgba(119,68,18,0.14)] sm:w-[178px] lg:w-[190px]"
              />
            </div>
          </div>

          <div className="mx-auto max-w-[1440px] px-6 pb-12 lg:px-12">
            <div className="grid gap-5 rounded-t-[18px] border border-[#e6ebf2] border-b-0 bg-white px-5 py-8 shadow-[0_-8px_30px_rgba(17,30,64,0.04)] md:grid-cols-3 xl:grid-cols-5">
              {featureCards.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 rounded-[10px] border border-[#e4eaf2] bg-white p-4">
                  <FeatureIcon icon={feature.icon} accent={feature.accent} />
                  <div>
                    <h3 className="text-[15px] font-extrabold leading-snug text-[#071943]">{feature.title}</h3>
                    <p className="mt-2 text-[12px] leading-5 text-[#435176]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="product" className="bg-white py-16 lg:py-[72px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#ff5b00]">One platform. Every campus.</span>
                  <span className="h-px w-14 bg-[#ff5b00]" />
                </div>
                <h2 className="max-w-[520px] text-[40px] font-black leading-[1.12] tracking-[-0.035em] text-[#06163c] lg:text-[48px]">
                  Everything a campus needs, connected.
                </h2>
                <p className="mt-5 max-w-[520px] text-[18px] leading-[1.6] text-[#435176]">
                  Configure the modules each school needs, then manage teaching, operations, and communication from one place.
                </p>
              </div>

              <div className="rounded-[12px] border border-[#dfe5ee] bg-white px-10 py-8 shadow-[0_16px_40px_rgba(17,30,64,0.06)]">
                <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr_1px_1fr]">
                  <WorkflowStep number="1" icon={Globe2} title="Create instance" body="Spin up a branded campus in minutes." />
                  <ArrowRight className="hidden h-7 w-7 text-[#435176] md:block" />
                  <WorkflowStep number="2" icon={Puzzle} title="Configure modules" body="Enable the tools your school needs." />
                  <ArrowRight className="hidden h-7 w-7 text-[#435176] md:block" />
                  <WorkflowStep number="3" icon={Users} title="Invite community" body="Add staff, teachers, students, and guardians." />
                  <div className="hidden h-28 bg-[#dfe5ee] md:block" />
                  <div>
                    <p className="mb-3 text-[13px] text-[#435176]">Your campus URL</p>
                    <div className="flex h-12 items-center gap-3 rounded-[8px] border border-[#dfe5ee] bg-[#f8fafc] px-4 text-[14px] font-bold text-[#142247]">
                      <Lock className="h-4 w-4" />
                      academy.campusone.app
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#1faf5c] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-7 lg:grid-cols-2 2xl:grid-cols-[1.04fr_0.96fr_220px]">
              <CommandCenterMockup />
              <PortalPreviewMockup />
              <div className="relative flex min-h-[360px] items-end justify-center">
                <div className="absolute right-0 top-14 w-full rounded-[10px] border border-[#dfe5ee] bg-white p-5 shadow-[0_14px_36px_rgba(17,30,64,0.07)]">
                  <div className="flex items-start gap-3 text-[#ff5b00]">
                    <Sparkles className="h-5 w-5" />
                    <div>
                      <p className="text-[17px] font-extrabold">Tigo&apos;s tip</p>
                      <p className="mt-3 text-[14px] leading-6 text-[#435176]">
                        Enable only the modules your school needs. You can always add more later.
                      </p>
                    </div>
                  </div>
                </div>
                <Image
                  src="/mascot/tigo/transparent-square/frames/pointing-left/frame-01.png"
                  alt="Tigo pointing to a Campus One tip"
                  width={512}
                  height={512}
                  className="relative z-10 w-[210px] object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="border-t border-[#eef2f6] bg-[#fbfcfe] py-16 lg:py-[72px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.18em] text-[#ff5b00]">Trusted by thousands</p>
              <h2 className="text-[38px] font-black leading-tight tracking-[-0.035em] text-[#06163c] lg:text-[46px]">
                Built for growing schools and networks.
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {proofCards.map((card) => (
                <ProofCard key={card.title} {...card} />
              ))}
            </div>
          </div>

          <div className="mt-16 border-y border-[#eef2f6] bg-white">
            <div className="mx-auto grid max-w-[1280px] gap-7 px-6 py-8 md:grid-cols-5 md:items-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#66728c]">Used by schools across the globe</p>
              {[
                [Building2, '120+', 'Institutions'],
                [Users, '500K+', 'Active learners'],
                [Globe2, '20+', 'Countries'],
                [ShieldCheck, '99.9%', 'Uptime'],
              ].map(([Icon, value, label]) => (
                <div key={String(label)} className="flex items-center gap-4">
                  <Icon className="h-8 w-8 text-[#66728c]" />
                  <div>
                    <p className="text-[22px] font-extrabold text-[#06163c]">{String(value)}</p>
                    <p className="text-[12px] text-[#435176]">{String(label)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="schools" className="bg-white py-16 lg:py-[72px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-11 text-center">
              <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.18em] text-[#ff5b00]">Made for every role</p>
              <h2 className="text-[38px] font-black leading-tight tracking-[-0.035em] text-[#06163c] lg:text-[46px]">
                For every team on campus
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {roleCards.map((role) => (
                <div key={role.title} className="rounded-[12px] border border-[#dfe5ee] bg-white p-7">
                  <span className={`mb-7 flex h-16 w-16 items-center justify-center rounded-full ${role.color}`}>
                    <role.icon className="h-8 w-8" />
                  </span>
                  <h3 className="text-[21px] font-extrabold text-[#071943]">{role.title}</h3>
                  <p className="mt-3 min-h-[54px] text-[14px] leading-6 text-[#435176]">{role.description}</p>
                  <div className="my-6 h-px bg-[#e6ebf2]" />
                  <ul className="grid gap-4">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3 text-[13px] text-[#142247]">
                        <Check className="h-4 w-4 rounded-full border border-current p-0.5 text-[#249c65]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="mt-8 inline-flex items-center gap-3 text-[15px] font-bold text-[#ff5b00]">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-20 overflow-hidden rounded-[14px] border border-[#ffd9c2] bg-[#fff9f5]">
              <div className="grid gap-8 px-8 py-10 md:grid-cols-[0.95fr_1.05fr] md:px-16 md:py-12">
                <div className="flex flex-col justify-center">
                  <h2 className="max-w-[460px] text-[38px] font-black leading-[1.12] tracking-[-0.035em] text-[#06163c] lg:text-[44px]">
                    Launch your first campus instance.
                  </h2>
                  <p className="mt-5 max-w-[460px] text-[17px] leading-7 text-[#435176]">
                    Start with one school, then scale to every program, branch, or campus you manage.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openAuth('signup')}
                      className="inline-flex h-13 items-center justify-center gap-3 rounded-[8px] bg-[#ff5b00] px-8 py-4 text-[15px] font-bold text-white shadow-[0_14px_24px_rgba(255,91,0,0.16)]"
                    >
                      Create a portal
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuth('login')}
                      className="inline-flex h-13 items-center justify-center gap-3 rounded-[8px] border border-[#071943] bg-white px-8 py-4 text-[15px] font-bold text-[#071943]"
                    >
                      Talk to Campus One
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="relative min-h-[280px]">
                  <Image
                    src="/mascot/tigo/transparent-square/frames/default-wave/frame-01.png"
                    alt="Tigo waving beside the Campus One logo"
                    width={512}
                    height={512}
                    className="absolute bottom-0 left-1/2 z-10 w-[270px] -translate-x-1/2 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8e0ea] bg-[#f3f6fa] py-14">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_2.6fr]">
            <div>
              <div className="flex items-center gap-3">
                <CampusOneMark className="h-11 w-11" />
                <CampusOneWordmark />
              </div>
              <p className="mt-5 max-w-[360px] text-[14px] leading-7 text-[#435176]">
                The all-in-one LMS and school management platform for modern institutions and education networks.
              </p>
              <div className="mt-7 flex gap-3">
                {['in', 'X', 'yt', 'gl'].map((item) => (
                  <span key={item} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe5ee] text-[12px] font-bold text-[#435176]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <h3 className="text-[14px] font-extrabold text-[#071943]">{group}</h3>
                  <div className="mt-5 grid gap-3">
                    {links.map((link) => (
                      <button key={link} type="button" className="w-fit text-left text-[14px] text-[#435176] hover:text-[#ff5b00]">
                        {link}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-[#d8e0ea] pt-8 text-[13px] text-[#66728c] md:flex-row md:items-center md:justify-between">
            <p>© 2026 Campus One. All rights reserved.</p>
            <div className="flex gap-8">
              <button type="button">Privacy Policy</button>
              <button type="button">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {authModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071333]/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[12px] border border-[#dfe5ee] bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4 top-4 rounded-[8px] p-1 text-[#66728c] hover:bg-[#f6f8fb] hover:text-[#071943]"
              aria-label="Close authentication dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#fff2e9] text-[#ff5b00]">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-black text-[#071943]">
                {authTab === 'login' ? 'Sign in to Campus One' : 'Create your first portal'}
              </h2>
              <p className="mt-1 text-sm text-[#52607e]">
                {authTab === 'login' ? 'Continue managing your school workspace.' : 'Set up an institution account for portal access.'}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-1 rounded-[10px] bg-[#f6f8fb] p-1 text-sm font-black">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`rounded-[8px] py-2 ${authTab === 'login' ? 'bg-white shadow-sm' : 'text-[#66728c]'}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`rounded-[8px] py-2 ${authTab === 'signup' ? 'bg-white shadow-sm' : 'text-[#66728c]'}`}
              >
                Setup
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === 'signup' && (
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Institution name</span>
                  <input
                    required
                    value={schoolName}
                    onChange={(event) => setSchoolName(event.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                    placeholder="Greenfield Academy"
                  />
                  {registrationErrors.name && <span className="mt-1 block text-xs font-bold text-rose-600">{registrationErrors.name}</span>}
                </label>
              )}

              {authTab === 'signup' && (
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Representative name</span>
                  <input
                    required
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                    placeholder="Registrar Officer"
                  />
                  {registrationErrors.representative && <span className="mt-1 block text-xs font-bold text-rose-600">{registrationErrors.representative}</span>}
                </label>
              )}

              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Email address</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                  placeholder="name@institution.edu"
                />
                {registrationErrors.email && <span className="mt-1 block text-xs font-bold text-rose-600">{registrationErrors.email}</span>}
              </label>

              {authTab === 'login' && (
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Password</span>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                    placeholder="Enter password"
                  />
                </label>
              )}

              {authTab === 'signup' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Contact number</span>
                    <input
                      required
                      type="tel"
                      value={contactNumber}
                      onChange={(event) => setContactNumber(event.target.value)}
                      className="h-11 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                      placeholder="+63 900 000 0000"
                    />
                    {registrationErrors.contactNumber && <span className="mt-1 block text-xs font-bold text-rose-600">{registrationErrors.contactNumber}</span>}
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-black uppercase text-[#435176]">School type</span>
                    <span className="relative block">
                      <select
                        required
                        value={schoolType}
                        onChange={(event) => setSchoolType(event.target.value)}
                        className="h-11 w-full appearance-none rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                      >
                        <option value="">Select type</option>
                        <option value="Basic Education">Basic Education</option>
                        <option value="Higher Education">Higher Education</option>
                        <option value="Technical Vocational">Technical Vocational</option>
                        <option value="Training Center">Training Center</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#66728c]" />
                    </span>
                    {registrationErrors.schoolType && <span className="mt-1 block text-xs font-bold text-rose-600">{registrationErrors.schoolType}</span>}
                  </label>
                </div>
              )}

              {authTab === 'signup' && (
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Target subdomain</span>
                  <input
                    required
                    value={targetSubdomain}
                    onChange={(event) => setTargetSubdomain(event.target.value.trim().toLowerCase())}
                    className="h-11 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm text-[#071943]"
                    placeholder="greenfield"
                  />
                  <span className="mt-1 block text-xs font-semibold text-[#66728c]">
                    Availability is confirmed during submission while the backend preflight endpoint is pending.
                  </span>
                  {registrationErrors.targetSubdomain && <span className="mt-1 block text-xs font-bold text-rose-600">{registrationErrors.targetSubdomain}</span>}
                </label>
              )}

              {authError && <p className="rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{authError}</p>}
              {authSuccess && (
                <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                  {authTab === 'login' ? 'Authenticated. Redirecting...' : registrationMessage || 'School registration submitted for review.'}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="flex h-12 w-full items-center justify-center rounded-[8px] bg-[#ff5b00] text-sm font-black text-white transition hover:bg-[#e94f00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authLoading ? 'Working...' : authTab === 'login' ? 'Sign in' : 'Create portal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowStep({
  number,
  icon: Icon,
  title,
  body,
}: {
  number: string;
  icon: typeof Globe2;
  title: string;
  body: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex items-center justify-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffd7bf] bg-[#fff6ef] text-[18px] font-bold text-[#071943]">{number}</span>
        <span className="flex h-16 w-16 items-center justify-center rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] text-[#ff5b00]">
          <Icon className="h-8 w-8" />
        </span>
      </div>
      <h3 className="text-[16px] font-extrabold text-[#071943]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[180px] text-[13px] leading-5 text-[#435176]">{body}</p>
    </div>
  );
}

function CommandCenterMockup() {
  const campuses = [
    ['Northfield Academy', 'northfield.campusone.app', 'Active', '4,821', '243', '100%'],
    ['Riverside College', 'riverside.campusone.app', 'Active', '3,942', '198', '99.97%'],
    ['Maplewood Academy', 'maplewood.campusone.app', 'Active', '2,756', '156', '99.99%'],
    ['Coral Bay School', 'coralbay.campusone.app', 'Active', '1,987', '112', '100%'],
    ['Pinecrest School', 'pinecrest.campusone.app', 'Setup', '-', '-', 'Complete setup'],
  ];

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#dfe5ee] bg-white shadow-[0_18px_44px_rgba(17,30,64,0.08)]">
      <div className="grid min-h-[420px] grid-cols-[160px_1fr]">
        <aside className="bg-[#061f3c] p-5 text-white">
          <div className="mb-7 flex items-center gap-2">
            <CampusOneMark className="h-7 w-7" />
            <span className="text-[15px] font-bold">Campus One</span>
          </div>
          <div className="grid gap-2 text-[12px] font-semibold">
            {[
              [Home, 'Overview'],
              [Building2, 'Campuses'],
              [Users, 'Users'],
              [Puzzle, 'Modules'],
              [BarChart3, 'Reports'],
              [MessageSquare, 'Communications'],
            ].map(([Icon, label], index) => (
              <div key={String(label)} className={`flex items-center gap-2 rounded-[7px] px-3 py-2 ${index === 0 ? 'bg-white/14' : ''}`}>
                <Icon className="h-4 w-4" />
                {String(label)}
              </div>
            ))}
          </div>
        </aside>
        <div className="p-6">
          <h3 className="text-[15px] font-extrabold text-[#071943]">Command Center</h3>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              ['Active Campuses', '12'],
              ['Active Learners', '24,532'],
              ['Courses', '1,248'],
              ['System Uptime', '99.98%'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[7px] border border-[#e6ebf2] p-3">
                <p className="text-[10px] font-bold text-[#071943]">{label}</p>
                <p className="mt-2 text-[22px] font-black text-[#071943]">{value}</p>
                <p className="mt-1 text-[10px] text-[#15945d]">All systems operational</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[7px] border border-[#e6ebf2]">
            <div className="grid grid-cols-[1.2fr_1.25fr_0.75fr_0.8fr_0.7fr_0.7fr] border-b border-[#e6ebf2] px-4 py-3 text-[10px] font-bold text-[#435176]">
              <span>Campus</span>
              <span>Domain</span>
              <span>Status</span>
              <span>Active Learners</span>
              <span>Courses</span>
              <span>Uptime</span>
            </div>
            {campuses.map((row) => (
              <div key={row[0]} className="grid grid-cols-[1.2fr_1.25fr_0.75fr_0.8fr_0.7fr_0.7fr] items-center border-b border-[#eef2f6] px-4 py-3 text-[10px] last:border-b-0">
                <span className="font-bold text-[#071943]">{row[0]}</span>
                <span className="text-[#435176]">{row[1]}</span>
                <span>
                  <StatusPill color={row[2] === 'Setup' ? 'orange' : 'green'}>{row[2]}</StatusPill>
                </span>
                <span className="font-bold text-[#071943]">{row[3]}</span>
                <span className="font-bold text-[#071943]">{row[4]}</span>
                <span className="font-bold text-[#071943]">{row[5]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalPreviewMockup() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#dfe5ee] bg-white shadow-[0_18px_44px_rgba(17,30,64,0.08)]">
      <div className="grid min-h-[420px] grid-cols-[92px_1fr]">
        <aside className="border-r border-[#e6ebf2] bg-[#fbfcfe] p-4">
          <div className="mb-5 flex items-center gap-2 text-[13px] font-bold text-[#071943]">
            <Home className="h-5 w-5" />
          </div>
          <div className="grid gap-2 text-[11px] font-semibold text-[#435176]">
            {['Home', 'Courses', 'Calendar', 'Assignments', 'Grades', 'People', 'Files'].map((item, index) => (
              <div key={item} className={`rounded-[6px] px-2 py-2 ${index === 0 ? 'bg-[#e8f2ff] text-[#1f65d6]' : ''}`}>{item}</div>
            ))}
          </div>
        </aside>
        <div className="p-5">
          <div className="flex items-center justify-between border-b border-[#e6ebf2] pb-4">
            <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#071943]">
              <School className="h-5 w-5" />
              Northfield Academy
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-4">
              <Bell className="h-4 w-4 text-[#435176]" />
              <Mail className="h-4 w-4 text-[#435176]" />
              <span className="h-8 w-8 rounded-full bg-[#f0b07d]" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_1fr] gap-4">
            <div>
              <p className="mb-3 text-[12px] font-bold text-[#071943]">My Courses</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Biology 101', '#e9f8ee', BookOpen],
                  ['World History', '#f3edff', Globe2],
                  ['Algebra II', '#fff1df', Puzzle],
                ].map(([title, color, Icon]) => (
                  <div key={String(title)} className="rounded-[8px] border border-[#e6ebf2] p-3">
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-[7px]" style={{ backgroundColor: String(color) }}>
                      <Icon className="h-5 w-5 text-[#15945d]" />
                    </span>
                    <p className="text-[10px] font-bold text-[#071943]">{String(title)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[8px] border border-[#e6ebf2] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#071943]">Student Directory</p>
                  <span className="text-[10px] font-bold text-[#1f65d6]">View all</span>
                </div>
                {['Ava Johnson', 'Liam Chen', 'Noah Patel'].map((name) => (
                  <div key={name} className="mb-3 flex items-center gap-3 last:mb-0">
                    <span className="h-8 w-8 rounded-full bg-[#d8e9f8]" />
                    <div>
                      <p className="text-[11px] font-bold text-[#071943]">{name}</p>
                      <p className="text-[10px] text-[#435176]">11th Grade</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[12px] font-bold text-[#071943]">Announcements</p>
              <div className="rounded-[8px] border border-[#e6ebf2] p-4">
                {['Midterm Schedule', 'Library Hours Update', 'Parent-Teacher Meeting'].map((item) => (
                  <div key={item} className="mb-4 flex items-center gap-2 last:mb-0">
                    <span className="h-2 w-2 rounded-full bg-[#1f65d6]" />
                    <div>
                      <p className="text-[11px] font-bold text-[#071943]">{item}</p>
                      <p className="text-[10px] text-[#435176]">May 20, 2026</p>
                    </div>
                    <ChevronDown className="ml-auto h-3 w-3 -rotate-90 text-[#435176]" />
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[8px] border border-[#e6ebf2] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#071943]">Attendance Overview</p>
                  <span className="rounded-[5px] border border-[#dfe5ee] px-2 py-1 text-[10px] text-[#435176]">This week</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="grid h-24 w-24 place-items-center rounded-full border-[14px] border-[#49b96f] text-center">
                    <span className="text-[20px] font-black text-[#071943]">92%</span>
                  </div>
                  <div className="grid gap-2 text-[11px] text-[#435176]">
                    <span><b className="text-[#49b96f]">●</b> Present 92%</span>
                    <span><b className="text-[#dc4e4e]">●</b> Absent 5%</span>
                    <span><b className="text-[#f5a524]">●</b> Late 3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProofCard({
  title,
  description,
  icon: Icon,
  bullets,
  tint,
}: {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  bullets: string[];
  tint: string;
}) {
  const isBlue = tint === 'blue';
  return (
    <div className="rounded-[12px] border border-[#dfe5ee] bg-white p-9">
      <span className={`mb-8 flex h-20 w-20 items-center justify-center rounded-full ${isBlue ? 'bg-[#edf5ff] text-[#1f65d6]' : 'bg-[#edf8f1] text-[#15945d]'}`}>
        <Icon className="h-10 w-10" />
      </span>
      <h3 className="text-[24px] font-extrabold text-[#071943]">{title}</h3>
      <p className="mt-5 min-h-[92px] text-[14px] leading-7 text-[#435176]">{description}</p>
      <div className="mb-7 mt-8 h-px bg-[#e6ebf2]" />
      <div className="grid gap-3">
        {bullets.map((bullet) => (
          <div key={bullet} className="flex h-11 items-center gap-3 rounded-[7px] border border-[#dfe5ee] bg-[#f8fbf9] px-4 text-[13px] font-bold text-[#142247]">
            <Check className={`h-4 w-4 rounded-full border p-0.5 ${isBlue ? 'border-[#1f65d6] text-[#1f65d6]' : 'border-[#15945d] text-[#15945d]'}`} />
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
}
