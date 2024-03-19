import auth from '@react-native-firebase/auth';

export const onSignOut = async (navigation, updateUser) => {
  updateUser({status: 'offline'});
  await auth().signOut();
  navigation.navigate('login');
};
