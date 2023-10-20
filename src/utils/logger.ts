import _ from 'lodash';

enum LogLevel {
  SILENT = -1 as number,
  ERROR = 0 as number,
  WARN = 1 as number,
  INFO = 2 as number,
  DEBUG = 3 as number,
  TRACE = 4 as number,
}

const logFunctions: {
  [key: number] : (...args: any[]) => void
} = {
    [LogLevel.ERROR]: console.error,
    [LogLevel.WARN]: console.warn,
    [LogLevel.INFO]: console.info,
    [LogLevel.DEBUG]: console.debug,
    [LogLevel.TRACE]: console.trace,
};

const loggerNameMap = {};

let globalLogLevelOverride: LogLevel;
const setGlobalLogLevelOverride = (logLevel: LogLevel): void => {
    globalLogLevelOverride = logLevel;
};

const getLogger = (name = 'Global'): Logger => {
    if (!loggerNameMap[name]) {
        loggerNameMap[name] = new Logger(name);
    }
    return loggerNameMap[name];
};

class Logger {
  private name : string;

  private logLevel: LogLevel = LogLevel.ERROR;

  public setLogLevel = (newLogLevel: LogLevel) => {
      this.logLevel = newLogLevel;
  }

  public getName = (): string => this.name;

  public getLogLevel = (): LogLevel => this.logLevel;

  constructor(name: string) {
      this.name = name;
  }

  public canLog(logLevel: LogLevel): boolean {
      if (logLevel === LogLevel.SILENT) return false;
      if (!_.isUndefined(globalLogLevelOverride)) {
          return globalLogLevelOverride >= logLevel;
      }
      return this.logLevel >= logLevel;
  }

  public async logMessages(args: any[], logLevel: LogLevel): Promise<void> {
      if (this.canLog(logLevel)) {
          const logFn = logFunctions[logLevel];
          if (logFn) {
              logFn(...args);
          }
      }
  }

  public log(...args: any[]): void {
      this.info(args);
  }

  public info(...args: any[]): void {
      this.logMessages(args, LogLevel.INFO);
  }

  public debug(...args: any[]): void {
      this.logMessages(args, LogLevel.DEBUG);
  }

  public trace(...args: any[]): void {
      this.logMessages(args, LogLevel.TRACE);
  }

  public error(...args: any[]): void {
      this.logMessages(args, LogLevel.ERROR);
  }

  public warn(...args: any[]): void {
      this.logMessages(args, LogLevel.WARN);
  }
}

export {
    getLogger,
    Logger,
    setGlobalLogLevelOverride,
    LogLevel,
};
