'use client';

import LinkWithTransition from 'components/link-with-transition';
import LogoSquare from 'components/logo-square';
import { usePathname } from 'next/navigation';

const { SITE_NAME } = process.env;

export default function FooterLogo() {
  const pathname = usePathname();
  
  if (pathname === '/') {
    return (
      <div className="flex items-center gap-2 text-black md:pt-1 dark:text-white cursor-default">
        <LogoSquare size="sm" />
        <span className="uppercase">{SITE_NAME}</span>
      </div>
    );
  }
  
  return (
    <LinkWithTransition className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
      <LogoSquare size="sm" />
      <span className="uppercase">{SITE_NAME}</span>
    </LinkWithTransition>
  );
}

