// levelLogger.js

const LOG_LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];

let currentLogLevelIndex = 0; // Change this to change the log level

const levelLogger = store => next => action => {
  if (
    action.meta &&
    LOG_LEVELS.indexOf(action.meta.logLevel) >= currentLogLevelIndex
  ) {
    console.log(
      `Log level: ${action.meta.logLevel}\nAction type: ${action.type}`,
      action
    );
    console.log('State after action:', store.getState());
  }

  return next(action);
};

export default levelLogger;

export const setLogLevel = level => {
  const index = LOG_LEVELS.indexOf(level);
  if (index !== -1) {
    currentLogLevelIndex = index;
  } else {
    console.warn(
      `Invalid log level: ${level}. Valid levels are: ${LOG_LEVELS.join(', ')}`
    );
  }
};
