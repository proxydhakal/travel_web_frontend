import { useState } from "react";
import { ApiError } from "./api";
import { useToast } from "../context/ToastContext";

export function useNotify() {
  const { push } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const run = async (work: () => Promise<void>, success: string) => {
    setErrors({});
    try {
      await work();
      push(success, "success");
      return true;
    } catch (reason) {
      if (reason instanceof ApiError) {
        setErrors(reason.errors);
        push(reason.message, "error");
      } else {
        push("Something went wrong. Try again.", "error");
      }
      return false;
    }
  };

  return { errors, run, setErrors };
}
