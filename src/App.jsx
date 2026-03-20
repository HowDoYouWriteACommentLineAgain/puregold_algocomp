import { inventoryData } from "./data/inventoryData";

function App() {
  const backend = "--";

  return (
    <main className='min-h-screen px-4 py-6 sm:px-8'>
      <section className='mx-auto w-full max-w-6xl rounded-2xl border bg-white p-4 shadow-md sm:p-6'>
        <header className='mb-5 rounded-xl bg-[#6A8D73] px-5 py-4 text-white'>
          <div>
            <p className='text-xs font-medium tracking-wider text-green-100'>
              INVENTORY SYSTEM
            </p>
            <h1 className='text-2xl font-semibold'>Stock Search Dashboard</h1>
          </div>
        </header>

        {/* search and results */}
        <section className='mb-4 rounded-xl border border-[#6A8D73] bg-white p-4'>
          <label
            htmlFor='inventory-search'
            className='mb-2 block text-sm font-semibold text-[#36513f]'
          >
            Search Items
          </label>
          <input
            id='inventory-search'
            type='text'
            className='w-full rounded-lg border border-[#6A8D73] bg-[#f8fbf7] px-4 py-3 text-sm text-[#243c2f] outline-none focus:border-[#F9DB6D] focus:ring-1 focus:ring-[#F9DB6D]'
            placeholder='Search by SKU, item name, or category'
          />
          <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-[#36513f]'>
            <span className='rounded-md bg-[#F9DB6D] px-3 py-1 font-medium'>
              {backend} results
            </span>
            <span className='rounded-md bg-[#dbe6df] px-3 py-1 font-medium'>
              {backend} ms
            </span>
          </div>
        </section>

        {/* inventory table */}
        <section className='overflow-x-auto rounded-xl border border-[#6A8D73] bg-white'>
          <table className='min-w-full border-collapse text-sm'>
            <thead>
              <tr className='bg-[#F9DB6D] text-left text-[#243c2f]'>
                <th className='px-4 py-3 font-semibold'>SKU</th>
                <th className='px-4 py-3 font-semibold'>Item Name</th>
                <th className='px-4 py-3 font-semibold'>Category</th>
                <th className='px-4 py-3 font-semibold'>Stock</th>
                <th className='px-4 py-3 font-semibold'>Price (PHP)</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr
                  key={item.id}
                  className='border-t border-[#edf3ef] hover:bg-[#f7fbf8]'
                >
                  <td className='px-4 py-3 font-medium text-[#36513f]'>
                    {item.id}
                  </td>
                  <td className='px-4 py-3 text-[#243c2f]'>{item.name}</td>
                  <td className='px-4 py-3 text-[#4d6a58]'>{item.category}</td>
                  <td className='px-4 py-3 text-[#36513f]'>
                    <span className='inline-flex min-w-14 justify-center rounded-md bg-[#dbe6df] px-2 py-1 text-xs font-semibold'>
                      {item.stock}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-[#243c2f]'>
                    ₱{item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

export default App;
