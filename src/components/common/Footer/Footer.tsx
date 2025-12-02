import './Footer.css'

interface FooterProps {
  copyrightText: string
}

export default function Footer({ copyrightText }: FooterProps) {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Luis Carlos Picado Rojas. {copyrightText}</p>
    </footer>
  )
}
