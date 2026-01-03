type IOption = {
  limit?: string | number;
  page?: string | number;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
};

type IOptionResult = {
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const paginationSortingHelper = (options: IOption): IOptionResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 5;
  const skip: number = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
