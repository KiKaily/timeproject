import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import { setSubscriptionTier } from '@/types/subscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const handleUpgrade = () => {
    // In production, this would integrate with payment gateway
    // For demo purposes, just unlock pro features
    setSubscriptionTier('pro');
    alert('Pro features unlocked! (This is a demo - no payment processed)');
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">upgrade to pro</h2>
            <p className="text-muted-foreground text-sm">unlock some features & support the app</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-foreground font-medium">100 projects</p>
                <p className="text-muted-foreground text-sm">up from 10 projects</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-foreground font-medium">multiple timers</p>
                <p className="text-muted-foreground text-sm">run multiple projects simultaneously</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-foreground font-medium">20 colors</p>
                <p className="text-muted-foreground text-sm">up from 10 colors</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-foreground font-medium">project folders</p>
                <p className="text-muted-foreground text-sm">organize projects in folders</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-foreground font-medium">app themes</p>
                <p className="text-muted-foreground text-sm">customize app appearance</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-primary">$3.99</p>
            <p className="text-xs text-muted-foreground mt-1">one-time payment, yours forever</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              className="flex-1 glass-pill py-3 text-muted-foreground font-medium"
              onClick={onClose}
              whileTap={{ scale: 0.95 }}
            >
              maybe later
            </motion.button>
            <motion.button
              className="flex-1 glass-pill py-3 bg-primary/20 text-primary font-medium"
              onClick={handleUpgrade}
              whileTap={{ scale: 0.95 }}
            >
              upgrade now
            </motion.button>
          </div>
        </div>
        </div>
      </motion.div>
    </>
  );
};
