import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  PushPin,
  ForkRight,
  Delete,
  Add,
} from '@mui/icons-material';
import { ConversationMetadata } from '../../../types';

export interface ChatSessionSidebarProps {
  darkMode: boolean;
  conversations: ConversationMetadata[];
  activeConvId: string;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
  onTogglePin: (convId: string, e: React.MouseEvent) => void;
  onForkConversation: (convId: string, e: React.MouseEvent) => void;
  onDeleteConversation: (convId: string, e: React.MouseEvent) => void;
}

export const ChatSessionSidebar: React.FC<ChatSessionSidebarProps> = ({
  darkMode,
  conversations,
  activeConvId,
  onSelectConversation,
  onCreateNewConversation,
  onTogglePin,
  onForkConversation,
  onDeleteConversation,
}) => {
  return (
    <Paper
      sx={{
        width: 280,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
      }}
    >
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
        <Button size="small" startIcon={<Add />} variant="contained" onClick={onCreateNewConversation}>
          New
        </Button>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        {conversations.map((conv) => {
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
              }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {conv.pinned && <PushPin fontSize="small" color="primary" sx={{ fontSize: 14 }} />}
                    <Typography variant="body2" noWrap sx={{ fontWeight: isActive ? 700 : 500, flexGrow: 1 }}>
                      {conv.title}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {conv.model}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={(e) => onTogglePin(conv.conversationId, e)} title="Pin">
                        <PushPin
                          fontSize="small"
                          sx={{ fontSize: 13, color: conv.pinned ? 'primary.main' : 'inherit' }}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => onForkConversation(conv.conversationId, e)}
                        title="Fork / Branch"
                      >
                        <ForkRight fontSize="small" sx={{ fontSize: 13 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => onDeleteConversation(conv.conversationId, e)}
                        title="Delete"
                      >
                        <Delete fontSize="small" sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
