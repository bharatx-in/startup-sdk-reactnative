import * as React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import BharatxReactnativeCommon from '@bharatx/startup-sdk-reactnative';

export default function App() {
  React.useEffect(() => {
    BharatxReactnativeCommon.registerUser({
      phoneNumber: '9876543210',
      id: 'temp-id',
      name: 'Jon Snow',
      gender: 'Male',
      dob: '2016-02-05',
      dobFormat: 'YYYY-MM-DD',
      age: 20,
      address: '20, Tech Street, Bengaluru',
      customKey1: 'customValue1',
      customKey2: 'customValue2',
    });
    BharatxReactnativeCommon.getUserCreditInfo(
      ({ creditTaken, creditLimit }) => {
        console.log(creditLimit);
        console.log(creditTaken);
      }
    );
    BharatxReactnativeCommon.displayBharatXProgressDialog();
    setTimeout(() => {
      BharatxReactnativeCommon.closeBharatXProgressDialog();
      BharatxReactnativeCommon.confirmTransactionWithUser(
        10000,
        'test-txn',
        () => {
          console.log('Success');
        },
        (reason) => {
          console.log('Failure due to: ' + reason);
        }
      );
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Button title="hello" onPress={() => {}} />
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
