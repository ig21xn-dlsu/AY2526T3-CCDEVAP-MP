// any rejected promise is forwarded to Express's error-handling middleware 
// instead of crashing the process.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}