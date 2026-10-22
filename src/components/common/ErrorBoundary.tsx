import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ErrorOutline,
  Refresh,
  ContentCopy,
  ExpandMore,
  BugReport,
} from '@mui/icons-material';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  traceId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    traceId: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const traceId = `trace-${Math.random().toString(36).substring(2, 10)}`;
    return { hasError: true, error, traceId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, traceId: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleCopyDiagnostics = () => {
    const report = {
      traceId: this.state.traceId,
      timestamp: new Date().toISOString(),
      errorName: this.state.error?.name,
      errorMessage: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
    };
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 640,
              width: '100%',
              p: 4,
              borderRadius: 3,
              border: 1,
              borderColor: 'error.light',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <ErrorOutline color="error" sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  OENEXA Platform Runtime Error
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Trace ID: {this.state.traceId}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.6 }}>
              An unexpected rendering exception was intercepted by the OENEXA Error Boundary.
              Your data has been preserved, and you can safely recover or reset component state.
            </Typography>

            <Paper
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'rgba(239, 68, 68, 0.08)',
                border: 1,
                borderColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main', mb: 0.5 }}>
                {this.state.error?.name || 'Error'}: {this.state.error?.message}
              </Typography>
              <Chip
                label="Self-Healing Ready"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReset}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={this.handleCopyDiagnostics}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Copy Diagnostics
              </Button>
            </Box>

            {this.state.error?.stack && (
              <Accordion sx={{ borderRadius: '8px !important', boxShadow: 'none', border: 1, borderColor: 'divider' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BugReport fontSize="small" color="action" />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Technical Stack Trace Diagnostics
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography
                    component="pre"
                    variant="caption"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.72rem',
                      lineHeight: 1.5,
                      color: 'text.secondary',
                      maxHeight: 200,
                      overflowY: 'auto',
                      bgcolor: 'background.paper',
                      p: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    {this.state.error.stack}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
