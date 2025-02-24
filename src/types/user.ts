type TUserSignUpPayload = {
    username: string,
    password: string
}

type TUserSignUpResponse =  {
    username: string;
};

type UserModel = {
    userId: string;
    username: string;
}

export type {
    TUserSignUpPayload,
    TUserSignUpResponse,
    UserModel
}