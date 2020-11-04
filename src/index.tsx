import { NativeEventEmitter, NativeModules } from 'react-native';

type BharatxReactnativeCommonType = {
  registerCreditAccess(): void;
  showBharatXProgressDialog(): void;
  closeBharatXProgressDialog(): void;
  getUserCreditInfo(
    onComplete: (creditTaken: number, creditLimit: number) => void
  ): void;
  confirmTransactionWithUser(amountInPaise: number): void;
  showTransactionStatusDialog(
    isTransactionSuccessful: boolean,
    onStatusDialogClose: () => void
  ): void;
  registerTransactionId(
    transactionId: string,
    successFailureCallback: (isSuccess: boolean) => void
  ): void;
};

const BharatxReactnativeCommon = NativeModules.BharatxReactnativeCommon as BharatxReactnativeCommonType;
const BharatxReactnativeCommonExport = {
  registerCreditAccess: BharatxReactnativeCommon.registerCreditAccess,
  showBharatXProgressDialog: BharatxReactnativeCommon.showBharatXProgressDialog,
  closeBharatXProgressDialog:
    BharatxReactnativeCommon.closeBharatXProgressDialog,
  getUserCreditInfo: BharatxReactnativeCommon.getUserCreditInfo,
  confirmTransactionWithUser: (
    amountInPaise: number,
    onUserConfirmedTransaction: () => void,
    onUserAcceptedPrivacyPolicy: () => void,
    onUserCancelledTransaction: () => void
  ) => {
    BharatxReactnativeCommon.confirmTransactionWithUser(amountInPaise);
    const eventEmitter = new NativeEventEmitter(
      NativeModules.BharatxReactnativeCommon
    );
    const eventListener = eventEmitter.addListener(
      'confirmTransactionWithUser',
      (event) => {
        switch (event.value) {
          case 'onUserConfirmedTransaction': {
            onUserConfirmedTransaction();
            eventListener.remove();
            break;
          }
          case 'onUserAcceptedPrivacyPolicy': {
            onUserAcceptedPrivacyPolicy();
            break;
          }
          case 'onUserCancelledTransaction': {
            onUserCancelledTransaction();
            eventListener.remove();
            break;
          }
        }
      }
    );
  },
  showTransactionStatusDialog:
    BharatxReactnativeCommon.showTransactionStatusDialog,
  registerTransactionId: BharatxReactnativeCommon.registerTransactionId,
};

export default BharatxReactnativeCommonExport;
