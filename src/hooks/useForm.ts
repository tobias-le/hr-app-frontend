import { useState, useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";

type FormEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent
  | { target: { name: string; value: any } };

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: FormEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const setField = useCallback((name: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    reset,
    setField,
    isSubmitting,
    setIsSubmitting,
  };
}
