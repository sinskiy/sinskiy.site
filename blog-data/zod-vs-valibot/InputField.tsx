import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export type InputErrors = string[] | undefined;

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  name?: string;
  error: InputErrors;
  type: HTMLInputTypeAttribute;
}

export function InputField({
  id,
  name = id,
  label = id,
  error,
  ...inputProps
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input name={name} id={id} {...inputProps} />
      <p aria-live="polite" style={{ color: "red" }}>
        {error}
      </p>
    </div>
  );
}
