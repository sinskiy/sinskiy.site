import { Form } from "./Form";
import { InputField } from "./InputField";
import type { FormInstanceProps } from "./types";

export function AddPersonForm({
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
        id="full-name"
        name="fullName"
        label="full name"
        autoComplete="name"
        error={errors?.fullName}
      />
      <InputField
        type="tel"
        id="phone"
        autoComplete="tel"
        error={errors?.phone}
      />
      <InputField type="date" id="birthday" error={errors?.birthday} />
    </Form>
  );
}
