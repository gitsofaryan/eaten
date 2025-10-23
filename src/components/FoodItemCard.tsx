import { Card } from "@/components/ui/card";

interface FoodItemCardProps {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FoodItemCard = ({ name, quantity, calories, protein, carbs, fat }: FoodItemCardProps) => {
  return (
    <Card className="p-5 shadow-medium hover:shadow-large transition-shadow duration-300 animate-scale-in">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{quantity}</p>
          </div>
          <div className="bg-gradient-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
            {calories} cal
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Protein</p>
            <p className="font-semibold text-foreground">{protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Carbs</p>
            <p className="font-semibold text-foreground">{carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Fat</p>
            <p className="font-semibold text-foreground">{fat}g</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
