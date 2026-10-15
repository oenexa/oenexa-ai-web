import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Badge,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  PlayArrow,
  Search,
  Chat as ChatIcon,
  Code as CodeIcon,
  Timeline,
  ViewModule,
  Lock,
  ExitToApp,
  AccountCircle,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

interface Workflow {
  id: string;
  steps: string[];
}

interface WorkflowRun {
  id: string;
  workflow: string;
  status: string;
  report: string;
  steps: Array<{
    agent: string;
    objective: string;
    summary: string;
    depth: number;
  }>;
}

interface SearchResult {
  chunkId: string;
  title: string;
  snippet: string;
  similarityScore: number;
}

interface ModuleInfo {
  id: string;
  displayName: string;
  description: string;
  capabilities: string[];
  status: 'ACTIVE' | 'PLANNED';
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [health, setHealth] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Authentication State
  const [token, setToken] = useState<string | null>(localStorage.getItem('oenexa_token'));
  const [username, setUsername] = useState<string>(localStorage.getItem('oenexa_user') || '');
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authUsername, setAuthUsername] = useState<string>('admin');
  const [authPassword, setAuthPassword] = useState<string>('Admin@Oenexa2026!');
  const [authError, setAuthError] = useState<string>('');

  // Modules State
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  // Workflow states
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('REPOSITORY_ANALYSIS');
  const [objective, setObjective] = useState<string>('Audit project dependencies and security vulnerabilities');
  const [runningWorkflow, setRunningWorkflow] = useState<boolean>(false);
  const [workflowRun, setWorkflowRun] = useState<WorkflowRun | null>(null);

  // Chat states
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'AI Engineer', text: 'Hello! I am your AI Software Engineer assistant. How can I help you today?' },
  ]);

  // RAG Search states
  const [ragQuery, setRagQuery] = useState<string>('security architecture');
  const [ragResults, setRagResults] = useState<SearchResult[]>([]);
  const [ragSearching, setRagSearching] = useState<boolean>(false);

  useEffect(() => {
    // Health check
    fetch('/api/health')
      .then((res) => res.text())
      .then((text) => {
        setHealth(text);
        setLoading(false);
      })
      .catch(() => {
        setHealth('unavailable');
        setLoading(false);
      });

    // Load available workflows
    fetch('/api/v1/agents/workflows')
      .then((res) => res.json())
      .then((data: Workflow[]) => setWorkflows(data))
      .catch(() => {});

    // Load modules
    fetch('/api/v1/modules')
      .then((res) => res.json())
      .then((data: ModuleInfo[]) => setModules(data))
      .catch(() => {});
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    const html = document.documentElement;
    if (!darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const handleAuthSubmit = async () => {
    setAuthError('');
    const endpoint = authMode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
    const payload = authMode === 'login'
      ? { usernameOrEmail: authUsername, password: authPassword }
      : { username: authUsername, email: authEmail, password: authPassword, fullName: authUsername };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      setToken(data.accessToken);
      setUsername(authUsername);
      localStorage.setItem('oenexa_token', data.accessToken);
      localStorage.setItem('oenexa_user', authUsername);
      setAuthDialogOpen(false);
    } catch {
      setAuthError('Connection to authentication service failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('oenexa_token');
    localStorage.removeItem('oenexa_user');
  };

  const handleRunWorkflow = async () => {
    setRunningWorkflow(true);
    try {
      const res = await fetch('/api/v1/agents/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ workflow: selectedWorkflow, objective }),
      });
      const data: WorkflowRun = await res.json();
      setWorkflowRun(data);
    } catch {
      // Fallback display if network offline
    } finally {
      setRunningWorkflow(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage('');
    setChatHistory((prev) => [...prev, { sender: 'You', text: msg }]);

    try {
      const res = await fetch('/api/v1/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: msg, conversationId: 'default' }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: 'AI Engineer', text: data.reply }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'AI Engineer', text: 'Acknowledged: ' + msg + ' (Offline fallback mode)' },
      ]);
    }
  };

  const handleRagSearch = async () => {
    if (!ragQuery.trim()) return;
    setRagSearching(true);
    try {
      const res = await fetch(`/api/v1/rag/query?q=${encodeURIComponent(ragQuery)}&limit=5`);
      const data: SearchResult[] = await res.json();
      setRagResults(data);
    } catch {
      setRagResults([]);
    } finally {
      setRagSearching(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: darkMode ? '#121212' : '#f8fafc', color: darkMode ? '#fff' : '#0f172a' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ⚡ OENEXA AI Engineer
          </Typography>

          {token ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <AccountCircle fontSize="small" />
              <Typography variant="body2">{username}</Typography>
              <IconButton color="inherit" size="small" onClick={handleLogout} title="Logout">
                <ExitToApp fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button color="inherit" startIcon={<Lock />} onClick={() => setAuthDialogOpen(true)} sx={{ mr: 1 }}>
              Sign In
            </Button>
          )}

          <IconButton color="inherit" onClick={toggleDarkMode} aria-label="toggle dark mode">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Top Bar Navigation Tabs */}
      <Paper square elevation={1} sx={{ bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary" variant="scrollable">
          <Tab icon={<CodeIcon />} iconPosition="start" label="Code Workspace" />
          <Tab icon={<Timeline />} iconPosition="start" label="Multi-Agent Workflows" />
          <Tab icon={<ChatIcon />} iconPosition="start" label="AI Assistant Chat" />
          <Tab icon={<Search />} iconPosition="start" label="RAG Knowledge Base" />
          <Tab icon={<ViewModule />} iconPosition="start" label="Platform Modules (20)" />
        </Tabs>
      </Paper>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Backend Service Health: {loading ? <CircularProgress size={12} /> : health}
        </Typography>
      </Box>

      {/* Tab 0: Code Workspace */}
      {activeTab === 0 && (
        <Box sx={{ p: 2, height: '75vh' }}>
          <Editor
            height="100%"
            defaultLanguage="java"
            defaultValue={`// OENEXA AI Engineer - Enterprise Code Generation Workspace
package com.oenexa.workspace;

public class Solution {
    public static void main(String[] args) {
        System.out.println("OENEXA AI Autonomous Software Engineering Platform");
    }
}`}
            theme={darkMode ? 'vs-dark' : 'light'}
          />
        </Box>
      )}

      {/* Tab 1: Multi-Agent Workflows */}
      {activeTab === 1 && (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
          <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
            <Typography variant="h6" gutterBottom>
              🚀 Launch Multi-Agent Workflow
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              {workflows.map((wf) => (
                <Chip
                  key={wf.id}
                  label={wf.id}
                  clickable
                  color={selectedWorkflow === wf.id ? 'primary' : 'default'}
                  onClick={() => setSelectedWorkflow(wf.id)}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Engineering Objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleRunWorkflow}
              disabled={runningWorkflow}
            >
              {runningWorkflow ? 'Executing Multi-Agent Workflow...' : 'Execute Workflow'}
            </Button>
          </Paper>

          {workflowRun && (
            <Paper sx={{ p: 3, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Run Details: {workflowRun.id}</Typography>
                <Chip label={workflowRun.status} color={workflowRun.status === 'COMPLETED' ? 'success' : 'error'} />
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Agent Step Timeline:
              </Typography>
              <List>
                {workflowRun.steps.map((st, i) => (
                  <React.Fragment key={i}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={<Typography variant="subtitle2" color="primary">{`Step ${i + 1}: [${st.agent}] (Depth ${st.depth})`}</Typography>}
                        secondary={<Typography variant="body2">{st.summary}</Typography>}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}

      {/* Tab 2: AI Assistant Chat */}
      {activeTab === 2 && (
        <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto' }}>
          <Paper sx={{ p: 3, height: '60vh', overflowY: 'auto', mb: 2, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
            {chatHistory.map((msg, i) => (
              <Box key={i} sx={{ mb: 2, textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {msg.sender}
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    display: 'inline-block',
                    maxWidth: '80%',
                    bgcolor: msg.sender === 'You' ? (darkMode ? '#1e3a8a' : '#e0e7ff') : (darkMode ? '#262626' : '#f1f5f9'),
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Paper>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask the AI Engineer regarding architecture, code fixes, testing..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="contained" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      )}

      {/* Tab 3: RAG Knowledge Base */}
      {activeTab === 3 && (
        <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto' }}>
          <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
            <Typography variant="h6" gutterBottom>
              🔍 Semantic Codebase & Architecture Search
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search architecture, security findings, or documentation..."
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRagSearch()}
              />
              <Button variant="contained" startIcon={<Search />} onClick={handleRagSearch} disabled={ragSearching}>
                Search
              </Button>
            </Box>
          </Paper>

          {ragResults.length > 0 && (
            <Paper sx={{ p: 3, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
              <Typography variant="subtitle1" gutterBottom>
                Search Results ({ragResults.length}):
              </Typography>
              <List>
                {ragResults.map((r, i) => (
                  <ListItem key={i} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" color="primary">
                            {r.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Score: {(r.similarityScore * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                      secondary={<Typography variant="body2">{r.snippet}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}

      {/* Tab 4: Platform Modules (20) */}
      {activeTab === 4 && (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            🏛️ Enterprise Platform Modules (20 Active Services)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Full capabilities matrix discovered dynamically from <code>/api/v1/modules</code>
          </Typography>

          <Grid container spacing={2}>
            {modules.map((m) => (
              <Grid item xs={12} sm={6} md={4} key={m.id}>
                <Card sx={{ height: '100%', bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {m.displayName}
                      </Typography>
                      <Chip label={m.status} size="small" color={m.status === 'ACTIVE' ? 'success' : 'default'} />
                    </Box>
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>
                      id: <code>{m.id}</code>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {m.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {m.capabilities.map((cap) => (
                        <Chip key={cap} label={cap} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Authentication Dialog */}
      <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)}>
        <DialogTitle>{authMode === 'login' ? '🔐 Sign In to OENEXA' : '📝 Create Engineer Account'}</DialogTitle>
        <DialogContent sx={{ pt: 1, minWidth: 320 }}>
          {authError && <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>{authError}</Typography>}
          <TextField
            fullWidth
            margin="dense"
            label="Username"
            value={authUsername}
            onChange={(e) => setAuthUsername(e.target.value)}
          />
          {authMode === 'register' && (
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          )}
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            size="small"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
          </Button>
          <Button variant="contained" onClick={handleAuthSubmit}>
            {authMode === 'login' ? 'Sign In' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
