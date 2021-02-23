import { Injectable } from '@angular/core';

// eslint-disable-next-line no-shadow
export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

export class LogEntry {
  entryDate: Date = new Date();
  message = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate = true;

  buildLogString(): string {
      let ret = '';

      if (this.logWithDate) {
          ret = new Date() + ' - ';
      }

      ret += 'Type: ' + LogLevel[this.level];
      ret += ' - Message: ' + this.message;
      if (this.extraInfo.length) {
          ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
      }

      return ret;
  }

  private formatParams(params: any[]): string {
      let ret: string = params.join(',');

      // Is there at least one object in the array?
      if (params.some(p => typeof p == 'object')) {
          ret = '';

          // Build comma-delimited string
          for (const item of params) {
              ret += JSON.stringify(item) + ',';
          }
      }

      return ret;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  level: LogLevel = LogLevel.All;
  logWithDate = true;

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
      this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
      this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
      this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
      this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
      this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
        const entry: LogEntry = new LogEntry();
        entry.message = msg;
        entry.level = level;
        entry.extraInfo = params;
        entry.logWithDate = this.logWithDate;
        console.log(entry.buildLogString());
    }
}

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
        ret = true;
    }
    return ret;
  }

}

