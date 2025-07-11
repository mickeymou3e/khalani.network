import { TechDetails } from '@/components/ui/Text'
import FooterSocialIcons from '@/components/ui/FooterSocialIcons/FooterSocialIcons'

import s from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={s.footer}>
      <TechDetails>Templar © 2025</TechDetails>
      <FooterSocialIcons />
    </footer>
  )
}

export default Footer
