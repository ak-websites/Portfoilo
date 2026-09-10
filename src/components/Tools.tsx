import React, { useState } from "react";

// --- CONVERSION CONSTANTS (1 Sq. Metre = Base unit) ---
const SQ_METERS = {
  sqMeters: 1,
  sqFeet: 10.7639,
  // Terai System
  bigha: 1 / 6772.63,
  kattha: 1 / 338.63,
  dhur: 1 / 16.93,
  // Hill/Valley System
  ropani: 1 / 508.72,
  aana: 1 / 31.80,
  paisa: 1 / 7.95,
  dam: 1 / 1.99,
};

export default function Tools() {
  const [activeTab, setActiveTab] = useState("land");

  // State for Land Converter
  const [sqm, setSqm] = useState(100);

  // State for Triangulation (Heron's Formula)
  const [sideA, setSideA] = useState(10);
  const [sideB, setSideB] = useState(10);
  const [sideC, setSideC] = useState(10);

  // State for Concrete Estimator
  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(4);
  const [thickness, setThickness] = useState(0.15); // in meters
  const [grade, setGrade] = useState("M20"); // Default 1:1.5:3

  // --- LAND CALCULATIONS ---
  const currentSqm = parseFloat(sqm) || 0;
  const sqft = (currentSqm * SQ_METERS.sqFeet).toFixed(2);

  // Breakdown Terai System (Bigha - Kattha - Dhur)
  const bigha = Math.floor(currentSqm / 6772.63);
  const remAfterBigha = currentSqm % 6772.63;
  const kattha = Math.floor(remAfterBigha / 338.63);
  const remAfterKattha = remAfterBigha % 338.63;
  const dhur = (remAfterKattha / 16.93).toFixed(2);

  // Breakdown Hill System (Ropani - Aana - Paisa - Dam)
  const ropani = Math.floor(currentSqm / 508.72);
  const remAfterRopani = currentSqm % 508.72;
  const aana = Math.floor(remAfterRopani / 31.80);
  const remAfterAana = remAfterRopani % 31.80;
  const paisa = Math.floor(remAfterAana / 7.95);
  const remAfterPaisa = remAfterAana % 7.95;
  const dam = (remAfterPaisa / 1.99).toFixed(2);

  // --- TRIANGULATION CALCULATIONS ---
  const a = parseFloat(sideA) || 0;
  const b = parseFloat(sideB) || 0;
  const c = parseFloat(sideC) || 0;
  let triangleArea = 0;
  let isValidTriangle = false;

  if (a + b > c && a + c > b && b + c > a && a > 0 && b > 0 && c > 0) {
    isValidTriangle = true;
    const s = (a + b + c) / 2;
    triangleArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  // --- CONCRETE CALCULATIONS ---
  const wetVolume = (parseFloat(length) || 0) * (parseFloat(width) || 0) * (parseFloat(thickness) || 0);
  const dryVolume = wetVolume * 1.54; // Safety/shrinkage factor for dry concrete
  let cementBags = 0, sandCuFt = 0, aggregateCuFt = 0;

  if (grade === "M20") { // Ratio 1 : 1.5 : 3 (Total = 5.5)
    const cementVol = (1 / 5.5) * dryVolume;
    cementBags = (cementVol / 0.0347).toFixed(1); // 1 bag = 0.0347 m3
    sandCuFt = ((1.5 / 5.5) * dryVolume * 35.3147).toFixed(2);
    aggregateCuFt = ((3 / 5.5) * dryVolume * 35.3147).toFixed(2);
  } else if (grade === "M15") { // Ratio 1 : 2 : 4 (Total = 7)
    const cementVol = (1 / 7) * dryVolume;
    cementBags = (cementVol / 0.0347).toFixed(1);
    sandCuFt = ((2 / 7) * dryVolume * 35.3147).toFixed(2);
    aggregateCuFt = ((4 / 7) * dryVolume * 35.3147).toFixed(2);
  }

  return (
    <section id="tools" className="min-h-screen py-20 px-6 max-w-6xl mx-auto text-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Civil Engineering & Survey Tools
        </h2>
        <p className="text-gray-400 mt-2">
          Nepali land unit converters, field triangulation, and structural estimators.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex justify-center gap-4 mb-10 border-b border-gray-800 pb-4">
        {[
          { id: "land", label: "🇳🇵 Land Unit Converter" },
          { id: "triangulation", label: "📐 Triangulation (Heron's)" },
          { id: "concrete", label: "🏗️ Concrete Quantity Estimator" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB 1: LAND CONVERTER --- */}
      {activeTab === "land" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">Input Land Area</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Area in Square Meters (m²)
              </label>
              <input
                type="number"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter area in m²"
              />
            </div>
            <div className="pt-2">
              <span className="text-sm text-gray-400">Equivalent Square Feet:</span>
              <p className="text-2xl font-bold text-emerald-400">{sqft} sq. ft</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
              <h4 className="text-md font-semibold text-gray-300 mb-2">
                Terai System (Bigha - Kattha - Dhur)
              </h4>
              <p className="text-2xl font-bold text-white">
                {bigha} <span className="text-sm font-normal text-gray-400">Bigha</span>,{" "}
                {kattha} <span className="text-sm font-normal text-gray-400">Kattha</span>,{" "}
                {dhur} <span className="text-sm font-normal text-gray-400">Dhur</span>
              </p>
            </div>

            <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
              <h4 className="text-md font-semibold text-gray-300 mb-2">
                Hill / Valley System (Ropani - Aana - Paisa - Dam)
              </h4>
              <p className="text-2xl font-bold text-white">
                {ropani} <span className="text-sm font-normal text-gray-400">Ropani</span>,{" "}
                {aana} <span className="text-sm font-normal text-gray-400">Aana</span>,{" "}
                {paisa} <span className="text-sm font-normal text-gray-400">Paisa</span>,{" "}
                {dam} <span className="text-sm font-normal text-gray-400">Dam</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: TRIANGULATION --- */}
      {activeTab === "triangulation" && (
        <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-blue-400 mb-4">
            Land Plot Triangulation (Heron's Formula)
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Calculate the exact area of any triangular survey section by entering all three side lengths.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {["A", "B", "C"].map((side, idx) => {
              const setters = [setSideA, setSideB, setSideC];
              const values = [sideA, sideB, sideC];
              return (
                <div key={side}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Side {side} (meters)
                  </label>
                  <input
                    type="number"
                    value={values[idx]}
                    onChange={(e) => setters[idx](e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              );
            })}
          </div>

          {isValidTriangle ? (
            <div className="bg-emerald-950/40 border border-emerald-800/60 p-6 rounded-xl">
              <h4 className="text-sm font-medium text-emerald-400 mb-1">Total Calculated Area</h4>
              <p className="text-3xl font-extrabold text-white">
                {triangleArea.toFixed(3)} <span className="text-lg font-normal text-gray-300">m²</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ≈ {(triangleArea * SQ_METERS.sqFeet).toFixed(2)} sq. ft
              </p>
            </div>
          ) : (
            <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-xl text-red-400 text-sm">
              ⚠️ Invalid Triangle: The sum of any two sides must be strictly greater than the third side.
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: CONCRETE QUANTITY ESTIMATOR --- */}
      {activeTab === "concrete" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">Slab / Structural Dimensions</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Length (m)</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Width (m)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Thickness / Depth (m)</label>
              <input
                type="number"
                step="0.01"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Concrete Mix Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
              >
                <option value="M20">M20 (1 : 1.5 : 3) - Standard Slab/Column</option>
                <option value="M15">M15 (1 : 2 : 4) - PCC / Flooring</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 bg-gray-800/40 p-6 rounded-xl border border-gray-700/40">
            <h3 className="text-xl font-bold text-emerald-400">Estimated Materials</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between border-b border-gray-700 py-2">
                <span>Wet Volume:</span>
                <span className="font-semibold text-white">{wetVolume.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 py-2">
                <span>Dry Volume (× 1.54):</span>
                <span className="font-semibold text-white">{dryVolume.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 py-2">
                <span>Cement Bags Required:</span>
                <span className="font-bold text-blue-400 text-base">{cementBags} Bags</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 py-2">
                <span>Sand Required:</span>
                <span className="font-bold text-emerald-400 text-base">{sandCuFt} cu. ft</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Aggregate (Crushed Stone):</span>
                <span className="font-bold text-amber-400 text-base">{aggregateCuFt} cu. ft</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
