import type { ComponentType, SVGProps } from 'react';
import { Globe, Mail, Phone } from 'lucide-react';
import { sanitizeUrl } from '../utils/security';

type SocialIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SocialIconComponent = ComponentType<SocialIconProps>;

export interface SocialLinkItem {
  id: string;
  platform: string;
  icon: string;
  label: string;
  url: string;
  enabled?: boolean;
}

export interface SocialPlatformOption {
  value: string;
  label: string;
  icon: string;
  placeholder: string;
}

export const SOCIAL_ICON_MAP: Record<string, SocialIconComponent> = {
  facebook: FacebookIcon,
  github: GitHubIcon,
  globe: Globe,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  mail: Mail,
  message: WhatsAppIcon,
  phone: Phone,
  twitter: XIcon,
  youtube: YouTubeIcon,
};

export const SOCIAL_PLATFORM_OPTIONS: SocialPlatformOption[] = [
  { value: 'facebook', label: 'Facebook', icon: 'facebook', placeholder: 'https://facebook.com/your-page' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/your-name' },
  { value: 'github', label: 'GitHub', icon: 'github', placeholder: 'https://github.com/your-name' },
  { value: 'instagram', label: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/your-name' },
  { value: 'twitter', label: 'X / Twitter', icon: 'twitter', placeholder: 'https://x.com/your-name' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/@your-channel' },
  { value: 'email', label: 'Email', icon: 'mail', placeholder: 'mailto:you@example.com or you@example.com' },
  { value: 'phone', label: 'Phone', icon: 'phone', placeholder: 'tel:+977... or +977...' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'message', placeholder: 'https://wa.me/977...' },
  { value: 'website', label: 'Website', icon: 'globe', placeholder: 'https://your-site.com' },
];

export const SOCIAL_ICON_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'message', label: 'WhatsApp' },
  { value: 'mail', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'globe', label: 'Website' },
];

export function getSocialIcon(iconName?: string): SocialIconComponent {
  if (!iconName) return Globe;
  return SOCIAL_ICON_MAP[iconName] || Globe;
}

export function getPlatformOption(platform?: string): SocialPlatformOption {
  return SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === platform) || SOCIAL_PLATFORM_OPTIONS[0];
}

export function createSocialLinkDraft(platform = 'linkedin'): SocialLinkItem {
  const option = getPlatformOption(platform);

  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    platform: option.value,
    icon: option.icon,
    label: option.label,
    url: '',
    enabled: true,
  };
}

export function normalizeSocialHref(link: SocialLinkItem): string {
  const raw = link.url?.trim() || '';
  if (!raw) return '#';

  if (link.platform === 'email' && !raw.startsWith('mailto:') && raw.includes('@')) {
    return sanitizeUrl(`mailto:${raw}`);
  }

  if (link.platform === 'phone' && !raw.startsWith('tel:')) {
    return sanitizeUrl(`tel:${raw}`);
  }

  return sanitizeUrl(raw);
}

export function buildFallbackSocialLinks(contact: {
  email?: string;
  phone?: string;
  linkedin?: string;
  linkedinLabel?: string;
  socialLinks?: SocialLinkItem[];
} | null | undefined): SocialLinkItem[] {
  if (!contact) return [];

  if (Array.isArray(contact.socialLinks) && contact.socialLinks.length > 0) {
    return contact.socialLinks;
  }

  const fallbackLinks: SocialLinkItem[] = [];

  if (contact.linkedin) {
    fallbackLinks.push({
      id: 'fallback-linkedin',
      platform: 'linkedin',
      icon: 'linkedin',
      label: contact.linkedinLabel || 'LinkedIn',
      url: contact.linkedin,
      enabled: true,
    });
  }

  if (contact.email) {
    fallbackLinks.push({
      id: 'fallback-email',
      platform: 'email',
      icon: 'mail',
      label: 'Email',
      url: contact.email,
      enabled: true,
    });
  }

  if (contact.phone) {
    fallbackLinks.push({
      id: 'fallback-phone',
      platform: 'phone',
      icon: 'phone',
      label: 'Phone',
      url: contact.phone,
      enabled: true,
    });
  }

  return fallbackLinks;
}

function FacebookIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.094 10.125 24v-8.438H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.687 4.533-4.687 1.312 0 2.686.235 2.686.235v2.963h-1.514c-1.491 0-1.956.93-1.956 1.885v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452H16.89v-5.569c0-1.328-.028-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.344V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452Z" />
    </svg>
  );
}

function GitHubIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.111.82-.258.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.335-5.467-5.932 0-1.31.469-2.381 1.236-3.221-.123-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23A11.49 11.49 0 0 1 12 6.111c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.874.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.371.814 1.103.814 2.222v3.293c0 .322.216.694.825.576A12.003 12.003 0 0 0 12 .297Z" />
    </svg>
  );
}

function InstagramIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 1.8h-8.5A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Zm5.15-2.15a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  );
}

function XIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.63 7.584H.48l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932Zm-1.292 19.49h2.04L6.486 3.24H4.298l13.311 17.404Z" />
    </svg>
  );
}

function YouTubeIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.509 3.5 12 3.5 12 3.5s-7.509 0-9.388.566a2.997 2.997 0 0 0-2.11 2.12C0 8.076 0 12 0 12s0 3.924.502 5.814a2.997 2.997 0 0 0 2.11 2.12C4.491 20.5 12 20.5 12 20.5s7.509 0 9.388-.566a2.997 2.997 0 0 0 2.11-2.12C24 15.924 24 12 24 12s0-3.924-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 20, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a11.88 11.88 0 0 0 5.78 1.48h.01c6.58 0 11.94-5.36 11.94-11.95 0-3.19-1.24-6.19-3.46-8.41ZM12.04 21.8h-.01a9.82 9.82 0 0 1-5-1.37l-.36-.21-3.71.97.99-3.62-.24-.37A9.84 9.84 0 0 1 2.2 11.95C2.2 6.52 6.61 2.1 12.04 2.1c2.62 0 5.08 1.02 6.92 2.87a9.73 9.73 0 0 1 2.86 6.93c0 5.43-4.42 9.9-9.78 9.9Zm5.39-7.36c-.29-.14-1.72-.85-1.99-.95-.27-.1-.47-.14-.67.14-.19.29-.76.95-.93 1.15-.17.19-.34.22-.63.08-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.08-.14-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.42 0 1.43 1.03 2.81 1.17 3 .14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.32.19 1.82.12.55-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.06-.12-.26-.19-.55-.34Z" />
    </svg>
  );
}
