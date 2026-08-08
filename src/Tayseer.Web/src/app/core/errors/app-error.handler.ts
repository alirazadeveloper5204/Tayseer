import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const message = this.messageOf(error);
    if (message.includes('ResizeObserver loop')) {
      return;
    }
    console.error(error);
  }

  private messageOf(error: unknown): string {
    if (!error) {
      return '';
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error instanceof ErrorEvent) {
      return [error.message, this.messageOf(error.error)].filter(Boolean).join(' ');
    }
    if (error instanceof Error) {
      const cause =
        'cause' in error && error.cause !== undefined ? this.messageOf(error.cause) : '';
      return [error.message, cause].filter(Boolean).join(' ');
    }
    if (typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message ?? '');
    }
    return String(error);
  }
}
