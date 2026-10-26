import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  CoreBrainDirectivesCard,
  CoreModulesStatusGrid,
  CoreBrainSynthesisViewer,
} from './corebrain';
import {
  CoreBrainDirective,
  CoreBrainSynthesis,
  CoreModuleInfo,
} from '../../types/coreBrain';
import { executeDirective, getCoreModulesStatus } from '../../services/coreBrainService';

interface CoreBrainStudioTabProps {
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
  onApplyArtifact?: (artifact: { title: string; code: string }) => void;
  onCopyCode?: (code: string) => void;
}

export const CoreBrainStudioTab: React.FC<CoreBrainStudioTabProps> = ({
  darkMode,
  token,
  notify,
  onApplyArtifact,
  onCopyCode,
}) => {
  const [modules, setModules] = useState<CoreModuleInfo[]>([]);
  const [synthesis, setSynthesis] = useState<CoreBrainSynthesis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadModules = useCallback(async () => {
    try {
      const res = await getCoreModulesStatus(token);
      setModules(res);
    } catch {
      notify('Failed to load core modules status');
    }
  }, [token, notify]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleExecuteDirective = async (directive: CoreBrainDirective) => {
    setLoading(true);
    notify(`Dispatching directive: "${directive.objective}" to Central Brain...`);
    try {
      const res = await executeDirective(directive, token);
      setSynthesis(res);
      notify(`Central Brain executed directive: ${res.directiveId}`);
      // Refresh module stats
      loadModules();
    } catch {
      notify('Directive execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          🧠 OENEXA Central Brain & 12-Engine Studio
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>
          Unified neural brain orchestrating the 12 core engines of Oenexa with Virtual Thread concurrency and zero-mock verification.
        </Typography>
      </Box>

      {/* Directive Dispatcher */}
      <CoreBrainDirectivesCard
        darkMode={darkMode}
        loading={loading}
        onExecute={handleExecuteDirective}
      />

      {/* Synthesis Viewer */}
      {synthesis && (
        <CoreBrainSynthesisViewer
          darkMode={darkMode}
          synthesis={synthesis}
          onApplyArtifact={onApplyArtifact}
          onCopyCode={onCopyCode}
        />
      )}

      {/* 12 Core Engines Matrix */}
      <CoreModulesStatusGrid
        darkMode={darkMode}
        modules={modules}
      />
    </Box>
  );
};
