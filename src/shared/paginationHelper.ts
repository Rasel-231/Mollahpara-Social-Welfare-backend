type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  return { page, limit, skip, sortBy, sortOrder };
};

const searchFields = <T extends string>(
  searchTerm: string | undefined,
  fields: T[]
): Record<string, unknown> | null => {
  if (!searchTerm) return null;

  return {
    OR: fields.map(field => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    })),
  };
};

const filterFields = <T extends Record<string, unknown>>(
  filters: T
): Record<string, unknown> | null => {
  const clean = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (clean.length === 0) return null;

  return {
    AND: clean.map(([key, value]) => ({
      [key]: { equals: value },
    })),
  };
};

export const paginationHelper = {
  calculatePagination,
  searchFields,
  filterFields,
};
