// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.tplr.ai',
	markdown: {
		rehypePlugins: [
			[rehypeMermaid, {
				strategy: 'pre-mermaid' // Switch to client-side rendering strategy
				// dark: true is no longer needed here
				// mermaidConfig is also not needed here as theming will be client-side
			}]
		],
		syntaxHighlight: 'shiki',
	},
	integrations: [
		starlight({
			title: 'TEMPLAR',
			favicon: '/favicon.ico',
			head: [
				// We will keep mermaid-themer.js but will modify its contents significantly
				{ tag: 'script', attrs: { src: '/scripts/mermaid-themer.js', defer: true } },
				// We might need to add Mermaid.js library itself if not already available
				// For example, from a CDN:
				// { tag: 'script', attrs: { src: 'https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.esm.min.mjs', type: 'module' } }
				// Or, if installed as a dependency and Astro bundles it, this might not be needed here.
			],
			logo: {
				src: './src/assets/logo.svg', // Update with actual path
			},
			customCss: [
				'./src/styles/custom.css'
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/tplr-ai/templar',
				},
				{
					icon: 'discord',
					label: 'Discord',
					href: 'https://discord.gg/N5xgygBJ9r',
				},
				{
					icon: 'x.com',
					label: 'X',
					href: 'https://x.com/tplr_ai',
				},
			],
			sidebar: [
				{
					label: 'Overview',
					link: '/', 
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Development Guide', link: '/guides/development-guide/' },
						{ label: 'Development Environment', link: '/guides/development-environment/' },
						{ label: 'Local Chain Setup', link: '/guides/local-chain-setup/' },
						{ 
							label: 'Deployment', 
							items: [
								{ label: 'Overview', link: '/guides/deployment/' },
								{ label: 'Docker Deployment', link: '/guides/docker-deployment/' },
								{ label: 'Ansible Deployment', link: '/guides/ansible-deployment/' },
							]
						},
						{ label: 'Testing', link: '/guides/testing/' },
						{ label: 'CI/CD Pipeline', link: '/guides/cicd-pipeline/' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'System Architecture', link: '/reference/system-architecture/' },
						{ label: 'Incentive Design', link: '/reference/incentive-design/' },
						{ label: 'Miners', link: '/reference/miners/' },
						{ label: 'Gradient Processing', link: '/reference/gradient-processing/' },
						{ label: 'Validators', link: '/reference/validators/' },
						{ label: 'Weight Setting', link: '/reference/weight-setting/' },
						{ label: 'Aggregation Server', link: '/reference/aggregation-server/' },
						{ label: 'Evaluator', link: '/reference/evaluator/' },
						{ label: 'Communication System', link: '/reference/communication-system/' },
						{ label: 'Checkpoint Management', link: '/reference/checkpoint-management/' },
						{ label: 'Chain Integration', link: '/reference/chain-integration/' },
						{ label: 'Data Management', link: '/reference/data-management/' },
						{ label: 'R2 Storage', link: '/reference/r2-storage/' },
						{ 
							label: 'Monitoring and Telemetry', 
							items: [
								{ label: 'Overview', link: '/reference/monitoring-and-telemetry/' },
								{ label: 'Metrics Logging', link: '/reference/metrics-logging/' },
								{ label: 'Experiment Tracking', link: '/reference/experiment-tracking/' },
								{ label: 'Dashboards', link: '/reference/dashboards/' },
							]
						},
					],
				},
				{
					label: 'Research',
					items: [
						{ label: 'Templar Paper', link: '/reference/00_templar_paper/' },
					]
				}
			],
		}),
	],
});
