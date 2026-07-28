type IOptions = {
  page?: number | string;
  limit?: number | string;
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

const searchFields = (searchTerm: string | undefined, fields: string[]) => {
  if (!searchTerm) return null;

  return {
    OR: fields.map((field) => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    })),
  };
};

const filterFields = (filters: Record<string, any>) => {
  const clean: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value === 'true' || value === true) clean[key] = true;
      else if (value === 'false' || value === false) clean[key] = false;
      else clean[key] = value;
    }
  });

  if (Object.keys(clean).length === 0) return null;


  return clean;
};

export const paginationHelper = {
  calculatePagination,
  searchFields,
  filterFields,
};