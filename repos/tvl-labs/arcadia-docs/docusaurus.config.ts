import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Arcadia Documentation',
  tagline: 'Arcadia Documentation',
  favicon: 'img/favicon.ico',

  url: 'https://tvl-labs.github.io',
  baseUrl: '/arcadia-docs/',
  organizationName: 'tvl-labs',
  projectName: 'arcadia-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/tvl-labs/arcadia-docs/edit/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Arcadia Documentation',
      logo: {
        alt: 'Arcadia Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'contractsSidebar',
          position: 'left',
          label: 'Contracts',
        },
        {
          type: 'docSidebar',
          sidebarId: 'exampleSidebar',
          position: 'left',
          label: 'Example',
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'contributionSidebar',
        //   position: 'left',
        //   label: 'Contribution',
        // },
        {
          href: 'https://blog.khalani.network/',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://github.com/tvl-labs/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Guides',
              to: '/docs/guides/intro',
            },
            {
              label: 'Example',
              to: '/docs/example/intro',
            },
            {
              label: 'Contribution',
              to: '/docs/contribution/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/arcadia_network',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              href: 'https://blog.khalani.network/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/tvl-labs/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
