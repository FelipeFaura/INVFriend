import { Injectable } from "@angular/core";
import { Observable, from, throwError } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/compat/storage";

import {
  StorageError,
  FileTooLargeError,
  InvalidFileTypeError,
  UploadFailedError,
  DeleteFailedError,
} from "../../domain/errors/storage-errors";

/**
 * Validation options for file uploads
 */
export interface FileValidationOptions {
  /** Maximum file size in bytes. Default: 2MB (2 * 1024 * 1024) */
  maxSizeBytes: number;
  /** Allowed MIME types. Default: ['image/jpeg', 'image/png', 'image/webp'] */
  allowedTypes: string[];
}

/**
 * Result of file validation
 */
export interface ValidationResult {
  /** Whether the file passed validation */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Default validation options for image uploads
 */
export const DEFAULT_IMAGE_VALIDATION: FileValidationOptions = {
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
};

/**
 * Firebase Storage service for file upload/download operations
 * Handles profile images and other file uploads to Firebase Storage
 */
@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(private readonly storage: AngularFireStorage) {}

  /**
   * Upload a file to Firebase Storage
   * @param file - File to upload
   * @param path - Storage path (e.g., 'users/{userId}/profile')
   * @returns Observable<string> - Download URL
   * @throws UploadFailedError if upload fails
   */
  uploadFile(file: File, path: string): Observable<string> {
    const ref = this.storage.ref(path);

    return from(ref.put(file)).pipe(
      switchMap(() => ref.getDownloadURL()),
      catchError((error) => this.handleStorageError(error)),
    );
  }

  /**
   * Delete a file from Firebase Storage
   * @param path - Storage path or full URL
   * @returns Observable<void>
   * @throws DeleteFailedError if deletion fails
   */
  deleteFile(path: string): Observable<void> {
    // Handle both full URLs and storage paths
    const storagePath = this.extractPathFromUrl(path);
    const ref = this.storage.ref(storagePath);

    return from(ref.delete()).pipe(
      catchError((error) => {
        // Ignore "object-not-found" errors - file already deleted
        if (error?.code === "storage/object-not-found") {
          return from(Promise.resolve());
        }
        return throwError(() => new DeleteFailedError(error?.message));
      }),
    );
  }

  /**
   * Validate a file before upload
   * @param file - File to validate
   * @param options - Validation options (defaults to image validation)
   * @returns ValidationResult with valid status and optional error message
   */
  validateFile(
    file: File,
    options: Partial<FileValidationOptions> = {},
  ): ValidationResult {
    const mergedOptions: FileValidationOptions = {
      ...DEFAULT_IMAGE_VALIDATION,
      ...options,
    };

    // Check file size
    if (file.size > mergedOptions.maxSizeBytes) {
      const maxSizeMB = mergedOptions.maxSizeBytes / 1024 / 1024;
      return {
        valid: false,
        error: `File exceeds maximum size of ${maxSizeMB}MB`,
      };
    }

    // Check file type
    if (!mergedOptions.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${mergedOptions.allowedTypes.join(", ")}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate and throw if file is invalid
   * @param file - File to validate
   * @param options - Validation options
   * @throws FileTooLargeError or InvalidFileTypeError if validation fails
   */
  validateFileOrThrow(
    file: File,
    options: Partial<FileValidationOptions> = {},
  ): void {
    const mergedOptions: FileValidationOptions = {
      ...DEFAULT_IMAGE_VALIDATION,
      ...options,
    };

    if (file.size > mergedOptions.maxSizeBytes) {
      throw new FileTooLargeError(mergedOptions.maxSizeBytes);
    }

    if (!mergedOptions.allowedTypes.includes(file.type)) {
      throw new InvalidFileTypeError(mergedOptions.allowedTypes);
    }
  }

  /**
   * Upload a file with validation
   * @param file - File to upload
   * @param path - Storage path
   * @param options - Validation options
   * @returns Observable<string> - Download URL
   * @throws FileTooLargeError, InvalidFileTypeError, or UploadFailedError
   */
  uploadFileWithValidation(
    file: File,
    path: string,
    options: Partial<FileValidationOptions> = {},
  ): Observable<string> {
    try {
      this.validateFileOrThrow(file, options);
      return this.uploadFile(file, path);
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Extract storage path from a full Firebase Storage URL
   * @param url - Full URL or storage path
   * @returns Storage path
   */
  private extractPathFromUrl(url: string): string {
    // If it's already a path (doesn't start with http), return as-is
    if (!url.startsWith("http")) {
      return url;
    }

    try {
      // Firebase Storage URLs contain the path after /o/ and before ?
      // Example: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?token=...
      const match = url.match(/\/o\/([^?]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    } catch {
      // Fall through to return original
    }

    return url;
  }

  /**
   * Handle Firebase Storage errors and convert to domain errors
   * @param error - Firebase error
   * @returns Observable that throws a StorageError
   */
  private handleStorageError(error: unknown): Observable<never> {
    const firebaseError = error as { code?: string; message?: string };

    switch (firebaseError?.code) {
      case "storage/unauthorized":
        return throwError(
          () =>
            new StorageError("Not authorized to upload files", "UNAUTHORIZED"),
        );
      case "storage/canceled":
        return throwError(
          () => new StorageError("Upload was canceled", "UPLOAD_CANCELED"),
        );
      case "storage/quota-exceeded":
        return throwError(
          () => new StorageError("Storage quota exceeded", "QUOTA_EXCEEDED"),
        );
      default:
        return throwError(
          () =>
            new UploadFailedError(firebaseError?.message || "Upload failed"),
        );
    }
  }
}
