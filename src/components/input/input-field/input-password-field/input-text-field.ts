import InputField, { InputFiledProps } from '@components/input/input-field/input-field';

type InputPasswordFieldProps = Omit<InputFiledProps, 'type'>;

export default class InputTextField extends InputField {
  constructor({ name, callback, attributes, additionalClassNames }: InputPasswordFieldProps) {
    super({ name, callback, attributes, additionalClassNames });
  }
}
