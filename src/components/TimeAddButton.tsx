import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_OPTIONS } from '@/types/project';

interface TimeAddButtonProps {
  onAddTime: (seconds: number) => void;
}

export const TimeAddButton = ({ onAddTime }: TimeAddButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsExpanded(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!isExpanded) {
      onAddTime(15 * 60); // Default 15 minutes
    }
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsExpanded(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);

  const handleSelectTime = (seconds: number) => {
    onAddTime(seconds);
    setIsExpanded(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        className="glass-button w-12 h-12 text-xs font-medium text-foreground/80 select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => longPressTimer.current && clearTimeout(longPressTimer.current)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        whileTap={{ scale: 0.95 }}
      >
        +15m
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute left-0 top-0 z-50"
          >
            <div className="relative w-44 h-44">
              {TIME_OPTIONS.map((option, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 55;
                const x = Math.cos(angle) * radius + 55;
                const y = Math.sin(angle) * radius + 55;

                return (
                  <motion.button
                    key={option.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: index * 0.03, type: 'spring', stiffness: 400, damping: 20 }}
                    className="glass-button w-10 h-10 text-xs font-medium text-foreground/90 absolute"
                    style={{
                      left: x,
                      top: y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => handleSelectTime(option.seconds)}
                  >
                    {option.label}
                  </motion.button>
                );
              })}
              
              {/* Center button shows current selection indicator */}
              <motion.div
                className="glass-circle w-14 h-14 absolute text-xs font-semibold text-primary"
                style={{ left: 55, top: 55, transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                +15m
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
