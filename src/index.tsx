import { NativeEventEmitter, NativeModules } from 'react-native';

type BharatxReactnativeCommonType = {
  registerUser(userDetails: {
    phoneNumber?: string;
    id?: string;
    name?: string;
    gender?: string;
    dob?: string;
    dobFormat?: string;
    age?: number;
    address?: string;
    [key: string]: unknown;
  }): void;
  registerCreditAccess(): void;
  displayBharatXProgressDialog(): void;
  closeBharatXProgressDialog(): void;
  getUserCreditInfo(
    onComplete: (result: { creditTaken: number; creditLimit: number }) => void
  ): void;
  getUserCreditInfoFull(
    onComplete: (result: {
      creditTaken: number;
      creditLimit: number;
      dueAmount: number;
      totalOutstandingAmount: number;
      currentCycleDueDate: string;
      repaymentLink: string;
    }) => void
  ): void;
  confirmTransactionWithUser(
    amountInPaise: number,
    transactionId: string
  ): void;
};

const BharatxReactnativeCommon = NativeModules.BharatxReactnativeCommon as BharatxReactnativeCommonType;

export enum TransactionFailureReason {
  USER_CANCELLED = 'USER_CANCELLED',
  DEVICE_FEATURE_MISSING = 'DEVICE_FEATURE_MISSING',
  USER_PERMISSIONS_SETTINGS_RELOAD = 'USER_PERMISSIONS_SETTINGS_RELOAD',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  TRANSACTION_CONFIRMATION_FAILURE = 'TRANSACTION_CONFIRMATION_FAILURE',
  UNKNOWN = 'UNKNOWN',
}

const BharatxReactnativeCommonExport = {
  registerUser: BharatxReactnativeCommon.registerUser,
  registerCreditAccess: BharatxReactnativeCommon.registerCreditAccess,
  displayBharatXProgressDialog:
    BharatxReactnativeCommon.displayBharatXProgressDialog,
  closeBharatXProgressDialog:
    BharatxReactnativeCommon.closeBharatXProgressDialog,
  getUserCreditInfo: BharatxReactnativeCommon.getUserCreditInfo,
  getUserCreditInfoFull: BharatxReactnativeCommon.getUserCreditInfoFull,
  confirmTransactionWithUser: (
    amountInPaise: number,
    transactionId: string,
    onSuccess: () => void,
    onFailure?: (transactionFailureReason: TransactionFailureReason) => void
  ) => {
    BharatxReactnativeCommon.confirmTransactionWithUser(
      amountInPaise,
      transactionId
    );
    const eventEmitter = new NativeEventEmitter(
      NativeModules.BharatxReactnativeCommon
    );
    const eventListener = eventEmitter.addListener(
      'confirmTransactionWithUser',
      (event) => {
        switch (event.value) {
          case 'onSuccess': {
            onSuccess();
            eventListener.remove();
            break;
          }
          case 'onFailure': {
            if (onFailure) {
              let reason = event.transactionFailureReason as string;
              if (!(reason in TransactionFailureReason)) {
                reason = TransactionFailureReason.UNKNOWN;
              }

              onFailure(reason as TransactionFailureReason);
            }
            eventListener.remove();
            break;
          }
        }
      }
    );
  },
};

export default BharatxReactnativeCommonExport;
