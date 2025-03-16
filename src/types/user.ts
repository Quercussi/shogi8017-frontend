type TUserSignUpPayload = {
    username: string,
    password: string
}

type TUserSignUpResponse =  {
    username: string;
};

type TUserPaginatedSearchPayload = {
    searchQuery: string;
    offset?: number;
    limit?: number;
}

type TUserPaginatedSearchResponse = {
    users: UserModel[],
    count: number,
    nextOffset: number,
    total: number,
}

type TUserGetByIdPayload = {
    userId: string;
}

type UserModel = {
    userId: string;
    username: string;
}

type MaybeUserModel = UserModel | null;

export type {
    TUserSignUpPayload,
    TUserSignUpResponse,
    TUserGetByIdPayload,
    TUserPaginatedSearchPayload,
    TUserPaginatedSearchResponse,
    UserModel,
    MaybeUserModel
}