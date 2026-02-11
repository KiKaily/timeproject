import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Project, Tag, AccentColor, ACCENT_COLORS_FREE, ACCENT_COLORS_PRO, getAccentColorClass, formatTime, parseTime } from '@/types/project';
import { getSubscriptionTier } from '@/types/subscription';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; timeInSeconds: number; accentColor: AccentColor; tagIds: string[] }) => void;
  onDelete: () => void;
  isNew?: boolean;
  onUpgradeClick?: (pendingEdit: {
    projectId: string | null;
    name: string;
    timeInSeconds: number;
    accentColor: AccentColor;
    tagIds: string[];
    isNew: boolean;
  }) => void;
  showSeconds?: boolean;
  tags?: Tag[];
  defaultTagId?: string | null;
}

export const EditProjectModal = ({
  project,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isNew = false,
  onUpgradeClick,
  showSeconds = true,
  tags = [],
  defaultTagId = null,
}: EditProjectModalProps) => {
  const [name, setName] = useState('');
  const [timeString, setTimeString] = useState('00:00:00');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const subscriptionTier = getSubscriptionTier();
  const proColors = ACCENT_COLORS_PRO;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setTimeString(formatTime(project.timeInSeconds, showSeconds));
      setAccentColor(project.accentColor);
      setSelectedTagIds(project.tagIds || []);
    } else if (isNew) {
      setName('');
      setTimeString(showSeconds ? '00:00:00' : '00:00');
      setAccentColor('blue');
      setSelectedTagIds(defaultTagId ? [defaultTagId] : []);
    }
  }, [project, isNew, showSeconds, defaultTagId]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        timeInSeconds: parseTime(timeString),
        accentColor,
        tagIds: selectedTagIds,
      });
      onClose();
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              <div className="glass-card p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {isNew ? 'new project' : 'edit project'}
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
                  <label className="text-sm text-muted-foreground">project name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="enter project name"
                      className="w-full glass-pill px-4 py-2.5 pr-10 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {name && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setName('')}
                        className="absolute right-3 top-[0.9rem] text-muted-foreground hover:text-foreground transition-colors p-0 w-4 h-4 flex items-center justify-center"
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">time already dedicated</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={timeString}
                      onChange={(e) => setTimeString(e.target.value)}
                      placeholder={showSeconds ? '00:00:00' : '00:00'}
                      className="w-full glass-pill px-4 py-2.5 pr-10 bg-transparent font-mono text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {timeString && timeString !== (showSeconds ? '00:00:00' : '00:00') && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setTimeString(showSeconds ? '00:00:00' : '00:00')}
                        className="absolute right-3 top-[0.9rem] text-muted-foreground hover:text-foreground transition-colors p-0 w-4 h-4 flex items-center justify-center"
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">colors</label>
                  
                  {/* Free Colors */}
                  <div className="space-y-2">
                    <div className="w-full glass-pill px-4 py-3">
                      <div className="flex gap-2 flex-wrap justify-between items-center">
                        {ACCENT_COLORS_FREE.map((color) => (
                          <motion.button
                            key={color}
                            className={`w-2 h-2 rounded-full ${getAccentColorClass(color)} ${
                              accentColor === color
                                ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-background scale-125'
                                : ''
                            }`}
                            onClick={() => setAccentColor(color)}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pro Colors */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">pro colors</p>
                    <div className="w-full glass-pill px-4 py-3">
                      <div className="flex gap-2 flex-wrap justify-between items-center">
                        {proColors.map((color) => (
                          <motion.button
                            key={color}
                            className={`w-2 h-2 rounded-full ${getAccentColorClass(color)} ${
                              accentColor === color
                                ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-background scale-125'
                                : ''
                            }`}
                            onClick={() => {
                              if (subscriptionTier === 'free') {
                                onUpgradeClick?.({
                                  projectId: project?.id || null,
                                  name: name,
                                  timeInSeconds: parseTime(timeString),
                                  accentColor: color,
                                  tagIds: selectedTagIds,
                                  isNew: isNew,
                                });
                              } else {
                                setAccentColor(color);
                              }
                            }}
                            whileTap={{ scale: 0.9 }}
                            title={subscriptionTier === 'free' ? 'Upgrade to pro to use this color' : ''}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">tags</label>
                  {tags.length > 0 ? (
                    <div className="w-full glass-pill px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {tags.map((tag) => (
                          <motion.button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 transition-all ${
                              selectedTagIds.includes(tag.id)
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-muted/50 text-muted-foreground border border-transparent'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className={`w-1 h-1 rounded-full ${getAccentColorClass(tag.color)}`} />
                            <span>{tag.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full glass-pill px-4 py-3">
                      <p className="text-xs text-muted-foreground/60 text-center">
                        {subscriptionTier === 'free' ? 'no tags available' : 'no tags created'}
                      </p>
                    </div>
                  )}
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
                    delete
                  </motion.button>
                )}
                <motion.button
                  className="flex-1 glass-pill py-2.5 bg-primary/20 text-primary font-medium"
                  onClick={handleSave}
                  whileTap={{ scale: 0.95 }}
                >
                  save
                </motion.button>
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
