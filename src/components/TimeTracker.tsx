import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Crown, Download, Palette, Tag, Settings } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { ProjectPill } from './ProjectPill';
import { EditProjectModal } from './EditProjectModal';
import { UpgradeModal } from './UpgradeModal';
import { ThemeSelector } from './ThemeSelector';
import { TagManager } from './TagManager';
import { Project, AccentColor } from '@/types/project';
import { getSubscriptionTier, SUBSCRIPTION_FEATURES } from '@/types/subscription';

export const TimeTracker = () => {
  const { 
    projects, 
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
  } = useProjects();
  const { isInstallable, promptInstall, isStandalone } = useInstallPrompt();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [pendingEditForUpgrade, setPendingEditForUpgrade] = useState<{
    projectId: string | null;
    name: string;
    timeInSeconds: number;
    accentColor: AccentColor;
    tagIds: string[];
    isNew: boolean;
  } | null>(null);
  const [showThemes, setShowThemes] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [multipleRunningWarning, setMultipleRunningWarning] = useState(false);
  const [allowStopFromStatus, setAllowStopFromStatus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('tp-theme') || 'dark';
  });
  const [showSeconds, setShowSeconds] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('tp-show-seconds');
    return saved ? saved === 'true' : true;
  });
  const [showTutorialCard, setShowTutorialCard] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('tp-show-tutorial');
    return saved ? saved === 'true' : true;
  });

  const subscriptionTier = getSubscriptionTier();
  const features = SUBSCRIPTION_FEATURES[subscriptionTier];
  const PROJECT_LIMIT = features.maxProjects;

  // Restore pending edit after upgrade
  useEffect(() => {
    const pendingEditStr = localStorage.getItem('tp-pending-edit');
    if (pendingEditStr) {
      try {
        const pendingEdit = JSON.parse(pendingEditStr);
        localStorage.removeItem('tp-pending-edit');
        
        // Apply the saved edit
        if (pendingEdit.isNew) {
          createProject(pendingEdit.name, pendingEdit.accentColor, pendingEdit.tagIds || []);
        } else if (pendingEdit.projectId) {
          updateProject(pendingEdit.projectId, {
            name: pendingEdit.name,
            timeInSeconds: pendingEdit.timeInSeconds,
            accentColor: pendingEdit.accentColor,
            tagIds: pendingEdit.tagIds || [],
          });
        }
      } catch (e) {
        console.error('Failed to restore pending edit:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tp-show-seconds', String(showSeconds));
    }
  }, [showSeconds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tp-show-tutorial', String(showTutorialCard));
    }
  }, [showTutorialCard]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('tp-theme', selectedTheme);
    }
  }, [selectedTheme]);

  const handleSaveEdit = (updates: { name: string; timeInSeconds: number; accentColor: AccentColor; tagIds: string[] }) => {
    if (editingProject) {
      updateProject(editingProject.id, updates);
    }
  };

  const handleSaveNew = (updates: { name: string; timeInSeconds: number; accentColor: AccentColor; tagIds: string[] }) => {
    if (projects.length >= PROJECT_LIMIT) {
      if (subscriptionTier === 'free') {
        setShowUpgrade(true);
      } else {
        alert(`Maximum ${PROJECT_LIMIT} projects reached.`);
      }
      return;
    }
    createProject(updates.name, updates.accentColor, updates.tagIds);
  };

  const handleAddProject = () => {
    if (projects.length >= PROJECT_LIMIT) {
      if (subscriptionTier === 'free') {
        setShowUpgrade(true);
      } else {
        alert(`Maximum ${PROJECT_LIMIT} projects reached.`);
      }
      return;
    }
    setIsCreating(true);
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
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">timeprojec</h1>
              <a 
                href="https://rcrear.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[0.625rem] text-orange-500 font-medium mt-0.5 hover:text-orange-600 transition-colors block"
              >
                by rcrear.com
              </a>
            </div>
            <div 
              className="text-xs cursor-pointer"
              onClick={() => {
                const runningProjects = projects.filter(p => p.isRunning);
                if (runningProjects.length === 1 && allowStopFromStatus) {
                  toggleTimer(runningProjects[0].id);
                } else if (runningProjects.length > 1) {
                  setMultipleRunningWarning(true);
                  setTimeout(() => setMultipleRunningWarning(false), 5000);
                }
              }}
            >
              {projects.filter(p => p.isRunning).length === 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">ready</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary">recording</span>
                </div>
              )}
              <div className="text-muted-foreground text-xs mt-1">{projects.filter(p => p.isRunning).length > 0 ? 'tap to stop' : 'tap a project'}</div>
            </div>
          </div>
        </motion.div>

        {/* Tutorial Card */}
        <AnimatePresence>
          {showTutorialCard && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-3 mb-4 mx-4 relative"
            >
              <button
                onClick={() => setShowTutorialCard(false)}
                className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss tutorial"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="text-white text-xs space-y-1 pr-6">
                <p className="font-medium">record your time dedicated to projects</p>
                <p className="text-white/80">tap to start/stop • hold project to edit • hold +15m for options</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project List */}
        <div className="glass-card p-4">
          {subscriptionTier === 'pro' && showTags && (
            <TagManager
              tags={tags}
              onCreateTag={createTag}
              onUpdateTag={(id, updates) => updateTag(id, updates)}
              onDeleteTag={deleteTag}
              onSelectTag={setSelectedTag}
              selectedTag={selectedTag}
            />
          )}
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <ProjectPill
                  key={project.id}
                  project={project}
                  onToggleTimer={() => toggleTimer(project.id)}
                  onAddTime={(seconds) => addTime(project.id, seconds)}
                  onSetTime={(seconds) => setTime(project.id, seconds)}
                  onEdit={() => setEditingProject(project)}
                  showSeconds={showSeconds}
                />
              ))}
            </AnimatePresence>

            {/* Add Project Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full glass-pill h-12 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleAddProject}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              <span className="font-medium">add project</span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-4">
          {!isStandalone && isInstallable && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex-1 flex items-center justify-center gap-2 glass-pill px-4 py-2 text-xs text-primary hover:bg-primary/10 transition-colors"
              onClick={promptInstall}
              whileTap={{ scale: 0.95 }}
              title="Install app on your device"
            >
              <Download size={14} />
              <span>install</span>
            </motion.button>
          )}
          {subscriptionTier === 'pro' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`flex-1 flex items-center justify-center gap-2 glass-pill px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${
                showTags ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setShowTags(!showTags)}
              whileTap={{ scale: 0.95 }}
              title={showTags ? 'Hide tags' : 'Show tags'}
            >
              <Tag size={14} />
              <span>tags</span>
            </motion.button>
          )}
          {subscriptionTier === 'free' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex-1 flex items-center justify-center gap-2 glass-pill px-4 py-2 text-xs text-muted-foreground hover:bg-muted/10 transition-colors cursor-not-allowed opacity-50"
              onClick={() => setShowUpgrade(true)}
              whileTap={{ scale: 0.95 }}
              title="Upgrade to pro for tags"
            >
              <Tag size={14} />
              <span>tags</span>
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex-1 flex items-center justify-center gap-2 glass-pill px-4 py-2 text-xs text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setShowThemes(true)}
            whileTap={{ scale: 0.95 }}
            title="Choose a theme"
          >
            <Palette size={14} />
            <span>themes</span>
          </motion.button>
        </div>

        {/* Settings Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-3 flex items-center justify-center w-12 h-10 rounded-lg hover:bg-primary/10 transition-colors"
          onClick={() => setShowSettings(true)}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <Settings size={18} className="text-primary" />
        </motion.button>

        {/* Multiple Running Warning */}
        <AnimatePresence>
          {multipleRunningWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-2 glass-card rounded-xl text-xs text-orange-500 text-center"
            >
              when multiple projects running disabled, tap each project or change in settings
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-6 w-full max-w-sm rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">settings</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setAllowStopFromStatus(!allowStopFromStatus)}
                    className="w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`text-xs ${allowStopFromStatus ? 'text-orange-500' : 'text-muted-foreground'}`}>
                      stop all projects from <span className={`inline-block w-1.5 h-1.5 rounded-full mx-1 ${allowStopFromStatus ? 'bg-orange-500' : 'bg-muted-foreground'}`} /> recording: {allowStopFromStatus ? 'on' : 'off'}
                    </div>
                  </button>
                  <button
                    onClick={() => setShowSeconds(!showSeconds)}
                    className="w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`text-xs ${showSeconds ? 'text-orange-500' : 'text-muted-foreground'}`}>
                      show seconds in timers: {showSeconds ? 'on' : 'off'}
                    </div>
                  </button>
                  <button
                    onClick={() => setShowTutorialCard(!showTutorialCard)}
                    className="w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`text-xs ${showTutorialCard ? 'text-orange-500' : 'text-muted-foreground'}`}>
                      bring back tutorial card: {showTutorialCard ? 'on' : 'off'}
                    </div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {subscriptionTier === 'free' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-3 mx-auto flex items-center gap-2 glass-pill px-4 py-2 text-xs text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setShowUpgrade(true)}
            whileTap={{ scale: 0.95 }}
          >
            <Crown size={14} />
            <span>upgrade to pro • {projects.length}/{PROJECT_LIMIT} projects</span>
          </motion.button>
        )}
      </div>

      {/* Edit Modal */}
      <EditProjectModal
        project={editingProject}
        isOpen={editingProject !== null}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        onUpgradeClick={(pendingEdit) => {
          setPendingEditForUpgrade(pendingEdit);
          setShowUpgrade(true);
        }}
        showSeconds={showSeconds}
        tags={tags}
      />

      {/* Create Modal */}
      <EditProjectModal
        project={null}
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSave={handleSaveNew}
        onDelete={() => {}}
        isNew
        onUpgradeClick={(pendingEdit) => {
          setPendingEditForUpgrade(pendingEdit);
          setShowUpgrade(true);
        }}
        showSeconds={showSeconds}
        tags={tags}
        defaultTagId={selectedTag}
      />

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => {
          setShowUpgrade(false);
          setPendingEditForUpgrade(null);
        }} 
        pendingEdit={pendingEditForUpgrade || undefined}
      />

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={showThemes}
        onClose={() => setShowThemes(false)}
        onSelectTheme={(themeId) => {
          setSelectedTheme(themeId);
        }}
        selectedTheme={selectedTheme}
        onUpgradeClick={() => setShowUpgrade(true)}
      />
    </div>
  );
};
