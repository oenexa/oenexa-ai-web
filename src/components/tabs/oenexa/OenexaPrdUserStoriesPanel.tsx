import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Grid,
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { ProductRequirementsDocument, UserStory } from '../../../types';

export interface OenexaPrdUserStoriesPanelProps {
  darkMode: boolean;
  prd: ProductRequirementsDocument;
  userStories: UserStory[];
}

export const OenexaPrdUserStoriesPanel: React.FC<OenexaPrdUserStoriesPanelProps> = ({
  darkMode,
  prd,
  userStories,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" /> AI Product Manager: Synthesized PRD & INVEST User Stories
          </Typography>
          <Chip label={prd.releaseRoadmap} color="primary" size="small" />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          {prd.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
          <strong>Target Audience:</strong> {prd.targetAudience}
        </Typography>
        <Paper variant="outlined" sx={{ bgcolor: darkMode ? '#0f172a' : '#f8fafc', p: 1.5, borderRadius: 1.5, mb: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            <strong>Problem Statement:</strong> {prd.problemStatement}
          </Typography>
        </Paper>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          INVEST User Stories ({userStories.length})
        </Typography>
        <Grid container spacing={2}>
          {userStories.map((story) => (
            <Grid item xs={12} md={6} key={story.id}>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {story.title}
                  </Typography>
                  <Chip label={`${story.storyPoints} Story Points`} size="small" color="primary" variant="outlined" />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>As a</strong> {story.asA}, <strong>I want</strong> {story.iWant}, <strong>So that</strong> {story.soThat}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Acceptance Criteria:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {story.acceptanceCriteria.map((ac, i) => (
                    <Typography component="li" variant="caption" key={i} sx={{ color: 'text.secondary' }}>
                      {ac}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
