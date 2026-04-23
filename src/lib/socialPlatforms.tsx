import type { LucideIcon } from 'lucide-react';
import {
  Badge,
  CircleUserRound,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { sanitizeUrl } from '../utils/security';

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

export const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  facebook: Badge,
  github: Badge,
  globe: Globe,
  instagram: CircleUserRound,
  linkedin: CircleUserRound,
  mail: Mail,
  message: MessageCircle,
  phone: Phone,
  send: Send,
  twitter: Globe,
  youtube: Send,
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

export const SOCIAL_ICON_OPTIONS = Object.entries(SOCIAL_ICON_MAP).map(([value]) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export function getSocialIcon(iconName?: string): LucideIcon {
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
