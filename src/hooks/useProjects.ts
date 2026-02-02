import { useState, useEffect, useCallback } from 'react';
import { Project, AccentColor } from '@/types/project';

const STORAGE_KEY = 'timetracker-projects';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getDefaultProjects = (): Project[] => [
  { id: generateId(), name: 'Design Work', timeInSeconds: 9312, accentColor: 'blue', isRunning: false, lastStartTime: null },
  { id: generateId(), name: 'Client Meeting', timeInSeconds: 4245, accentColor: 'green', isRunning: false, lastStartTime: null },
  { id: generateId(), name: 'Development', timeInSeconds: 12305, accentColor: 'purple', isRunning: false, lastStartTime: null },
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

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

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
    setProjects(prev =>
      prev.map(project => {
        if (project.id === id) {
          if (project.isRunning) {
            return { ...project, isRunning: false, lastStartTime: null };
          } else {
            // Stop all other timers first
            return { ...project, isRunning: true, lastStartTime: Date.now() };
          }
        }
        // Stop other running timers
        if (project.isRunning) {
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

  return {
    projects,
    toggleTimer,
    addTime,
    createProject,
    updateProject,
    deleteProject,
  };
};
