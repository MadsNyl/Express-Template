import { pageSize } from "../config/constants";


export const paginate = (query: string) => {
    const page = parseInt(query);

    const skip = (page - 1) * pageSize;

    return {
        skip,
        take: pageSize
    };
};

export const getSearchQuery = (search: string, fields: string[]) => {
    if (!search) {
        return {};
    };

    const query = fields.map((field) => ({
        [field]: {
            contains: search
        }
    }));

    return {
        OR: query
    };
};

export const getPaginationData = (itemsLength: number, page: number) => {
    const nextPage = itemsLength > pageSize ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
        count: itemsLength,
        page,
        next: nextPage,
        prev: prevPage
    }
};