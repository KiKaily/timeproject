import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getSubscriptionTier } from '@/types/subscription';

interface Theme {
  id: string;
  name: string;
  preview: string;
  isPro?: boolean;
}

const THEMES: Theme[] = [

  {
    id: 'dark',
    name: 'dark',
    preview: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 240%22%3E%3Crect fill=%22%231e293b%22 width=%22320%22 height=%22240%22/%3E%3Crect fill=%221e1b4b%22 x=%2220%22 y=%2220%22 width=%22280%22 height=%2240%22 rx=%228%22/%3E%3Crect fill=%22%23f97316%22 x=%2240%22 y=%2230%22 width=%228%22 height=%2220%22 rx=%224%22/%3E%3Ctext x=%2260%22 y=%2245%22 font-size=%2214%22 fill=%22white%22 font-family=%22sans-serif%22%3Etimeprojec%3C/text%3E%3Crect fill=%221e1b4b%22 x=%2220%22 y=%2280%22 width=%22280%22 height=%2230%22 rx=%226%22/%3E%3Crect fill=%22%23f97316%22 x=%2235%22 y=%2290%22 width=%226%22 height=%2210%22 rx=%222%22/%3E%3Ctext x=%2250%22 y=%2298%22 font-size=%2210%22 fill=%22%23f97316%22 font-family=%22sans-serif%22%3Erecording%3C/text%3E%3Crect fill=%221e1b4b%22 x=%2220%22 y=%22125%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3Crect fill=%221e1b4b%22 x=%2220%22 y=%22160%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3C/svg%3E',
    isPro: false,
  },
  {
    id: 'marathon',
    name: 'marathon',
    preview: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 240%22%3E%3Crect fill=%22%230a0f14%22 width=%22320%22 height=%22240%22/%3E%3Crect fill=%22%230f172a%22 x=%2220%22 y=%2220%22 width=%22280%22 height=%2240%22 rx=%228%22/%3E%3Crect fill=%22%2300ffa3%22 x=%2240%22 y=%2230%22 width=%228%22 height=%2220%22 rx=%224%22/%3E%3Ctext x=%2260%22 y=%2245%22 font-size=%2214%22 fill=%22%23d1faff%22 font-family=%22sans-serif%22%3Etimeprojec%3C/text%3E%3Crect fill=%22%230f172a%22 x=%2220%22 y=%2280%22 width=%22280%22 height=%2230%22 rx=%226%22/%3E%3Crect fill=%22%2300ffa3%22 x=%2235%22 y=%2290%22 width=%226%22 height=%2210%22 rx=%222%22/%3E%3Ctext x=%2250%22 y=%2298%22 font-size=%2210%22 fill=%22%2300ffa3%22 font-family=%22sans-serif%22%3Erecording%3C/text%3E%3Crect fill=%22%230f172a%22 x=%2220%22 y=%22125%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3Crect fill=%22%230f172a%22 x=%2220%22 y=%22160%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3C/svg%3E',
    isPro: true,
  },
  {
    id: 'green',
    name: 'green',
    preview: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 240%22%3E%3Crect fill=%22%230f241a%22 width=%22320%22 height=%22240%22/%3E%3Crect fill=%22%231a3a2a%22 x=%2220%22 y=%2220%22 width=%22280%22 height=%2240%22 rx=%228%22/%3E%3Crect fill=%22%2300ff00%22 x=%2240%22 y=%2230%22 width=%228%22 height=%2220%22 rx=%224%22/%3E%3Ctext x=%2260%22 y=%2245%22 font-size=%2214%22 fill=%22%2300ff00%22 font-family=%22sans-serif%22%3Etimeprojec%3C/text%3E%3Crect fill=%22%231a3a2a%22 x=%2220%22 y=%2280%22 width=%22280%22 height=%2230%22 rx=%226%22/%3E%3Crect fill=%22%2300ff00%22 x=%2235%22 y=%2290%22 width=%226%22 height=%2210%22 rx=%222%22/%3E%3Ctext x=%2250%22 y=%2298%22 font-size=%2210%22 fill=%22%2300ff00%22 font-family=%22sans-serif%22%3Erecording%3C/text%3E%3Crect fill=%22%231a3a2a%22 x=%2220%22 y=%22125%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3Crect fill=%22%231a3a2a%22 x=%2220%22 y=%22160%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3C/svg%3E',
    isPro: true,
  },
  {
    id: 'neon',
    name: 'neon',
    preview: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 240%22%3E%3Crect fill=%22%23000000%22 width=%22320%22 height=%22240%22/%3E%3Crect fill=%22%231a1a1a%22 x=%2220%22 y=%2220%22 width=%22280%22 height=%2240%22 rx=%228%22/%3E%3Crect fill=%220d1b82%22 x=%2240%22 y=%2230%22 width=%228%22 height=%2220%22 rx=%224%22/%3E%3Ctext x=%2260%22 y=%2245%22 font-size=%2214%22 fill=%22%23b5fe00%22 font-family=%22sans-serif%22%3Etimeprojec%3C/text%3E%3Crect fill=%22%231a1a1a%22 x=%2220%22 y=%2280%22 width=%22280%22 height=%2230%22 rx=%226%22/%3E%3Crect fill=%220d1b82%22 x=%2235%22 y=%2290%22 width=%226%22 height=%2210%22 rx=%222%22/%3E%3Ctext x=%2250%22 y=%2298%22 font-size=%2210%22 fill=%22%23b5fe00%22 font-family=%22sans-serif%22%3Erecording%3C/text%3E%3Crect fill=%22%231a1a1a%22 x=%2220%22 y=%22125%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3Crect fill=%22%231a1a1a%22 x=%2220%22 y=%22160%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3C/svg%3E',
    isPro: true,
  },
  {
    id: 'earth',
    name: 'earth',
    preview: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 240%22%3E%3Crect fill=%22%23ebe5da%22 width=%22320%22 height=%22240%22/%3E%3Crect fill=%22%23d9cebc%22 x=%2220%22 y=%2220%22 width=%22280%22 height=%2240%22 rx=%228%22/%3E%3Crect fill=%22%23d67a42%22 x=%2240%22 y=%2230%22 width=%228%22 height=%2220%22 rx=%224%22/%3E%3Ctext x=%2260%22 y=%2245%22 font-size=%2214%22 fill=%22%232f1f0a%22 font-family=%22sans-serif%22%3Etimeprojec%3C/text%3E%3Crect fill=%22%23d9cebc%22 x=%2220%22 y=%2280%22 width=%22280%22 height=%2230%22 rx=%226%22/%3E%3Crect fill=%22%23d67a42%22 x=%2235%22 y=%2290%22 width=%226%22 height=%2210%22 rx=%222%22/%3E%3Ctext x=%2250%22 y=%2298%22 font-size=%2210%22 fill=%22%232f1f0a%22 font-family=%22sans-serif%22%3Erecording%3C/text%3E%3Crect fill=%22%23d9cebc%22 x=%2220%22 y=%22125%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3Crect fill=%22%23d9cebc%22 x=%2220%22 y=%22160%22 width=%22280%22 height=%2228%22 rx=%226%22/%3E%3C/svg%3E',
    isPro: true,
  },
];

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: string) => void;
  selectedTheme: string;
  onUpgradeClick?: () => void;
}

export const ThemeSelector = ({
  isOpen,
  onClose,
  onSelectTheme,
  selectedTheme,
  onUpgradeClick,
}: ThemeSelectorProps) => {
  const subscriptionTier = getSubscriptionTier();
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    const selectedThemeObj = THEMES.find(t => t.id === selectedTheme);
    
    // If user is free and trying to save a pro theme, show upgrade modal
    if (subscriptionTier === 'free' && selectedThemeObj?.isPro) {
      onUpgradeClick?.();
      return;
    }
    
    // Otherwise save the theme
    onClose();
  };

  return (
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
          <div className="glass-card p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">themes</h2>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {THEMES.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-video ${
                    selectedTheme === theme.id
                      ? 'border-primary'
                      : 'border-muted hover:border-muted-foreground'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={theme.preview}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedTheme === theme.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Save Button */}
            <motion.button
              className="w-full glass-pill py-3 bg-primary/20 text-primary font-medium"
              onClick={handleSave}
              whileTap={{ scale: 0.98 }}
            >
              save
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
