export const logInfo = (...args) => {
  console.log("[INFO]", ...args);
};

export const logError = (...args) => {
  console.error("[ERROR]", ...args);
};

export const getLogger = (namespace) => {
  return {
    info: (...args) => {
      console.log(`[INFO][${namespace}]`, ...args);
    },
    error: (...args) => {
      console.error(`[ERROR][${namespace}]`, ...args);
    },
    warn: (...args) => {
      console.warn(`[WARN][${namespace}]`, ...args);
    },
    debug: (...args) => {
      console.log(`[DEBUG][${namespace}]`, ...args);
    },
  };
};