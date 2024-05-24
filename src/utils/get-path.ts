import { RouterPages } from '@app/app.ts';

export default function getPath(currentPath: string): RouterPages | null {
  switch (currentPath) {
    case RouterPages.main:
      return RouterPages.main;
    case RouterPages.signin:
      return RouterPages.signin;
    case RouterPages.signup:
      return RouterPages.signup;
    case RouterPages.products:
      return RouterPages.products;
    default:
      return null;
  }
}
