/* eslint-disable react-hooks/exhaustive-deps */
import {useLayoutEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const useUsersCollection = setUsers => {
  useLayoutEffect(() => {
    if (auth().currentUser?.email) {
      firestore()
        .collection('Users')
        .where('email', '!=', auth().currentUser?.email || '')
        .onSnapshot(querySnapshot => {
          setUsers?.(
            querySnapshot.docs.map(doc => ({
              name: doc.data().name,
              email: doc.data().email,
              token: doc.data().token,
              status: doc.data().status,
            })),
          );
        });
    }
  }, []);
  const addUser = userData => {
    const {email, name} = userData;

    firestore()
      .collection('Users')
      .add({
        email,
        name,
      })
      .then(() => {
        console.log('user added!');
      });
  };
  const updateUser = async userData => {
    const querysnapshot = await firestore()
      .collection('Users')
      .where('email', '==', auth().currentUser.email)
      .get();
    if (!querysnapshot.empty) {
      // If the document exists, update its fields
      querysnapshot.forEach(async documentSnapshot => {
        // Get the reference to the document
        const docRef = firestore().collection('Users').doc(documentSnapshot.id);

        // Perform the update operation
        await docRef.update(userData);

        console.log('User updated successfully.');
      });
    }
  };

  return {addUser, updateUser};
};

export default useUsersCollection;
