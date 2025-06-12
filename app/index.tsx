import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import { useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { StatusBar } from "expo-status-bar";

const Page = () => {
	const [assets] = useAssets([require("@/assets/videos/intro.mp4")]);
	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			{assets && (
				<Video
					isLooping
					isMuted
					shouldPlay
					resizeMode={ResizeMode.COVER}
					source={assets[0]}
					style={styles.videoPlayer}
				/>
			)}
			<View style={{ marginTop: 80, padding: 20 }}>
				<Text style={styles.header}>
					Ready to change the way you money?
				</Text>
			</View>
			{/* <View style={{ flex: 1 }}></View> */}
			<View style={styles.buttons}>
				<Link
					href={"/login"}
					style={[
						defaultStyles.pillButton,
						{ flex: 1, backgroundColor: Colors.dark },
					]}
					asChild
				>
					<TouchableOpacity>
						<Text
							style={{ color: "#FFF", fontSize: 22, fontWeight: "600" }}
						>
							Log in
						</Text>
					</TouchableOpacity>
				</Link>
				<Link
					href={"/signup"}
					style={[
						defaultStyles.pillButton,
						{ flex: 1, backgroundColor: "#fff" },
					]}
					asChild
				>
					<TouchableOpacity>
						<Text
							style={{ color: "#000", fontSize: 22, fontWeight: "600" }}
						>
							Sign up
						</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
};

export default Page;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
		justifyContent: "space-between",
	},
	videoPlayer: {
		width: "100%",
		height: "100%",
		position: "absolute",
		top: 0,
		left: 0,
	},
	header: {
		color: "#fff",
		fontWeight: "900",
		fontSize: 36,
		textTransform: "uppercase",
	},
	buttons: {
		flexDirection: "row",
		marginBottom: 70,
		gap: 20,
		padding: 20,
	},
});
