import { Category, CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';

export interface ModifyCategory {
  id: string;
  key: string;
  ancestors: { typeId: string; id: string }[];
  name: string;
  children?: ModifyCategory[];
}

export function categoriesCreator(data: ClientResponse<CategoryPagedQueryResponse>): ModifyCategory[] {
  const categoriesData: Category[] = data.body.results;

  const newArray: ModifyCategory[] = categoriesData.map((cat) => ({
    id: cat.id,
    key: cat.key,
    ancestors: cat.ancestors,
    name: cat.name['en-US'],
  })) as ModifyCategory[];

  const categoryMap: { [id: string]: ModifyCategory & { children?: ModifyCategory[] | undefined } } = {};

  newArray.forEach((category: ModifyCategory) => (categoryMap[category.id] = { ...category, children: [] }));
  newArray.forEach((category: ModifyCategory) => {
    if (category.ancestors.length) {
      const parentId = category.ancestors[category.ancestors.length - 1].id;
      categoryMap[parentId].children?.push(categoryMap[category.id]);
    }
  });
  return newArray
    .filter((category: ModifyCategory) => !category.ancestors.length)
    .map((category: ModifyCategory) => categoryMap[category.id]);
}
