import InputField, { InputFiledProps } from '@components/input/input-field/input-field';

type InputDateFieldProps = InputFiledProps;

export default class InputDateField extends InputField {
  constructor({ name, callback, attributes }: InputDateFieldProps) {
    super({ name, callback, attributes });
  }
}
