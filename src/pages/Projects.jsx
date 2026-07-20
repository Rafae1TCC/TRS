import Section from '../components/section/Section.jsx'
import RevenanceSqr from '../assets/projects/revenance_sqr.png'
import ProximamenteSqr from '../assets/projects/proximamente_sqr.png'
import '../assets/fonts/fonts.css'

const PLACEHOLDER_IMG =
  'https://imgs.search.brave.com/aUhU7mIhff3AFAE7-C0mJ8X-5OcWQcdDD44rPKmzozs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8x/LzE3L1BvZGNhc3Rf/Y292ZXJfYXJ0X3Bs/YWNlaG9sZGVyX2lt/YWdlLnBuZw'

const LOREM =
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel reiciendis sunt illum exercitationem molestiae. Odio maxime consequuntur delectus unde obcaecati et aspernatur magni modi, veritatis accusamus nemo aperiam porro explicabo.'

// One entry per repeated block in the original landing.html.
// Swap in real copy/images whenever they're ready.
const sections = [
  {
    title: 'Revenance',
    text: "Una experiencia multijugador en Minecraft Java Edition, diseñada para demostrar quién es el más fuerte. En este servidor, cuando mueres, quedas fuera del juego temporalmente. Deberás administrar tus recursos, formar alianzas y pelear para no ser eliminado.",
    imageSrc: RevenanceSqr,
    imageAlt: "Imagen",
    ctaLabel: 'Explorar',
    particlesColor: '#750d0d',
    fontClass: ''
  },
  {
    title: 'Próximamente',
    text: LOREM,
    imageSrc: ProximamenteSqr,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
    reverse: true,
    particlesColor: '#fff',
    fontClass: 'enchant'
  },
  {
    title: 'Próximamente',
    text: LOREM,
    imageSrc: ProximamenteSqr,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
    particlesColor: '#fff',
    fontClass: 'enchant'
  },
  {
    title: 'Próximamente',
    text: LOREM,
    imageSrc: ProximamenteSqr,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
    reverse: true,
    particlesColor: '#fff',
    fontClass: 'enchant'
  },
]

export default function Projects() {
  return (
    <>
      {sections.map((section, i) => (
        <Section key={i} {...section} />
      ))}
    </>
  )
}
