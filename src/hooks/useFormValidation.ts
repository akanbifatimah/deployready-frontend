import { useState, type ChangeEvent } from 'react';

type FieldErrors<T> = Partial<Record<keyof T, string | undefined>>;

/**
 * Controlled form state with validation. Errors stay hidden until a field is
 * blurred or the form is submitted, then update live as the user types.
 */
export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validate: (values: T) => FieldErrors<T>,
) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(values);
  const isValid = Object.values(errors).every((error) => !error);

  const field = <K extends keyof T>(name: K) => ({
    name: String(name),
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [name]: e.target.value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    error: submitted || touched[name] ? errors[name] : undefined,
  });

  /** Marks the form as submitted (revealing all errors) and returns whether it's valid. */
  const submit = () => {
    setSubmitted(true);
    return isValid;
  };

  return { values, field, submit };
}
