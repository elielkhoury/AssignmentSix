import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUserChats, sendNotification} from '../../../redux/actions';
import {db} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

type User = {
  uid: string;
  username?: string;
  image?: string;
};

type Message = {
  id: string;
  text: string;
  creator: string;
  creation: Timestamp;
};

type Props = {
  navigation: any;
  route: any;
  currentUser: any;
  fetchUserChats: () => void;
  sendNotification: (
    token: string,
    title: string,
    message: string,
    data: any,
  ) => void;
};

const Chat: React.FC<Props> = ({navigation, route, currentUser}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatId = useRef<string | null>(null);

  useEffect(() => {
    const user: User = route.params.user;
    navigation.setOptions({headerTitle: user.username || 'Chat'});

    if (chatId.current) {
      const q = query(
        collection(db, 'chats', chatId.current, 'messages'),
        orderBy('creation', 'asc'),
      );
      const unsubscribe = onSnapshot(q, querySnapshot => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const messages: Message[] = [];
        querySnapshot.forEach(doc => {
          messages.push({id: doc.id, ...doc.data()} as Message);
        });
        setMessages(messages);
      });

      return () => unsubscribe();
    }
  }, [navigation, route.params.user]);

  // Function to handle message sending.
  const onSend = async () => {
    // Check for non-empty messages.
    if (!input.trim()) {
      return;
    }
    setInput(''); // Clear input field after sending.
  };

  // Determine the message box style based on the message creator.
  const getMessageBoxStyle = (creator: string) => [
    styles.messageBox,
    creator === currentUser.uid
      ? styles.messageBoxRight
      : styles.messageBoxLeft,
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={getMessageBoxStyle(item.creator)}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={onSend}>
          <Icon name="send" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  messageBox: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  messageBoxRight: {
    alignSelf: 'flex-end',
  },
  messageBoxLeft: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
});

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchUserChats,
      sendNotification,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
