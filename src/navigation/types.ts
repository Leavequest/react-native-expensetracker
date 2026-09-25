import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ShoppingStackParamList = {
  ShoppingLists: undefined;
  ShoppingListDetail: { listId: string };
};

export type RootTabParamList = {
  Expenses: undefined;
  Shopping: NavigatorScreenParams<ShoppingStackParamList>;
  Analytics: undefined;
  Settings: undefined;
};

export type ShoppingStackScreenProps<T extends keyof ShoppingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ShoppingStackParamList, T>,
    BottomTabScreenProps<RootTabParamList>
  >;

declare global {
  namespace ReactNavigation {
    // Types `useNavigation()` everywhere without passing generics
    interface RootParamList extends RootTabParamList {}
  }
}
