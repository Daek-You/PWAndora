export interface IStackCount {
    date: `${number}-${number}-${number}`
    noneSiteStackCount: number
    pwaStackCount: number
    noPwaStackCount: number
    totalDownloadStackCount: number
    blockedPwaStackCount: number
}

export interface IDailyStat {
    date: `${number}-${number}-${number}`
    noneSiteCount: number
    pwaCount: number
    noPwaCount: number
    totalDownloadCount: number
    blockedPwaCount: number
}

export interface ICategoryCount {
    id: number,
    name: string,
    count: number
}
