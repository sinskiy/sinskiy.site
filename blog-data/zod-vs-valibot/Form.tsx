import type { FormEventHandler, PropsWithChildren } from "react";

export type FormErrors = string[] | undefined;

interface FormProps extends PropsWithChildren {
  handleSubmit: FormEventHandler;
  errors: FormErrors;
}

export function Form({ handleSubmit, errors, children }: FormProps) {
  return (
    <form onSubmit={handleSubmit}>
      <p aria-live="polite" style={{ color: "red" }}>
        {errors?.join("; ")}
      </p>
      {children}
      <button type="submit">submit</button>
    </form>
  );
}
