import InputField, { InputFieldType, InputFiledProps } from '@components/input/input-field/input-field';

type InputDateFieldProps = Omit<InputFiledProps, 'type'>;

export default class InputDateField extends InputField {
  constructor({ name, callback }: InputDateFieldProps) {
    super({ name, type: InputFieldType.date, callback });
  }
}
