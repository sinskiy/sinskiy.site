import { Form } from "./Form";
import { InputField } from "./InputField";
import type { FormInstanceProps } from "./types";

export function SignUpForm({
  handleSubmit,
  errors,
  formErrors,
}: FormInstanceProps) {
  return (
    <Form handleSubmit={handleSubmit} errors={formErrors}>
      <InputField
        type="email"
        id="email"
        autoComplete="email"
        error={errors?.email}
      />
      <InputField
        type="text"
        id="username"
        autoComplete="username"
        error={errors?.username}
      />
      <InputField
        type="password"
        id="password"
        autoComplete="new-password"
        error={errors?.password}
      />
      <InputField
        type="password"
        id="confirm-password"
        name="confirmPassword"
        label="confirm password"
        autoComplete="new-password"
        error={errors?.confirmPassword}
      />
    </Form>
  );
}
