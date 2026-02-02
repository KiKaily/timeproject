import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Project, AccentColor, ACCENT_COLORS, getAccentColorClass, formatTime, parseTime } from '@/types/project';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; timeInSeconds: number; accentColor: AccentColor }) => void;
  onDelete: () => void;
  isNew?: boolean;
}

export const EditProjectModal = ({
  project,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isNew = false,
}: EditProjectModalProps) => {
  const [name, setName] = useState('');
  const [timeString, setTimeString] = useState('00:00:00');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setTimeString(formatTime(project.timeInSeconds));
      setAccentColor(project.accentColor);
    } else if (isNew) {
      setName('');
      setTimeString('00:00:00');
      setAccentColor('blue');
    }
  }, [project, isNew]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        timeInSeconds: parseTime(timeString),
        accentColor,
      });
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
          >
            <div className="glass-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {isNew ? 'New Project' : 'Edit Project'}
                </h2>
                <motion.button
                  className="glass-button w-8 h-8 text-muted-foreground"
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Project Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full glass-pill px-4 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Set Time:</label>
                  <input
                    type="text"
                    value={timeString}
                    onChange={(e) => setTimeString(e.target.value)}
                    placeholder="00:00:00"
                    className="w-full glass-pill px-4 py-2.5 bg-transparent font-mono text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Color:</label>
                  <div className="flex gap-2 flex-wrap">
                    {ACCENT_COLORS.map((color) => (
                      <motion.button
                        key={color}
                        className={`w-8 h-8 rounded-full ${getAccentColorClass(color)} ${
                          accentColor === color
                            ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-background'
                            : ''
                        }`}
                        onClick={() => setAccentColor(color)}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                {!isNew && (
                  <motion.button
                    className="glass-button px-4 py-2.5 rounded-xl text-destructive flex items-center gap-2"
                    onClick={handleDelete}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                )}
                <motion.button
                  className="flex-1 glass-pill py-2.5 bg-primary/20 text-primary font-medium"
                  onClick={handleSave}
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
