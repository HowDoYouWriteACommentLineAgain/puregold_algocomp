import { useState } from "react";
import inventoryData from "./data/inventoryData" with { type: 'json' };
import { algorithms, complexityMap, handleSort, handleStepSort } from "./utils/Sorter";
import { Speeds } from "./utils/Speeds";

function App() {
  // Initializing with the first 20 items
  const [items, setItems] = useState(inventoryData.slice(0, 20));
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms.BUBBLE);
  const [stats, setStats] = useState({ time: 0, count: 0 });
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);
  const [stagedColumn, setStagedColumn] = useState('price');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [sortSpeed, setSortSpeed] = useState(Speeds[0].value);
  const [prevTime, setPrevTime] = useState(null);
  const [dataLimit, setDataLimit] = useState(20);

  // Helper to sync data size changes
  const handleLimitChange = (newLimit) => {
    if (isSorting) return;
    setDataLimit(newLimit);
    const freshSlice = inventoryData.slice(0, newLimit);
    setItems(freshSlice);
    setStats({ time: 0, count: 0 });
    setPrevTime(null);
    setActiveIndices([]);
  };

  // Fisher-Yates Shuffle: Fast $O(n)$ scramble
  const handleShuffle = () => {
    if (isSorting) return;
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
    setActiveIndices([]);
    // Stats are preserved as per instructions
  };

  const triggerInstantSort = (field) => {
    setPrevTime(stats.time);
    const result = handleSort(items, selectedAlgo, field, sortConfig.direction);
    setItems(result.sortedData);
    setStats({ time: result.time, count: result.count });
    setSortConfig(prev => ({ ...prev, key: field }));
    setActiveIndices([]);
  };

  const triggerVisualSort = async (field) => {
    setPrevTime(stats.time);
    setIsSorting(true);
    await handleStepSort(
      items,
      selectedAlgo,
      field,
      sortSpeed,
      sortConfig.direction,
      (nextItems, highlightIds, nextCount, nextTime) => {
        setItems(nextItems);
        setActiveIndices(highlightIds);
        setStats({ count: nextCount, time: nextTime });
      }
    );
    setIsSorting(false);
  };

  const toggleDirection = () => {
    setSortConfig(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const dataSizeOptions = [20, 200, inventoryData.length];

  return (
    <main className='min-h-screen px-4 py-6 sm:px-8 bg-gray-50'>
      <section className='mx-auto w-full max-w-6xl rounded-2xl border bg-white p-4 shadow-md sm:p-6'>
        
        {/* Brand Header */}
        <header className='mb-5 rounded-xl bg-[#6A8D73] px-5 py-4 text-white flex justify-between items-center'>
          <div>
            <p className='text-xs font-medium tracking-wider text-green-100 uppercase'>Inventory System</p>
            <h1 className='text-2xl font-semibold'>PUREGOLD DASHBOARD</h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black opacity-60 uppercase">System Status</p>
            <p className="text-xs font-bold text-green-200">{isSorting ? "● PROCESSING" : "● READY"}</p>
          </div>
        </header>

        {/* COMMAND CENTER */}
        <section className='mb-6 flex flex-col gap-4'>
          <div className='rounded-xl border border-[#6A8D73] bg-white p-4 shadow-sm transition-all'>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <label className='text-[10px] font-black uppercase tracking-widest text-[#6A8D73]'>Selected Logic</label>
                <p className="text-sm font-bold text-[#36513f]">{selectedAlgo} <span className="ml-2 font-mono text-xs font-medium opacity-50">({complexityMap[selectedAlgo]})</span></p>
              </div>

              <button
                onClick={() => setIsControlsVisible(!isControlsVisible)}
                className="group flex items-center gap-2 rounded-full bg-[#6A8D73]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#6A8D73] transition-all hover:bg-[#6A8D73] hover:text-white active:scale-95"
              >
                <span>{isControlsVisible ? "Close Settings" : "Adjust Strategy"}</span>
                <svg className={`h-3 w-3 transition-transform duration-300 ${isControlsVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className={`grid transition-all duration-500 ease-in-out ${isControlsVisible ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden space-y-4">
                
                {/* 1. Algorithm Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {Object.values(algorithms).map((algo) => (
                    <button
                      key={algo}
                      disabled={isSorting}
                      onClick={() => setSelectedAlgo(algo)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedAlgo === algo ? 'bg-[#6A8D73] text-white shadow-md' : 'bg-gray-100 text-[#36513f] hover:bg-[#dbe6df]'}`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>

                {/* 2. Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border-2 border-dashed border-[#6A8D73]/20 bg-white/50 p-4">
                  <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-100">
                    <span className="text-[10px] font-black uppercase text-[#6A8D73] ml-2">Visual Speed</span>
                    <div className="flex rounded-md bg-gray-100 p-1">
                      {Speeds.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setSortSpeed(opt.value)}
                          disabled={isSorting}
                          className={`rounded px-3 py-1 text-[10px] font-bold uppercase transition-all ${sortSpeed === opt.value ? "bg-white text-[#6A8D73] shadow-sm" : "text-gray-400"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-100">
                    <span className="text-[10px] font-black uppercase text-[#6A8D73] ml-2">Direction</span>
                    <button 
                      onClick={toggleDirection}
                      disabled={isSorting}
                      className="rounded-md bg-[#6A8D73] px-4 py-1.5 text-[10px] font-black text-white hover:bg-[#4d6a58]"
                    >
                      {stagedColumn.toUpperCase()} {sortConfig.direction === 'asc' ? "↑ ASC" : "↓ DESC"}
                    </button>
                  </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleShuffle}
                    disabled={isSorting}
                    className="flex-1 rounded-lg border-2 border-[#6A8D73] py-3 text-xs font-black uppercase text-[#6A8D73] hover:bg-[#6A8D73] hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    Shuffle
                  </button>
                  <button
                    onClick={() => triggerInstantSort(stagedColumn)}
                    disabled={isSorting}
                    className="flex-1 rounded-lg bg-[#F9DB6D] py-3 text-xs font-black uppercase text-[#36513f] shadow-sm hover:bg-[#f2cc41] active:scale-95 disabled:opacity-50"
                  >
                    Sort 
                  </button>
                  <button
                    onClick={() => triggerVisualSort(stagedColumn)}
                    disabled={isSorting}
                    className={`flex-[2] flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-black uppercase transition-all shadow-md ${isSorting ? "bg-gray-100 text-gray-400" : "bg-[#6A8D73] text-white hover:bg-[#4d6a58] active:scale-95"}`}
                  >
                    {isSorting ? "Visualizing Algorithm..." : "▶ Run Visualizer"}
                  </button>
                </div>
              </div>
            </div>

            {/* DATA CULLING SELECTOR */}
            <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-100 mt-4">
              <div className="flex flex-col ml-2">
                <span className="text-[10px] font-black uppercase text-[#6A8D73]">Data Load</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase">{items.length} Items Active</span>
              </div>
              
              <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                {dataSizeOptions.map((size, idx) => (
                  <button
                    key={`size-${size}-${idx}`}
                    onClick={() => handleLimitChange(size)}
                    disabled={isSorting}
                    className={`px-3 py-1 text-[10px] font-black rounded transition-all ${
                      dataLimit === size ? "bg-[#6A8D73] text-white shadow-sm" : "text-gray-400 hover:text-[#6A8D73]"
                    }`}
                  >
                    {idx === 0 ? "S" : idx === 1 ? "M" : "L"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STATS PANEL */}
          <div className='flex items-center justify-around rounded-xl border border-[#F9DB6D] bg-[#fffdf5] p-4 shadow-sm'>
            <div className="text-center relative">
              <p className="text-[10px] font-bold uppercase text-gray-400">Execution Time</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg font-mono font-bold text-[#36513f]">{stats.time} ms</p>
                {prevTime !== null && prevTime > 0 && stats.time > 0 && (
                  <span className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded ${parseFloat(stats.time) <= parseFloat(prevTime) ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {parseFloat(stats.time) <= parseFloat(prevTime) ? '↓' : '↑'} {Math.abs(((stats.time - prevTime) / prevTime) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>  

            <div className="h-8 w-[1px] bg-gray-200"></div>

            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-gray-400">Comparisons</p>
              <p className="text-lg font-mono font-bold text-[#36513f]">{stats.count.toLocaleString()}</p>
            </div>

            <div className="h-8 w-[1px] bg-gray-200"></div>

            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-gray-400">Amount</p>
              <p className="text-lg font-mono font-bold text-[#36513f]">{items.length.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Inventory Table */}
        <section className='overflow-x-auto rounded-xl border border-[#6A8D73]'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='bg-[#F9DB6D] text-[#243c2f]'>
                <th className='px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider opacity-60'>SKU</th>
                {[
                  { label: 'Item Name', key: 'name' },
                  { label: 'Category', key: 'category' },
                  { label: 'Stock', key: 'stock' },
                  { label: 'Price', key: 'price' }
                ].map((col) => {
                  const isStaged = stagedColumn === col.key;
                  return (
                    <th 
                      key={col.key}
                      className={`px-4 py-3 text-left cursor-pointer select-none transition-all ${isStaged ? 'bg-[#f2cc41] shadow-[inset_0_-3px_0_0_#36513f]' : 'hover:bg-[#f2cc41]/50'}`}
                      onClick={() => {if (!isSorting) { setStagedColumn(col.key); toggleDirection();}}}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{col.label}</span>
                        <span className="text-sm">{isStaged ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : (<span className="opacity-20"> ↕</span>)}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const isHighlighted = activeIndices.includes(index);
                return (
                  <tr key={`${item.id}-${index}`} className={`border-t border-[#edf3ef] transition-all duration-300 ${isHighlighted ? 'bg-[#F9DB6D]/40 ring-2 ring-inset ring-[#F9DB6D]' : 'hover:bg-[#f7fbf8]'}`}>
                    <td className={`px-4 py-3 font-mono text-xs ${isHighlighted ? 'font-bold text-[#36513f]' : 'text-gray-400'}`}>{item.id}</td>
                    <td className="px-4 py-3 font-semibold text-[#243c2f]">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[11px] font-bold transition-colors ${isHighlighted ? 'bg-[#6A8D73] text-white' : 'bg-[#dbe6df] text-[#36513f]'}`}>{item.stock}</span>
                    </td>
                    <td className={`px-4 py-3 font-bold transition-transform ${isHighlighted ? 'scale-110 text-[#6A8D73]' : ''}`}>₱{item.price.toFixed(2)}</td>
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