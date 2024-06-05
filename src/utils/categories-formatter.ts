import { ModifyCategory } from '@utils/categories-creator.ts';
import { categoryState } from '@state/state.ts';

export function getCategoryByKey(data: ModifyCategory[], targetKey: string): ModifyCategory | undefined {
  for (const item of data) {
    if (item.key === targetKey) {
      return item;
    }
    if (item.children) {
      const foundItem = getCategoryByKey(item.children, targetKey);
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return undefined;
}

export function getAncestorCategories(data: ModifyCategory[], targetId: string): ModifyCategory[] {
  const ancestors: ModifyCategory[] = [];

  function traverse(items: ModifyCategory[]): ModifyCategory | undefined {
    for (const item of items) {
      if (item.id === targetId) {
        ancestors.unshift(item);
        return item;
      }
      if (item.children) {
        const foundItem = traverse(item.children);
        if (foundItem) {
          ancestors.unshift(item);
          return foundItem;
        }
      }
    }
    return undefined;
  }

  traverse(data);
  return ancestors;
}

export function validatePath(path: string[]): boolean {
  const data: ModifyCategory[] | [] = categoryState.getState().categories;
  const res: string[] = path.filter((el) => getCategoryByKey(data, el));
  return path.length - 1 === res.length;
}
