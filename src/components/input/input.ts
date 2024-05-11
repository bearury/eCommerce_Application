import { ParamsElementCreator } from '@utils/element-creator';
import { Event } from '@utils/element-creator';
import View from '@utils/view';
import styles from '@components/input/input.module.scss';

export enum InputType {
  checkbox = 'checkbox',
  email = 'email',
  hidden = 'hidden',
  number = 'number',
  password = 'password',
  radio = 'radio',
  search = 'search',
  tel = 'tel',
  text = 'text',
  submit = 'submit',
}

export type Callback = { event: Event; callback: Function };

interface InputProps {
  inputType: InputType;
  callbacks: Callback[];
  classNames?: string[];
  placeholder?: string;
  value?: string;
  inputName?: string;
}

export default class Input extends View {
  constructor({ inputType, callbacks, classNames = [], placeholder = '', value = '', inputName = '' }: InputProps) {
    const params: ParamsElementCreator = {
      tag: 'input',
      classNames: classNames.map((className) => styles[className]),
      attribute: [
        { type: 'type', value: inputType },
        { type: 'placeholder', value: placeholder },
        { type: 'value', value: value },
        { type: 'name', value: inputName },
      ],
      callback: callbacks,
    };
    super(params);
  }
}
