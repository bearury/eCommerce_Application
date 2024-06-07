import { RouterPages } from '@app/app.ts';

export default function getPath(currentPath: string): RouterPages | undefined {
  const values: RouterPages[] = Object.values(RouterPages);
  return values.find((value: RouterPages): boolean => value === currentPath);
}
