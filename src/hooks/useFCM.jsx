/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import useUsersCollection from './useUsersCollection';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ToastAndroid} from 'react-native';

const useFCM = () => {
  const {updateUser} = useUsersCollection();
  const navigation = useNavigation();
  const route = useRoute();
  const [currentDeviceToken, setCurrentDeviceToken] = useState('');
  const handlePushNotification = async () => {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      setCurrentDeviceToken(fcmToken);
      updateUser({token: fcmToken});
    }
  };
  const sendNotification = async deviceToken => {
    const FIREBASE_API_KEY =
      'AAAAH2fbdN0:APA91bFpIpMfpZJ2jIv5whelWpUpgdvEVPeSLvQp1ZqgrKxJprs0eX1IYA9dBFC9nuQP7weU3RjdrC4aM9dbaAs7reHNq00EFhueuGk-JPREjPexqx6N2SeTWrJsmgXvfKxkV0aS0maw';
    const message = {
      registration_ids: [deviceToken],
      notification: {
        title: 'New Message',
        body: "You've received new message",
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        senderName: auth().currentUser.displayName,
        senderEmail: auth().currentUser.email,
        senderToken: currentDeviceToken,
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    };

    try {
      await axios.post('https://fcm.googleapis.com/fcm/send', message, {
        headers,
      });
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  };
  const NotificationPressHandler = remoteMessage => {
    if (remoteMessage?.data?.senderEmail) {
      if (auth().currentUser) {
        navigation.navigate('chat', {
          currentContactName: remoteMessage?.data?.senderName,
          currentContactEmail: remoteMessage?.data?.senderEmail,
          receiverToken: remoteMessage?.data.senderToken,
        });
      } else {
        navigation.navigate('login');
      }
    }
  };
  useEffect(() => {
    handlePushNotification();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (route.name === 'home') {
        ToastAndroid.show(
          'new message received from ' + remoteMessage?.data?.senderName,
          1000,
        );
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {});

    // when press on notification and app in background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      NotificationPressHandler(remoteMessage);
    });

    // when press on notification and app on quit state (closed)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          NotificationPressHandler(remoteMessage);
        }
      });

    return unsubscribe;
  }, []);
  return {sendNotification};
};

export default useFCM;
