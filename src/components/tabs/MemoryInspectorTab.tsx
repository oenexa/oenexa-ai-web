import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import { UserMemoryRecord } from '../../types';
import { saveUserMemory } from '../../services/memoryService';

export interface MemoryInspectorTabProps {
  darkMode: boolean;
  username: string;
  userMemories: UserMemoryRecord[];
  setUserMemories: React.Dispatch<React.SetStateAction<UserMemoryRecord[]>>;
  notify: (msg: string) => void;
}

export const MemoryInspectorTab: React.FC<MemoryInspectorTabProps> = ({
  darkMode,
  username,
  userMemories,
  setUserMemories,
  notify,
}) => {
  const [memorySearchQuery, setMemorySearchQuery] = useState<string>('');
  const [newMemoryKey, setNewMemoryKey] = useState<string>('');
  const [newMemoryValue, setNewMemoryValue] = useState<string>('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<string>('PREFERENCE');

  const handleAddMemory = async () => {
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) return;
    const newRecord: UserMemoryRecord = {
      userId: username || 'engineer',
      memoryKey: newMemoryKey.trim(),
      memoryValue: newMemoryValue.trim(),
      category: newMemoryCategory,
      confidence: 1.0,
      learnedAt: new Date().toISOString(),
    };

    await saveUserMemory(newRecord);
    setUserMemories((prev) => [newRecord, ...prev]);
    setNewMemoryKey('');
    setNewMemoryValue('');
    notify(`Saved memory: [${newRecord.memoryKey}]`);
  };

  const filteredMemories = userMemories.filter(
    (m) =>
      !memorySearchQuery ||
      m.memoryKey.toLowerCase().includes(memorySearchQuery.toLowerCase()) ||
      m.memoryValue.toLowerCase().includes(memorySearchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          🧠 AI Memory Architecture (Short-Term & Long-Term)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manages multi-turn conversation memory, sliding context windows, and user preferences stored in PostgreSQL.
        </Typography>

        {/* Add Custom Memory */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Record New Learned Memory:
          </Typography>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Memory Key"
                value={newMemoryKey}
                onChange={(e) => setNewMemoryKey(e.target.value)}
                placeholder="e.g. DATABASE_CHOICE"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                label="Memory Value / Fact"
                value={newMemoryValue}
                onChange={(e) => setNewMemoryValue(e.target.value)}
                placeholder="e.g. Always use PostgreSQL 16"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={newMemoryCategory}
                  onChange={(e) => setNewMemoryCategory(e.target.value)}
                >
                  <MenuItem value="PREFERENCE">PREFERENCE</MenuItem>
                  <MenuItem value="FACT">FACT</MenuItem>
                  <MenuItem value="PROJECT_CONTEXT">PROJECT_CONTEXT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" onClick={handleAddMemory}>
                Save Memory
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filter */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search user memories..."
          value={memorySearchQuery}
          onChange={(e) => setMemorySearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Persistent User Memories ({filteredMemories.length}):
        </Typography>
        <List>
          {filteredMemories.map((mem, i) => (
            <ListItem key={i} sx={{ px: 0, py: 1 }}>
              <Paper
                sx={{
                  p: 1.5,
                  width: '100%',
                  bgcolor: darkMode ? '#1e293b' : '#f8fafc',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
                      {mem.memoryKey}
                    </Typography>
                    <Chip
                      label={mem.category || 'PREFERENCE'}
                      size="small"
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.65rem' }}
                    />
                  </Box>
                  <Chip
                    label={`${((mem.confidence || 1.0) * 100).toFixed(0)}% Confidence`}
                    color="success"
                    size="small"
                    sx={{ height: 18, fontSize: '0.65rem' }}
                  />
                </Box>
                <Typography variant="body2">{mem.memoryValue}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
