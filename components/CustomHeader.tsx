import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const CustomHeader = () => {
	const [search, setSearch] = useState("");
	const { top } = useSafeAreaInsets();

	return (
		<BlurView intensity={80} tint={"extraLight"} style={{ paddingTop: top }}>
			<View
				style={[
					styles.container,
					{
						height: 60,
						gap: 10,
						paddingHorizontal: 20,
						backgroundColor: "transparent",
					},
				]}
			>
				<TouchableOpacity style={styles.userContainer}>
					<Text style={styles.initialsText}>JM</Text>
				</TouchableOpacity>
				<View style={styles.searchContainer}>
					<Ionicons color={Colors.dark} name="search" size={20} />
					<TextInput
						value={search}
						onChangeText={setSearch}
						placeholder="Search"
						style={styles.searchInput}
					/>
				</View>
				<TouchableOpacity style={styles.chartContainer}>
					<Ionicons color={Colors.dark} name="stats-chart" size={20} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.chartContainer}>
					<Ionicons name={"card"} size={20} color={Colors.dark} />
				</TouchableOpacity>
			</View>
		</BlurView>
	);
};

export default CustomHeader;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	searchContainer: {
		flexDirection: "row",
		flex: 1,
		backgroundColor: Colors.lightGray,
		paddingHorizontal: 10,
		height: 45,
		alignItems: "center",
		borderRadius: 50,
		gap: 5,
	},
	searchInput: {
		flex: 1,
		height: "100%",
	},
	userContainer: {
		backgroundColor: Colors.gray,
		alignItems: "center",
		justifyContent: "center",
		height: 45,
		width: 45,
		borderRadius: 50,
		gap: 5,
	},
	initialsText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
	},
	chartContainer: {
		backgroundColor: Colors.lightGray,
		alignItems: "center",
		justifyContent: "center",
		height: 45,
		width: 45,
		borderRadius: 50,
		gap: 5,
	},
});
