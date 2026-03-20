import { useState } from "react";
import { inventoryData } from "./data/inventoryData";
import { handleSort, algorithms, complexityMap, handleStepSort } from "./utils/Sorter";

function App() {
  const [items, setItems] = useState(inventoryData);
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms.BUBBLE);
  const [stats, setStats] = useState({ time: 0, count: 0 });
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);

  const startSlowSort = async (field) => {
    setIsSorting(true);
    await handleStepSort(items, selectedAlgo, field, sortSpeed, (nextItems, highlightIds, nextCount, nextTime) => {
      setItems(nextItems);
      setActiveIndices(highlightIds);
      setStats({ count: nextCount, time: nextTime });
    });
    setIsSorting(false);
  };

  const triggerSort = (field) => {
    const result = handleSort(items, selectedAlgo, field);
    setItems(result.sortedData);
    setStats({ time: result.time, count: result.count });
  };

  const [sortSpeed, setSortSpeed] = useState(1500);

  return (
    <main className='min-h-screen px-4 py-6 sm:px-8 bg-gray-50'>
      <section className='mx-auto w-full max-w-6xl rounded-2xl border bg-white p-4 shadow-md sm:p-6'>

        {/* Header and Brand */}
        <header className='mb-5 rounded-xl bg-[#6A8D73] px-5 py-4 text-white flex justify-between items-center'>
          <div>
            <p className='text-xs font-medium tracking-wider text-green-100'>INVENTORY SYSTEM</p>
            <h1 className='text-2xl font-semibold'>PUREGOLD DASHBOARD</h1>
          </div>
        </header>

        {/* Algorithm Selection & Stats Stack */}
        <section className='mb-4 flex flex-col gap-4'>


          {/* 1. SELECTION PANEL (Vertical Stack) */}
          <div className='rounded-xl border border-[#6A8D73] bg-white p-4 shadow-sm transition-all'>
            <div className="flex items-center justify-between mb-2">
              <label className='text-sm font-semibold text-[#36513f]'>
                Select Algorithm: <span className="text-[#6A8D73] font-mono">{selectedAlgo}</span>
              </label>

              <div className="flex items-center gap-4"> {/* Grouped complexity and button */}
                <div className="text-right">
                  <span className="text-xs opacity-80">Complexity: </span>
                  <span className="font-mono text-sm">{complexityMap[selectedAlgo]}</span>
                </div>

                <button
                  onClick={() => setIsControlsVisible(!isControlsVisible)}
                  className="group flex items-center gap-2 rounded-full bg-[#6A8D73]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#6A8D73] transition-all hover:bg-[#6A8D73] hover:text-white active:scale-95"
                >
                  <span>{isControlsVisible ? "Hide Options" : "Change Algo"}</span>
                  <svg
                    className={`h-3 w-3 transition-transform duration-300 ${isControlsVisible ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* FIXED HEIGHT WRAPPER: This prevents the 'cheating' jump */}
            <div className={`grid transition-all duration-500 ease-in-out ${isControlsVisible
                ? 'grid-rows-[1fr] opacity-100 mt-4 min-h-[220px]' // Set a min-height that fits your buttons + visualizer
                : 'grid-rows-[0fr] opacity-0 mt-0 min-h-0'
              }`}>
              <div className="overflow-hidden">
                {/* Algorithm Buttons */}
                <div className="flex flex-wrap gap-2 pb-4">
                  {Object.values(algorithms).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => {
                        setSelectedAlgo(algo);
                        setIsControlsVisible(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${selectedAlgo === algo
                          ? 'bg-[#6A8D73] text-white shadow-md'
                          : 'bg-gray-100 text-[#36513f] hover:bg-[#dbe6df]'
                        }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>

                {/* Speed & Visualizer Controls */}
                <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-[#6A8D73]/20 bg-white/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#6A8D73]">Simulation Speed</span>
                      <span className="text-xs text-gray-500 italic">Current: {sortSpeed}ms / step</span>
                    </div>

                    <div className="flex rounded-lg bg-gray-100 p-1">
                      {[{ label: "Slow", value: 1500 }, { label: "Normal", value: 500 }, { label: "Fast", value: 100 }].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setSortSpeed(opt.value)}
                          disabled={isSorting}
                          className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase transition-all ${sortSpeed === opt.value ? "bg-white text-[#6A8D73] shadow-sm" : "text-gray-400 hover:text-[#6A8D73]"
                            } ${isSorting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startSlowSort('price')}
                    disabled={isSorting}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-black uppercase tracking-tighter transition-all ${isSorting ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#F9DB6D] text-[#36513f] hover:bg-[#f2cc41] active:scale-95 shadow-md"
                      }`}
                  >
                    {isSorting ? "Sorting..." : "Run Visualizer"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. STATS PANEL (Always Visible, stacked below) */}
          <div className='flex items-center justify-around rounded-xl border border-[#F9DB6D] bg-[#fffdf5] p-4 shadow-sm'>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-gray-400">Execution Time</p>
              <p className="text-lg font-mono font-bold text-[#36513f]">{stats.time} ms</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-gray-400">Comparisons</p>
              <p className="text-lg font-mono font-bold text-[#36513f]">{stats.count.toLocaleString()}</p>
            </div>
          </div>

        </section>

        {/* Inventory Table */}
        <section className='overflow-x-auto rounded-xl border border-[#6A8D73]'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='bg-[#F9DB6D] text-[#243c2f]'>
                <th className='px-4 py-3 text-left'>SKU</th>
                <th className='px-4 py-3 text-left cursor-pointer hover:underline' onClick={() => triggerSort('name')}>Item Name ↕</th>
                <th className='px-4 py-3 text-left'>Category</th>
                <th className='px-4 py-3 text-left cursor-pointer hover:underline' onClick={() => triggerSort('stock')}>Stock ↕</th>
                <th className='px-4 py-3 text-left cursor-pointer hover:underline' onClick={() => triggerSort('price')}>Price ↕</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const isHighlighted = activeIndices.includes(index);

                return (
                  <tr
                    key={item.id}
                    className={`border-t border-[#edf3ef] transition-all duration-300 ${isHighlighted
                        ? 'bg-[#F9DB6D]/40 ring-2 ring-inset ring-[#F9DB6D]'
                        : 'hover:bg-[#f7fbf8]'
                      }`}
                  >
                    <td className={`px-4 py-3 font-mono text-xs ${isHighlighted ? 'font-bold text-[#36513f]' : 'text-gray-400'}`}>
                      {item.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#243c2f]">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[11px] font-bold transition-colors ${isHighlighted ? 'bg-[#6A8D73] text-white' : 'bg-[#dbe6df] text-[#36513f]'
                        }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-bold transition-transform ${isHighlighted ? 'scale-110 text-[#6A8D73]' : ''}`}>
                      ₱{item.price.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

export default App;