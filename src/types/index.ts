export interface AppTheme {
  palette: {
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
    background: {
      default: string;
    };
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
