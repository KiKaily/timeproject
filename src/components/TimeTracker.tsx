import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectPill } from './ProjectPill';
import { EditProjectModal } from './EditProjectModal';
import { Project, AccentColor } from '@/types/project';

export const TimeTracker = () => {
  const { projects, toggleTimer, addTime, createProject, updateProject, deleteProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveEdit = (updates: { name: string; timeInSeconds: number; accentColor: AccentColor }) => {
    if (editingProject) {
      updateProject(editingProject.id, updates);
    }
  };

  const handleSaveNew = (updates: { name: string; timeInSeconds: number; accentColor: AccentColor }) => {
    createProject(updates.name, updates.accentColor);
  };

  const handleDelete = () => {
    if (editingProject) {
      deleteProject(editingProject.id);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-4"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">TimeTracker</h1>
            <div className="text-xs text-muted-foreground">
              {projects.filter(p => p.isRunning).length > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Recording
                </span>
              ) : (
                'Ready'
              )}
            </div>
          </div>
        </motion.div>

        {/* Project List */}
        <div className="glass-card p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <ProjectPill
                key={project.id}
                project={project}
                onToggleTimer={() => toggleTimer(project.id)}
                onAddTime={(seconds) => addTime(project.id, seconds)}
                onEdit={() => setEditingProject(project)}
              />
            ))}
          </AnimatePresence>

          {/* Add Project Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full glass-pill py-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsCreating(true)}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span className="font-medium">Add Project</span>
          </motion.button>
        </div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/60 mt-4"
        >
          Tap project to start/stop • Hold +15m for more options • Right-click to edit
        </motion.p>
      </div>

      {/* Edit Modal */}
      <EditProjectModal
        project={editingProject}
        isOpen={editingProject !== null}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />

      {/* Create Modal */}
      <EditProjectModal
        project={null}
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSave={handleSaveNew}
        onDelete={() => {}}
        isNew
      />
    </div>
  );
};
