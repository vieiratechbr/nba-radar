export interface ServiceResult<T> {
  data: T;
  source: "espn" | "api" | "mock";
  error?: string;
  message?: string;
  empty?: boolean;
  fallback?: boolean;
}
