import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useUsersCollection from './useUsersCollection';

const useAuth = (email, password, name) => {
  const navigation = useNavigation();
  const {addUser} = useUsersCollection();
  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          navigation.navigate('home');
        })
        .catch(err => Alert.alert('Login error', err.message));
    }
  };
  const onHandleRegister = () => {
    if (email !== '' && password !== '' && name !== '') {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          user.user.updateProfile({displayName: name});
          addUser({email, name});
          navigation.navigate('home');
        })
        .catch(err => Alert.alert('Register error', err.message));
    }
  };
  return {onHandleLogin, onHandleRegister};
};

export default useAuth;
