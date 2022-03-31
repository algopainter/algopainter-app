export interface IReportEarnings {
    index: number;
    nft: string;
    collection: string;
    amount: string;
    creator: string;
    sellDT?: Date;
    toClaim: boolean;
    lastBid?: string;
    bidBackRate: number;
    pirs: string;
    bidback: string;
}
