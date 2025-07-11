import React from 'react';
import Head from 'next/head';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import useUIStore from '@/store/ui';
import { MediumTitle, TechDetails } from '@/components/ui/Text';
import s from './careers.module.scss';

const CareersPage = () => {
  const theme = useUIStore((s) => s.theme);

  return (
    <>
      <Head>
        <title>Careers | Templar</title>
        <meta name="description" content="Join the Templar team and help build the future of decentralized AI training." />
        {/* Add other relevant meta tags here */}
      </Head>
      <div className={s.container}>
        <Header pageTheme={theme} lines={['']} />
        <main className={s.mainContent}>
          <section className={s.heroSection}>
            <MediumTitle as="h1" className={s.pageTitle}>
              Join Our Team
            </MediumTitle>
          </section>

          <section className={s.contentSection}>
            <TechDetails as="p" className={s.mainText}>
              We are actively seeking talented <span className={s.highlight}>researchers</span> and <span className={s.highlight}>ml engineers</span> to join our mission of
              building the future of decentralized AI training. Our team is composed of passionate
              individuals accelerating the future of the decentralised training.
            </TechDetails>

            <TechDetails as="p" className={s.contactText}>
              Send your resume and a brief introduction to{' '}
              <a href="mailto:careers@tplr.ai" className={s.emailLink}>careers@tplr.ai</a>
            </TechDetails>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

CareersPage.getInitialProps = async () => {
  return {};
};

export default CareersPage; 