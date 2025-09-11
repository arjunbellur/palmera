import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-midnight-950">
            Welcome to Palmera
          </h1>
          <p className="text-xl text-midnight-600 mt-4">
            Let's get your business set up to start offering premium experiences
          </p>
        </div>
        
        <OnboardingFlow />
      </div>
    </div>
  );
}
