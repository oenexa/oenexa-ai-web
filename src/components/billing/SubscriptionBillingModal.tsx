import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  CreditCard,
  CheckCircle,
  AccountBalanceWallet,
  Receipt,
  Speed,
  OpenInNew,
  Star,
} from '@mui/icons-material';
import {
  SubscriptionTier,
  BillingInterval,
  UserSubscription,
  UsageQuota,
  InvoiceRecord,
  ApiCreditBalance,
} from '../../types/billing';
import {
  getUserSubscription,
  upgradeSubscription,
  createStripeCheckout,
  getUserQuota,
  listUserInvoices,
  getUserCredits,
  topUpUserCredits,
} from '../../services/billingService';

export interface SubscriptionBillingModalProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
}

const TIERS: { tier: SubscriptionTier; name: string; price: number; features: string[] }[] = [
  {
    tier: 'FREE',
    name: 'Free Community',
    price: 0,
    features: ['100,000 Monthly Tokens', '50 Autonomous Agent Runs', '1 GB Vector Knowledge Store', 'Local Ollama & Open Models'],
  },
  {
    tier: 'PRO',
    name: 'Developer Pro',
    price: 29,
    features: ['2,000,000 Monthly Tokens', '1,000 Autonomous Agent Runs', '10 GB Vector Knowledge Store', 'Claude & DeepSeek Dual-Engine', 'Priority Virtual Thread Execution'],
  },
  {
    tier: 'BUSINESS',
    name: 'Team Business',
    price: 99,
    features: ['10,000,000 Monthly Tokens', '5,000 Autonomous Agent Runs', '50 GB Vector Knowledge Store', 'Full 8-Agent Autonomous Pipeline', 'Voice AI & Meeting Diarization', '2FA Banking-Grade Governance'],
  },
  {
    tier: 'ENTERPRISE',
    name: 'Sovereign Enterprise',
    price: 499,
    features: ['100,000,000 Monthly Tokens', '50,000 Autonomous Agent Runs', '500 GB Dedicated Vector Shards', 'Private GPU Cloud & On-Prem Airgap', 'Unlimited Stripe Invoicing & SSO', '24/7 Dedicated Architect SLA'],
  },
];

export const SubscriptionBillingModal: React.FC<SubscriptionBillingModalProps> = ({
  open,
  onClose,
  darkMode,
  token,
  notify,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [interval, setInterval] = useState<BillingInterval>('MONTHLY');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [quota, setQuota] = useState<UsageQuota | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [credits, setCredits] = useState<ApiCreditBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      getUserSubscription('default-user', token).then(setSubscription).catch(() => {});
      getUserQuota('default-user', token).then(setQuota).catch(() => {});
      listUserInvoices('default-user', token).then(setInvoices).catch(() => {});
      getUserCredits('default-user', token).then(setCredits).catch(() => {});
    }
  }, [open, token]);

  const handleUpgrade = async (targetTier: SubscriptionTier) => {
    setLoading(true);
    try {
      const checkout = await createStripeCheckout(targetTier, interval, 'default-user', token);
      const updated = await upgradeSubscription(targetTier, interval, 'default-user', token);
      setSubscription(updated);
      getUserQuota('default-user', token).then(setQuota);
      notify(`Upgraded plan to ${targetTier}! Stripe Checkout initialized.`);
    } catch {
      notify('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (amountUsd: number) => {
    try {
      const updated = await topUpUserCredits(amountUsd, 'default-user', token);
      setCredits(updated);
      notify(`Successfully added $${amountUsd} in API credits!`);
    } catch {
      notify('Failed to top up credits');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreditCard color="primary" /> Enterprise Subscription & Billing System (Phase 11)
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2.5, borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Star />} iconPosition="start" label="Plans & Pricing" />
          <Tab icon={<Speed />} iconPosition="start" label="Usage Quotas" />
          <Tab icon={<AccountBalanceWallet />} iconPosition="start" label="API Credits" />
          <Tab icon={<Receipt />} iconPosition="start" label="Invoices & History" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ToggleButtonGroup
                value={interval}
                exclusive
                onChange={(_, v) => v && setInterval(v)}
                size="small"
              >
                <ToggleButton value="MONTHLY">Monthly Billing</ToggleButton>
                <ToggleButton value="ANNUAL">Annual Billing (Save 17% + 2 Months Free)</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Grid container spacing={2}>
              {TIERS.map((t) => {
                const isCurrent = subscription?.tier === t.tier;
                const price = interval === 'ANNUAL' ? Math.round(t.price * 10 / 12) : t.price;
                return (
                  <Grid item xs={12} sm={6} md={3} key={t.tier}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderColor: isCurrent ? 'primary.main' : 'divider',
                        borderWidth: isCurrent ? 2 : 1,
                        bgcolor: darkMode ? '#1e293b' : '#fff',
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isCurrent ? 'primary.main' : 'text.primary' }}>
                            {t.name}
                          </Typography>
                          {isCurrent && <Chip label="ACTIVE" color="primary" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                          ${price}
                          <Typography component="span" variant="caption" color="text.secondary">
                            /mo
                          </Typography>
                        </Typography>
                        <Stack spacing={0.75} sx={{ my: 2 }}>
                          {t.features.map((feat, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <CheckCircle color="success" sx={{ fontSize: 14 }} />
                              <Typography variant="caption">{feat}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant={isCurrent ? 'outlined' : 'contained'}
                          color={isCurrent ? 'inherit' : 'primary'}
                          onClick={() => handleUpgrade(t.tier)}
                          disabled={isCurrent || loading}
                        >
                          {isCurrent ? 'Current Plan' : `Upgrade to ${t.tier}`}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {activeTab === 1 && quota && (
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                Token Utilization: {(quota.tokensUsed).toLocaleString()} / {(quota.tokenLimit).toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (quota.tokensUsed / quota.tokenLimit) * 100)}
                sx={{ height: 10, borderRadius: 1, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {((quota.tokensUsed / quota.tokenLimit) * 100).toFixed(1)}% of monthly capacity utilized. Resets on next billing cycle.
              </Typography>
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Autonomous Agent Pipeline Executions:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                    {quota.agentRunsUsed} / {quota.agentRunsLimit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Multi-agent DAG tasks orchestrated across the 8 autonomous roles.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Vector Knowledge Shard Storage:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}>
                    {quota.storageMbUsed} MB / {quota.storageMbLimit} MB
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Document embeddings and semantic indexes in PostgreSQL + pgvector.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        )}

        {activeTab === 2 && credits && (
          <Paper variant="outlined" sx={{ p: 3, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Available API Credit Balance
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  ${credits.remainingCreditsUsd.toFixed(2)}
                </Typography>
              </Box>
              <Chip label="PRE-PAID" color="success" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              API credits can be used for pay-as-you-go model routing (DeepSeek, Claude, GPT, Qwen), GPU synthesis, and third-party integrations.
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Instant Top-Up:
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" onClick={() => handleTopUp(25)}>+$25 USD</Button>
              <Button variant="outlined" onClick={() => handleTopUp(50)}>+$50 USD</Button>
              <Button variant="contained" onClick={() => handleTopUp(100)}>+$100 USD (Popular)</Button>
              <Button variant="outlined" onClick={() => handleTopUp(250)}>+$250 USD</Button>
            </Stack>
          </Paper>
        )}

        {activeTab === 3 && (
          <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Stripe Invoices & Receipts:
            </Typography>
            <List disablePadding>
              {invoices.map((inv) => (
                <ListItem key={inv.invoiceId} sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Invoice {inv.invoiceId}
                        </Typography>
                        <Chip label={inv.status} color="success" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          ${inv.amountDueUsd.toFixed(2)} {inv.currency}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Issued: {new Date(inv.issuedAt).toLocaleDateString()}
                        </Typography>
                        <Button
                          size="small"
                          href={inv.hostedInvoiceUrl}
                          target="_blank"
                          endIcon={<OpenInNew sx={{ fontSize: 12 }} />}
                          sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          View Stripe Receipt
                        </Button>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
