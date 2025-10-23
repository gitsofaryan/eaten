import { Card } from "@/components/ui/card";

interface TotalMacrosProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export const TotalMacros = ({ totalCalories, totalProtein, totalCarbs, totalFat }: TotalMacrosProps) => {
  return (
    <Card className="p-6 shadow-large bg-gradient-primary text-primary-foreground animate-fade-in-up sticky top-4">
      <h3 className="text-center text-xl font-bold mb-4">Total Nutrition</h3>
      
      <div className="text-center mb-5">
        <div className="text-5xl font-extrabold mb-1">{totalCalories}</div>
        <div className="text-sm opacity-90">Total Calories</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
        <div className="text-center">
          <p className="text-2xl font-bold mb-1">{totalProtein}g</p>
          <p className="text-xs opacity-90">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold mb-1">{totalCarbs}g</p>
          <p className="text-xs opacity-90">Carbs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold mb-1">{totalFat}g</p>
          <p className="text-xs opacity-90">Fat</p>
        </div>
      </div>
    </Card>
  );
};
