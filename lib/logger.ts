/**
 * Centralized logging utility
 * In production, errors are sent to error tracking service (Sentry)
 * Debug logs are only shown in development
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    // In production, only log errors and warnings
    return level === "error" || level === "warn";
  }

  private formatMessage(message: string, context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return message;
    }
    return `${message} ${JSON.stringify(context)}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(`[DEBUG] ${this.formatMessage(message, context)}`);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(`[INFO] ${this.formatMessage(message, context)}`);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${this.formatMessage(message, context)}`);
      // In production, send to error tracking
      if (!this.isDevelopment && typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).Sentry?.captureMessage(message, {
          level: "warning",
          extra: context,
        });
      }
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${this.formatMessage(message, context)}`, error);
      // In production, send to error tracking
      if (!this.isDevelopment && typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sentry = (window as any).Sentry;
        if (error instanceof Error) {
          sentry?.captureException(error, {
            extra: { message, ...context },
          });
        } else {
          sentry?.captureMessage(message, {
            level: "error",
            extra: { error, ...context },
          });
        }
      }
    }
  }
}

export const logger = new Logger();

