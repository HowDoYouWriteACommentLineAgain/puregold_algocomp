import { items } from "./interfaces";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const algorithms = {
  BUBBLE: "Bubble Sort",
  QUICK: "Quick Sort",
  MERGE: "Merge Sort",
};

export const complexityMap = {
  [algorithms.BUBBLE]: "O(n²)",
  [algorithms.QUICK]: "O(n log n)",
  [algorithms.MERGE]: "O(n log n)",
};

// Add this to your Sorter.js
export const handleSort = (data, type, field, direction) => {
  const startTime = performance.now();
  let comparisons = 0;
  let arr = [...data];

  // Logic for the instant sort
  arr.sort((a, b) => {
    comparisons++;
    const valA = a[field];
    const valB = b[field];

    if (direction === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const endTime = performance.now();

  return {
    sortedData: arr,
    time: (endTime - startTime).toFixed(4), // High precision for instant sorts
    count: comparisons
  };
};

export const handleStepSort = async (data:items[], type, field, speed, direction, updateCallback) => {
  let arr = [...data];
  let comparisons = 0;
  const startTime = performance.now();

  const getTime = () => (performance.now() - startTime).toFixed(2);

  // --- BUBBLE SORT ---
  if (type === algorithms.BUBBLE) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        
        // Highlight comparison
        updateCallback([...arr], [j, j + 1], comparisons, getTime());
        await sleep(speed);

        const shouldSwap = direction === 'asc' 
          ? arr[j][field] > arr[j + 1][field] 
          : arr[j][field] < arr[j + 1][field];

        if (shouldSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          updateCallback([...arr], [j, j + 1], comparisons, getTime());
          await sleep(speed / 2);
        }
      }
    }
  }

  // --- QUICK SORT (Lomuto Partition) ---
  if (type === algorithms.QUICK) {
    const quickSort = async (low, high) => {
      if (low < high) {
        let pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
      }
    };

    const partition = async (low, high) => {
      let pivotValue = arr[high][field];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        updateCallback([...arr], [j, high], comparisons, getTime());
        await sleep(speed);

        const shouldSwap = direction === 'asc' 
          ? arr[j][field] < pivotValue 
          : arr[j][field] > pivotValue;

        if (shouldSwap) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          updateCallback([...arr], [i, j], comparisons, getTime());
          await sleep(speed / 2);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      updateCallback([...arr], [i + 1, high], comparisons, getTime());
      return i + 1;
    };

    await quickSort(0, arr.length - 1);
  }

  // --- MERGE SORT (In-Place / Block Merge) ---
  if (type === algorithms.MERGE) {
    const merge = async (l, m, r) => {
      let start2 = m + 1;

      // Check if already sorted
      const alreadySorted = direction === 'asc' 
        ? arr[m][field] <= arr[start2][field] 
        : arr[m][field] >= arr[start2][field];

      if (alreadySorted) return;

      while (l <= m && start2 <= r) {
        comparisons++;
        updateCallback([...arr], [l, start2], comparisons, getTime());
        await sleep(speed);

        const isLeftCorrect = direction === 'asc' 
          ? arr[l][field] <= arr[start2][field] 
          : arr[l][field] >= arr[start2][field];

        if (isLeftCorrect) {
          l++;
        } else {
          let value = arr[start2];
          let index = start2;

          while (index !== l) {
            arr[index] = arr[index - 1];
            index--;
          }
          arr[l] = value;

          updateCallback([...arr], [l], comparisons, getTime());
          await sleep(speed / 2);

          l++; m++; start2++;
        }
      }
    };

    const mSort = async (l, r) => {
      if (l < r) {
        let m = Math.floor(l + (r - l) / 2);
        await mSort(l, m);
        await mSort(m + 1, r);
        await merge(l, m, r);
      }
    };

    await mSort(0, arr.length - 1);
  }

  // Final cleanup: Clear highlights
  updateCallback([...arr], [], comparisons, getTime());
};