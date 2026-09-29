# Expense Tracker

A React Native app for tracking a household's money: expenses, income and transfers across cash and card wallets, a monthly budget, and shared shopping lists.

## Features

- **Wallets**: each household member has their own cash and card wallets with live balances. Add as many as you like (for example a savings jar).
- **Expenses, income and transfers**: log them from one sheet. A transfer moves money between two of your wallets, for example an ATM withdrawal from card to cash.
- **Monthly budget**: see how much of the household budget is left this month.
- **Analytics**: this month's total, spending by category and a groceries breakdown.
- **Shopping lists**: add items by aisle, tick them off in the store, and record the trip as an expense when you're done.
- **Household members**: switch between members from the avatar at the top of any screen. There is no real login; members are local to the device.
- **Light and dark theme**: toggle it from the moon/sun button in the header or in Settings.

All data is saved on the device. Nothing is sent to a server.

## Requirements

- Node.js 22.11 or newer
- For Android: Android Studio with the Android SDK (API 36) and JDK 17
- For iOS: a Mac with Xcode and CocoaPods

## Run the app

1. Clone the repo and install the dependencies:

   ```bash
   git clone https://github.com/Leavequest/react-native-expense-tracker.git
   cd react-native-expense-tracker
   npm install
   ```

2. **iOS only**, install the native dependencies once:

   ```bash
   bundle install
   cd ios && bundle exec pod install && cd ..
   ```

3. Start Metro in one terminal:

   ```bash
   npm start
   ```

4. In a second terminal, build and launch the app on an emulator or a connected device:

   ```bash
   npm run android
   # or
   npm run ios
   ```

## Try it out

The app starts empty, with one member ("You") who owns a Cash and a Card wallet.

To fill it with sample data, go to **Settings → App & Data → Load demo data**. This adds wallets with balances, a salary, an ATM transfer, a dozen expenses, a monthly budget and a shopping list, so every screen has something to show. It replaces any data you already entered.

To start over, use **Settings → App & Data → Delete all data**. It removes all expenses, income, transfers and shopping lists, resets every member to an empty Cash and Card wallet, and sets the currency back to euro. Household members are kept.

## Tests and checks

```bash
npm test          # unit and component tests
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript
```

## Troubleshooting

**The app shows "Metro has encountered an error" (error 500).** Metro is stuck, usually after files were renamed or deleted while it was running. Stop it and start it again with a clean cache:

```bash
npm start -- --reset-cache
```

## Future features

- A backend, so shopping lists can be shared between phones with **Join via Code**
- Real accounts and login instead of local household members
- Importing expenses for wallets with CSV files
- Wallets in different currencies, with live exchange rates
- Recurring expenses and income, such as rent or salary
- Exporting expenses to a spreadsheet

## Built with

- [React Native](https://reactnative.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/): bottom tabs and a stack for the shopping lists
- [Gorhom Bottom Sheet](https://gorhom.dev/react-native-bottom-sheet/): all forms and sheets
- [React Native Keyboard Controller](https://kirillzyusko.github.io/react-native-keyboard-controller/): keeps text fields above the keyboard
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/): animations and swipe-to-delete
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/): saving data on the device
- [react-native-gifted-charts](https://gifted-charts.web.app/): the analytics chart
- [Lucide](https://lucide.dev/): icons

## Disclaimer

AI tools were used during the development of this app.
