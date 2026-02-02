import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Project, formatTime, getAccentBorderClass } from '@/types/project';
import { TimeAddButton } from './TimeAddButton';

interface ProjectPillProps {
  project: Project;
  onToggleTimer: () => void;
  onAddTime: (seconds: number) => void;
  onSetTime: (seconds: number) => void;
  onEdit: () => void;
}

export const ProjectPill = ({ project, onToggleTimer, onAddTime, onSetTime, onEdit }: ProjectPillProps) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const didLongPress = useRef(false);

  const handleTouchStart = () => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onEdit();
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!didLongPress.current) {
      onToggleTimer();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if it was a long press
    if (didLongPress.current) {
      e.preventDefault();
      return;
    }
    onToggleTimer();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3"
    >
      <TimeAddButton onAddTime={onAddTime} onSetTime={onSetTime} />

      <motion.div
        className={`glass-pill flex-1 flex items-center gap-3 pl-6 pr-4 py-3 cursor-pointer relative overflow-hidden ${
          project.isRunning ? 'timer-active' : ''
        }`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => longPressTimer.current && clearTimeout(longPressTimer.current)}
        onContextMenu={(e) => {
          e.preventDefault();
          onEdit();
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Color accent - circular blob on left edge */}
        <div className={`accent-indicator ${getAccentBorderClass(project.accentColor)}`} />

        {/* Project name */}
        <span className="flex-1 font-medium text-foreground/90 truncate ml-4">
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
