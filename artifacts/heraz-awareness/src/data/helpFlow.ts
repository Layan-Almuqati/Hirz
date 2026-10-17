export const helpFlowLinks = {
  helpPage: {
    href: '/protect/help',
    lastVerified: '2026-10-17',
  },
  protectPage: {
    href: '/protect',
    lastVerified: '2026-10-17',
  },
  kollonaAmnGooglePlay: {
    href: 'https://play.google.com/store/apps/details?id=sa.gov.moi.securityinform',
    lastVerified: '2026-10-17',
  },
  kollonaAmnAppStore: {
    href: 'https://apps.apple.com/us/app/%D9%83%D9%84%D9%86%D8%A7-%D8%A3%D9%85%D9%86/id1085635249',
    lastVerified: '2026-10-17',
  },
  officialServicePage: {
    href: 'https://my.gov.sa/ar/services/398352',
    lastVerified: '2026-10-17',
  },
  personalDataComplaint: {
    href: 'https://dgp.sdaia.gov.sa/wps/myportal/pdp/eservices/complaints',
    lastVerified: '2026-10-17',
  },
  emergency911: {
    href: 'tel:911',
    phoneNumber: '911',
    lastVerified: '2026-10-17',
  },
} as const;

export const helpFlowCopy = {
  entryTitle: 'حصل لي موقف الآن؟',
  pageTitle: 'ماذا حدث؟',
  subtitle: 'اختر أقرب حالة، وسنرتب لك الخطوات.',
  officialServiceLink: 'صفحة الخدمة الرسمية',
  kollonaPrimary: 'قدّم البلاغ في كلنا أمن',
  googlePlay: 'Google Play',
  appStore: 'App Store',
  kollonaInstructions: 'التقديم داخل التطبيق: سجّل الدخول، ثم اختر تصنيف الجريمة، ثم التصنيف الفرعي، ثم أضف الوصف والمرفقات وأرسل.',
  kollonaUnavailable: 'لا يوجد لديك التطبيق؟ حمّله من الرابط ثم قدّم البلاغ داخله.',
  sdaiaUnavailable: 'الخدمة تتطلب حساب أبشر.',
  absherNeeded: 'تحتاج حساب أبشر',
  progress: (step: number, total: number) => `الخطوة ${step} من ${total}`,
  next: 'التالي',
  back: 'رجوع',
  unable: 'لم أتمكن',
  complete: 'تمّت',
  returnConfirmation: 'هل أتممت هذه الخطوة؟',
  endTitle: 'أتممت الخطوات المطلوبة',
  endMessage: 'تتابع الجهات المختصة بلاغك. المدة المعلنة لخدمة بلاغات الجرائم المعلوماتية 10 أيام عمل.',
  secureAccounts: 'حصّن حساباتك',
  startAgain: 'ابدأ من جديد',
  permanentNote: 'منصة حِرز توعوية وليست جهة بلاغات. الأزرار تفتح خدمات الجهات الرسمية.',
} as const;

export type HelpAction = 'kollona-amn' | 'emergency-911' | 'sdaia-complaint';

export type HelpCase = {
  number: 1 | 2 | 3 | 4;
  title: string;
  steps: { text: string; action?: HelpAction }[];
  showEndMessage: boolean;
};

export const helpCases: HelpCase[] = [
  {
    number: 1,
    title: 'وجدت صورة أو فيديو مزيّفًا لطفلي',
    steps: [
      { text: 'وثّق المحتوى: احفظ الرابط ولقطة الشاشة والتاريخ واسم المنصة.' },
      { text: 'بلّغ المنصة من داخل تطبيقها واطلب الإزالة.' },
      { text: 'قدّم بلاغًا رسميًا.', action: 'kollona-amn' },
    ],
    showEndMessage: true,
  },
  {
    number: 2,
    title: 'اتصل بي أحد بصوت يشبه صوت طفلي',
    steps: [
      { text: 'إذا لم تستطع التأكد من سلامة طفلك الآن.', action: 'emergency-911' },
      { text: 'أنهِ المكالمة، واتصل بطفلك أو بمن معه على رقم تعرفه.' },
      { text: 'إن اتفقتم مسبقًا على كلمة سر عائلية، اسأل عنها.' },
      { text: 'بعد أن تتأكد، قدّم بلاغًا رسميًا.', action: 'kollona-amn' },
    ],
    showEndMessage: true,
  },
  {
    number: 3,
    title: 'أحد يهددني بمحتوى مزيّف عن طفلي',
    steps: [
      { text: 'وثّق الرسائل واسم الحساب والتاريخ والمنصة.' },
      { text: 'بلّغ المنصة من داخل تطبيقها.' },
      { text: 'قدّم بلاغًا رسميًا.', action: 'kollona-amn' },
    ],
    showEndMessage: true,
  },
  {
    number: 4,
    title: 'وجدت صور طفلي منشورة عند غيري',
    steps: [
      { text: 'وثّق الرابط ولقطة الشاشة وتاريخ النشر.' },
      { text: 'اطلب الإزالة من المنصة.' },
      { text: 'إذا نُشرت صور طفلك للعموم دون إذنك، يمكنك تقديم شكوى.', action: 'sdaia-complaint' },
    ],
    showEndMessage: false,
  },
];

export function getKollonaAmnPrimaryHref(userAgent: string): string {
  if (/android/i.test(userAgent)) return helpFlowLinks.kollonaAmnGooglePlay.href;
  if (/iPhone|iPad|iPod/i.test(userAgent)) return helpFlowLinks.kollonaAmnAppStore.href;
  return helpFlowLinks.officialServicePage.href;
}
