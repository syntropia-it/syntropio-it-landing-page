import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('astro:page-load', () => {
  const section = document.querySelector('[data-gallery]');
  const track = section?.querySelector('.gallery-track') as HTMLElement;

  if (!section || !track) return;

  const scrollAmount = track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: -scrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 2,
      end: `+=${scrollAmount}`,
    },
  });
});
