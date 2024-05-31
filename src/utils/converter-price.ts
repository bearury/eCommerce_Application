import { Price } from '@commercetools/platform-sdk';

export default function converterPrice({ value }: Price): string {
  const { centAmount, fractionDigits } = value;
  return (centAmount / 100).toFixed(fractionDigits);
}
