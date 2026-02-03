import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_OPTIONS } from '@/types/project';

interface TimeAddButtonProps {
  onAddTime: (seconds: number) => void;
  onSetTime: (seconds: number) => void;
  projectPillRef?: React.RefObject<HTMLDivElement>;
  onExpand?: (isExpanded: boolean) => void;
}

export const TimeAddButton = ({ onAddTime, onSetTime, projectPillRef, onExpand }: TimeAddButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(TIME_OPTIONS[2]);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const didLongPress = useRef(false);

  const startLongPress = () => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setIsExpanded(true);
      onExpand?.(true);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!didLongPress.current && !isExpanded) {
      onAddTime(selectedOption.seconds);
    }
  };

  const closeExpanded = () => {
    setIsExpanded(false);
    onExpand?.(false);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeExpanded();
      }
    };

    if (isExpanded) {
      document.addEventListener('pointerdown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleOptionSelect = (option: typeof TIME_OPTIONS[0]) => {
    setSelectedOption(option);
    closeExpanded();
  };

  return (
    <div ref={containerRef} className="relative" onPointerDown={(e) => e.stopPropagation()}>
      <motion.button
        className="glass-button w-12 h-12 text-xs font-medium text-foreground/80 select-none"
        onPointerDown={startLongPress}
        onPointerUp={endLongPress}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsExpanded(true);
          onExpand?.(true);
        }}
        whileTap={{ scale: 0.95 }}
      >
        +{selectedOption.label}
      </motion.button>

      <AnimatePresence>
        {isExpanded && projectPillRef?.current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-40 pointer-events-auto"
            style={{
              left: projectPillRef.current.getBoundingClientRect().left - containerRef.current!.getBoundingClientRect().left,
              top: projectPillRef.current.getBoundingClientRect().top - containerRef.current!.getBoundingClientRect().top,
              width: projectPillRef.current.offsetWidth,
              height: projectPillRef.current.offsetHeight,
            }}
          >
            {/* Gravity balls inside the pill */}
            <div className="relative w-full h-full flex flex-wrap gap-2 items-center justify-center p-3 content-center">
              {TIME_OPTIONS.map((option, index) => {
                const isSelected = selectedOption.label === option.label;
                return (
                  <motion.button
                    key={option.label}
                    initial={{ x: -120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -120, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: 'easeOut',
                    }}
                    onClick={() => handleOptionSelect(option)}
                    className={`flex-shrink-0 w-12 h-8 rounded-full font-medium text-xs flex items-center justify-center ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-muted text-foreground/80 hover:bg-muted/80'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
