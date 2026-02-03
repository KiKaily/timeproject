import { useState, useEffect, useCallback } from 'react';
import { Project, AccentColor, Folder } from '@/types/project';
import { getSubscriptionTier, SUBSCRIPTION_FEATURES } from '@/types/subscription';

const STORAGE_KEY = 'timetracker-projects';
const FOLDERS_STORAGE_KEY = 'timetracker-folders';
const SELECTED_FOLDER_KEY = 'timetracker-selected-folder';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getDefaultProjects = (): Project[] => [
  { id: generateId(), name: 'freelance work', timeInSeconds: 0, accentColor: 'blue', isRunning: false, lastStartTime: null },
  { id: generateId(), name: 'art hobby', timeInSeconds: 0, accentColor: 'green', isRunning: false, lastStartTime: null },
  { id: generateId(), name: 'guitar practice', timeInSeconds: 0, accentColor: 'purple', isRunning: false, lastStartTime: null },
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : getDefaultProjects();
    } catch {
      return getDefaultProjects();
    }
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedFolder, setSelectedFolder] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_FOLDER_KEY) || null;
    } catch {
      return null;
    }
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Save folders to localStorage
  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  // Save selected folder to localStorage
  useEffect(() => {
    localStorage.setItem(SELECTED_FOLDER_KEY, selectedFolder || '');
  }, [selectedFolder]);

  // Update running timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(prev => 
        prev.map(project => {
          if (project.isRunning && project.lastStartTime) {
            const elapsed = Math.floor((Date.now() - project.lastStartTime) / 1000);
            return {
              ...project,
              timeInSeconds: project.timeInSeconds + 1,
            };
          }
          return project;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTimer = useCallback((id: string) => {
    const subscriptionTier = getSubscriptionTier();
    const features = SUBSCRIPTION_FEATURES[subscriptionTier];

    setProjects(prev =>
      prev.map(project => {
        if (project.id === id) {
          if (project.isRunning) {
            return { ...project, isRunning: false, lastStartTime: null };
          } else {
            // For free tier: stop all other timers
            // For pro tier: allow multiple timers
            if (!features.multipleTimers) {
              return { ...project, isRunning: true, lastStartTime: Date.now() };
            }
            return { ...project, isRunning: true, lastStartTime: Date.now() };
          }
        }
        // For free tier: stop other running timers
        if (!features.multipleTimers && project.isRunning) {
          return { ...project, isRunning: false, lastStartTime: null };
        }
        return project;
      })
    );
  }, []);

  const addTime = useCallback((id: string, seconds: number) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? { ...project, timeInSeconds: Math.max(0, project.timeInSeconds + seconds) }
          : project
      )
    );
  }, []);

  const setTime = useCallback((id: string, seconds: number) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? { ...project, timeInSeconds: Math.max(0, seconds) }
          : project
      )
    );
  }, []);

  const createProject = useCallback((name: string, accentColor: AccentColor) => {
    const newProject: Project = {
      id: generateId(),
      name,
      timeInSeconds: 0,
      accentColor,
      isRunning: false,
      lastStartTime: null,
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Pick<Project, 'name' | 'timeInSeconds' | 'accentColor'>>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  }, []);

  const createFolder = useCallback((name: string, color: AccentColor) => {
    const newFolder: Folder = {
      id: generateId(),
      name,
      color,
    };
    setFolders(prev => [...prev, newFolder]);
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
    // Remove folderId from projects in this folder
    setProjects(prev =>
      prev.map(project =>
        project.folderId === folderId ? { ...project, folderId: null } : project
      )
    );
    // If selected folder is deleted, clear selection
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
  }, [selectedFolder]);

  const updateProjectFolder = useCallback((projectId: string, folderId: string | null) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, folderId } : project
      )
    );
  }, []);

  const filteredProjects = selectedFolder
    ? projects.filter(p => p.folderId === selectedFolder)
    : projects.filter(p => !p.folderId);

  return {
    projects: filteredProjects,
    allProjects: projects,
    folders,
    selectedFolder,
    toggleTimer,
    addTime,
    setTime,
    createProject,
    updateProject,
    deleteProject,
    createFolder,
    deleteFolder,
    setSelectedFolder,
    updateProjectFolder,
  };
};
