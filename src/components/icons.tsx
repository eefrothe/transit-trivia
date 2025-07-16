import React from 'react';

type IconProps = {
  className?: string;
  title?: string;
};

const BaseIcon: React.FC<IconProps & React.SVGProps<SVGSVGElement>> = ({ className, title, children, ...props }) => (
  <svg
    className={className}
    aria-hidden={!title}
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);

// --- Icons ---

export const CheckIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </BaseIcon>
);

export const XIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </BaseIcon>
);

export const CrownIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M18.97 18.251a2.25 2.25 0 01-2.22 2.499H7.25a2.25 2.25 0 01-2.22-2.5A20.183 20.183 0 018.816 6.01L6 3.193V3a.75.75 0 011.5 0v.193l2.816 2.817a20.184 20.184 0 012.368 0L15.5 3.193V3a.75.75 0 011.5 0v.193l-2.816 2.817a20.183 20.183 0 013.786 12.24z"
      clipRule="evenodd"
    />
  </BaseIcon>
);

export const TrainIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2c-4.42 0-8 .5-8 4v10c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0h5V6h-5v4zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </BaseIcon>
);

export const ShareIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </BaseIcon>
);

export const BrainIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7h3A2.5 2.5 0 0 0 20 4.5v0A2.5 2.5 0 0 0 17.5 2Z" />
    <path d="M6.5 15.5A2.5 2.5 0 0 1 4 13v0a2.5 2.5 0 0 1 2.5-2.5H10a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5Z" />
    <path d="M17.5 15.5A2.5 2.5 0 0 0 20 13v0a2.5 2.5 0 0 0-2.5-2.5H14a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5Z" />
    <path d="M9 7.5c0 2.5 2 4.5 5 4.5h0c3 0 5-2 5-4.5" />
    <path d="M15 7.5c0-2.5-2-4.5-5-4.5h0c-3 0-5 2-5 4.5" />
    <path d="M9 15.5v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
  </BaseIcon>
);

export const SpeakerOnIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </BaseIcon>
);

export const SpeakerOffIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </BaseIcon>
);

export const HintIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v.01M9 15.75a3 3 0 116 0v1.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a4.5 4.5 0 014.5 4.5a.75.75 0 01-1.5 0A3 3 0 0012 5.25a3 3 0 00-3 3a.75.75 0 01-1.5 0A4.5 4.5 0 0112 3.75z" />
  </BaseIcon>
);

export const DoublePointsIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} {...props}>
    <text x="50%" y="52%" dominantBaseline="central" textAnchor="middle" fontSize="11" fontWeight="bold">2x</text>
  </BaseIcon>
);

export const SkipIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
  </BaseIcon>
);

export const UserGroupIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.226A3 3 0 0113.12 16.51M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m8-10a4 4 0 11-8 0 4 4 0 018 0z" />
  </BaseIcon>
);

export const HomeIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </BaseIcon>
);

export const LogoutIcon = (props: IconProps) => (
  <BaseIcon viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </BaseIcon>
);
