import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/config';
import * as Flags from 'country-flag-icons/react/3x2';
import { Link } from 'react-router-dom';

function Flag({className, code}: {className?: string, code: string}) {
  const upperCode = code.toUpperCase();
  const fixedCode = upperCode === `EN` ? `GB` : upperCode;

  const FlagComponent = Flags[fixedCode as keyof typeof Flags];
  return <FlagComponent className={className} />;
}

export function MenuItem({icon, to, onClick, children}: {icon: React.ReactNode, to?: string, onClick?: () => void, children: React.ReactNode}) {
  const contents = (
    <div className="flex items-center select-none">
      <div className={`w-6 mr-2 text-center`}>{icon}</div>
      <div>{children}</div>
    </div>
  );

  const className = `flex bg-white/60 hover:bg-white rounded shadow px-2 py-1 cursor-pointer items-baseline`;

  const render = to
    ? to.startsWith(`https://`)
      ? <a className={className} href={to} target={`_blank`}>{contents}</a>
      : <Link className={className} to={to}>{contents}</Link>
    : <div className={className} onClick={onClick}>{contents}</div>;

  return render;
}

export function SideMenu({children}: {children?: React.ReactNode}) {
  const { i18n, t } = useTranslation();

  return (
    <div className="lg:absolute top-4 left-4 z-50 flex flex-col items-start space-y-2">
      {children}
      {SUPPORTED_LANGUAGES.map((language) => (
        <MenuItem key={language} icon={<Flag className={`h-3`} code={language} />} onClick={() => i18n.changeLanguage(language)}>
          {t(`language.name`, {lng: language})}
        </MenuItem>
      ))}
    </div>
  );
} 