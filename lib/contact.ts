import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'

// Every way to reach me, in the order people should try them. Used by the
// Say hi dialog (components/ContactModal) and the close of the home page.
export const EMAIL = 'mastrangelo.tyler@gmail.com'
export const RESUME = '/files/Tyler%20Mastrangelo%20Resume.pdf'

export const contactOptions = [
  { label: 'Email', detail: EMAIL, href: `mailto:${EMAIL}`, icon: FaEnvelope },
  { label: 'LinkedIn', detail: 'in/tymastrangelo', href: 'https://linkedin.com/in/tymastrangelo', icon: FaLinkedin },
  { label: 'GitHub', detail: '@tymastrangelo', href: 'https://github.com/tymastrangelo', icon: FaGithub },
  { label: 'Instagram', detail: '@tymastrangelo', href: 'https://instagram.com/tymastrangelo', icon: FaInstagram },
  { label: 'TikTok', detail: '@tymastrangelo', href: 'https://tiktok.com/@tymastrangelo', icon: FaTiktok },
]
