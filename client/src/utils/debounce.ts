type VoidFunction = () => void;

export default function debounce(fn: VoidFunction, delay = 0.5): VoidFunction {
  let timeout = null;
  const debouncedFunction = function () {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(fn, delay * 1000);
  };
  return debouncedFunction;
}
