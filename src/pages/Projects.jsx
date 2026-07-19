import Section from '../components/section/Section.jsx'
const PLACEHOLDER_IMG =
  'https://imgs.search.brave.com/aUhU7mIhff3AFAE7-C0mJ8X-5OcWQcdDD44rPKmzozs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8x/LzE3L1BvZGNhc3Rf/Y292ZXJfYXJ0X3Bs/YWNlaG9sZGVyX2lt/YWdlLnBuZw'

const LOREM =
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel reiciendis sunt illum exercitationem molestiae. Odio maxime consequuntur delectus unde obcaecati et aspernatur magni modi, veritatis accusamus nemo aperiam porro explicabo.'

// One entry per repeated block in the original landing.html.
// Swap in real copy/images whenever they're ready.
const sections = [
  {
    title: 'Revenance',
    text: LOREM,
    imageSrc: PLACEHOLDER_IMG,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
  },
  {
    title: 'Próximamente',
    text: LOREM,
    imageSrc: PLACEHOLDER_IMG,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
    reverse: true,
  },
  {
    title: 'Próximamente',
    text: LOREM,
    imageSrc: PLACEHOLDER_IMG,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
  },
  {
    title: 'Próximamente',
    text: LOREM,
    imageSrc: PLACEHOLDER_IMG,
    imageAlt: 'Imagen',
    ctaLabel: 'Explorar',
    reverse: true,
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
