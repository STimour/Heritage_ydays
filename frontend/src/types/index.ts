/** Generic ID type */
export type ID = string | number;

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Generic async state */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Icon component props */
export interface IconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

/** Children prop helper */
export interface WithChildren {
  children: React.ReactNode;
}

/** ClassName prop helper */
export interface WithClassName {
  className?: string;
}
