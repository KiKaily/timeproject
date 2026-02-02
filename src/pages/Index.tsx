import { TimeTracker } from '@/components/TimeTracker';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-card/50 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Main content */}
      <div className="relative z-10">
        <TimeTracker />
      </div>
    </div>
  );
};

export default Index;
