import { useId } from 'react';

function Avatar({ isSupervisor = false }: { isSupervisor?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className={`person-avatar${isSupervisor ? ' is-supervisor' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 80 80" width="80" height="80" focusable="false">
        <defs>
          <linearGradient id={`pa-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#51EDC8" />
            <stop offset="1" stopColor="#EEEEEF" />
          </linearGradient>
          <clipPath id={`pc-${id}`}><circle cx="40" cy="40" r={isSupervisor ? 31 : 38} /></clipPath>
        </defs>
        {isSupervisor && (
          <>
            <circle cx="40" cy="40" r="39" fill="none" stroke="#51EDC8" strokeWidth="2" />
            <circle cx="40" cy="40" r="34.5" fill="none" stroke="#1D2254" strokeWidth="2" />
          </>
        )}
        <circle cx="40" cy="40" r={isSupervisor ? 31 : 38} fill={`url(#pa-${id})`} />
        <g clipPath={`url(#pc-${id})`} fill="#1D2254">
          <circle cx="40" cy="33" r="12" />
          <path d="M16 74c0-14 10.7-23 24-23s24 9 24 23v6H16Z" />
        </g>
      </svg>
      {isSupervisor && (
        <svg className="person-avatar-badge" viewBox="0 0 24 24" width="26" height="26" focusable="false">
          <circle cx="12" cy="12" r="12" fill="#1D2254" />
          <path d="M12 5.2 17 7v4.1c0 3.2-2.1 5.6-5 7-2.9-1.4-5-3.8-5-7V7Z" fill="#51EDC8" />
          <path d="m9.6 11.6 1.7 1.7 3.2-3.4" fill="none" stroke="#1D2254" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export default function PersonAvatar() {
  return <Avatar />;
}

export function SupervisorAvatar() {
  return <Avatar isSupervisor />;
}
