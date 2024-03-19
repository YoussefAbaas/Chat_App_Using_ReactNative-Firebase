/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useLayoutEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../../colors';
import styles from './Chat.styles';
import {onSignOut} from './utils';
import useChatsCollection from '../../hooks/useChatsCollection';
import useUsersCollection from '../../hooks/useUsersCollection';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const {currentContactEmail, currentContactName, receiverToken} = route.params;
  const {updateUser} = useUsersCollection();
  const {onSend} = useChatsCollection(
    setMessages,
    currentContactEmail,
    receiverToken,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentContactName,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => onSignOut(navigation, updateUser)}>
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={styles.icon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={styles.messagesContainerStyle}
      textInputStyle={styles.textInputStyle}
      user={{
        _id: auth()?.currentUser?.email,
        avatar: 'https://i.pravatar.cc/300',
      }}
    />
  );
}
