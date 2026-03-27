/**
 * Domain errors for storage operations in the frontend
 * Used for file upload/download validation and error handling
 */

/**
 * Base storage error class
 */
export class StorageError extends Error {
  /**
   * Creates a StorageError instance
   * @param message - Error message
   * @param code - Error code for classification
   */
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "StorageError";
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

/**
 * Thrown when a file exceeds the maximum allowed size
 */
export class FileTooLargeError extends StorageError {
  constructor(maxSizeBytes: number) {
    const maxSizeMB = maxSizeBytes / 1024 / 1024;
    super(`File exceeds maximum size of ${maxSizeMB}MB`, "FILE_TOO_LARGE");
    this.name = "FileTooLargeError";
    Object.setPrototypeOf(this, FileTooLargeError.prototype);
  }
}

/**
 * Thrown when a file type is not in the allowed types list
 */
export class InvalidFileTypeError extends StorageError {
  constructor(allowedTypes: string[]) {
    super(
      `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
      "INVALID_FILE_TYPE",
    );
    this.name = "InvalidFileTypeError";
    Object.setPrototypeOf(this, InvalidFileTypeError.prototype);
  }
}

/**
 * Thrown when file upload fails
 */
export class UploadFailedError extends StorageError {
  constructor(message = "File upload failed") {
    super(message, "UPLOAD_FAILED");
    this.name = "UploadFailedError";
    Object.setPrototypeOf(this, UploadFailedError.prototype);
  }
}

/**
 * Thrown when file deletion fails
 */
export class DeleteFailedError extends StorageError {
  constructor(message = "File deletion failed") {
    super(message, "DELETE_FAILED");
    this.name = "DeleteFailedError";
    Object.setPrototypeOf(this, DeleteFailedError.prototype);
  }
}

/**
 * Storage error codes for classification
 */
export const STORAGE_ERROR_CODES = {
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  DELETE_FAILED: "DELETE_FAILED",
  UNKNOWN: "UNKNOWN",
} as const;
