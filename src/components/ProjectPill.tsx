import { motion } from 'framer-motion';
import { Project, formatTime, getAccentColorClass } from '@/types/project';
import { TimeAddButton } from './TimeAddButton';

interface ProjectPillProps {
  project: Project;
  onToggleTimer: () => void;
  onAddTime: (seconds: number) => void;
  onEdit: () => void;
}

export const ProjectPill = ({ project, onToggleTimer, onAddTime, onEdit }: ProjectPillProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3"
    >
      <TimeAddButton onAddTime={onAddTime} />

      <motion.div
        className={`glass-pill flex-1 flex items-center gap-3 px-4 py-3 cursor-pointer ${
          project.isRunning ? 'timer-active' : ''
        }`}
        onClick={onToggleTimer}
        onContextMenu={(e) => {
          e.preventDefault();
          onEdit();
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Color accent indicator */}
        <div className={`accent-indicator ${getAccentColorClass(project.accentColor)}`} />

        {/* Project name */}
        <span className="flex-1 font-medium text-foreground/90 truncate">
          {project.name}
        </span>

        {/* Time display */}
        <span className={`font-mono text-sm tabular-nums ${
          project.isRunning ? 'text-primary animate-pulse-glow' : 'text-muted-foreground'
        }`}>
          {formatTime(project.timeInSeconds)}
        </span>
      </motion.div>
    </motion.div>
  );
};
