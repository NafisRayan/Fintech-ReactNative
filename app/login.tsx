import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";
import { FIRE_BASE_AUTH } from "@/firebaseConfig";

enum SignInType {
	PHONE,
	EMAIL,
	APPLE,
}

const Page = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const auth = FIRE_BASE_AUTH;
	const keyboardOffset = Platform.OS === "ios" ? 85 : 0;

	const router = useRouter();

	const onUserLogin = async (type: SignInType) => {
		try {
			const response = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			console.log(response.user);

			const jsonValue = JSON.stringify(response.user);
			await AsyncStorage.setItem("my-key", jsonValue);

			router.push(`/(authenticated)/(tabs)/home`);
			setEmail("");
			setPassword("");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior="padding"
			keyboardVerticalOffset={keyboardOffset}
		>
			<StatusBar style="dark" />
			<View
				style={[
					defaultStyles.container,
					{ backgroundColor: Colors.background },
				]}
			>
				<Text style={defaultStyles.header}>Welcome back</Text>
				<Text style={defaultStyles.descriptionText}>
					Enter the phone number associated with your account
				</Text>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={[styles.input, {}]}
						defaultValue=""
						keyboardType="email-address"
						placeholder="user@gmail.com"
						value={email}
						onChangeText={setEmail}
						placeholderTextColor={Colors.gray}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Password</Text>
					<TextInput
						style={[styles.input, {}]}
						defaultValue=""
						keyboardType="default"
						placeholder="******"
						value={password}
						onChangeText={setPassword}
						placeholderTextColor={Colors.gray}
						secureTextEntry={true}
					/>
				</View>
				<View style={{ flex: 1 }}></View>
				<View style={{ marginBottom: 50 }}>
					<TouchableOpacity
						onPress={() => {
							onUserLogin(SignInType.PHONE);
						}}
						style={[
							defaultStyles.pillButton,
							{
								backgroundColor:
									email === "" ? Colors.primaryMuted : Colors.primary,
							},
						]}
					>
						<Text style={defaultStyles.buttonText}>Sign In</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Page;

const styles = StyleSheet.create({
	inputContainer: {
		marginTop: 20,
		marginBottom: 10,
		gap: 10,
	},
	input: {
		backgroundColor: Colors.lightGray,
		paddingHorizontal: 20,
		paddingVertical: 20,
		width: "100%",
		// height: 60,
		fontSize: 18,
		borderRadius: 16,
	},
	label: {
		fontWeight: "600",
		fontSize: 18,
		color: Colors.gray,
	},
	seperator: {
		flex: 1,
		height: 1,
		backgroundColor: Colors.lightGray,
	},
	buttonText: {
		color: Colors.dark,
		fontSize: 18,
		fontWeight: "500",
	},
});
