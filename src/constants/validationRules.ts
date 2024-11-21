export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{9}$/,
  required: (value: any) => !!value,
  numeric: (value: number) => typeof value === "number" && value >= 0,
};
