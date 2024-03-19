/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useLayoutEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GiftedChat} from 'react-native-gifted-chat';
import useFCM from './useFCM';

const useChatsCollection = (setMessages, currentContact, deviceToken) => {
  const {sendNotification} = useFCM();

  useLayoutEffect(() => {
    firestore()
      .collection('Chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        if (querySnapshot?.docs?.length > 0) {
          setMessages(
            querySnapshot?.docs
              ?.filter(
                doc =>
                  (doc?.data()?.sentTo === currentContact &&
                    doc?.data()?.sentFrom === auth()?.currentUser.email) ||
                  (doc?.data()?.sentFrom === currentContact &&
                    doc?.data()?.sentTo === auth()?.currentUser.email),
              )
              .map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
              })),
          );
        }
      });
  }, [setMessages]);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];

    firestore()
      .collection('Chats')
      .add({
        _id,
        createdAt,
        text,
        user,
        sentTo: currentContact,
        sentFrom: auth().currentUser.email,
      })
      .then(() => {
        console.log('Message added!');
        sendNotification(deviceToken);
      });
  }, []);
  return {onSend};
};

export default useChatsCollection;
