import React from 'react';
import { useProgress } from '../hooks/useProgress';

const InsuranceProgress: React.FC = () => {
  const { currentStep, steps, goToStep } = useProgress();

  return (
    <div className="bg-white py-6 px-4 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
              style={{ 
                width: `${((steps.findIndex(step => step.key === currentStep) + 1) / steps.length) * 100}%` 
              }}
            />
          </div>

          {steps.map((step, index) => {
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            const isCurrent = currentStep === step.key;
            const stepNumber = index + 1;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                {/* Step circle */}
                <button
                  onClick={() => goToStep(step.key)}
                  disabled={!isCompleted && !isCurrent}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : isCurrent
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>
                
                {/* Step label */}
                <span className={`mt-2 text-xs font-medium text-center max-w-24 ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InsuranceProgress;