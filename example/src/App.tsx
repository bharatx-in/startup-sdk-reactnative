import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BharatxReactnativeCommon from '@bharatx/bharatx-reactnative-common';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    BharatxReactnativeCommon.registerTransactionId(
      'TempTransaction',
      (isSuccess) => {
        console.log(isSuccess);
      }
    );
    BharatxReactnativeCommon.registerUserId('tempuser4');
    BharatxReactnativeCommon.showTransactionStatusDialog(true, () => {
      console.log('Closed');
    });
    BharatxReactnativeCommon.showBharatXProgressDialog();
    setTimeout(() => {
      BharatxReactnativeCommon.closeBharatXProgressDialog();
      BharatxReactnativeCommon.registerCreditAccess();
      BharatxReactnativeCommon.getUserCreditInfo((creditTaken, creditLimit) => {
        console.log(creditLimit);
        console.log(creditTaken);
      });
      BharatxReactnativeCommon.confirmTransactionWithUser(
        10000,
        () => {
          console.log('onUserConfirmedTransaction');
          let cur = true;
          const fun = () => {
            console.log('Showing Transaction Status Dialog');
            cur = !cur;
            BharatxReactnativeCommon.showTransactionStatusDialog(cur, () => {
              console.log('Closing Transaction Status Dialog');
              fun();
            });
          };
          fun();
        },
        () => {
          console.log('onUserAcceptedPrivacyPolicy');
        },
        () => {
          console.log('onUserCancelledTransaction');
        }
      );
    }, 5000);
    setResult(2);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
