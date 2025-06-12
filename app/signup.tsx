import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { FIRE_BASE_AUTH } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const auth = FIRE_BASE_AUTH;

	const keyboardOffset = Platform.OS === "ios" ? 90 : 0;

	const router = useRouter();

	const onUserSignUp = async () => {
		try {
			const response = await createUserWithEmailAndPassword(
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
				<Text style={defaultStyles.header}>Let's get started!</Text>
				<Text style={defaultStyles.descriptionText}>
					Enter your email and password to create an account with us.
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
				<Link
					href={"/login"}
					asChild
					style={[defaultStyles.textLink, { marginTop: 20 }]}
				>
					<Text>Already have an account? Log in</Text>
				</Link>
				<View style={{ flex: 1 }}></View>
				<View style={{ marginBottom: 50 }}>
					<TouchableOpacity
						onPress={onUserSignUp}
						style={[
							defaultStyles.pillButton,
							{
								backgroundColor:
									email === "" ? Colors.primaryMuted : Colors.primary,
							},
						]}
					>
						<Text style={defaultStyles.buttonText}>Sign up</Text>
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
});
