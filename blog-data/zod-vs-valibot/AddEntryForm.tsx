import { Form } from "./Form";
import { InputField } from "./InputField";
import type { FormInstanceProps } from "./types";

export function AddEntryForm({
  handleSubmit,
  errors,
  formErrors,
}: FormInstanceProps) {
  return (
    <Form handleSubmit={handleSubmit} errors={formErrors}>
      <InputField
        type="text"
        id="title"
        autoComplete="off"
        error={errors?.title}
      />
      <InputField
        type="text"
        id="description"
        autoComplete="off"
        error={errors?.description}
      />
      <InputField type="date" id="date" error={errors?.date} />
      <InputField
        type="checkbox"
        id="subscribe"
        label="subscribe to updates"
        error={errors?.subscribe}
      />
    </Form>
  );
}
