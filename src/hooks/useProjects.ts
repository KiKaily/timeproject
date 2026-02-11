import { useState, useEffect, useCallback } from 'react';
import { Project, AccentColor, Tag } from '@/types/project';
import { getSubscriptionTier, SUBSCRIPTION_FEATURES } from '@/types/subscription';

const STORAGE_KEY = 'timetracker-projects';
const TAGS_STORAGE_KEY = 'timetracker-tags';
const SELECTED_TAG_KEY = 'timetracker-selected-tag';
const LEGACY_FOLDERS_STORAGE_KEY = 'timetracker-folders';
const LEGACY_SELECTED_FOLDER_KEY = 'timetracker-selected-folder';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getDefaultProjects = (): Project[] => [
  { id: generateId(), name: 'project example', timeInSeconds: 0, accentColor: 'blue', isRunning: false, lastStartTime: null, tagIds: [] },
];

const migrateProjects = (storedProjects: Project[]): Project[] =>
  storedProjects.map(project => {
    const legacyFolderId = (project as Project & { folderId?: string | null }).folderId;
    const tagIds = project.tagIds ?? (legacyFolderId ? [legacyFolderId] : []);
    const { folderId, ...rest } = project as Project & { folderId?: string | null };
    return { ...rest, tagIds };
  });

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? migrateProjects(JSON.parse(stored)) : getDefaultProjects();
    } catch {
      return getDefaultProjects();
    }
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const stored = localStorage.getItem(TAGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      const legacy = localStorage.getItem(LEGACY_FOLDERS_STORAGE_KEY);
      return legacy ? JSON.parse(legacy) : [];
    } catch {
      return [];
    }
  });

  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    try {
      const selected = localStorage.getItem(SELECTED_TAG_KEY);
      if (selected) return selected;
      return localStorage.getItem(LEGACY_SELECTED_FOLDER_KEY) || null;
    } catch {
      return null;
    }
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Save tags to localStorage
  useEffect(() => {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  }, [tags]);

  // Save selected tag to localStorage
  useEffect(() => {
    localStorage.setItem(SELECTED_TAG_KEY, selectedTag || '');
  }, [selectedTag]);

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

  const createProject = useCallback((name: string, accentColor: AccentColor, tagIds: string[] = []) => {
    const newProject: Project = {
      id: generateId(),
      name,
      timeInSeconds: 0,
      accentColor,
      isRunning: false,
      lastStartTime: null,
      tagIds,
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Pick<Project, 'name' | 'timeInSeconds' | 'accentColor' | 'tagIds'>>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  }, []);

  const createTag = useCallback((name: string, color: AccentColor) => {
    const newTag: Tag = {
      id: generateId(),
      name,
      color,
    };
    setTags(prev => [...prev, newTag]);
  }, []);

  const updateTag = useCallback((id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>) => {
    setTags(prev =>
      prev.map(tag =>
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
  }, []);

  const deleteTag = useCallback((tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    // Remove tagId from projects that have this tag
    setProjects(prev =>
      prev.map(project => ({
        ...project,
        tagIds: project.tagIds?.filter(id => id !== tagId) || [],
      }))
    );
    // If selected tag is deleted, clear selection
    if (selectedTag === tagId) {
      setSelectedTag(null);
    }
  }, [selectedTag]);

  const updateProjectTags = useCallback((projectId: string, tagIds: string[]) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, tagIds } : project
      )
    );
  }, []);

  const filteredProjects = selectedTag
    ? projects.filter(p => p.tagIds?.includes(selectedTag))
    : projects;

  return {
    projects: filteredProjects,
    allProjects: projects,
    tags,
    selectedTag,
    toggleTimer,
    addTime,
    setTime,
    createProject,
    updateProject,
    deleteProject,
    createTag,
    updateTag,
    deleteTag,
    setSelectedTag,
    updateProjectTags,
  };
};
