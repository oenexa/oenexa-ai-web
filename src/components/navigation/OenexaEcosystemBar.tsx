import React from 'react';
import { Box, Link as MuiLink, Typography } from '@mui/material';

const ECOSYSTEM_LINKS = [
  { id: 'portal', label: 'Portal', href: import.meta.env.VITE_OENEXA_PORTAL_URL || 'https://app.oenexa.com' },
  { id: 'exchange', label: 'Exchange', href: import.meta.env.VITE_OENEXA_EXCHANGE_URL || 'https://exchange.oenexa.com/trade' },
  { id: 'wallet', label: 'Wallet', href: import.meta.env.VITE_OENEXA_WALLET_URL || 'https://wallet.oenexa.com/wallet' },
  { id: 'chain', label: 'Blockchain', href: import.meta.env.VITE_OENEXA_EXPLORER_URL || 'https://explorer.oenexa.com' },
  { id: 'ai', label: 'OENXA AI', href: import.meta.env.VITE_OENEXA_AI_URL || 'https://ai.oenexa.com' },
  { id: 'oengo', label: 'OENGO', href: import.meta.env.VITE_OENEXA_OENGO_URL || 'https://oengo.oenexa.com' },
  { id: 'security', label: 'Security Center', href: import.meta.env.VITE_OENEXA_SECURITY_URL || 'https://app.oenexa.com/security' },
  { id: 'docs', label: 'Docs', href: import.meta.env.VITE_OENEXA_DOCS_URL || 'https://docs.oenexa.com' },
];

export const OenexaEcosystemBar: React.FC<{ activeProduct?: string }> = ({ activeProduct = 'ai' }) => (
  <Box
    data-testid="oenexa-ecosystem-bar"
    sx={{
      height: 32,
      px: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: 'var(--ox-bg-canvas, #0b0e14)',
      borderBottom: '1px solid var(--ox-border-subtle, #232b3b)',
      fontSize: '11px',
      overflowX: 'auto',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
      <Typography component="span" sx={{ fontSize: '11px', fontWeight: 700, color: 'var(--ox-accent-primary, #f0b90b)', mr: 1 }}>
        OENEXA ECOSYSTEM
      </Typography>
      {ECOSYSTEM_LINKS.map((item) => {
        const active = item.id === activeProduct;
        return (
          <MuiLink
            key={item.id}
            href={item.href}
            target={active ? undefined : '_blank'}
            rel={active ? undefined : 'noopener noreferrer'}
            underline="none"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: '11px',
              fontWeight: active ? 600 : 400,
              bgcolor: active ? 'var(--ox-bg-elevated, #1f2533)' : 'transparent',
              color: active ? 'var(--ox-text-primary, #f0f3f6)' : 'var(--ox-text-secondary, #8c9ba8)',
              '&:hover': { color: 'var(--ox-text-primary, #f0f3f6)' },
            }}
          >
            {item.label}
          </MuiLink>
        );
      })}
    </Box>
    <Typography
      component="span"
      sx={{ display: { xs: 'none', md: 'inline' }, fontSize: '10px', fontFamily: 'monospace', color: 'var(--ox-text-muted, #5a6878)' }}
    >
      SSO · id.oenexa.com
    </Typography>
  </Box>
);
