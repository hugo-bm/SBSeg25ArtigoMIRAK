export type cpeDictionary = {
    deprecated: boolean,
    cpeName: string,
    cpeNameId: string,
    lastModified: Date | undefined,
    created: Date | undefined,
    titles: title[],
    refs: ref[],
    deprecatedBy: deprecatedBy[]
}

export type ref = {
    ref: string,
    type: string | undefined
}

export type deprecatedBy = {
    cpeName: string,
    cpeNameId: string
}

export type title = {
    title: string,
    lang: string
}