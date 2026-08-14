import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default fallback URL if nothing is saved
const DEFAULT_APP_URL = 'http://192.168.137.175:3000';
const STORAGE_KEY = '@app_server_url';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [serverUrl, setServerUrl] = useState(DEFAULT_APP_URL);
  const [showConfig, setShowConfig] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  const notificationListener = useRef();
  const responseListener = useRef();
  const webViewRef = useRef(null);

  useEffect(() => {
    async function initialize() {
      setLoadingStatus('Checking saved configuration...');
      // Load saved URL first
      try {
        const savedUrl = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedUrl !== null) {
          setServerUrl(savedUrl);
        }
      } catch (e) {
        console.warn('Failed to load server URL');
      }

      // Small delay for Android native modules to stabilize
      if (Platform.OS === 'android') {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setAppIsReady(true);
      setLoadingStatus('Connecting to server...');

      const isExpoGo = Constants.executionEnvironment === 'store-client';
      if (isExpoGo) {
        console.log('[DEBUG] Running in Expo Go. Skipping native notification setup.');
        return;
      }

      try {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        const token = await registerForPushNotificationsAsync();
        console.log('[DEBUG] Expo Push Token:', token);
        setExpoPushToken(token || '');

        const relayNotification = (notif) => {
          const data = notif.request.content.data;
          if (data && webViewRef.current) {
            const script = `
              if (window.onNativeNotification) {
                window.onNativeNotification(${JSON.stringify(data)});
              }
            `;
            webViewRef.current.injectJavaScript(script);
          }
        };

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
          relayNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('[DEBUG] Notification Tapped:', response);
          relayNotification(response.notification);
        });
      } catch (e) {
        console.warn('[DEBUG] Failed to setup notifications:', e.message);
      }
    }

    initialize();

    return () => {
      try {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      } catch (e) { }
    };
  }, []);

  const saveUrl = async () => {
    try {
      // Clean up the URL format
      let formattedUrl = tempUrl.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'http://' + formattedUrl;
      }

      // Basic check if they only entered IP and forgot port, we assume :3000
      if (formattedUrl.split(':').length === 2 && !formattedUrl.includes('https://')) {
        formattedUrl += ':3000';
      }

      await AsyncStorage.setItem(STORAGE_KEY, formattedUrl);
      setServerUrl(formattedUrl);
      setShowConfig(false);
    } catch (e) {
      alert('Failed to save URL');
    }
  };

  if (!appIsReady) {
    return null;
  }

  if (showConfig) {
    return (
      <SafeAreaView style={styles.configContainer}>
        <Text style={styles.title}>Server Configuration</Text>
        <Text style={styles.subtitle}>Cannot connect to the current server URL.</Text>
        <Text style={styles.currentUrlLabel}>Current: {serverUrl}</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 192.168.1.103:3000"
          value={tempUrl}
          onChangeText={setTempUrl}
          autoCapitalize="none"
          keyboardType="url"
          autoCorrect={false}
        />

        <View style={styles.buttonRow}>
          <Button title="Reset to Default" color="#666" onPress={async () => {
            setServerUrl(DEFAULT_APP_URL);
            await AsyncStorage.removeItem(STORAGE_KEY);
            setShowConfig(false);
          }} />
          <Button title="Save & Connect" onPress={saveUrl} />
        </View>

        <Text style={styles.helpText}>
          If you changed Wi-Fi networks, check your computer's IP address (run "ipconfig" on Windows or "ifconfig" on Mac) and enter it here so the app can connect to your local Next.js server.
        </Text>
      </SafeAreaView>
    );
  }

  // JS to inject when page loads to identify as mobile and provide token
  const injectedJS = `
    (function() {
      window.isMobileWebView = true;
      window.expoPushToken = '${expoPushToken}';
      if (window.onNativeTokenReady) {
        window.onNativeTokenReady('${expoPushToken}');
      }
      document.body.classList.add('mobile-app-mode');
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: serverUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="MedicarePlusMobile-SafeWebView"
        injectedJavaScript={injectedJS}
        onLoadStart={() => {
          setIsWebViewLoading(true);
          setLoadingStatus('Loading page content...');
        }}
        onLoadEnd={() => {
          setIsWebViewLoading(false);
          // Re-inject token if it was received late
          if (expoPushToken && webViewRef.current) {
            webViewRef.current.injectJavaScript(`
              if (window.onNativeTokenReady) {
                window.onNativeTokenReady('${expoPushToken}');
              }
            `);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setTempUrl(serverUrl.replace('http://', '').replace('https://', ''));
          setShowConfig(true);
          setIsWebViewLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          if (nativeEvent.statusCode >= 400) {
            console.warn('WebView HTTP error: ', nativeEvent);
            setTempUrl(serverUrl.replace('http://', '').replace('https://', ''));
            setShowConfig(true);
            setIsWebViewLoading(false);
          }
        }}
        onMessage={(event) => {
          console.log('[DEBUG] Message from WebView:', event.nativeEvent.data);
        }}
      />
      
      {isWebViewLoading && !showConfig && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Medicare+</Text>
          <Text style={styles.loadingSubtext}>{loadingStatus}</Text>
          <Text style={styles.loadingHint}>Connecting to {serverUrl}</Text>
        </View>
      )}

      {/* Floating config button for manual access */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          setTempUrl(serverUrl.replace('http://', '').replace('https://', ''));
          setShowConfig(true);
        }}
      >
        <Text style={styles.floatingButtonText}>⚙️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
  const isExpoGo = Constants.executionEnvironment === 'store-client';
  if (isExpoGo) return 'EXPO-GO-PLACEHOLDER';

  try {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
    } else {
      token = 'EXP-SIMULATOR-TOKEN-' + Math.random().toString(36).substring(7);
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('medication-alerts', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'alarm',
      });
    }

    return token;
  } catch (e) {
    console.warn('[DEBUG] Notification Error:', e);
    alert('Notification Error: ' + e.message);
    return 'NOTIFICATIONS-DISABLED';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
  configContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 24 : 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  currentUrlLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#e9e9e9',
    padding: 16,
    borderRadius: 8,
  },
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    fontSize: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loadingHint: {
    fontSize: 12,
    color: '#999',
    position: 'absolute',
    bottom: 50,
  }
});
