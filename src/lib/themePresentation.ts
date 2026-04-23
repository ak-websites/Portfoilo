import type { Variants } from 'framer-motion';
import type { ThemeSet } from '../store/useTheme';

export function getThemeRevealVariants(theme: ThemeSet): Variants {
  switch (theme) {
    case 'architectural':
      return {
        hidden: { opacity: 0, x: -48, y: 24 },
        visible: { opacity: 1, x: 0, y: 0 },
      };
    case 'concrete':
      return {
        hidden: { opacity: 0, y: 56, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1 },
      };
    case 'luxury':
      return {
        hidden: { opacity: 0, y: 42, scale: 0.92, rotate: -2 },
        visible: { opacity: 1, y: 0, scale: 1, rotate: 0 },
      };
    case 'nordic':
      return {
        hidden: { opacity: 0, x: 28, y: 34 },
        visible: { opacity: 1, x: 0, y: 0 },
      };
    case 'precision':
      return {
        hidden: { opacity: 0, y: 32, rotate: -1.5, filter: 'blur(4px)' },
        visible: { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' },
      };
    case 'blueprint':
      return {
        hidden: { opacity: 0, x: 40, y: 28, scale: 0.98 },
        visible: { opacity: 1, x: 0, y: 0, scale: 1 },
      };
    default:
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      };
  }
}

export function getThemeHeroMotion(theme: ThemeSet) {
  switch (theme) {
    case 'architectural':
      return {
        primaryClassName: 'top-[12%] left-[-8%] md:top-[18%] md:left-[8%] w-[16rem] h-[16rem] md:w-[30rem] md:h-[30rem] rounded-[28%]',
        secondaryClassName: 'bottom-[8%] right-[-10%] md:bottom-[12%] md:right-[10%] w-[14rem] h-[14rem] md:w-[24rem] md:h-[24rem] rounded-[18%]',
        primaryAnimate: { x: [0, 26, 0], y: [0, -16, 0], rotate: [0, 8, 0] },
        secondaryAnimate: { x: [0, -22, 0], y: [0, 18, 0], rotate: [0, -10, 0] },
      };
    case 'concrete':
      return {
        primaryClassName: 'top-[18%] left-[4%] w-[14rem] h-[14rem] md:w-[22rem] md:h-[22rem] rounded-[1.5rem]',
        secondaryClassName: 'bottom-[14%] right-[2%] w-[12rem] h-[12rem] md:w-[18rem] md:h-[18rem] rounded-[1rem]',
        primaryAnimate: { x: [0, 12, 0], y: [0, 12, 0] },
        secondaryAnimate: { x: [0, -14, 0], y: [0, -8, 0] },
      };
    case 'luxury':
      return {
        primaryClassName: 'top-[10%] left-[50%] -translate-x-1/2 w-[18rem] h-[18rem] md:w-[34rem] md:h-[34rem] rounded-full',
        secondaryClassName: 'bottom-[4%] right-[12%] w-[10rem] h-[10rem] md:w-[20rem] md:h-[20rem] rounded-full',
        primaryAnimate: { scale: [1, 1.08, 1], y: [0, -12, 0] },
        secondaryAnimate: { scale: [1, 0.92, 1], x: [0, -18, 0], y: [0, 12, 0] },
      };
    case 'nordic':
      return {
        primaryClassName: 'top-[18%] left-[8%] w-[13rem] h-[13rem] md:w-[24rem] md:h-[24rem] rounded-[2rem]',
        secondaryClassName: 'bottom-[10%] right-[8%] w-[11rem] h-[11rem] md:w-[20rem] md:h-[20rem] rounded-[3rem]',
        primaryAnimate: { x: [0, 18, 0], y: [0, -22, 0] },
        secondaryAnimate: { x: [0, -16, 0], y: [0, 18, 0] },
      };
    case 'precision':
      return {
        primaryClassName: 'top-[16%] left-[8%] w-[15rem] h-[15rem] md:w-[26rem] md:h-[26rem] rounded-[1rem]',
        secondaryClassName: 'bottom-[8%] right-[8%] w-[13rem] h-[13rem] md:w-[22rem] md:h-[22rem] rounded-[0.75rem]',
        primaryAnimate: { x: [0, 12, -12, 0], y: [0, -8, 8, 0], rotate: [0, 2, -2, 0] },
        secondaryAnimate: { x: [0, -10, 10, 0], y: [0, 10, -10, 0], rotate: [0, -3, 3, 0] },
      };
    case 'blueprint':
      return {
        primaryClassName: 'top-[14%] left-[2%] w-[16rem] h-[16rem] md:w-[28rem] md:h-[28rem] rounded-[0.5rem]',
        secondaryClassName: 'bottom-[10%] right-[2%] w-[12rem] h-[12rem] md:w-[22rem] md:h-[22rem] rounded-[0.5rem]',
        primaryAnimate: { x: [0, 20, 0], y: [0, -10, 0] },
        secondaryAnimate: { x: [0, -24, 0], y: [0, 14, 0] },
      };
    default:
      return {
        primaryClassName: 'top-1/4 left-1/4 w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] rounded-full',
        secondaryClassName: 'bottom-1/4 right-1/4 w-[16rem] h-[16rem] md:w-[24rem] md:h-[24rem] rounded-full',
        primaryAnimate: { x: [0, 24, 0], y: [0, 16, 0] },
        secondaryAnimate: { x: [0, -24, 0], y: [0, -16, 0] },
      };
  }
}
