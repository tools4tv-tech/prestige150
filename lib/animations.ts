import type { gsap as GsapInstance } from 'gsap'

export const fadeUp = (gsap: GsapInstance, target: gsap.TweenTarget, options: gsap.TweenVars = {}) =>
  gsap.from(target, {
    autoAlpha: 0,
    y: 26,
    duration: 0.7,
    ease: 'power2.out',
    ...options,
  })

export const fadeIn = (gsap: GsapInstance, target: gsap.TweenTarget, options: gsap.TweenVars = {}) =>
  gsap.from(target, {
    autoAlpha: 0,
    duration: 0.55,
    ease: 'power2.out',
    ...options,
  })
