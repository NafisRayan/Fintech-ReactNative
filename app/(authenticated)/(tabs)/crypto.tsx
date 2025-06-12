import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { allCoins } from "@/data/coinlistdata";
import { defaultStyles } from "@/constants/Styles";
import { useHeaderHeight } from "@react-navigation/elements";
import CryptoCard from "@/components/CryptoCard";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Page = () => {
	const screenHeight = useHeaderHeight();

	return (
		<ScrollView
			style={[defaultStyles.container, { flex: 1 }]}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingTop: screenHeight - 80,
				paddingBottom: 100,
			}}
		>
			<StatusBar style="dark" />
			<Text style={styles.pageHeader}>Latest crypto</Text>

			<View style={styles.cryptoContainer}>
				{allCoins.map((coin) => (
					<Link
						key={coin.uuid}
						href={`/(authenticated)/crypto/${coin?.uuid}`}
					>
						<CryptoCard coin={coin} />
					</Link>
				))}
			</View>
		</ScrollView>
	);
};

export default Page;

const styles = StyleSheet.create({
	pageHeader: {
		fontSize: 24,
		fontWeight: "700",
	},
	cryptoContainer: {
		marginTop: 30,
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 20,
		gap: 20,
	},
});
