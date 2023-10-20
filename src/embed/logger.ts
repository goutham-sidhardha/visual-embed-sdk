const logger = console;

enum LogLevel {
  SILENT = -1 as number,
  ERROR = 0 as number,
  WARN = 1 as number,
  INFO = 2 as number,
  DEBUG = 3 as number,
  TRACE = 4 as number,
}

const loggerNameMap = {};

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

  public getName = () => this.name;

  public getLogLevel = () => this.logLevel;

  constructor(name: string) {
      this.name = name;
  }

  public canLog(logLevel: LogLevel) {
      return this.logLevel >= logLevel;
  }

  public async logMessages(args: any[], logLevel: LogLevel) {
      if (this.canLog(logLevel)) { logger.log(...args); }
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
};
