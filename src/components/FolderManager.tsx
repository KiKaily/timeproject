import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, X, Trash2 } from 'lucide-react';
import { Folder, AccentColor, ACCENT_COLORS_FREE, ACCENT_COLORS_PRO } from '@/types/project';
import { getAccentColorClass } from '@/types/project';
import { getSubscriptionTier } from '@/types/subscription';

interface FolderManagerProps {
  folders: Folder[];
  onCreateFolder: (name: string, color: AccentColor) => void;
  onDeleteFolder: (folderId: string) => void;
  onSelectFolder: (folderId: string | null) => void;
  selectedFolder: string | null;
}

export const FolderManager = ({
  folders,
  onCreateFolder,
  onDeleteFolder,
  onSelectFolder,
  selectedFolder,
}: FolderManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState<AccentColor>('blue');

  const subscriptionTier = getSubscriptionTier();
  const proColors = ACCENT_COLORS_PRO;

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim(), selectedColor);
      setFolderName('');
      setSelectedColor('blue');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {/* All Projects Button */}
      <motion.button
        onClick={() => onSelectFolder(null)}
        className={`w-full glass-pill h-10 px-4 flex items-center gap-2 text-sm transition-all ${
          selectedFolder === null
            ? 'bg-primary/20 text-primary border-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-2 h-2 rounded-full bg-current" />
        <span>all projects</span>
      </motion.button>

      {/* Folders */}
      <AnimatePresence mode="popLayout">
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex gap-2"
          >
            <motion.button
              onClick={() => onSelectFolder(folder.id)}
              className={`flex-1 glass-pill h-10 px-4 flex items-center gap-2 text-sm transition-all ${
                selectedFolder === folder.id
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-2 h-2 rounded-full ${getAccentColorClass(folder.color)}`} />
              <span className="truncate">{folder.name}</span>
            </motion.button>
            <motion.button
              onClick={() => onDeleteFolder(folder.id)}
              className="glass-button px-3 h-10 text-destructive hover:bg-destructive/10"
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={14} />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Folder Button */}
      {!isAdding && (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full glass-pill h-10 px-4 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <FolderPlus size={14} />
          <span>new folder</span>
        </motion.button>
      )}

      {/* Add Folder Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-3 space-y-3 rounded-2xl"
          >
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">folder name:</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="folder name"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm border-b border-muted"
                autoFocus
              />
            </div>

            {/* Color */}
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">color:</label>
              
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
                className="flex-1 glass-pill py-1.5 text-xs text-primary font-medium"
                whileTap={{ scale: 0.98 }}
              >
                create
              </motion.button>
              <motion.button
                onClick={() => setIsAdding(false)}
                className="flex-1 glass-pill py-1.5 text-xs text-muted-foreground"
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
