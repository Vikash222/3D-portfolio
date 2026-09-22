import React, { createContext, useContext } from 'react';

export const VisualEditorContext = createContext({
  isEditMode: false,
  isPreviewMode: false,
  updateProfileField: () => {},
  updateAboutDetail: () => {},
  updateCampItem: () => {},
  deleteCampItem: () => {},
  addCampItem: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  addProject: () => {},
  updateSkill: () => {},
  deleteSkill: () => {},
  addSkill: () => {},
  openImageCropper: () => {},
  markDirty: () => {},
});

export const useVisualEditor = () => useContext(VisualEditorContext);
