import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SocialLinkItem } from '../../lib/socialPlatforms';
import { getSocialIcon, normalizeSocialHref } from '../../lib/socialPlatforms';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

interface FloatingSocialSidebarProps {
  links?: SocialLinkItem[];
  contactSectionId?: string;
}

export default function FloatingSocialSidebar({
  links = [],
  contactSectionId = 'contact',
}: FloatingSocialSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  const socialLinks = useMemo(
    () =>
      links
        .filter((link) => link?.enabled !== false)
        .map((link) => ({
          ...link,
          href: normalizeSocialHref(link),
          Icon: getSocialIcon(link.icon),
        }))
        .filter((link) => link.href !== '#'),
    [links],
  );

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let frameId = 0;

    const attachObserver = () => {
      const section = document.getElementById(contactSectionId);

      if (!section) {
        frameId = window.requestAnimationFrame(attachObserver);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -15% 0px',
        },
      );

      observer.observe(section);
    };

    attachObserver();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [contactSectionId]);

  if (socialLinks.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.aside
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-3 bottom-5 z-[65] md:right-6 md:top-1/2 md:bottom-auto md:-translate-y-1/2"
          aria-label="Social media links"
        >
          <div className="flex flex-col items-end gap-3">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{
                  duration: 0.24,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => trackSocialClick(link)}
                className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-background/85 text-foreground shadow-[0_14px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-colors duration-300 hover:bg-primary hover:text-primary-foreground md:h-14 md:w-14"
              >
                <div className="absolute inset-0 rounded-2xl bg-primary/0 opacity-0 blur-xl transition-all duration-300 group-hover:bg-primary/35 group-hover:opacity-100" />
                <link.Icon size={20} className="relative z-10 md:size-[22px]" />
                <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] hidden whitespace-nowrap rounded-full border border-white/10 bg-background/92 px-3 py-1 text-xs font-semibold tracking-wide text-foreground opacity-0 shadow-[0_10px_25px_rgba(15,23,42,0.14)] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block md:translate-x-2">
                  {link.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function trackSocialClick(link: SocialLinkItem) {
  window.gtag?.('event', 'social_click', {
    platform: link.platform,
    label: link.label,
    location: 'floating_sidebar',
  });

  window.plausible?.('Social Link Click', {
    props: {
      platform: link.platform,
      label: link.label,
      location: 'floating_sidebar',
    },
  });
}
