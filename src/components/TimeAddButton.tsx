import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_OPTIONS } from '@/types/project';

interface TimeAddButtonProps {
  onAddTime: (seconds: number) => void;
  onSetTime: (seconds: number) => void;
}

export const TimeAddButton = ({ onAddTime, onSetTime }: TimeAddButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const didLongPress = useRef(false);

  const startLongPress = () => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setIsExpanded(true);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!didLongPress.current && !isExpanded) {
      onAddTime(15 * 60); // Default 15 minutes
    }
  };

  const cancelLongPress = () => {
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

  // Handler for time option buttons - tap to add, hold to set
  const TimeOptionButton = ({ option, index }: { option: typeof TIME_OPTIONS[0]; index: number }) => {
    const optionLongPressTimer = useRef<NodeJS.Timeout | null>(null);
    const didOptionLongPress = useRef(false);

    const handleOptionTouchStart = () => {
      didOptionLongPress.current = false;
      optionLongPressTimer.current = setTimeout(() => {
        didOptionLongPress.current = true;
        onSetTime(option.seconds);
        setIsExpanded(false);
      }, 500);
    };

    const handleOptionTouchEnd = () => {
      if (optionLongPressTimer.current) {
        clearTimeout(optionLongPressTimer.current);
      }
      if (!didOptionLongPress.current) {
        onAddTime(option.seconds);
        setIsExpanded(false);
      }
    };

    const handleOptionCancel = () => {
      if (optionLongPressTimer.current) {
        clearTimeout(optionLongPressTimer.current);
      }
    };

    // Calculate position - container is 160px, center at 80
    const containerSize = 160;
    const center = containerSize / 2;
    const radius = 52;
    const angle = (index * 60 - 90) * (Math.PI / 180);
    const x = Math.cos(angle) * radius + center;
    const y = Math.sin(angle) * radius + center;

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
        onMouseDown={handleOptionTouchStart}
        onMouseUp={handleOptionTouchEnd}
        onMouseLeave={handleOptionCancel}
        onTouchStart={handleOptionTouchStart}
        onTouchEnd={handleOptionTouchEnd}
        onTouchCancel={handleOptionCancel}
      >
        {option.label}
      </motion.button>
    );
  };

  const containerSize = 160;
  const center = containerSize / 2;

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        className="glass-button w-12 h-12 text-xs font-medium text-foreground/80 select-none"
        onMouseDown={startLongPress}
        onMouseUp={endLongPress}
        onMouseLeave={cancelLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={endLongPress}
        onTouchCancel={cancelLongPress}
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
            style={{ marginLeft: -6, marginTop: -6 }}
          >
            <div className="relative" style={{ width: containerSize, height: containerSize }}>
              {TIME_OPTIONS.map((option, index) => (
                <TimeOptionButton key={option.label} option={option} index={index} />
              ))}
              
              {/* Center button shows current selection indicator */}
              <motion.div
                className="glass-circle w-12 h-12 absolute text-xs font-semibold text-primary"
                style={{ 
                  left: center, 
                  top: center, 
                  transform: 'translate(-50%, -50%)' 
                }}
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
