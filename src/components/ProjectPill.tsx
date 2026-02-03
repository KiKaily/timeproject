import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, formatTime, getAccentColorClass } from '@/types/project';
import { TimeAddButton } from './TimeAddButton';

interface ProjectPillProps {
  project: Project;
  onToggleTimer: () => void;
  onAddTime: (seconds: number) => void;
  onSetTime: (seconds: number) => void;
  onEdit: () => void;
  onMoveToFolder?: (folderId: string | null) => void;
  folders?: Array<{ id: string; name: string }>;
  showSeconds?: boolean;
}

export const ProjectPill = ({ project, onToggleTimer, onAddTime, onSetTime, onEdit, onMoveToFolder, folders = [], showSeconds = true }: ProjectPillProps) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const didLongPress = useRef(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const [timeMenuExpanded, setTimeMenuExpanded] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Cancel long press timer and check if it was a long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (didLongPress.current) {
      e.preventDefault();
      didLongPress.current = false;
      return;
    }
    
    // Only toggle if it wasn't a long press and wasn't during time menu
    if (!timeMenuExpanded) {
      onToggleTimer();
    }
  };

  const handlePointerDown = () => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onEdit();
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3"
    >
      <TimeAddButton onAddTime={onAddTime} onSetTime={onSetTime} projectPillRef={pillRef} onExpand={setTimeMenuExpanded} />

      <motion.div
        ref={pillRef}
        className={`glass-pill flex-1 flex items-center gap-3 pl-6 pr-4 py-3 cursor-pointer relative h-12 ${
          project.isRunning ? 'timer-active' : ''
        }`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => {
          e.preventDefault();
          if (folders.length > 0) {
            setShowFolderMenu(true);
          } else {
            onEdit();
          }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="crossFade">
          {showFolderMenu && folders.length > 0 ? (
            <motion.div
              key="folder-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 w-full flex-wrap justify-center"
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToFolder?.(null);
                  setShowFolderMenu(false);
                }}
                className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                none
              </motion.button>
              {folders.map((folder) => (
                <motion.button
                  key={folder.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveToFolder?.(folder.id);
                    setShowFolderMenu(false);
                  }}
                  className="text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  {folder.name}
                </motion.button>
              ))}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFolderMenu(false);
                }}
                className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                cancel
              </motion.button>
            </motion.div>
          ) : !timeMenuExpanded ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 w-full"
            >
              {/* Color accent - dot indicator */}
              <div className={`accent-indicator ${getAccentColorClass(project.accentColor)}`} />

              {/* Project name */}
              <span className="flex-1 font-medium text-foreground/90 truncate ml-4">
                {project.name}
              </span>

              {/* Time display */}
              <span className={`font-mono text-sm tabular-nums ${
                project.isRunning ? 'text-primary animate-pulse-glow' : 'text-muted-foreground'
              }`}>
                {formatTime(project.timeInSeconds, showSeconds)}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="circles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 w-full items-center justify-center"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
