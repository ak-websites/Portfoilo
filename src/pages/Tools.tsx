import React, { useState } from 'react';
import { Compass, Calculator, Layers, ArrowRightLeft, LucideIcon } from 'lucide-react';

// Conversion constants (1 Sq. Meter = Base unit)
const SQ_METERS = {
  sqFeet: 10.7639,
  // Terai System
  bigha: 1 / 6772.63,
  kattha: 1 / 338.63,
  dhur: 1 / 16.93,
  // Hill / Valley System
  ropani: 1 / 508.72,
  aana: 1 / 31.80,
  paisa: 1 / 7.95,
  dam: 1 / 1.99,
} as const;

type ToolTab = 'land' | 'triangulation' | 'concrete';
type ConcreteGrade = 'M20' | 'M15';

interface TabItem {
  id: ToolTab;
  label: string;
  icon: LucideIcon;
}

export default function Tools(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ToolTab>('land');

  // State: Land Unit Converter
  const [sqm, setSqm] = useState<number | string>(100);

  // State: Triangulation (Heron's Formula)
  const [sideA, setSideA] = useState<number | string>(10);
  const [sideB, setSideB] = useState<number | string>(10);
  const [sideC, setSideC] = useState<number | string>(10);

  // State: Concrete Quantity Estimator
  const [length, setLength] = useState<number | string>(5);
  const [width, setWidth] = useState<number | string>(4);
  const [thickness, setThickness] = useState<number | string>(0.15);
  const [grade, setGrade] = useState<ConcreteGrade>('M20');

  // --- LAND CALCULATIONS ---
  const currentSqm = typeof sqm === 'number' ? sqm : parseFloat(sqm) || 0;
  const sqft = (currentSqm * SQ_METERS.sqFeet).toFixed(2);

  // Terai System Breakdown (Bigha - Kattha - Dhur)
  const bigha = Math.floor(currentSqm / 6772.63);
  const remBigha = currentSqm % 6772.63;
  const kattha = Math.floor(remBigha / 338.63);
  const remKattha = remBigha % 338.63;
  const dhur = (remKattha / 16.93).toFixed(2);

  // Hill System Breakdown (Ropani - Aana - Paisa - Dam)
  const ropani = Math.floor(currentSqm / 508.72);
  const remRopani = currentSqm % 508.72;
  const aana = Math.floor(remRopani / 31.80);
  const remAana = remRopani % 31.80;
  const paisa = Math.floor(remAana / 7.95);
  const remPaisa = remAana % 7.95;
  const dam = (remPaisa / 1.99).toFixed(2);

  // --- TRIANGULATION CALCULATIONS ---
  const a = typeof sideA === 'number' ? sideA : parseFloat(sideA) || 0;
  const b = typeof sideB === 'number' ? sideB : parseFloat(sideB) || 0;
  const c = typeof sideC === 'number' ? sideC : parseFloat(sideC) || 0;
  let triangleArea = 0;
  let isValidTriangle = false;

  if (a + b > c && a + c > b && b + c > a && a > 0 && b > 0 && c > 0) {
    isValidTriangle = true;
    const s = (a + b + c) / 2;
    triangleArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  // --- CONCRETE CALCULATIONS ---
  const lVal = typeof length === 'number' ? length : parseFloat(length) || 0;
  const wVal = typeof width === 'number' ? width : parseFloat(width) || 0;
  const tVal = typeof thickness === 'number' ? thickness : parseFloat(thickness) || 0;

  const wetVolume = lVal * wVal * tVal;
  const dryVolume = wetVolume * 1.54;
  let cementBags = '0.0';
  let sandCuFt = '0.00';
  let aggregateCuFt = '0.00';

  if (grade === 'M20') {
    const cementVol = (1 / 5.5) * dryVolume;
    cementBags = (cementVol / 0.0347).toFixed(1);
    sandCuFt = ((1.5 / 5.5) * dryVolume * 35.3147).toFixed(2);
    aggregateCuFt = ((3 / 5.5) * dryVolume * 35.3147).toFixed(2);
  } else if (grade === 'M15') {
    const cementVol = (1 / 7) * dryVolume;
    cementBags = (cementVol / 0.0347).toFixed(1);
    sandCuFt = ((2 / 7) * dryVolume * 35.3147).toFixed(2);
    aggregateCuFt = ((4 / 7) * dryVolume * 35.3147).toFixed(2);
  }

  const tabs: TabItem[] = [
    { id: 'land', label: 'Land Converter', icon: ArrowRightLeft },
    { id: 'triangulation', label: 'Triangulation Tool', icon: Compass },
    { id: 'concrete', label: 'Concrete Estimator', icon: Layers },
  ];

  return (
    <div className="pt-28 pb-16 px-4 md:px-12 max-w-6xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Engineering & Surveying Tools
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl mx-auto">
          Nepali land unit converters, field plot triangulation, and structural material estimation tools tailored for civil engineering applications.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 border-b border-border pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Land Unit Converter */}
      {activeTab === 'land' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass p-6 md:p-8 rounded-[2rem] border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-primary">
              Area Input
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Square Meters (m²)
              </label>
              <input
                type="number"
                value={sqm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSqm(e.target.value)}
                className="w-full bg-accent/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                placeholder="Enter area in m²"
              />
            </div>
            <div className="p-4 bg-accent/30 rounded-xl border border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Square Feet Equivalent
              </span>
              <p className="text-2xl font-black text-primary mt-1">{sqft} sq. ft</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-accent/40 border border-border">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                Terai Region (Bigha - Kattha - Dhur)
              </h3>
              <p className="text-xl md:text-2xl font-black">
                {bigha} <span className="text-xs font-bold text-muted-foreground">Bigha</span>,{' '}
                {kattha} <span className="text-xs font-bold text-muted-foreground">Kattha</span>,{' '}
                {dhur} <span className="text-xs font-bold text-muted-foreground">Dhur</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-accent/40 border border-border">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                Hill / Valley Region (Ropani - Aana - Paisa - Dam)
              </h3>
              <p className="text-xl md:text-2xl font-black">
                {ropani} <span className="text-xs font-bold text-muted-foreground">Ropani</span>,{' '}
                {aana} <span className="text-xs font-bold text-muted-foreground">Aana</span>,{' '}
                {paisa} <span className="text-xs font-bold text-muted-foreground">Paisa</span>,{' '}
                {dam} <span className="text-xs font-bold text-muted-foreground">Dam</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Triangulation */}
      {activeTab === 'triangulation' && (
        <div className="glass p-6 md:p-8 rounded-[2rem] border border-border max-w-3xl mx-auto">
          <h2 className="text-lg font-black uppercase tracking-wider text-primary mb-1">
            Heron's Formula Plot Area
          </h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
            Calculate exact irregular plot surface area from boundary side measurements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Side A (m)', val: sideA, set: setSideA },
              { label: 'Side B (m)', val: sideB, set: setSideB },
              { label: 'Side C (m)', val: sideC, set: setSideC },
            ].map((item, idx) => (
              <div key={idx}>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {item.label}
                </label>
                <input
                  type="number"
                  value={item.val}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => item.set(e.target.value)}
                  className="w-full bg-accent/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                />
              </div>
            ))}
          </div>

          {isValidTriangle ? (
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Calculated Area
              </span>
              <p className="text-3xl font-black mt-1">
                {triangleArea.toFixed(3)} <span className="text-sm font-bold text-muted-foreground">m²</span>
              </p>
              <p className="text-xs font-bold text-muted-foreground mt-1">
                ≈ {(triangleArea * SQ_METERS.sqFeet).toFixed(2)} sq. ft
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-wider">
              ⚠️ Invalid Triangle: The sum of any two side lengths must be strictly greater than the third side.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Concrete Quantity Estimator */}
      {activeTab === 'concrete' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass p-6 md:p-8 rounded-[2rem] border border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-primary">
              Structure Dimensions
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Length (meters)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLength(e.target.value)}
                className="w-full bg-accent/50 border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Width (meters)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)}
                className="w-full bg-accent/50 border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Thickness / Depth (meters)
              </label>
              <input
                type="number"
                step="0.01"
                value={thickness}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThickness(e.target.value)}
                className="w-full bg-accent/50 border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Concrete Mix Grade
              </label>
              <select
                value={grade}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value as ConcreteGrade)}
                className="w-full bg-accent/50 border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
              >
                <option value="M20">M20 (1 : 1.5 : 3) - Beams / Slabs</option>
                <option value="M15">M15 (1 : 2 : 4) - PCC / Flooring</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 bg-accent/30 p-6 rounded-2xl border border-border flex flex-col justify-center">
            <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-2">
              Materials Estimate
            </h3>
            <div className="flex justify-between border-b border-border pb-2 text-xs font-bold">
              <span className="text-muted-foreground">Wet Volume:</span>
              <span>{wetVolume.toFixed(2)} m³</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2 text-xs font-bold">
              <span className="text-muted-foreground">Dry Volume (× 1.54):</span>
              <span>{dryVolume.toFixed(2)} m³</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2 text-xs font-bold">
              <span className="text-muted-foreground">Cement Bags:</span>
              <span className="text-primary font-black">{cementBags} Bags</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2 text-xs font-bold">
              <span className="text-muted-foreground">Sand Volume:</span>
              <span>{sandCuFt} cu. ft</span>
            </div>
            <div className="flex justify-between pt-1 text-xs font-bold">
              <span className="text-muted-foreground">Aggregate Volume:</span>
              <span>{aggregateCuFt} cu. ft</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
