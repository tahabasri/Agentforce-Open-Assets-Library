export interface ActionFile {
  sourceFile: string;
  author?: string;
  company?: string;
  dependencies?: string[];
  [key: string]: string | string[] | undefined;
}

export interface CategoryData {
  [subCategory: string]: {
    actions: { [fileName: string]: ActionFile };
    topics: { [fileName: string]: ActionFile };
    agents: { [fileName: string]: ActionFile };
    icon?: string;
  }
}

export interface AppData {
  industries: CategoryData;
  products: CategoryData;
}
