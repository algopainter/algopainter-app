export interface IAuctionCoin {
  value: string;
  label: string;
  tokenAddress: string;
  decimalPlaces: number;
  img: string;
}

export const auctionCoins : IAuctionCoin[] = [
  {
    value: '1',
    label: 'BTC',
    tokenAddress: process.env.VUE_APP_BTC_TOKEN_ADDRESS || '',
    decimalPlaces: 18,
    img: '/images/BTC.svg',
  },
  {
    value: '2',
    label: 'BUSD',
    tokenAddress: process.env.VUE_APP_BUSD_TOKEN_ADDRESS || '',
    decimalPlaces: 18,
    img: '/images/BUSD.svg',
  },
  {
    value: '3',
    label: 'ALGOP',
    tokenAddress: process.env.VUE_APP_ALGOP_TOKEN_ADDRESS || '',
    decimalPlaces: 18,
    img: '/images/ALGOP.svg',
  },
  {
    value: '4',
    label: 'DAI',
    tokenAddress: process.env.VUE_APP_DAI_TOKEN_ADDRESS || '',
    decimalPlaces: 18,
    img: '/images/DAI.svg',
  },
];
