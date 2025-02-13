export type cachedCPE = {
    cpeName: string;
    expirationDate: Date;
    product: string;
    os: string;
};

export type cachedCPEList = cachedCPE[];