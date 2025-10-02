import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ProgressStep = 'covertype' | 'quote' | 'createpolicy' | 'payment';

interface ProgressContextType {
  currentStep: ProgressStep;
  steps: { key: ProgressStep; label: string; path: string }[];
  goToStep: (step: ProgressStep) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const insuranceSteps = [
  { key: 'covertype' as ProgressStep, label: 'Cover Type', path: '/covertype' },
  { key: 'quote' as ProgressStep, label: 'Quote', path: '/quote' },
  { key: 'createpolicy' as ProgressStep, label: 'Create Policy', path: '/createpolicy' },
  { key: 'payment' as ProgressStep, label: 'Payment', path: '/payment' },
];

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ProgressStep>('covertype');

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/search') {
      setCurrentStep('covertype');
      return;
    }
    const detectedStep = insuranceSteps.find(step => currentPath.includes(step.path));
    if (detectedStep) setCurrentStep(detectedStep.key);
  }, [location.pathname]);

  const goToStep = (step: ProgressStep) => {
    const stepConfig = insuranceSteps.find(s => s.key === step);
    if (stepConfig) navigate(stepConfig.path);
  };

  const resetProgress = () => setCurrentStep('covertype');

  return (
    <ProgressContext.Provider value={{ currentStep, steps: insuranceSteps, goToStep, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
