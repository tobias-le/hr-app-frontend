import { useSnackbarStore } from "../components/GlobalSnackbar";

export const handleApiError = (error: unknown, customMessage?: string) => {
  const { showMessage } = useSnackbarStore.getState();
  console.error(error);
  showMessage(customMessage || "An error occurred");
};
