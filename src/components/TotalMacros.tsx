interface TotalMacrosProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export const TotalMacros = ({ totalCalories, totalProtein, totalCarbs, totalFat }: TotalMacrosProps) => {
  return (
    <div className="glass-card-strong p-6 rounded-2xl shadow-large animate-fade-in-up sticky top-4">
      <h3 className="text-center text-xl font-bold mb-4 text-white">Total</h3>

      <div className="text-center mb-5">
        <div className="text-5xl font-extrabold mb-1 text-white">{totalCalories.toFixed(2)}</div>
        <div className="text-sm text-white/70">Calories</div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
        <div className="text-center">
          <p className="text-2xl font-bold mb-1 text-white">{totalProtein.toFixed(2)}g</p>
          <p className="text-xs text-white/70">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold mb-1 text-white">{totalCarbs.toFixed(2)}g</p>
          <p className="text-xs text-white/70">Carbs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold mb-1 text-white">{totalFat.toFixed(2)}g</p>
          <p className="text-xs text-white/70">Fat</p>
        </div>
      </div>
    </div>
  );
};
