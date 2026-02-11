import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag as TagIcon, X, Trash2 } from 'lucide-react';
import { Tag, AccentColor, ACCENT_COLORS_FREE, ACCENT_COLORS_PRO } from '@/types/project';
import { getAccentColorClass } from '@/types/project';
import { getSubscriptionTier } from '@/types/subscription';

interface TagManagerProps {
  tags: Tag[];
  onCreateTag: (name: string, color: AccentColor) => void;
  onUpdateTag: (id: string, updates: { name: string; color: AccentColor }) => void;
  onDeleteTag: (tagId: string) => void;
  onSelectTag: (tagId: string | null) => void;
  selectedTag: string | null;
}

export const TagManager = ({
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  onSelectTag,
  selectedTag,
}: TagManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<AccentColor>('blue');

  const subscriptionTier = getSubscriptionTier();
  const proColors = ACCENT_COLORS_PRO;

  const handleCreate = () => {
    if (tagName.trim()) {
      onCreateTag(tagName.trim(), selectedColor);
      setTagName('');
      setSelectedColor('blue');
      setIsAdding(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setSelectedColor(tag.color);
  };

  const handleSaveEdit = () => {
    if (editingTag && tagName.trim()) {
      onUpdateTag(editingTag.id, { name: tagName.trim(), color: selectedColor });
      setEditingTag(null);
      setTagName('');
      setSelectedColor('blue');
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setTagName('');
    setSelectedColor('blue');
  };

  return (
    <div className="space-y-2 mb-4">
      {/* All Projects Button */}
      <motion.button
        onClick={() => onSelectTag(null)}
        className={`w-full glass-pill h-8 px-3 flex items-center gap-2 text-xs transition-all ${
          selectedTag === null
            ? 'bg-primary/20 text-primary border-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>all projects</span>
      </motion.button>

      {/* Tags */}
      <AnimatePresence mode="popLayout">
        {tags.map((tag) => {
          const longPressTimer = useRef<NodeJS.Timeout | null>(null);
          const didLongPress = useRef(false);

          const handlePointerDown = () => {
            didLongPress.current = false;
            longPressTimer.current = setTimeout(() => {
              didLongPress.current = true;
              handleEdit(tag);
            }, 600);
          };

          const handlePointerUp = () => {
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
            }
          };

          const handleClick = () => {
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
            }
            
            if (!didLongPress.current) {
              onSelectTag(tag.id);
            }
            didLongPress.current = false;
          };

          return (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {editingTag?.id === tag.id ? (
                <motion.div
                  className="w-full glass-card p-3 space-y-3 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">tag name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="tag name"
                        className="w-full glass-pill px-4 py-2.5 pr-10 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm"
                        autoFocus
                      />
                      {tagName && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setTagName('')}
                          className="absolute right-3 top-[0.9rem] text-muted-foreground hover:text-foreground transition-colors p-0 w-4 h-4 flex items-center justify-center"
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={16} />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">color</label>
                    <div className="w-full glass-pill px-4 py-3">
                      <div className="flex gap-2 flex-wrap justify-between items-center">
                        {ACCENT_COLORS_FREE.map((color) => (
                          <motion.button
                            key={color}
                            className={`w-2 h-2 rounded-full ${getAccentColorClass(color)} ${
                              selectedColor === color
                                ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-background scale-125'
                                : ''
                            }`}
                            onClick={() => setSelectedColor(color)}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleSaveEdit}
                      className="flex-1 glass-pill py-1 text-xs text-primary font-medium"
                      whileTap={{ scale: 0.98 }}
                    >
                      save
                    </motion.button>
                    <motion.button
                      onClick={handleCancelEdit}
                      className="flex-1 glass-pill py-1 text-xs text-muted-foreground"
                      whileTap={{ scale: 0.98 }}
                    >
                      cancel
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onDeleteTag(tag.id);
                        setEditingTag(null);
                        setTagName('');
                        setSelectedColor('blue');
                      }}
                      className="glass-button px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={12} />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleClick}
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleEdit(tag);
                  }}
                  className={`w-full glass-pill h-10 px-4 flex items-center gap-2 text-sm transition-all select-none ${
                    selectedTag === tag.id
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-2 h-2 rounded-full ${getAccentColorClass(tag.color)}`} />
                  <span className="truncate">{tag.name}</span>
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add Tag Button */}
      {!isAdding && !editingTag && (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full glass-pill h-7 px-3 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <TagIcon size={12} />
          <span>new tag</span>
        </motion.button>
      )}

      {/* Add Tag Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-3 space-y-3 rounded-2xl"
          >
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">tag name</label>
              <div className="relative">
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="tag name"
                  className="w-full glass-pill px-4 py-2.5 pr-10 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm"
                  autoFocus
                />
                {tagName && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setTagName('')}
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
              <label className="text-sm text-muted-foreground">color</label>
              
              {/* Free Colors */}
              <div className="w-full glass-pill px-4 py-3">
                <div className="flex gap-2 flex-wrap justify-between items-center">
                  {ACCENT_COLORS_FREE.map((color) => (
                    <motion.button
                      key={color}
                      className={`w-2 h-2 rounded-full ${getAccentColorClass(color)} ${
                        selectedColor === color
                          ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-background scale-125'
                          : ''
                      }`}
                      onClick={() => setSelectedColor(color)}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>

              {/* Pro Colors */}
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">pro colors</p>
                <div className="w-full glass-pill px-4 py-3">
                  <div className="flex gap-2 flex-wrap justify-between items-center">
                    {proColors.map((color) => (
                      <motion.button
                        key={color}
                        className={`w-2 h-2 rounded-full ${getAccentColorClass(color)} ${
                          selectedColor === color
                            ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-background scale-125'
                            : ''
                        }`}
                        onClick={() => {
                          if (subscriptionTier === 'free') {
                            // Will need to pass upgrade callback
                          } else {
                            setSelectedColor(color);
                          }
                        }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={handleCreate}
                className="flex-1 glass-pill py-1 text-xs text-primary font-medium"
                whileTap={{ scale: 0.98 }}
              >
                create
              </motion.button>
              <motion.button
                onClick={() => {
                  setIsAdding(false);
                  setTagName('');
                  setSelectedColor('blue');
                }}
                className="flex-1 glass-pill py-1 text-xs text-muted-foreground"
                whileTap={{ scale: 0.98 }}
              >
                cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
