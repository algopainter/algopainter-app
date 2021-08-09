/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IImageUser } from 'src/models/IImageUser';
import AlgoPainterTokenProxy from '../eth/AlgoPainterTokenProxy';
import { NetworkInfo } from '../store/user/types';

const fetchAccountBalance = async(networkInfo: NetworkInfo, accountAddress: string) => {
  const algopainter = new AlgoPainterTokenProxy(networkInfo);
  return (await algopainter.balanceOf(accountAddress)) / 10 ** 18;
};

/**
 * input/output example
 *
 * Input: 6679.690202143615462628, 3
 * Output: "6679.690..."
 *
 */
const formatAccountBalance = (balance: number, decimalPlaces: number): string => {
  const [integerPart, decimalPart] = balance.toString().split('.');
  if (!decimalPart) {
    return integerPart;
  }
  const slicedDecimal: string = decimalPart.slice(0, decimalPlaces);
  return [integerPart, slicedDecimal + '...'].join('.');
};

/**
 * input/output example
 *
 * Input: "0x38Ad0Ab1Dd2B9a64Dd6D75fB6D84a14893366DCD"
 * Output: "0x38ad0ab1d...6dcd"
 *
 */
const formatedAccount = (accountAddress: string, inital: number = 5, final: number = -3) => {
  const splited = accountAddress.split('');
  return splited.slice(0, inital).join('') + '...' + splited.slice(final).join('');
};

const getUsersByRole = (users: IImageUser[], role: string) : any => {
  return users.filter((user) => (user?.role === role));
};

const helpers = {
  fetchAccountBalance,
  formatAccountBalance,
  formatedAccount,
  getUsersByRole,
};

export default helpers;
