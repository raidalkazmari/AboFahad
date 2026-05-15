'use client';
import { useState, useEffect, useRef } from 'react';

const APP_NAME = 'ذاكر مع أبو فهد';
const PAGES = { LANDING:'landing', DASHBOARD:'dashboard', UPLOAD:'upload', SUMMARY:'summary', QUIZ:'quiz', FLASHCARDS:'flashcards', STUDY_PLAN:'study_plan', CHAT:'chat' };

async function callAI(prompt, system) {
  const r = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.text;
}

function Spinner({ size = 22 }) {
  return <div style={{ width: size, height: size, border: '3px solid var(--border)', borderTop: '3px solid var(--pri-light)', borderRadius: '50%', animation: 'abuSpin .7s linear infinite', display: 'inline-block' }} />;
}

const Icons = {
  Upload: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  FileText: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Zap: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Calendar: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  MessageCircle: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  Home: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Sparkles: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 18l.7 2.1L8 21l-2.3.7L5 24l-.7-2.3L2 21l2.3-.9L5 18z"/></svg>,
  Layers: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Send: ({ s = 20 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  BarChart: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  BookOpen: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  Coffee: ({ s = 24 }) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
};

const st = {
  card: { background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 24, transition: 'all .3s' },
  btn: { background: 'linear-gradient(135deg,#f59e0b,#d97706,#b45309)', color: '#000', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 16, fontWeight: 800, fontFamily: "'Tajawal',sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 },
  btnO: { background: 'transparent', color: 'var(--pri-light)', border: '2px solid var(--pri-light)', borderRadius: 12, padding: '12px 28px', fontSize: 16, fontWeight: 700, fontFamily: "'Tajawal',sans-serif", cursor: 'pointer' },
  inp: { background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 12, padding: '12px 16px', fontSize: 16, color: 'var(--text)', fontFamily: "'Tajawal',sans-serif", width: '100%', boxSizing: 'border-box', outline: 'none', direction: 'rtl' },
};

// =============================================
// LANDING
// =============================================
function Landing({ go }) {
  const features = [
    { icon: <Icons.FileText s={24} />, title: 'تلخيص ذكي', desc: 'حوّل دروسك لملخصات مركّزة بثواني', col: 'var(--pri)' },
    { icon: <Icons.Zap s={24} />, title: 'اختبارات فورية', desc: 'اختبر فهمك بأسئلة اختيار من المحتوى', col: 'var(--accent)' },
    { icon: <Icons.Layers s={24} />, title: 'فلاش كاردز', desc: 'بطاقات مراجعة ذكية تساعدك تحفظ أسرع', col: 'var(--success)' },
    { icon: <Icons.Calendar s={24} />, title: 'خطة مذاكرة', desc: 'خطة مخصصة لك حسب وقتك ومادتك', col: '#ec4899' },
    { icon: <Icons.MessageCircle s={24} />, title: 'مساعد ذكي', desc: 'اسأل أبو فهد أي سؤال ويجاوبك فوراً', col: '#8b5cf6' },
    { icon: <Icons.BarChart s={24} />, title: 'تتبع تقدمك', desc: 'شوف إحصائياتك وتطورك الدراسي', col: '#f97316' },
  ];
  return (
    <div style={{ minHeight: '100vh', overflow: 'auto' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.BookOpen s={20} /></div>
          <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--pri-light)' }}>{APP_NAME}</span>
        </div>
        <button className="abu-btn" onClick={() => go(PAGES.DASHBOARD)} style={{ ...st.btn, padding: '10px 24px', fontSize: 14 }}>ابدأ مجاناً</button>
      </nav>

      {/* Hero */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px', textAlign: 'center', position: 'relative', background: 'radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.08),rgba(6,8,15,1) 70%)' }}>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,var(--pri-glow),transparent 70%)', animation: 'abuPulse 5s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 750 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 40, padding: '8px 20px', marginBottom: 28, fontSize: 14, color: 'var(--pri-light)', animation: 'abuSlide .5s ease-out' }}>
            <Icons.Sparkles s={16} /> مساعدك الدراسي بالذكاء الاصطناعي
          </div>
          <h1 style={{ fontSize: 'clamp(38px,7vw,68px)', fontWeight: 900, margin: '0 0 8px', lineHeight: 1.2, animation: 'abuSlide .5s ease-out .1s both' }}>
            <span>ذاكر مع </span><span style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>أبو فهد</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--pri-light)', fontWeight: 700, margin: '0 0 8px', letterSpacing: 1, animation: 'abuSlide .5s ease-out .15s both' }}>☕ القهوة عليك والمذاكرة علينا</p>
          <p style={{ fontSize: 'clamp(17px,2.8vw,22px)', color: 'var(--text-muted)', maxWidth: 550, margin: '12px auto 36px', lineHeight: 1.9, animation: 'abuSlide .5s ease-out .2s both' }}>
            لخّص دروسك، اختبر نفسك، راجع بالفلاش كاردز، وخطط مذاكرتك — كل هذا بضغطة زر
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', animation: 'abuSlide .5s ease-out .3s both' }}>
            <button className="abu-btn" onClick={() => go(PAGES.DASHBOARD)} style={{ ...st.btn, fontSize: 18, padding: '16px 40px', borderRadius: 14 }}>ابدأ الحين 🚀</button>
            <button className="abu-btn" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ ...st.btnO, fontSize: 18, padding: '16px 36px', borderRadius: 14 }}>اكتشف المميزات</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, marginTop: 64, background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', animation: 'abuSlide .5s ease-out .4s both', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          {[{ num: '٥+', label: 'أدوات ذكية' }, { num: 'AI', label: 'ذكاء اصطناعي' }, { num: '∞', label: 'محتوى غير محدود' }, { num: '🇸🇦', label: 'عربي بالكامل' }].map((s, i) => (
            <div key={i} style={{ padding: '20px 32px', textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--border)' : 'none', minWidth: 120 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--pri-light)', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ padding: '80px 20px', maxWidth: 1050, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, margin: '0 0 12px' }}>كل اللي تحتاجه <span style={{ color: 'var(--pri-light)' }}>بمكان واحد</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, margin: 0 }}>أدوات ذكية تخليك تتفوق بأقل وقت وجهد</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 18 }}>
          {features.map((f, i) => (
            <div key={i} className="abu-card" style={{ ...st.card, cursor: 'default' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `color-mix(in srgb, ${f.col} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.col, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 6px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.8, fontSize: 15 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 900, marginBottom: 40 }}>كيف يشتغل؟</h2>
        {[
          { step: '١', title: 'الصق محتواك الدراسي', desc: 'انسخ نص المحاضرة أو الدرس والصقه بالتطبيق' },
          { step: '٢', title: 'اختر الأداة', desc: 'تلخيص؟ اختبار؟ فلاش كاردز؟ خطة مذاكرة؟ أنت تختار' },
          { step: '٣', title: 'أبو فهد يجهزلك كل شي', desc: 'الذكاء الاصطناعي يحلل المحتوى ويطلع لك النتيجة بثواني' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '24px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#f59e0b,#d97706)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#000' }}>{s.step}</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '60px 20px 80px', textAlign: 'center', background: 'linear-gradient(180deg,transparent,rgba(245,158,11,0.04))' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
        <h2 style={{ fontSize: 30, fontWeight: 900, margin: '0 0 12px' }}>جاهز تذاكر مع أبو فهد؟</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 17 }}>ابدأ الحين وشوف الفرق بنفسك</p>
        <button className="abu-btn" onClick={() => go(PAGES.DASHBOARD)} style={{ ...st.btn, fontSize: 18, padding: '16px 44px', borderRadius: 14 }}>يلا نبدأ 🔥</button>
      </div>

      <footer style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 14, color: 'var(--text-dim)' }}>
        <span>© 2026 {APP_NAME} — جميع الحقوق محفوظة</span>
        <span>صُنع بـ ❤️ للطلاب</span>
      </footer>
    </div>
  );
}

// =============================================
// SIDEBAR
// =============================================
function Sidebar({ cur, go }) {
  const items = [
    { id: PAGES.DASHBOARD, icon: <Icons.Home s={20} />, label: 'الرئيسية' },
    { id: PAGES.UPLOAD, icon: <Icons.Upload s={20} />, label: 'رفع محتوى' },
    { id: PAGES.SUMMARY, icon: <Icons.FileText s={20} />, label: 'تلخيص' },
    { id: PAGES.QUIZ, icon: <Icons.Zap s={20} />, label: 'اختبار' },
    { id: PAGES.FLASHCARDS, icon: <Icons.Layers s={20} />, label: 'فلاش كاردز' },
    { id: PAGES.STUDY_PLAN, icon: <Icons.Calendar s={20} />, label: 'خطة مذاكرة' },
    { id: PAGES.CHAT, icon: <Icons.MessageCircle s={20} />, label: 'اسأل أبو فهد' },
  ];
  return (
    <div style={{ width: 210, background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '18px 10px', position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 100, overflowY: 'auto' }}>
      <div onClick={() => go(PAGES.LANDING)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', marginBottom: 28, cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.BookOpen s={18} /></div>
        <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--pri-light)' }}>أبو فهد</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(it => (
          <button key={it.id} className="abu-nav" onClick={() => go(it.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, border: 'none', fontFamily: "'Tajawal',sans-serif", background: cur === it.id ? 'rgba(245,158,11,0.12)' : 'transparent', color: cur === it.id ? 'var(--pri-light)' : 'var(--text-muted)', fontSize: 14, fontWeight: cur === it.id ? 700 : 500, cursor: 'pointer', textAlign: 'right', direction: 'rtl', transition: 'all .2s' }}>
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Wrap({ title, subtitle, children }) {
  return (
    <div style={{ padding: '28px 24px', maxWidth: 860, margin: '0 auto' }}>
      {title && <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 4px' }}>{title}</h1>}
      {subtitle && <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: 15 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

// =============================================
// DASHBOARD
// =============================================
function Dashboard({ go, stats }) {
  const actions = [
    { icon: <Icons.Upload s={22} />, label: 'رفع محتوى', page: PAGES.UPLOAD, col: 'var(--pri)' },
    { icon: <Icons.FileText s={22} />, label: 'تلخيص', page: PAGES.SUMMARY, col: 'var(--accent)' },
    { icon: <Icons.Zap s={22} />, label: 'اختبار', page: PAGES.QUIZ, col: 'var(--warning)' },
    { icon: <Icons.Layers s={22} />, label: 'فلاش كاردز', page: PAGES.FLASHCARDS, col: 'var(--success)' },
    { icon: <Icons.Calendar s={22} />, label: 'خطة مذاكرة', page: PAGES.STUDY_PLAN, col: '#ec4899' },
    { icon: <Icons.MessageCircle s={22} />, label: 'اسأل أبو فهد', page: PAGES.CHAT, col: '#8b5cf6' },
  ];
  const sc = [
    { label: 'محتوى مرفوع', value: stats.files, col: 'var(--pri)' },
    { label: 'ملخصات', value: stats.summaries, col: 'var(--accent)' },
    { label: 'اختبارات', value: stats.quizzes, col: 'var(--warning)' },
    { label: 'فلاش كاردز', value: stats.flashcards, col: 'var(--success)' },
  ];
  return (
    <Wrap title="أهلاً بك ☕" subtitle="اختر أداة وابدأ مذاكرتك مع أبو فهد">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 14, marginBottom: 28 }}>
        {sc.map((s, i) => (
          <div key={i} style={{ ...st.card, padding: 18 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.col }}>{s.value}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>الأدوات الذكية</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
        {actions.map((a, i) => (
          <button key={i} className="abu-card" onClick={() => go(a.page)} style={{ ...st.card, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb, ${a.col} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.col }}>{a.icon}</div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{a.label}</span>
          </button>
        ))}
      </div>
    </Wrap>
  );
}

// =============================================
// UPLOAD
// =============================================
function Upload({ onUpload }) {
  const [text, setText] = useState('');
  return (
    <Wrap title="رفع المحتوى الدراسي" subtitle="الصق نص المحاضرة أو الدرس وأبو فهد يحلله لك">
      <div style={{ ...st.card, padding: 0 }}>
        <textarea className="abu-inp" value={text} onChange={e => setText(e.target.value)} placeholder="الصق المحتوى هنا... مثلاً فصل من كتاب أو ملاحظات محاضرة ☕" style={{ ...st.inp, minHeight: 240, resize: 'vertical', border: 'none', borderRadius: 16, padding: 22, fontSize: 16, lineHeight: 2 }} />
      </div>
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="abu-btn" style={{ ...st.btn, opacity: text.trim() ? 1 : .45, pointerEvents: text.trim() ? 'auto' : 'none' }} onClick={() => text.trim() && onUpload(text.trim())}>
          <Icons.Sparkles s={18} /> يلا حلل المحتوى
        </button>
        {text.trim() && <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>{text.trim().split(/\s+/).length} كلمة</span>}
      </div>
    </Wrap>
  );
}

// =============================================
// SUMMARY
// =============================================
function Summary({ content, onDone }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const gen = async () => {
    setLoading(true);
    try { const r = await callAI(`لخّص لي النص التالي بطريقة مرتبة ومفهومة مع النقاط الأساسية:\n\n${content}`, 'أنت أبو فهد، مساعد دراسي متخصص بالتلخيص. لخّص بوضوح وركّز على الأساسيات.'); setSummary(r); onDone(); } catch { setSummary('صار خطأ، جرب مرة ثانية.'); }
    setLoading(false);
  };
  return (
    <Wrap title="التلخيص الذكي ✨" subtitle="أبو فهد يلخص لك المحتوى بثواني">
      {!content ? <div style={{ ...st.card, textAlign: 'center', padding: 44 }}><p style={{ color: 'var(--text-muted)' }}>ارفع محتوى أولاً من "رفع محتوى"</p></div> : <>
        <div style={{ ...st.card, marginBottom: 18 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700 }}>المحتوى الأصلي</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, maxHeight: 130, overflow: 'auto', fontSize: 14 }}>{content.substring(0, 400)}{content.length > 400 ? '...' : ''}</p>
        </div>
        {!summary && <button className="abu-btn" style={st.btn} onClick={gen} disabled={loading}>{loading ? <><Spinner size={18} /> أبو فهد يلخص...</> : <><Icons.Sparkles s={18} /> لخّص لي</>}</button>}
        {summary && <div style={{ ...st.card, borderColor: 'var(--pri-light)', animation: 'abuSlide .4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><div style={{ color: 'var(--pri-light)' }}><Icons.Sparkles s={22} /></div><h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>الملخص</h3></div>
          <p style={{ lineHeight: 2.2, margin: 0, whiteSpace: 'pre-wrap', fontSize: 16 }}>{summary}</p>
        </div>}
      </>}
    </Wrap>
  );
}

// =============================================
// QUIZ
// =============================================
function Quiz({ content, onDone }) {
  const [qs, setQs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState({});
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);

  const gen = async () => {
    setLoading(true);
    try {
      const r = await callAI(`أنشئ 5 أسئلة اختيار من متعدد من النص. كل سؤال 4 خيارات وجواب صحيح.\nأجب بـ JSON فقط بدون backticks:\n[{"q":"السؤال","options":["أ","ب","ج","د"],"correct":0}]\n\nالنص:\n${content}`, 'أنت مساعد تعليمي. أنشئ أسئلة اختبار. أجب فقط بـ JSON صالح بدون أي نص أو backticks.');
      setQs(JSON.parse(r.replace(/```json|```/g, '').trim()));
    } catch { setQs([{ q: 'ما الفكرة الرئيسية؟', options: ['الفهم', 'الحفظ', 'التطبيق', 'التحليل'], correct: 0 }]); }
    setLoading(false);
  };
  const pick = (i) => {
    setSel(i);
    setTimeout(() => {
      const na = { ...ans, [cur]: i }; setAns(na);
      if (cur < qs.length - 1) { setCur(cur + 1); setSel(null); }
      else { onDone(); setDone(true); }
    }, 700);
  };

  if (done) {
    const score = qs.reduce((a, q, i) => a + (ans[i] === q.correct ? 1 : 0), 0);
    const pct = Math.round(score / qs.length * 100);
    return (
      <Wrap title="نتيجتك">
        <div style={{ ...st.card, textAlign: 'center', padding: 44, animation: 'abuSlide .4s ease-out' }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', margin: '0 auto 20px', background: pct >= 70 ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 900, color: pct >= 70 ? 'var(--success)' : 'var(--warning)' }}>{pct}%</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>{pct >= 80 ? 'ماشاء الله عليك! 🎉' : pct >= 60 ? 'حلو! 👍' : 'عادي، ذاكر وارجع 💪'}</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 28px' }}>{score} من {qs.length} صح</p>
          <button className="abu-btn" style={st.btn} onClick={() => { setDone(false); setCur(0); setAns({}); setSel(null); setQs([]); }}>اختبار جديد</button>
        </div>
      </Wrap>
    );
  }
  return (
    <Wrap title="اختبر نفسك ⚡" subtitle="أسئلة اختيار من متعدد من محتواك">
      {!content ? <div style={{ ...st.card, textAlign: 'center', padding: 44 }}><p style={{ color: 'var(--text-muted)' }}>ارفع محتوى أولاً</p></div>
        : qs.length === 0 ? <button className="abu-btn" style={st.btn} onClick={gen} disabled={loading}>{loading ? <><Spinner size={18} /> أبو فهد يجهز الأسئلة...</> : <><Icons.Zap s={18} /> ابدأ الاختبار</>}</button>
          : <div style={{ animation: 'abuSlide .4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>سؤال {cur + 1} من {qs.length}</span>
              <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 3 }}><div style={{ width: `${(cur + 1) / qs.length * 100}%`, height: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 3, transition: 'width .3s' }} /></div>
            </div>
            <div style={st.card}>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 20px', lineHeight: 1.8 }}>{qs[cur].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {qs[cur].options.map((opt, i) => {
                  let bg = 'var(--bg-card)', bc = 'var(--border-light)';
                  if (sel !== null) { if (i === qs[cur].correct) { bg = 'rgba(16,185,129,.1)'; bc = 'var(--success)'; } else if (sel === i) { bg = 'rgba(239,68,68,.1)'; bc = 'var(--danger)'; } }
                  return (<button key={i} onClick={() => sel === null && pick(i)} style={{ background: bg, border: `2px solid ${bc}`, borderRadius: 12, padding: '14px 18px', color: 'var(--text)', fontSize: 15, fontFamily: "'Tajawal',sans-serif", textAlign: 'right', cursor: sel === null ? 'pointer' : 'default', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(245,158,11,.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--pri-light)' }}>{['أ', 'ب', 'ج', 'د'][i]}</span>{opt}
                  </button>);
                })}
              </div>
            </div>
          </div>}
    </Wrap>
  );
}

// =============================================
// FLASHCARDS
// =============================================
function Flashcards({ content, onDone }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cur, setCur] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const gen = async () => {
    setLoading(true);
    try {
      const r = await callAI(`أنشئ 6 فلاش كاردز من النص. كل بطاقة سؤال وجواب.\nأجب بـ JSON فقط بدون backticks:\n[{"q":"السؤال","a":"الجواب"}]\n\nالنص:\n${content}`, 'أنت مساعد تعليمي. أنشئ بطاقات تعليمية. أجب فقط بـ JSON صالح.');
      const p = JSON.parse(r.replace(/```json|```/g, '').trim()); setCards(p); onDone(p.length);
    } catch { setCards([{ q: 'ما الفكرة الرئيسية؟', a: 'راجع المحتوى' }]); }
    setLoading(false);
  };
  return (
    <Wrap title="فلاش كاردز 🃏" subtitle="بطاقات مراجعة ذكية — اضغط للقلب">
      {!content ? <div style={{ ...st.card, textAlign: 'center', padding: 44 }}><p style={{ color: 'var(--text-muted)' }}>ارفع محتوى أولاً</p></div>
        : cards.length === 0 ? <button className="abu-btn" style={st.btn} onClick={gen} disabled={loading}>{loading ? <><Spinner size={18} /> جاري الإنشاء...</> : <><Icons.Layers s={18} /> أنشئ فلاش كاردز</>}</button>
          : <div style={{ animation: 'abuSlide .4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>بطاقة {cur + 1} من {cards.length}</span></div>
            <div onClick={() => setFlipped(!flipped)} style={{ ...st.card, minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center', borderColor: flipped ? 'var(--pri)' : 'var(--accent)', transition: 'all .35s', animation: flipped ? 'abuGlow 2s ease-in-out infinite' : 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: flipped ? 'var(--pri-light)' : 'var(--accent)', marginBottom: 14, letterSpacing: 2, textTransform: 'uppercase' }}>{flipped ? 'الجواب' : 'السؤال'}</div>
              <p style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.9, margin: 0, maxWidth: 480 }}>{flipped ? cards[cur].a : cards[cur].q}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 20 }}>اضغط للقلب</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
              <button onClick={() => { setCur(Math.max(0, cur - 1)); setFlipped(false); }} disabled={cur === 0} style={{ ...st.btnO, padding: '10px 22px', fontSize: 13, opacity: cur === 0 ? .35 : 1 }}>السابقة</button>
              <button className="abu-btn" onClick={() => { setCur(Math.min(cards.length - 1, cur + 1)); setFlipped(false); }} disabled={cur === cards.length - 1} style={{ ...st.btn, padding: '10px 22px', fontSize: 13, opacity: cur === cards.length - 1 ? .4 : 1 }}>التالية</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 14 }}>
              {cards.map((_, i) => <div key={i} onClick={() => { setCur(i); setFlipped(false); }} style={{ width: i === cur ? 22 : 7, height: 7, borderRadius: 4, cursor: 'pointer', transition: 'all .3s', background: i === cur ? 'var(--pri-light)' : 'var(--border-light)' }} />)}
            </div>
          </div>}
    </Wrap>
  );
}

// =============================================
// STUDY PLAN
// =============================================
function StudyPlan({ content }) {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(5);
  const [hours, setHours] = useState(2);
  const gen = async () => {
    setLoading(true);
    try { const r = await callAI(`أنشئ خطة مذاكرة مفصّلة.\nالمدة: ${days} أيام\nساعات يومياً: ${hours}\nقسّم المحتوى على الأيام مع نصائح.\n\nالمحتوى:\n${content}`, 'أنت أبو فهد، مساعد دراسي متخصص بخطط المذاكرة.'); setPlan(r); } catch { setPlan('صار خطأ، جرب مرة ثانية.'); }
    setLoading(false);
  };
  return (
    <Wrap title="خطة المذاكرة 📅" subtitle="أبو فهد ينظملك جدول مذاكرة حسب وقتك">
      {!content ? <div style={{ ...st.card, textAlign: 'center', padding: 44 }}><p style={{ color: 'var(--text-muted)' }}>ارفع محتوى أولاً</p></div> : <>
        <div style={{ ...st.card, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>عدد الأيام</label>
              <input className="abu-inp" type="number" min={1} max={30} value={days} onChange={e => setDays(+e.target.value)} style={st.inp} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>ساعات يومياً</label>
              <input className="abu-inp" type="number" min={1} max={12} value={hours} onChange={e => setHours(+e.target.value)} style={st.inp} />
            </div>
            <button className="abu-btn" style={st.btn} onClick={gen} disabled={loading}>{loading ? <><Spinner size={18} /> جاري الإنشاء...</> : <><Icons.Calendar s={18} /> أنشئ الخطة</>}</button>
          </div>
        </div>
        {plan && <div style={{ ...st.card, borderColor: '#ec4899', animation: 'abuSlide .4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><div style={{ color: '#ec4899' }}><Icons.Calendar s={22} /></div><h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>خطتك الدراسية</h3></div>
          <p style={{ lineHeight: 2.2, margin: 0, whiteSpace: 'pre-wrap', fontSize: 15 }}>{plan}</p>
        </div>}
      </>}
    </Wrap>
  );
}

// =============================================
// CHAT
// =============================================
function Chat({ content }) {
  const [msgs, setMsgs] = useState([{ role: 'assistant', text: 'أهلاً! أنا أبو فهد ☕\nمساعدك الدراسي الذكي — اسألني أي سؤال عن دروسك.' }]);
  const [inp, setInp] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current && (ref.current.scrollTop = ref.current.scrollHeight); }, [msgs]);
  const send = async () => {
    if (!inp.trim() || loading) return;
    const m = inp.trim(); setInp(''); setMsgs(p => [...p, { role: 'user', text: m }]); setLoading(true);
    try {
      const ctx = content ? `\n\nالمحتوى الدراسي:\n${content.substring(0, 2000)}` : '';
      const r = await callAI(m + ctx, 'أنت أبو فهد، مساعد دراسي ذكي ودود. أجب بالعربية بأسلوب مشجع ومبسط.');
      setMsgs(p => [...p, { role: 'assistant', text: r }]);
    } catch { setMsgs(p => [...p, { role: 'assistant', text: 'صار خطأ، جرب مرة ثانية.' }]); }
    setLoading(false);
  };
  return (
    <Wrap title="اسأل أبو فهد ☕" subtitle="اكتب سؤالك وأبو فهد يجاوبك فوراً">
      <div style={{ ...st.card, padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', maxHeight: 580 }}>
        <div ref={ref} style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-start' : 'flex-end' }}>
              <div style={{ maxWidth: '80%', padding: '13px 16px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? 'var(--pri)' : 'var(--bg-card-alt)', color: m.role === 'user' ? '#000' : 'var(--text)', lineHeight: 1.9, fontSize: 14, whiteSpace: 'pre-wrap', fontWeight: m.role === 'user' ? 600 : 400, animation: 'abuSlide .25s ease-out' }}>{m.text}</div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ padding: '13px 20px', borderRadius: '14px 14px 14px 4px', background: 'var(--bg-card-alt)' }}><Spinner size={16} /></div></div>}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', padding: 14, display: 'flex', gap: 10 }}>
          <input className="abu-inp" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="اكتب سؤالك هنا..." style={{ ...st.inp, flex: 1 }} />
          <button className="abu-btn" onClick={send} style={{ ...st.btn, padding: '12px 16px', opacity: inp.trim() ? 1 : .4 }}><Icons.Send s={20} /></button>
        </div>
      </div>
    </Wrap>
  );
}

// =============================================
// MAIN APP
// =============================================
export default function App() {
  const [page, setPage] = useState(PAGES.LANDING);
  const [content, setContent] = useState('');
  const [stats, setStats] = useState({ files: 0, summaries: 0, quizzes: 0, flashcards: 0 });
  const sb = page !== PAGES.LANDING;

  return (
    <div>
      {sb && <Sidebar cur={page} go={setPage} />}
      <div style={{ marginRight: sb ? 210 : 0, transition: 'margin .3s' }}>
        {page === PAGES.LANDING && <Landing go={setPage} />}
        {page === PAGES.DASHBOARD && <Dashboard go={setPage} stats={stats} />}
        {page === PAGES.UPLOAD && <Upload onUpload={t => { setContent(t); setStats(s => ({ ...s, files: s.files + 1 })); setPage(PAGES.DASHBOARD); }} />}
        {page === PAGES.SUMMARY && <Summary content={content} onDone={() => setStats(s => ({ ...s, summaries: s.summaries + 1 }))} />}
        {page === PAGES.QUIZ && <Quiz content={content} onDone={() => setStats(s => ({ ...s, quizzes: s.quizzes + 1 }))} />}
        {page === PAGES.FLASHCARDS && <Flashcards content={content} onDone={n => setStats(s => ({ ...s, flashcards: s.flashcards + n }))} />}
        {page === PAGES.STUDY_PLAN && <StudyPlan content={content} />}
        {page === PAGES.CHAT && <Chat content={content} />}
      </div>
    </div>
  );
}
