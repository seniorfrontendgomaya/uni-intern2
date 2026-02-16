export abstract class BaseError extends Error {
    readonly code: string;
    readonly status?: number;
    readonly meta?: unknown;
    
  
    protected constructor(
      message: string,
      code: string,
      status?: number,
      meta?: unknown
    ) {
      super(message);
      this.code = code;
      this.status = status;
      this.meta = meta;
    }
  }
  