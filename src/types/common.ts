export interface IMeta {
    limit: number;
    page: number;
    total: number;
}

export type ResponseSuccessType = {
    data: any,
    meta?: IMeta
}

export type IGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
    path: string | number;
    message: string;
};

export interface IUser {
    _id: string;
    fullName: string;
    gender: string;
    profileImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAdmin {
    _id: string;
    fullName: string;
    gender: string;
    profileImage: string;
    createdAt: string;
    updatedAt: string;
}
