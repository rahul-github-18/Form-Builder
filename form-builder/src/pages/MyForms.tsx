// src/pages/MyForms.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Visibility';
import { RootState } from '../store';
import { clearCurrentForm, addField, deleteSavedForm } from '../store/formSlice';

function MyForms() {
  const savedForms = useSelector((state: RootState) => state.forms.savedForms);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);

  const handlePreviewClick = (fields: any[]) => {
    dispatch(clearCurrentForm());
    fields.forEach((field) => {
      dispatch(addField(field));
    });
    navigate('/preview');
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      dispatch(deleteSavedForm(deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📁 Saved Forms
      </Typography>

      {savedForms.length === 0 ? (
        <Typography color="text.secondary">No saved forms found.</Typography>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
          justifyContent="flex-start"
        >
          {savedForms.map((form, index) => (
            <Box
              key={index}
              width="100%"
              maxWidth="320px"
              onClick={() => handlePreviewClick(form.fields)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📝 {form.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saved on: {new Date(form.date).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              {/* Buttons */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1,
                }}
                onClick={(e) => e.stopPropagation()} // Prevent preview on delete click
              >
                <Tooltip title="Preview">
                  <IconButton
                    onClick={() => handlePreviewClick(form.fields)}
                    size="small"
                  >
                    <PreviewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => setDeleteIndex(index)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Are you sure you want to delete this form?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyForms;
