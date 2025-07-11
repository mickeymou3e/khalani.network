import React from 'react';
import Link from 'next/link';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import s from './FooterSocialIcons.module.scss';

const socialLinksData = [
  {
    name: 'Github',
    href: 'https://github.com/tplr-ai/templar',
    icon: <FaGithub />,
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/N5xgygBJ9r',
    icon: <FaDiscord />,
  },
  {
    name: 'X',
    href: 'https://x.com/tplr_ai',
    icon: <FaXTwitter />,
  },
];

const FooterSocialIcons = () => {
  return (
    <div className={s.footerSocialIconsContainer}>
      {socialLinksData.map(social => (
        <Link 
          href={social.href} 
          key={social.name} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={s.socialIconLink} 
          aria-label={social.name}
        >
          {social.icon}
        </Link>
      ))}
    </div>
  );
};

export default FooterSocialIcons; 