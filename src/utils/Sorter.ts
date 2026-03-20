const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const algorithms = {
  BUBBLE: "Bubble Sort",
  INSERTION: "Insertion Sort",
  QUICK: "Quick Sort",
  MERGE: "Merge Sort",
  COUNTING: "Counting Sort", // ✅ NEW
};

export const complexityMap = {
  [algorithms.BUBBLE]: "O(n²)",
  [algorithms.INSERTION]: "O(n²)",
  [algorithms.QUICK]: "O(n log n)",
  [algorithms.MERGE]: "O(n log n)",
  [algorithms.COUNTING]: "O(n + k)", // ✅ NEW
};

// --- INSTANT SORT ---
export const handleSort = (data, type, field, direction) => {
  const arr = [...data];
  let comparisons = 0;
  const startTime = performance.now();
  const isAsc = direction === 'asc';

  // ✅ COUNTING SORT
  if (type === algorithms.COUNTING) {
    // works best for numeric fields (price, stock)
    const values = arr.map(item => Math.floor(item[field]));
    const max = Math.max(...values);
    const min = Math.min(...values);

    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    // count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[values[i] - min]++;
    }

    // prefix sum
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    // build output (stable)
    for (let i = arr.length - 1; i >= 0; i--) {
      const val = values[i];
      const idx = count[val - min] - 1;
      output[idx] = arr[i];
      count[val - min]--;
    }

    if (!isAsc) output.reverse();

    return {
      sortedData: output,
      time: (performance.now() - startTime).toFixed(4),
      count: arr.length // counting sort doesn't compare traditionally
    };
  }

  // --- EXISTING ALGORITHMS BELOW (UNCHANGED) ---

  if (type === algorithms.BUBBLE) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        const shouldSwap = isAsc ? arr[j][field] > arr[j + 1][field] : arr[j][field] < arr[j + 1][field];
        if (shouldSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
  } 
  
  else if (type === algorithms.INSERTION) {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;
        const condition = isAsc
          ? arr[j][field] > key[field]
          : arr[j][field] < key[field];

        if (!condition) break;

        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
  }

  else if (type === algorithms.QUICK) {
    const quickSort = (start, end) => {
      if (start >= end) return;
      let pivotValue = arr[end][field];
      let pivotIndex = start;
      for (let i = start; i < end; i++) {
        comparisons++;
        const shouldSwap = isAsc ? arr[i][field] < pivotValue : arr[i][field] > pivotValue;
        if (shouldSwap) {
          [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
          pivotIndex++;
        }
      }
      [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
      quickSort(start, pivotIndex - 1);
      quickSort(pivotIndex + 1, end);
    };
    quickSort(0, arr.length - 1);
  } 
  
  else if (type === algorithms.MERGE) {
    const merge = (left, right) => {
      let result = [];
      while (left.length && right.length) {
        comparisons++;
        const condition = isAsc
          ? left[0][field] < right[0][field]
          : left[0][field] > right[0][field];

        if (condition) result.push(left.shift());
        else result.push(right.shift());
      }
      return [...result, ...left, ...right];
    };

    const mergeSort = (array) => {
      if (array.length <= 1) return array;
      const mid = Math.floor(array.length / 2);
      return merge(mergeSort(array.slice(0, mid)), mergeSort(array.slice(mid)));
    };

    const sorted = mergeSort(arr);
    return {
      sortedData: sorted,
      time: (performance.now() - startTime).toFixed(4),
      count: comparisons
    };
  }

  return {
    sortedData: arr,
    time: (performance.now() - startTime).toFixed(4),
    count: comparisons
  };
};

// --- VISUAL SORT ---
export const handleStepSort = async (data, type, field, speed, direction, updateCallback) => {
  let arr = [...data];
  let comparisons = 0;
  const startTime = performance.now();
  const isAsc = direction === 'asc';
  const getT = () => (performance.now() - startTime).toFixed(2);

  // ✅ COUNTING SORT VISUAL
  if (type === algorithms.COUNTING) {
    const values = arr.map(item => Math.floor(item[field]));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min + 1;

    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    // counting phase
    for (let i = 0; i < arr.length; i++) {
      count[values[i] - min]++;
      updateCallback([...arr], [i], comparisons, getT());
      await sleep(speed);
    }

    // prefix sum
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
      await sleep(speed / 2);
    }

    // build output
    for (let i = arr.length - 1; i >= 0; i--) {
      const val = values[i];
      const idx = count[val - min] - 1;
      output[idx] = arr[i];
      count[val - min]--;

      updateCallback([...output.filter(Boolean), ...arr.slice(output.length)], [idx], comparisons, getT());
      await sleep(speed);
    }

    if (!isAsc) output.reverse();

    updateCallback([...output], [], comparisons, getT());
    return;
  }

  // keep your existing insertion / others BELOW unchanged

  updateCallback([...arr], [], comparisons, getT());
};