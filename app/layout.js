import './globals.css';

export const metadata = {
  title: 'ذاكر مع أبو فهد — مساعدك الدراسي الذكي',
  description: 'لخّص دروسك، اختبر نفسك، راجع بالفلاش كاردز، وخطط مذاكرتك — كل هذا بالذكاء الاصطناعي',
  keywords: 'مذاكرة, دراسة, ذكاء اصطناعي, تلخيص, اختبارات, فلاش كاردز',
  openGraph: {
    title: 'ذاكر مع أبو فهد ☕',
    description: 'القهوة عليك والمذاكرة علينا — مساعدك الدراسي بالذكاء الاصطناعي',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Readex+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
