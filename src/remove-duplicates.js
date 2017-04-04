const unique = (...args) => {
  const set = new Set();
  args.forEach(arg => set.add(arg, arg));
  return [...set];
};

export default unique;
