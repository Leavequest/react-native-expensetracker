/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register primary component
AppRegistry.registerComponent(appName, () => App);

// Backward-compatibility fallback for existing builds expecting 'AwesomeProject'
if (appName !== 'AwesomeProject') {
  AppRegistry.registerComponent('AwesomeProject', () => App);
}
