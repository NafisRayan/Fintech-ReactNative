import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface ButtonProps {
	text?: string;
	onPress?: () => void;
	icon: typeof Ionicons.defaultProps;
	size?: "sm" | "lg";
}

const RoundedButton: FC<ButtonProps> = ({
	icon,
	text,
	onPress,
	size = "lg",
}) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
			<View
				style={[
					styles.iconContainer,
					{
						width: size === "sm" ? 30 : 60,
						height: size === "sm" ? 30 : 60,
					},
				]}
			>
				<Ionicons name={icon} size={size === "sm" ? 20 : 35} color="#000" />
			</View>
			{text && <Text style={styles.buttonText}>{text}</Text>}
		</TouchableOpacity>
	);
};

export default RoundedButton;

const styles = StyleSheet.create({
	buttonContainer: {
		alignItems: "center",
		gap: 5,
	},
	buttonText: {
		fontSize: 14,
		fontWeight: "500",
		color: Colors.dark,
	},
	iconContainer: {
		height: 60,
		width: 60,
		backgroundColor: Colors.lightGray,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
});
