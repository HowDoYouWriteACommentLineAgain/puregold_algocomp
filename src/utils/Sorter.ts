// src/utils/sorter.js

import { items } from "./interfaces";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const handleStepSort = async (data, type, field, speed, updateCallback) => {
  let arr = [...data];
  let comparisons = 0;
  const startTime = performance.now();

  if (type === "Bubble Sort") {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        
        // Use the dynamic speed for the comparison pause
        updateCallback([...arr], [j, j + 1], comparisons, (performance.now() - startTime).toFixed(2));
        await sleep(speed); 

        if (arr[j][field] > arr[j + 1][field]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          updateCallback([...arr], [j, j + 1], comparisons, (performance.now() - startTime).toFixed(2));
          // Use a fraction of the speed for the swap animation
          await sleep(speed / 2); 
        }
      }
    }
    updateCallback([...arr], [], comparisons, (performance.now() - startTime).toFixed(2));
  }
};

export const algorithms = {
  BUBBLE: "Bubble Sort",
  QUICK: "Quick Sort",
  MERGE: "Merge Sort",
};

export const complexityMap = {
  [algorithms.BUBBLE]: "O(n²)",
  [algorithms.QUICK]: "O(n log n)", // Average
  [algorithms.MERGE]: "O(n log n)",
};

export const handleSort = (data:items[], type:string, field:string) => {
  const arr = [...data] as items[];
  let comparisons = 0;
  const startTime = performance.now();

  // --- BUBBLE SORT ---
  if (type === algorithms.BUBBLE) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        if (arr[j][field] > arr[j + 1][field]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
  }

  // --- QUICK SORT ---
  else if (type === algorithms.QUICK) {
    const quickSort = (start:number, end:number) => {
      if (start >= end) return;
      
      // Partitioning logic
      let pivotValue = arr[end][field];
      let pivotIndex = start;
      
      for (let i = start; i < end; i++) {
        comparisons++;
        if (arr[i][field] < pivotValue) {
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

  // --- MERGE SORT ---
  else if (type === algorithms.MERGE) {
    const merge = (left, right) => {
      let result = [];
      while (left.length && right.length) {
        comparisons++;
        if (left[0][field] < right[0][field]) {
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
      const left = mergeSort(array.slice(0, mid));
      const right = mergeSort(array.slice(mid));
      return merge(left, right);
    };
    
    const sorted = mergeSort(arr);
    const endTime = performance.now();
    return { sortedData: sorted, time: (endTime - startTime).toFixed(4), count: comparisons };
  }

  const endTime = performance.now();
  return {
    sortedData: arr,
    time: (endTime - startTime).toFixed(4),
    count: comparisons,
  };
};

