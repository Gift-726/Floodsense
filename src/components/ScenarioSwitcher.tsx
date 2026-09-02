import { SCENARIOS, type Scenario } from "@/lib/scenario";

type ScenarioSwitcherProps = {
  scenario: Scenario;
  onChange: (scenario: Scenario) => void;
};

export function ScenarioSwitcher({ scenario, onChange }: ScenarioSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded border border-slate-800 bg-slate-950/85 p-1 backdrop-blur">
      {SCENARIOS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            scenario === id
              ? "bg-blue-500 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
