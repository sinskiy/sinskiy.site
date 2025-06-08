import type { FormEventHandler } from "react";
import type { FormErrors } from "./Form";
import type { InputErrors } from "./InputField";

export interface FormInstanceProps {
  handleSubmit: FormEventHandler;
  formErrors: FormErrors;
  errors:
    | {
        [key: string]: InputErrors;
      }
    | undefined;
}
