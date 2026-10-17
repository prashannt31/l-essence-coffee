import {
  Leaf,
  BookOpen,
  Coffee,
  PackageCheck,
  Truck,
  BarChart3,
} from "lucide-react";

type Props = {
  setActiveSection: (section: string) => void;
};

export default function QuickActions({
  setActiveSection,
}: Props) {
  const actions = [
    {
      icon: Leaf,
      label: "Add Ingredient",
      section: "ingredients",
    },
    {
      icon: BookOpen,
      label: "Add Recipe",
      section: "recipes",
    },
    {
      icon: Coffee,
      label: "Add Menu Item",
      section: "menu",
    },
    {
      icon: PackageCheck,
      label: "Stock Adjustment",
      section: "inventory",
    },
    {
      icon: Truck,
      label: "View Suppliers",
      section: "suppliers",
    },
    {
      icon: BarChart3,
      label: "Generate Report",
      section: "analytics",
    },
  ];

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              onClick={() =>
                setActiveSection(action.section)
              }
              className="border border-zinc-800 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
            >
              <Icon size={30} />
              <span className="text-sm">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}