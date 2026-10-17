const esafetyPrivacyUrl = 'https://www.esafety.gov.au/parents/issues-and-advice/privacy-child';
const ic3PrivacyUrl = 'https://www.ic3.gov/PSA/2023/psa230605';

export const postChecklistGroups = [
  {
    heading: 'ما تُظهره الصورة',
    questions: [
      {
        id: 1,
        question: 'هل خلت الصورة والنص المصاحب لها من اسم طفلي الكامل ومن أي بيانات تواصل؟',
        advice: 'احذف الاسم الكامل وبيانات التواصل قبل النشر.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
      {
        id: 2,
        question: 'هل خلت الصورة مما يدل على مدرسته أو بيتكم أو مكان تواجده المعتاد (مثل الزي المدرسي أو واجهة المنزل)؟',
        advice: 'ابتعد عن نشر صور تظهر الزي المدرسي أو المكان أو المواعيد التي تعرّف بمكانه.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
      {
        id: 3,
        question: 'هل خلا المنشور من جدول أنشطة طفلي وروتينه ومكان وجوده الآن؟',
        advice: 'احذف تفاصيل المكان والروتين وجداول الأنشطة من النص والصورة.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
      {
        id: 4,
        question: 'هل أيقنت أن خدمة الموقع معطّلة في الكاميرا والتطبيقات التي لا تحتاجها؟',
        advice: 'عطّل تحديد الموقع للتطبيقات التي لا تحتاجه، وراجع بيانات الصورة (metadata) قبل نشرها، فمعظم الصور الرقمية تحمل الوقت والتاريخ وإحداثيات المكان.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
    ],
  },
  {
    heading: 'مع من تُشارَك',
    questions: [
      {
        id: 5,
        question: 'هل حسابي مضبوط على أعلى إعدادات الخصوصية، ومتابعوه أشخاص أعرفهم وأثق بهم؟',
        advice: 'اجعل الحساب خاصًا، وراجع قائمة المتابعين وأزل من لا تعرفه أو لا تثق به.',
        sourceLabel: 'IC3 — تنبيه I-060523-PSA',
        sourceUrl: ic3PrivacyUrl,
      },
      {
        id: 6,
        question: 'هل فكّرت في إرسالها في رسالة خاصة أو مجموعة مغلقة بدل نشرها على الحساب؟',
        advice: 'شاركها مع من تقصدهم فقط عبر رسالة خاصة أو مجموعة مغلقة.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
      {
        id: 7,
        question: 'هل خلت الصورة من أطفال آخرين، أو استأذنت أهاليهم إن وُجدوا؟',
        advice: 'اسأل أهالي الأطفال قبل نشر الصورة أو مشاركتها أو وضع علامة عليهم فيها.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
    ],
  },
  {
    heading: 'قبل النشر',
    questions: [
      {
        id: 8,
        question: 'هل سألت طفلي إن كان يرغب في نشرها وأخذت برأيه؟',
        advice: 'اشرح له لماذا تريد نشرها واسأله هل يوافق؛ وإن فضّل ألا تنشرها فاحترم قراره.',
        sourceLabel: 'eSafety — الخصوصية وطفلك',
        sourceUrl: esafetyPrivacyUrl,
      },
      {
        id: 9,
        question: 'هل أقبل أن تبقى هذه الصورة متاحة للنسخ والتعديل، مع أن سحبها بعد انتشارها قد يكون صعبًا؟',
        advice: 'لا تنشرها، أو شاركها مع من تثق بهم فقط بشكل خاص. المصدر يحذّر من أن الصور يمكن نسخها وتعديلها دون موافقة أصحابها.',
        sourceLabel: 'IC3 — تنبيه I-060523-PSA',
        sourceUrl: ic3PrivacyUrl,
      },
      {
        id: 10,
        question: 'هل راجعت سياسة الخصوصية للمنصة التي أرفع عليها (ماذا تفعل بالمحتوى وكم تحتفظ به)؟',
        advice: 'راجع سياسات الخصوصية ومشاركة البيانات والاحتفاظ بها في المنصة قبل رفع أي محتوى.',
        sourceLabel: 'IC3 — تنبيه I-060523-PSA',
        sourceUrl: ic3PrivacyUrl,
      },
    ],
  },
] as const;

export const postChecklistCopy = {
  pageTitle: 'قبل أن تنشر',
  yes: 'نعم',
  no: 'لا',
  reset: 'إعادة القائمة',
  summaryPending: (answered: number) => `أجبت عن ${answered} من 10.`,
  resultAllYes: 'أجبت بنعم على الأسئلة كلها. هذا يقلل المخاطر لكنه لا يلغيها. القرار لك.',
  resultNeedsEdits: 'قبل أن تنشر، عدّل هذه النقاط:',
  afterEditing: 'بعد التعديل، أعد القائمة.',
  sources: 'المصادر: هيئة eSafety الأسترالية، ومركز IC3 التابع لمكتب التحقيقات الفيدرالي الأمريكي.',
} as const;
