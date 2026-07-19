import Section from '../components/section/Section.jsx'
import Revenance from '../assets/revenance.png'
import RevenanceSqr from '../assets/revenance_sqr.png'

const PLACEHOLDER_IMG =
  'https://imgs.search.brave.com/aUhU7mIhff3AFAE7-C0mJ8X-5OcWQcdDD44rPKmzozs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8x/LzE3L1BvZGNhc3Rf/Y292ZXJfYXJ0X3Bs/YWNlaG9sZGVyX2lt/YWdlLnBuZw'

const LOREM =
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel reiciendis sunt illum exercitationem molestiae. Odio maxime consequuntur delectus unde obcaecati et aspernatur magni modi, veritatis accusamus nemo aperiam porro explicabo.'

// One entry per repeated block in the original landing.html.
// Swap in real copy/images whenever they're ready.
const sections = [
    {
    title: 'Una experiencia para todos',
    text: "En Team Rocket Studios creemos en brindar una experiencia única accesible para todos. Nos apasiona crear proyectos creativos y dinámicos que te mantengan al borde de tu asiento. Creado por jugadores, para jugadores.",
    imageSrc: PLACEHOLDER_IMG,
    imageAlt: 'Imagen',
    ctaLabel: 'Conocer más',
    linkName: '/us'
  },
  {
    title: 'Explora nuestro último proyecto',
    text: LOREM,
    imageSrc: RevenanceSqr,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
    linkName: '/projects',
    reverse: true
  }
]

export default function Landing() {
  return (
    <>
      {sections.map((section, i) => (
        <Section key={i} {...section} />
      ))}
    </>
  )
}
