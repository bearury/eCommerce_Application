import { ModifyCategory } from '@utils/categories-creator.ts';

export function getAncestorKeys(data: ModifyCategory[], targetKey: string): string[] {
  let result: string[] = [];

  function findItemById(items: ModifyCategory[], targetId: string): ModifyCategory | undefined {
    for (const item of items) {
      if (item.id === targetId) {
        return item;
      }
      if (item.children) {
        const foundItem = findItemById(item.children, targetId);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return undefined;
  }

  function traverse(items: ModifyCategory[]): boolean {
    for (const item of items) {
      if (item.key === targetKey) {
        result = [...item.ancestors.map((ancestor) => ancestor.id), item.id].map(
          (id) => findItemById(data, id)?.key || ''
        );
        return true;
      }
      if (item.children && traverse(item.children)) {
        return true;
      }
    }
    return false;
  }

  traverse(data);
  return result;
}
