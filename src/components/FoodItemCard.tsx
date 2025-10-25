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
    <div className="glass-card p-5 rounded-2xl shadow-medium hover:shadow-large transition-all duration-300 animate-scale-in">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-white">{name}</h3>
            <p className="text-sm text-white/60 mt-1">{quantity}</p>
          </div>
          <div className="bg-gradient-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
            {calories.toFixed(2)} cal
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">Protein</p>
            <p className="font-semibold text-white">{protein.toFixed(2)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">Carbs</p>
            <p className="font-semibold text-white">{carbs.toFixed(2)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">Fat</p>
            <p className="font-semibold text-white">{fat.toFixed(2)}g</p>
          </div>
        </div>
      </div>
    </div>
  );
};
