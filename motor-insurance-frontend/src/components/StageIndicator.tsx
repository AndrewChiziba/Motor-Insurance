
const stages = ["Search Vehicle", "Get Quote", "Create Policy", "Payment"];

interface StageIndicatorProps {
  currentStage: number;
}

export const StageIndicator = ({ currentStage }: StageIndicatorProps) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
      ></div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {stages.map((stage, index) => (
          <span key={index} className={index <= currentStage ? "text-primary" : ""}>
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
};