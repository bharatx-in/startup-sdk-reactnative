import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BharatxReactnativeCommon from '@bharatx/bharatx-reactnative-common';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

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
