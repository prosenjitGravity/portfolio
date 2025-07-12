import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OFF = 4,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  data?: any
  source?: string
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private isEnabled = true
  private logLevel: LogLevel = LogLevel.DEBUG
  private logHistory: LogEntry[] = []
  private maxHistorySize = 1000

  constructor() { }

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Set minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  /**
   * Check if logging is enabled for given level
   */
  private shouldLog(level: LogLevel): boolean {
    return this.isEnabled && level >= this.logLevel && this.logLevel !== LogLevel.OFF
  }

  /**
   * Create log entry and add to history
   */
  private createLogEntry(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      source,
    }

    // Add to history (keep only recent entries)
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }

    return entry;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString()
    const level = LogLevel[entry.level].padEnd(5)
    const source = entry.source ? `[${entry.source}]` : ""
    return `${timestamp} ${level} ${source} ${entry.message}`
  }

  /**
   * Get appropriate console method and styling
   */
  private getConsoleMethod(level: LogLevel): { method: any; style: string } {
    switch (level) {
      case LogLevel.DEBUG:
        return {
          method: console.debug,
          style: "color: #6B7280; font-weight: normal;",
        }
      case LogLevel.INFO:
        return {
          method: console.info,
          style: "color: #3B82F6; font-weight: normal;",
        }
      case LogLevel.WARN:
        return {
          method: console.warn,
          style: "color: #F59E0B; font-weight: bold;",
        }
      case LogLevel.ERROR:
        return {
          method: console.error,
          style: "color: #EF4444; font-weight: bold;",
        }
      default:
        return {
          method: console.log,
          style: "color: inherit; font-weight: normal;",
        }
    }
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry = this.createLogEntry(level, message, data, source)
    const formattedMessage = this.formatMessage(entry)
    const { method, style } = this.getConsoleMethod(level)

    // Log with styling
    if (data !== undefined) {
      method(`%c${formattedMessage}`, style, data)
    } else {
      method(`%c${formattedMessage}`, style)
    }
  }
  /**
   * Debug level logging
   */
  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source)
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source)
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source)
  }

  /**
   * Error level logging
   */
  error(message: string, error?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, error, source)
  }

  /**
   * Log HTTP requests
   */
  logHttpRequest(method: string, url: string, body?: any): void {
    this.debug(`HTTP ${method.toUpperCase()} ${url}`, body, "HTTP")
  }

  /**
   * Log HTTP responses
   */
  logHttpResponse(method: string, url: string, status: number, response?: any): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG
    this.log(level, `HTTP ${method.toUpperCase()} ${url} - ${status}`, response, "HTTP")
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number): void {
    this.info(`Performance: ${operation} completed in ${duration}ms`, undefined, "PERF")
  }

  /**
   * Get log history
   */
  getLogHistory(): LogEntry[] {
    return [...this.logHistory]
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2)
  }

  /**
   * Get current configuration
   */
  getConfig(): { enabled: boolean; level: LogLevel; historySize: number } {
    return {
      enabled: this.isEnabled,
      level: this.logLevel,
      historySize: this.logHistory.length,
    }
  }
}
