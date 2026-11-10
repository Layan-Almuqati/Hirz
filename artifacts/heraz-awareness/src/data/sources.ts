export type SourceRecord = {
  id: string;
  page: string;
  title: string;
  publisher: string;
  year: string;
  url: string;
  lastChecked: string;
};

export const sources: SourceRecord[] = [
  {
    id: 'gao-deepfakes',
    page: 'افهم',
    title: 'Science & Tech Spotlight: Deepfakes',
    publisher: 'U.S. Government Accountability Office',
    year: '2020',
    url: 'https://www.gao.gov/products/gao-20-379sp',
    lastChecked: '',
  },
  {
    id: 'sdaia-deepfake-guidelines',
    page: 'افهم',
    title: 'مبادئ التزييف العميق',
    publisher: 'سدايا',
    year: '',
    url: 'https://sdaia.gov.sa/ar/SDAIA/eParticipation/consulting/SDAIADeepfakesGuidelinesAr.pdf',
    lastChecked: '',
  },
  {
    id: 'ftc-family-emergency',
    page: 'افهم',
    title: 'Scammers Use AI to Enhance Their Family Emergency Schemes',
    publisher: 'Federal Trade Commission',
    year: '2023',
    url: 'https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes',
    lastChecked: '',
  },
  {
    id: 'hrw-brazil-photos',
    page: 'افهم',
    title: 'Children’s Personal Photos Misused by Powerful AI Tools',
    publisher: 'Human Rights Watch',
    year: '2024',
    url: 'https://www.hrw.org/news/2024/06/10/brazil-childrens-personal-photos-misused-power-ai-tools',
    lastChecked: '',
  },
  {
    id: 'ic3-generative-ai',
    page: 'افهم',
    title: 'Public Service Announcement I-060523-PSA',
    publisher: 'FBI Internet Crime Complaint Center (IC3)',
    year: '2023',
    url: 'https://www.ic3.gov/PSA/2023/psa230605',
    lastChecked: '',
  },
  {
    id: 'sdaia-deepfake-study',
    page: 'المخاطر',
    title: 'Deepfake Study',
    publisher: 'سدايا',
    year: '',
    url: 'https://sdaia.gov.sa/ar/MediaCenter/KnowledgeCenter/ResearchLibrary/DeepfakeStudy.pdf',
    lastChecked: '',
  },
  {
    id: 'unicef-deepfake-abuse',
    page: 'المخاطر',
    title: 'Deepfake abuse is abuse',
    publisher: 'UNICEF',
    year: '2026',
    url: 'https://www.unicef.org/asia-pacific/press-releases/deepfake-abuse-abuse',
    lastChecked: '',
  },
  {
    id: 'hrw-australia-photos',
    page: 'المخاطر',
    title: 'Australia: Children’s Personal Photos Misused by Powerful AI Tools',
    publisher: 'Human Rights Watch',
    year: '2024',
    url: 'https://hrw.org/news/2024/07/03/australia-childrens-personal-photos-misused-power-ai-tools',
    lastChecked: '',
  },
  {
    id: 'iwf-2026-warning',
    page: 'المخاطر',
    title: 'More AI-generated child sexual abuse images found in the first six months of 2026 than all of 2025',
    publisher: 'Internet Watch Foundation',
    year: '2026',
    url: 'https://www.iwf.org.uk/news-media/news/more-ai-generated-child-sexual-abuse-images-found-in-the-first-six-months-of-2026-than-all-of-2025-iwf-warns',
    lastChecked: '',
  },
  {
    id: 'iwf-2025-report',
    page: 'المخاطر',
    title: 'Annual Data & Insights Report 2025: Emerging and Persistent Harms',
    publisher: 'Internet Watch Foundation',
    year: '2025',
    url: 'https://www.iwf.org.uk/annual-data-insights-report-2025/emerging-and-persistent-harms/ai-generated-child-sexual-abuse-material',
    lastChecked: '',
  },
  {
    id: 'esafety-child-privacy',
    page: 'قبل أن تنشر',
    title: 'Privacy and your child',
    publisher: 'eSafety Commissioner',
    year: '',
    url: 'https://www.esafety.gov.au/parents/issues-and-advice/privacy-child',
    lastChecked: '',
  },
  {
    id: 'thorn-youth-research',
    page: 'اختبر وعيك',
    title: 'Deepfake nudes are a harmful reality for youth: new research from Thorn',
    publisher: 'Thorn',
    year: '2025',
    url: 'https://www.thorn.org/blog/deepfake-nudes-are-a-harmful-reality-for-youth-new-research-from-thorn/',
    lastChecked: '',
  },
  {
    id: 'mygov-cybercrime-reports',
    page: 'اختبر وعيك',
    title: 'بلاغات الجرائم المعلوماتية',
    publisher: 'المنصة الوطنية الموحدة',
    year: '',
    url: 'https://my.gov.sa/ar/services/398352',
    lastChecked: '',
  },
  {
    id: 'uqn-personal-data-regulation',
    page: 'التشريعات',
    title: 'اللائحة التنفيذية لنظام حماية البيانات الشخصية',
    publisher: 'جريدة أم القرى',
    year: '',
    url: 'https://www.uqn.gov.sa/details?p=23595',
    lastChecked: '',
  },
  {
    id: 'okaz-child-protection',
    page: 'التشريعات',
    title: 'نظام حماية الطفل',
    publisher: 'عكاظ',
    year: '',
    url: 'https://www.okaz.com.sa/news/local/2170629',
    lastChecked: '',
  },
  {
    id: 'kfu-cybercrime-law',
    page: 'التشريعات',
    title: 'نظام مكافحة جرائم المعلوماتية',
    publisher: 'KFU',
    year: '',
    url: 'https://www.kfu.edu.sa/ar/Deans/it/Documents/%D8%A8%D8%B4%D8%A3%D9%86%20%D9%86%D8%B8%D8%A7%D9%85%20%D9%85%D9%83%D8%A7%D9%81%D8%AD%D8%A9%20%D8%AC%D8%B1%D8%A7%D8%A6%D9%85%20%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D8%A9%20-%20Fighting%20Law%20against%20IT%20crimes.pdf',
    lastChecked: '',
  },
  {
    id: 'hrsd-child-protection',
    page: 'التشريعات',
    title: 'نظام حماية الطفل',
    publisher: 'وزارة الموارد البشرية والتنمية الاجتماعية',
    year: '',
    url: 'https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/regulation-and-procedures/%D9%86%D8%B8%D8%A7%D9%85-%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D9%81%D9%84',
    lastChecked: '',
  },
  {
    id: 'hrsd-family-violence',
    page: 'التشريعات',
    title: 'خدمة بلاغات العنف الأسري',
    publisher: 'وزارة الموارد البشرية والتنمية الاجتماعية',
    year: '',
    url: 'https://www.hrsd.gov.sa/ar/ministry-services/services/1155125',
    lastChecked: '',
  },
  {
    id: 'pdpl-qadha-copy',
    page: 'اختبر وعيك',
    title: 'نظام حماية البيانات الشخصية ولائحته التنفيذية',
    publisher: 'قضاء',
    year: '',
    url: 'https://qadha.org.sa/files/shares/%D9%86%D8%B8%D8%A7%D9%85%20%D8%AD%D9%85%D8%A7%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9%20%D9%88%D9%84%D9%88%D8%A7%D8%A6%D8%AD%D9%87%20%D8%A7%D9%84%D8%AA%D9%86%D9%81%D9%8A%D8%B0%D9%8A%D8%A9.pdf',
    lastChecked: '',
  },
];

export function findSourceByUrl(url: string) {
  return sources.find((source) => source.url === url);
}

export function findSourceById(id: string) {
  return sources.find((source) => source.id === id);
}
