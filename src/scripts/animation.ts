import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
  gsap.from('[data-reveal]', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '[data-reveal]',
      start: 'top 85%',
    },
  });

  gsap.from('[data-reveal-text]', {
    y: 100,
    opacity: 0,
    duration: 2,
    ease: 'power4.out',
  });
}
