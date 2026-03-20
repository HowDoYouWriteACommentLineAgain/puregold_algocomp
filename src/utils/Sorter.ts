// src/utils/sorter.js

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

// --- INSTANT SORT (For measurement/instant results) ---
export const handleSort = (data, type, field, direction) => {
  const arr = [...data];
  let comparisons = 0;
  const startTime = performance.now();

  const isAsc = direction === 'asc';

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
        const leftValue = left[0][field];
        const rightValue = right[0][field];
        const condition = isAsc ? leftValue < rightValue : leftValue > rightValue;
        if (condition) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
      return [...result, ...left, ...right];
    };

    const mergeSort = (array) => {
      if (array.length <= 1) return array;
      const mid = Math.floor(array.length / 2);
      return merge(mergeSort(array.slice(0, mid)), mergeSort(array.slice(mid)));
    };
    const sorted = mergeSort(arr);
    return { sortedData: sorted, time: (performance.now() - startTime).toFixed(4), count: comparisons };
  }

  const endTime = performance.now();
  return { sortedData: arr, time: (endTime - startTime).toFixed(4), count: comparisons };
};

// --- VISUAL STEP SORT (For the visualization) ---
export const handleStepSort = async (data, type, field, speed, direction, updateCallback) => {
  let arr = [...data];
  let comparisons = 0;
  const startTime = performance.now();
  const isAsc = direction === 'asc';
  const getT = () => (performance.now() - startTime).toFixed(2);

  if (type === algorithms.BUBBLE) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        updateCallback([...arr], [j, j + 1], comparisons, getT());
        await sleep(speed);
        const shouldSwap = isAsc ? arr[j][field] > arr[j + 1][field] : arr[j][field] < arr[j + 1][field];
        if (shouldSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          updateCallback([...arr], [j, j + 1], comparisons, getT());
          await sleep(speed / 2);
        }
      }
    }
  } 
  
  else if (type === algorithms.QUICK) {
    const quickSort = async (start, end) => {
      if (start >= end) return;
      let pivotValue = arr[end][field];
      let pivotIndex = start;
      for (let i = start; i < end; i++) {
        comparisons++;
        updateCallback([...arr], [i, end], comparisons, getT());
        await sleep(speed);
        const shouldSwap = isAsc ? arr[i][field] < pivotValue : arr[i][field] > pivotValue;
        if (shouldSwap) {
          [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
          pivotIndex++;
          updateCallback([...arr], [i, pivotIndex], comparisons, getT());
        }
      }
      [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
      updateCallback([...arr], [pivotIndex, end], comparisons, getT());
      await sleep(speed);
      await quickSort(start, pivotIndex - 1);
      await quickSort(pivotIndex + 1, end);
    };
    await quickSort(0, arr.length - 1);
  }

  else if (type === algorithms.MERGE) {
    const merge = async (start, mid, end) => {
      let left = arr.slice(start, mid + 1);
      let right = arr.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;

      while (i < left.length && j < right.length) {
        comparisons++;
        updateCallback([...arr], [k], comparisons, getT());
        await sleep(speed);
        const condition = isAsc ? left[i][field] < right[j][field] : left[i][field] > right[j][field];
        if (condition) {
          arr[k] = left[i++];
        } else {
          arr[k] = right[j++];
        }
        k++;
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];
      updateCallback([...arr], [], comparisons, getT());
    };

    const mSort = async (l, r) => {
      if (l < r) {
        let m = Math.floor((l + r) / 2);
        await mSort(l, m);
        await mSort(m + 1, r);
        await merge(l, m, r);
      }
    };
    await mSort(0, arr.length - 1);
  }

  updateCallback([...arr], [], comparisons, getT());
};