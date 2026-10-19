import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PushPin,
  ForkRight,
  Delete,
  Add,
  Search,
  Share,
  Folder,
  CreateNewFolder,
} from '@mui/icons-material';
import { ConversationMetadata, ChatFolder } from '../../../types';

export interface ChatSessionSidebarProps {
  darkMode: boolean;
  conversations: ConversationMetadata[];
  activeConvId: string;
  folders?: ChatFolder[];
  selectedFolderId?: string | null;
  onSelectFolder?: (folderId: string | null) => void;
  onCreateFolder?: (name: string, color?: string) => void;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
  onTogglePin: (convId: string, e: React.MouseEvent) => void;
  onForkConversation: (convId: string, e: React.MouseEvent) => void;
  onDeleteConversation: (convId: string, e: React.MouseEvent) => void;
  onShareConversation?: (convId: string, e: React.MouseEvent) => void;
}

export const ChatSessionSidebar: React.FC<ChatSessionSidebarProps> = ({
  darkMode,
  conversations,
  activeConvId,
  folders = [],
  selectedFolderId = null,
  onSelectFolder,
  onCreateFolder,
  onSelectConversation,
  onCreateNewConversation,
  onTogglePin,
  onForkConversation,
  onDeleteConversation,
  onShareConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      !selectedFolderId || c.folderId === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const standardConversations = filteredConversations.filter((c) => !c.pinned);

  const handleCreateFolderSubmit = () => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setFolderDialogOpen(false);
    }
  };

  const renderConversationItem = (conv: ConversationMetadata) => {
    const isActive = conv.conversationId === activeConvId;
    return (
      <ListItem
        key={conv.conversationId}
        button
        onClick={() => onSelectConversation(conv.conversationId)}
        sx={{
          borderRadius: 1.5,
          mb: 0.5,
          bgcolor: isActive ? (darkMode ? '#334155' : '#e2e8f0') : 'transparent',
          '&:hover': { bgcolor: darkMode ? '#1e293b' : '#f1f5f9' },
          transition: 'all 0.15s ease',
        }}
      >
        <ListItemText
          disableTypography
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {conv.pinned && <PushPin fontSize="small" color="primary" sx={{ fontSize: 13 }} />}
              <Typography variant="body2" noWrap sx={{ fontWeight: isActive ? 700 : 500, flexGrow: 1 }}>
                {conv.title}
              </Typography>
            </Box>
          }
          secondary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {conv.model}
                </Typography>
                {conv.folderName && (
                  <Chip
                    label={conv.folderName}
                    size="small"
                    sx={{ height: 16, fontSize: '0.62rem', px: 0.2 }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.3 }}>
                <IconButton
                  size="small"
                  onClick={(e) => onTogglePin(conv.conversationId, e)}
                  title={conv.pinned ? 'Unpin' : 'Pin'}
                  sx={{ p: 0.4 }}
                >
                  <PushPin
                    fontSize="small"
                    sx={{ fontSize: 13, color: conv.pinned ? 'primary.main' : 'inherit' }}
                  />
                </IconButton>
                {onShareConversation && (
                  <IconButton
                    size="small"
                    onClick={(e) => onShareConversation(conv.conversationId, e)}
                    title="Share conversation"
                    sx={{ p: 0.4 }}
                  >
                    <Share fontSize="small" sx={{ fontSize: 13 }} />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={(e) => onForkConversation(conv.conversationId, e)}
                  title="Fork / Branch"
                  sx={{ p: 0.4 }}
                >
                  <ForkRight fontSize="small" sx={{ fontSize: 13 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => onDeleteConversation(conv.conversationId, e)}
                  title="Delete"
                  sx={{ p: 0.4 }}
                >
                  <Delete fontSize="small" sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            </Box>
          }
        />
      </ListItem>
    );
  };

  return (
    <Paper
      sx={{
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Sessions
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          variant="contained"
          onClick={onCreateNewConversation}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
        >
          New Chat
        </Button>
      </Box>

      {/* Search Input */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              fontSize: '0.82rem',
              py: 0.2,
            },
          }}
        />
      </Box>

      {/* Folders Bar */}
      <Box
        sx={{
          px: 1,
          py: 0.8,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          overflowX: 'auto',
        }}
      >
        <Chip
          label="All"
          size="small"
          clickable
          variant={selectedFolderId === null ? 'filled' : 'outlined'}
          color={selectedFolderId === null ? 'primary' : 'default'}
          onClick={() => onSelectFolder && onSelectFolder(null)}
          sx={{ height: 22, fontSize: '0.7rem' }}
        />
        {folders.map((f) => (
          <Chip
            key={f.id}
            icon={<Folder style={{ color: f.color, fontSize: 13 }} />}
            label={f.name}
            size="small"
            clickable
            variant={selectedFolderId === f.id ? 'filled' : 'outlined'}
            onClick={() => onSelectFolder && onSelectFolder(f.id)}
            sx={{ height: 22, fontSize: '0.7rem' }}
          />
        ))}
        {onCreateFolder && (
          <IconButton
            size="small"
            onClick={() => setFolderDialogOpen(true)}
            title="Create Folder"
            sx={{ p: 0.3 }}
          >
            <CreateNewFolder fontSize="small" sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>

      {/* Conversation List */}
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ px: 1, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              📌 Pinned
            </Typography>
            {pinnedConversations.map(renderConversationItem)}
          </Box>
        )}

        {/* Regular Conversations */}
        {standardConversations.length > 0 ? (
          standardConversations.map(renderConversationItem)
        ) : (
          pinnedConversations.length === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ p: 2, display: 'block', textAlign: 'center' }}>
              No conversations found.
            </Typography>
          )
        )}
      </List>

      {/* Folder Creation Dialog */}
      <Dialog open={folderDialogOpen} onClose={() => setFolderDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem' }}>Create Chat Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            size="small"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Color Hex"
            size="small"
            value={newFolderColor}
            onChange={(e) => setNewFolderColor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateFolderSubmit} disabled={!newFolderName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
