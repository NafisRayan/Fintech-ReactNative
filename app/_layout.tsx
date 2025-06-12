import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, router, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// const { isLoaded, isSignedIn } = useAuth();
	const router = useRouter();
	const [isSignedIn, setIsSignedIn] = useState(false);

	const getAuthUser = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem("my-key");

			// jsonValue != null ? JSON.parse(jsonValue) : null;
			if (jsonValue != null) {
				const user = JSON.parse(jsonValue);
				setIsSignedIn(true);
				router.push(`/(authenticated)/(tabs)/home`);
			} else {
				setIsSignedIn(false);
			}
		} catch (e) {
			// error reading value
			setIsSignedIn(false);
		}
	};

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
			getAuthUser();
		}
	}, [loaded]);

	useEffect(() => {
		console.log("IsSigned in", isSignedIn);
		if (loaded) {
			if (isSignedIn) {
				router.replace(`/(authenticated)/(tabs)/home`);
			} else {
				router.replace("/");
			}
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="login"
				options={{
					title: "",
					headerBackTitle: " ",
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: Colors.background,
					},
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => {
								router.back();
							}}
						>
							<Ionicons
								name="arrow-back"
								size={34}
								color={Colors.primary}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="signup"
				options={{
					title: "",
					headerBackTitle: " ",
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: Colors.background,
					},
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => {
								router.back();
							}}
						>
							<Ionicons
								name="arrow-back"
								size={34}
								color={Colors.primary}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="(authenticated)/(tabs)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(authenticated)/crypto/[coinId]"
				options={{
					title: "",
					headerLeft: () => (
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="arrow-back"
								size={34}
								color={Colors.dark}
							/>
						</TouchableOpacity>
					),
					headerLargeTitle: true,
					headerTransparent: true,
					headerRight: () => (
						<View style={{ flexDirection: "row", gap: 10 }}>
							<TouchableOpacity>
								<Ionicons
									name="notifications-outline"
									color={Colors.dark}
									size={30}
								/>
							</TouchableOpacity>
							<TouchableOpacity>
								<Ionicons
									name="star-outline"
									color={Colors.dark}
									size={30}
								/>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
		</Stack>
	);
}

const RootLayoutNav = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<QueryClientProvider client={queryClient}>
				<InitialLayout />
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
};

export default RootLayoutNav;
