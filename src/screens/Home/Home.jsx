/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Pressable,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../colors';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './Home.styles';
import useUsersCollection from '../../hooks/useUsersCollection';
import useFCM from '../../hooks/useFCM';

const Home = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  useUsersCollection(setContacts);
  useFCM();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FontAwesome
          name="search"
          size={24}
          color={colors.gray}
          style={styles.headerLeftIcon}
        />
      ),
    });
  }, [navigation]);

  const renderItem = ({item}) => (
    <View style={styles.contactContainer}>
      <View style={styles.contactItem}>
        <Text style={styles.contactName}>{item?.name}</Text>
        <Text style={styles.contactStatus}>{item?.status}</Text>
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate('chat', {
            currentContactName: item.name,
            currentContactEmail: item.email,
            receiverToken: item.token,
          })
        }
        style={styles.chatButton}>
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </Pressable>
    </View>
  );

  return (
    <>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.email}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default Home;
