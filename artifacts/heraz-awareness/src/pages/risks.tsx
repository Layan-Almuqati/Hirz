import { Link } from 'wouter';
import { PageHeader } from '@/components/heraz/layout';
import { BidiText } from '@/components/heraz/BidiText';
import { SourceReference } from '@/components/heraz/SourceMarker';

const sources = {
  sdaia: 'https://sdaia.gov.sa/ar/MediaCenter/KnowledgeCenter/ResearchLibrary/DeepfakeStudy.pdf',
  unicef: 'https://www.unicef.org/asia-pacific/press-releases/deepfake-abuse-abuse',
  hrwBrazil: 'https://www.hrw.org/news/2024/06/10/brazil-childrens-personal-photos-misused-power-ai-tools',
  hrwAustralia: 'https://hrw.org/news/2024/07/03/australia-childrens-personal-photos-misused-power-ai-tools',
  ic3: 'https://www.ic3.gov/PSA/2023/psa230605',
  iwfStatement: 'https://www.iwf.org.uk/news-media/news/more-ai-generated-child-sexual-abuse-images-found-in-the-first-six-months-of-2026-than-all-of-2025-iwf-warns',
  iwfReport: 'https://www.iwf.org.uk/annual-data-insights-report-2025/emerging-and-persistent-harms/ai-generated-child-sexual-abuse-material',
} as const;

const riskSourceNumbers: Record<string, number> = {
  'https://sdaia.gov.sa/ar/MediaCenter/KnowledgeCenter/ResearchLibrary/DeepfakeStudy.pdf': 1,
  'https://www.unicef.org/asia-pacific/press-releases/deepfake-abuse-abuse': 2,
  'https://www.hrw.org/news/2024/06/10/brazil-childrens-personal-photos-misused-power-ai-tools': 3,
  'https://hrw.org/news/2024/07/03/australia-childrens-personal-photos-misused-power-ai-tools': 4,
  'https://www.ic3.gov/PSA/2023/psa230605': 5,
  'https://www.iwf.org.uk/news-media/news/more-ai-generated-child-sexual-abuse-images-found-in-the-first-six-months-of-2026-than-all-of-2025-iwf-warns': 6,
  'https://www.iwf.org.uk/annual-data-insights-report-2025/emerging-and-persistent-harms/ai-generated-child-sexual-abuse-material': 7,
};

function ExternalSourceLink({ href }: { href: string; children?: React.ReactNode }) {
  const number = riskSourceNumbers[href] ?? 1;
  return <SourceReference url={href} number={number} testId={`link-risk-source-${number}`} />;
}

function SourceLine({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-7 text-[var(--navy)]">{children}</p>;
}

function RiskCard({
  number,
  title,
  children,
  source,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  source: React.ReactNode;
}) {
  return (
    <article className="page-card h-full">
      <div className="mb-4 flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--turquoise)] font-bold text-[var(--navy)]"
        >
          {number}
        </span>
        <h3 className="heading-font pt-1 text-xl leading-[1.6]">{title}</h3>
      </div>
      <p className="text-[1.0625rem] leading-[1.9]">
        {typeof children === 'string' ? <BidiText text={children} /> : children}
      </p>
      <SourceLine>{source}</SourceLine>
    </article>
  );
}

function RisksPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="page-wrap min-h-[56vh] py-10 sm:py-16 animate-in fade-in-0 duration-500"
      data-testid="page-risks"
    >
      <PageHeader
        title="المخاطر"
        description="لماذا يتزايد الخطر، وما أثره على الأطفال، وما الذي قد يبقى بعد النشر."
      />

      <section aria-labelledby="risks-grow-heading" className="mb-12">
        <h2 id="risks-grow-heading" className="section-title heading-font mb-5 text-2xl">
          لماذا يكبر الخطر؟
        </h2>
        <div className="page-card">
          <p className="max-w-[70ch] text-[1.0625rem] leading-[1.9]">
            <BidiText text="لم تعد صناعة محتوى مزيّف تحتاج خبرة عالية. تذكر دراسة سدايا أنها أدواته سهلة الوصول ولا تتطلب خبرة تقنية عالية أو موارد مالية كبيرة. وتشير الدراسة إلى أن التقدم التقني السريع لم يواكبه تطور تنظيمي كافٍ، مما أتاح بيئة غير محوكمة قد تزيد من مخاطر هذه التقنية. ومن استخداماتها الضارة انتحال الهوية والاحتيال والابتزاز. ولا يزال اكتشافها تحديًا لأنها تتطور باستمرار." />
          </p>
        </div>
        <SourceLine>
          المصدر: سدايا، «
          <ExternalSourceLink href={sources.sdaia}>التزييف العميق: المخاطر والفرص المحتملة</ExternalSourceLink>
          »، يوليو 2025.
        </SourceLine>
      </section>

      <section aria-labelledby="children-heading" className="mb-12">
        <h2 id="children-heading" className="section-title heading-font mb-5 text-2xl">
          ما علاقة ذلك بالأطفال؟
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="page-card h-full" data-testid="card-child-risk-1">
            <div className="mb-4 flex items-start gap-4">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--navy)] font-bold text-white">١</span>
              <h3 className="heading-font pt-1 text-xl leading-[1.6]">التنمر الإلكتروني</h3>
            </div>
            <p className="max-w-[70ch] text-[1.0625rem] leading-[1.9]">
              تذكر دراسة سدايا أن المخاوف تتزايد من إساءة استخدام التزييف العميق خصوصًا في المحتوى الموجه للأطفال، وأنه يمكن أن يُستخدم في التنمر الإلكتروني بما يسبب أضرارًا نفسية بالغة للقاصرين.
            </p>
          </article>
          <article className="page-card h-full" data-testid="card-child-risk-2">
            <div className="mb-4 flex items-start gap-4">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--navy)] font-bold text-white">٢</span>
              <h3 className="heading-font pt-1 text-xl leading-[1.6]">ما رصدته اليونيسف</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-start md:gap-6">
              <p className="heading-font text-3xl font-bold leading-tight text-[var(--navy)]">1.2 مليون</p>
              <p className="max-w-[70ch] text-[1.0625rem] leading-[1.9]">
                وفي دراسة ميدانية لليونيسف (فبراير 2026)، أفاد ما لا يقل عن 1.2 مليون طفل أن صورهم عُدّلت إلى صور مزيّفة ذات طابع جنسي صريح خلال العام الماضي، في 11 دولة شملتها الدراسة. وفي بعض هذه الدول يعادل ذلك طفلًا من كل 25 طفلًا. شملت الدراسة أطفالًا من 12 إلى 17 سنة يستخدمون الإنترنت.
              </p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--navy)]/70">
              <BidiText text="النطاق: مسوح أسرية ممثلة وطنيًا نفّذتها اليونيسف وإبسوس في 11 دولة لم تسمّها النشرة، بنحو ألف طفل وألف ولي أمر في كل دولة، ضمن مشروع Disrupting Harm المرحلة الثانية. لا تتضمن النشرة تعميمًا على المملكة." />
            </p>
          </article>
        </div>
        <SourceLine>
          المصادر:{' '}
          <ExternalSourceLink href={sources.sdaia}>سدايا</ExternalSourceLink>
          {' (قسم «التأثير على القُصَّر»، صفحة 29)، '}
          <ExternalSourceLink href={sources.unicef}>اليونيسف</ExternalSourceLink>
          <BidiText text=" «Deepfake abuse is abuse» (4 فبراير 2026)." />
        </SourceLine>
      </section>

      <section aria-labelledby="long-term-heading" className="mb-12">
        <h2 id="long-term-heading" className="section-title heading-font mb-3 text-2xl">
          ماذا عن الأثر بعيد المدى؟
        </h2>
        <p className="mb-5 text-[1.0625rem] leading-[1.9] text-[var(--navy)]/80">
          ما يلي مما تذكره المصادر الموثقة فقط.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <RiskCard
            number={1}
            title="الصورة التي تُنشر اليوم قد تُستخدم بعد سنوات."
            source={
              <>
                هيومن رايتس ووتش،{' '}
                <ExternalSourceLink href={sources.hrwBrazil}>البرازيل</ExternalSourceLink>
                {' (يونيو 2024) و'}
                <ExternalSourceLink href={sources.hrwAustralia}>أستراليا</ExternalSourceLink>
                {' (يوليو 2024).'}
              </>
            }
          >
            أشارت هيومن رايتس ووتش إلى أن صورًا لأطفال وجدتها ضمن مجموعة بيانات لتدريب أدوات ذكاء اصطناعي كانت منشورة قبل سنوات طويلة، حتى قبل عشر سنوات من إنشائها. وفي تقرير آخر (2 يوليو 2024) وجدت المنظمة 190 صورة لأطفال أستراليين ضمن المجموعة نفسها، وذكرت أن كثيرًا منها كان منشورًا بدرجة من الخصوصية، منها مقطع «غير مدرج» على يوتيوب.
          </RiskCard>
          <RiskCard
            number={2}
            title="ما يُنشر يصعب سحبه بعد انتشاره."
            source={
              <>
                <ExternalSourceLink href={sources.ic3}>مركز IC3</ExternalSourceLink>
                <BidiText text=" (FBI)، تنبيه I-060523-PSA، 5 يونيو 2023." />
              </>
            }
          >
              <BidiText text="تذكر نشرة مركز IC3 التابع للمكتب الفيدرالي للتحقيقات (5 يونيو 2023) أن المحتوى بعد مشاركته على الإنترنت قد يصعب جدًا، بل يستحيل، إزالته بعد تداوله أو نشره من أطراف أخرى. وتذكر النشرة أن ضحايا هذه الصور المعدّلة إلى محتوى صريح يشملون أطفالًا قاصرين." />
          </RiskCard>
          <RiskCard
            number={3}
            title="قد تضعف ثقة الناس بما يرونه ويسمعونه."
            source={
              <>
                <ExternalSourceLink href={sources.sdaia}>سدايا</ExternalSourceLink>
                {'، صفحة 29.'}
              </>
            }
          >
            تذكر دراسة سدايا أنه إذا استمر تداول هذه التقنية على نطاق واسع، فقد تواجه الأجيال القادمة صعوبة في تصديق أي محتوى منشور عبر الإنترنت، وقد يصل الناس إلى مرحلة يتوقفون فيها عن تصديق أي مقطع مرئي أو صوتي حتى لو كان حقيقيًا.
          </RiskCard>
          <RiskCard
            number={4}
            title="صور الاعتداء على الأطفال المولّدة بالذكاء الاصطناعي تزداد فيما ترصده الجهات المختصة."
            source={
              <>
                <BidiText text="مؤسسة IWF،" />{' '}
                <ExternalSourceLink href={sources.iwfStatement}>بيان 5 أكتوبر 2026</ExternalSourceLink>
                {'، و'}
                <ExternalSourceLink href={sources.iwfReport}>تقريرها السنوي 2025</ExternalSourceLink>
                .
              </>
            }
          >
            <>
              <BidiText text="أعلنت مؤسسة مراقبة الإنترنت البريطانية (IWF) في 5 أكتوبر 2026 أنها رصدت في النصف الأول من 2026 صورًا واقعية المظهر مولّدة بالذكاء الاصطناعي لاعتداء على أطفال أكثر مما رصدته في 2025 كله: 6,310 صور مقابل 4,512 (زيادة 40%). وتذكر المؤسسة في تقريرها السنوي 2025 أن هذا النوع من المواد كثيرًا ما يستند إلى وجوه أو أجساد أطفال حقيقيين." />
              <span className="mt-3 block text-sm leading-7 text-[var(--navy)]/70">
                الأرقام عمّا قيّمته المؤسسة نفسها، وليست قياسًا لانتشار الظاهرة عالميًا.
              </span>
            </>
          </RiskCard>
        </div>
      </section>

      <section
        aria-label="خطوات تالية"
        className="rounded-2xl bg-[var(--navy)] p-6 text-white sm:p-8"
      >
              <p className="mb-5 max-w-[70ch] text-[1.0625rem] leading-[1.9]">
          ليس الهدف أن تخاف، بل أن تعرف ماذا تفعل. راجع قائمة «قبل أن تنشر» قبل أي صورة، وإذا حدث موقف فصفحة «احمِ» ترتّب لك الخطوات.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/before-you-post"
            data-testid="button-risks-before-you-post"
            className="primary-button min-h-11 focus-visible:outline-[var(--turquoise)]"
          >
            قبل أن تنشر
          </Link>
          <Link
            href="/protect"
            data-testid="button-risks-protect"
            className="secondary-button secondary-button-light min-h-11 focus-visible:outline-[var(--turquoise)]"
          >
            احمِ
          </Link>
        </div>
      </section>
    </main>
  );
}

export default RisksPage;
