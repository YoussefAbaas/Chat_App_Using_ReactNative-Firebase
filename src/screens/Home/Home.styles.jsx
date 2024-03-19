import {StyleSheet} from 'react-native';
import colors from '../../../colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 40,
    width: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
  },
  headerLeftIcon: {
    marginLeft: 15,
  },
  headerRightIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  contactItem: {
    padding: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactStatus: {
    fontSize: 14,
    color: '#666',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
