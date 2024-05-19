import InputField, { InputFieldType, InputFiledProps } from '@components/input/input-field/input-field';

type InputPasswordFieldProps = Omit<InputFiledProps, 'type'>;

export default class InputDateField extends InputField {
  constructor({ name, callback }: InputPasswordFieldProps) {
    super({ name, type: InputFieldType.date, callback });
  }
}
