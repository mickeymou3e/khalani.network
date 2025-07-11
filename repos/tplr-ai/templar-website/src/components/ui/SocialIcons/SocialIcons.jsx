import React, { useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import clsx from 'clsx';
import s from './SocialIcons.module.scss';

const socialLinksData = [
  {
    name: 'Github',
    href: 'https://github.com/tplr-ai/templar',
    icon: <FaGithub />,
    alwaysVisible: true,
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/N5xgygBJ9r',
    icon: <FaDiscord />,
    alwaysVisible: false,
  },
  {
    name: 'X',
    href: 'https://x.com/tplr_ai',
    icon: <FaXTwitter />,
    alwaysVisible: false,
  },
];

const SocialIcons = () => {
  const [isHovered, setIsHovered] = useState(false);

  const githubLink = socialLinksData.find(link => link.name === 'Github');
  const otherLinks = socialLinksData.filter(link => link.name !== 'Github');

  return (
    <div 
      className={s.socialIconsContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {githubLink && (
        <Link 
          href={githubLink.href} 
          key={githubLink.name} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={s.socialIconLink} // Main link for hover effect color
          aria-label={githubLink.name}
        >
          {githubLink.icon}
        </Link>
      )}
      <div className={clsx(s.expandableIcons, { [s.expanded]: isHovered })}>
        {otherLinks.map(social => (
          <Link 
            href={social.href} 
            key={social.name} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={s.socialIconLinkItem} // Specific class for items in expandable area
            aria-label={social.name}
            tabIndex={isHovered ? 0 : -1} // Make them focusable only when visible
          >
            {social.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SocialIcons; 