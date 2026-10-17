import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Shield as ShieldIcon } from '@mui/icons-material';
import { LocalPrivacyAudit } from '../../../types';

export interface ArgonPrivacyAuditCardProps {
  darkMode: boolean;
  privacyAudit: LocalPrivacyAudit;
}

export const ArgonPrivacyAuditCard: React.FC<ArgonPrivacyAuditCardProps> = ({
  darkMode,
  privacyAudit,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldIcon color="success" /> Air-Gapped Local Privacy & Zero Leakage Audit
          </Typography>
          <Chip
            label={privacyAudit.airGappedVerification ? 'VERIFIED AIR-GAPPED' : 'HYBRID'}
            color="success"
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
          <Chip label={`Endpoint: ${privacyAudit.localModelEndpoint}`} size="small" variant="outlined" />
          <Chip label={`Model: ${privacyAudit.selectedLocalModel}`} size="small" variant="outlined" />
          <Chip label={`VRAM Allocation: ${privacyAudit.maxVramAllocationMb} MB`} size="small" variant="outlined" />
          <Chip label="Telemetry: Disabled (0 Leakage)" color="success" size="small" variant="outlined" />
        </Box>
      </CardContent>
    </Card>
  );
};
