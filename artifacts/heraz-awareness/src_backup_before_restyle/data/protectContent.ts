export const sdaiaGuidelinesPdfUrl =
  'https://sdaia.gov.sa/ar/SDAIA/eParticipation/consulting/SDAIADeepfakesGuidelinesAr.pdf';

export const protectContent = {
  pageTitle: 'احمِ هوية طفلك',
  pageDescription: 'ما تحتاجه إذا حصل موقف، وما تتفقون عليه في أسرتكم قبل أن يحصل.',
  entry: {
    title: 'حصل لي موقف الآن؟',
    text: 'اختر أقرب حالة، وسنرتب لك الخطوات.',
    button: 'ابدأ',
    href: '/protect/help?from=protect',
  },
  familyPassword: {
    title: 'اتفقوا على كلمة سر عائلية',
    text: 'في حالة موثّقة في دليل سدايا، اتصل محتال بوالدين بصوت يشبه صوت طفلهم وادّعى أنه مخطوف وطلب مالًا. كان الصوت مستنسخًا، ودفع الوالدان مبلغًا كبيرًا. بعد الحادثة نُصح الناس باستخدام كلمات رمزية خاصة بالأسرة للتحقق.',
    action: 'اتفقوا مسبقًا على كلمة لا يعرفها غيركم، واطلبوها إذا اتصل أحد يدّعي أنه طفلك أو يطلب مالًا بسرعة.',
    note: 'الحالة وردت في الدليل كمثال من دولة في جنوب آسيا.',
    source: 'المصدر: دليل سدايا، الملحق 3، المثال 12',
    sourceHref: sdaiaGuidelinesPdfUrl,
  },
} as const;
