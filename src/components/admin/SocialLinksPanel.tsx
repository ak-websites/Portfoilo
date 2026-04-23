import type { CSSProperties } from 'react';
import type { SocialLinkItem } from '../../lib/socialPlatforms';
import {
  SOCIAL_ICON_OPTIONS,
  SOCIAL_PLATFORM_OPTIONS,
  createSocialLinkDraft,
  getPlatformOption,
} from '../../lib/socialPlatforms';

interface SocialLinksPanelProps {
  socialLinks: SocialLinkItem[];
  setSocialLinks: (links: SocialLinkItem[]) => void;
  onSave: () => Promise<void>;
}

export default function SocialLinksPanel({
  socialLinks,
  setSocialLinks,
  onSave,
}: SocialLinksPanelProps) {
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, createSocialLinkDraft()]);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLinkItem>) => {
    setSocialLinks(
      socialLinks.map((link) => {
        if (link.id !== id) return link;

        const nextLink = { ...link, ...updates };

        if (updates.platform) {
          const option = getPlatformOption(updates.platform);
          nextLink.platform = option.value;
          nextLink.icon = option.icon;
          if (!link.label || link.label === getPlatformOption(link.platform).label) {
            nextLink.label = option.label;
          }
        }

        return nextLink;
      }),
    );
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  return (
    <>
      <div className="card">
        <h3>Floating Social Sidebar</h3>
        <p style={helperTextStyle}>
          These buttons appear independently from your existing contact info and animate in only when the Contact section is on screen.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button className="save" style={{ marginTop: 0 }} onClick={addSocialLink}>
            Add Platform
          </button>
          <button className="save alt" style={{ marginTop: 0 }} onClick={onSave}>
            Save Social Buttons
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <p style={emptyStateStyle}>
            No floating social buttons yet. Add a platform to start building the sidebar.
          </p>
        ) : (
          <div className="admin-social-list">
            {socialLinks.map((link) => {
              const option = getPlatformOption(link.platform);

              return (
                <div key={link.id} className="admin-social-card">
                  <div className="admin-social-grid">
                    <div>
                      <label style={labelStyle}>Platform</label>
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                      >
                        {SOCIAL_PLATFORM_OPTIONS.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Icon</label>
                      <select
                        value={link.icon}
                        onChange={(e) => updateSocialLink(link.id, { icon: e.target.value })}
                      >
                        {SOCIAL_ICON_OPTIONS.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Label</label>
                      <input
                        value={link.label}
                        onChange={(e) => updateSocialLink(link.id, { label: e.target.value })}
                        placeholder={option.label}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Link</label>
                      <input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder={option.placeholder}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={link.enabled !== false}
                        onChange={(e) => updateSocialLink(link.id, { enabled: e.target.checked })}
                      />
                      <span>Enabled</span>
                    </label>

                    <button
                      className="save alt"
                      style={{ marginTop: 0, background: '#5a2222', color: '#fff', borderColor: '#5a2222' }}
                      onClick={() => removeSocialLink(link.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

const labelStyle: CSSProperties = {
  fontSize: '12px',
  color: 'hsl(var(--muted-foreground))',
  marginBottom: '6px',
  display: 'block',
  fontWeight: 600,
};

const helperTextStyle: CSSProperties = {
  fontSize: '12px',
  color: 'hsl(var(--muted-foreground))',
  marginBottom: '16px',
  lineHeight: 1.6,
};

const emptyStateStyle: CSSProperties = {
  color: 'hsl(var(--muted-foreground))',
  fontSize: '13px',
};
