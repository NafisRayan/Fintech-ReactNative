import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import {
	isClerkAPIResponseError,
	useSignIn,
	useSignUp,
} from "@clerk/clerk-expo";
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
	MaskSymbol,
} from "react-native-confirmation-code-field";
import Colors from "@/constants/Colors";

const CELL_COUNT = 6;

const Page = () => {
	const { phone, signin } = useLocalSearchParams<{
		phone: string;
		signin?: string;
	}>();
	const [code, setCode] = useState("");
	const { signIn } = useSignIn();
	const { signUp, setActive } = useSignUp();

	const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value: code,
		setValue: setCode,
	});

	const verifyCode = async () => {
		try {
			await signUp!.attemptPhoneNumberVerification({
				code: code,
			});

			await setActive!({ session: signUp!.createdSessionId });
		} catch (error) {
			console.log("Error", JSON.stringify(error, null, 2));
			if (isClerkAPIResponseError(error)) {
				Alert.alert("Error", error.errors[0].message);
			}
		}
	};
	const verifySignIn = async () => {
		try {
			await signIn!.attemptFirstFactor({
				strategy: "phone_code",
				code: code,
			});
			await setActive!({ session: signUp!.createdSessionId });
		} catch (error) {
			console.log("Error", JSON.stringify(error, null, 2));
			if (isClerkAPIResponseError(error)) {
				Alert.alert("Error", error.errors[0].message);
			}
		}
	};

	useEffect(() => {
		if (code.length === 6) {
			if (signin === "true") {
				verifySignIn();
			} else {
				verifyCode();
			}
		}
	}, [code]);

	return (
		<View style={defaultStyles.container}>
			<Text style={defaultStyles.header}>6-digit code</Text>
			<Text style={defaultStyles.descriptionText}>
				Enter the 6-digit code sent to {phone}
			</Text>
			<CodeField
				ref={ref}
				{...props}
				// Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
				value={code}
				onChangeText={setCode}
				cellCount={CELL_COUNT}
				rootStyle={styles.codeFieldRoot}
				keyboardType="number-pad"
				textContentType="oneTimeCode"
				// autoComplete={Platform.select({
				// 	android: "sms-otp",
				// 	default: "one-time-code",
				// })}
				testID="my-code-input"
				renderCell={({ index, symbol, isFocused }) => (
					<Text
						key={index}
						style={[styles.cell, isFocused && styles.focusCell]}
						onLayout={getCellOnLayoutHandler(index)}
					>
						{symbol || (isFocused ? <Cursor /> : null)}
					</Text>
				)}
			/>
		</View>
	);
};

export default Page;

const styles = StyleSheet.create({
	root: { flex: 1, padding: 20 },
	title: { textAlign: "center", fontSize: 30 },
	codeFieldRoot: { marginTop: 20 },
	cell: {
		width: 50,
		height: 50,
		paddingTop: 8,
		fontSize: 24,
		borderWidth: 2,
		borderColor: Colors.primaryMuted,
		textAlign: "center",
		borderRadius: 10,
	},
	focusCell: {
		borderColor: Colors.primary,
	},
});
