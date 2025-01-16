

export default interface IJsonCache {

    addCPE(cpe: string, product: string, os: string): void;
    save(): Promise<void>;
    load(): Promise<void>;
    searchByProductAndOS(product: string, os: string): string | undefined;
    unload(): void;
}