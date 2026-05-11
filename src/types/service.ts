export interface ServiceResult<T> {
  data: T;
  source: "espn" | "highlightly" | "api" | "mock";
  error?: string;
  message?: string;
  empty?: boolean;
  fallback?: boolean;
}
