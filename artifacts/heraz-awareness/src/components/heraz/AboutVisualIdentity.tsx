import './about-visual-identity.css';

const identityRows = [
  { label: 'الشعار:', text: 'درع وعناصر متداخلة ترمز إلى التكامل بين الإنسان والتقنية.' },
  { label: 'الأزرق الداكن:', text: 'الثقة والاستقرار.' },
  { label: 'الأخضر الفيروزي:', text: 'الابتكار والتجدد والتطلع للمستقبل.' },
] as const;

export default function AboutVisualIdentity() {
  return (
      <div className="about-identity-copy">
        <p data-testid="text-about-visual-identity">هوية «حرز» تجسّد الأمان والحماية والثقة والوعي الرقمي.</p>
        <ul className="about-identity-rows" role="list">
          {identityRows.map((row) => (
            <li key={row.label}>
              <span className="about-identity-marker" aria-hidden="true" />
              <p><strong>{row.label}</strong>{' '}{row.text}</p>
            </li>
          ))}
        </ul>
      </div>
  );
}
