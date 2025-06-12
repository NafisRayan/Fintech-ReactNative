import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const CryptoCard: FC<{ coin: any }> = ({ coin }) => {
	return (
		<View style={styles.cardContainer}>
			<View style={styles.leftSideContainer}>
				<Image
					style={styles.coinImage}
					source={coin.iconUrl}
					placeholder={blurhash}
					contentFit="cover"
					transition={1000}
				/>
				<View style={{ gap: 5 }}>
					<Text style={styles.coinName}>{coin?.name}</Text>
					<Text style={styles.coinInitials}>{coin?.symbol}</Text>
				</View>
			</View>
			<View style={styles.rightSideContainer}>
				<Text>{Number(coin?.price).toFixed(2)} $</Text>
				<View
					style={[{ flexDirection: "row", alignItems: "center", gap: 5 }]}
				>
					{Number(coin?.change) > 1.2 ? (
						<FontAwesome name="caret-up" color={"green"} size={14} />
					) : (
						<FontAwesome name="caret-down" color={"red"} size={14} />
					)}
					<Text
						style={[
							{ color: Number(coin?.change) > 1.2 ? "green" : "red" },
							styles.coinRate,
						]}
					>
						{Number(coin?.change).toFixed(2)} %
					</Text>
				</View>
			</View>
		</View>
	);
};

export default CryptoCard;

const styles = StyleSheet.create({
	cardContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		width: "100%",
	},
	leftSideContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	coinImage: {
		width: 40,
		height: 40,
		borderRadius: 50,
		overflow: "hidden",
	},
	coinName: {
		fontSize: 14,
		fontWeight: "500",
		color: "#000",
	},
	coinInitials: {
		fontSize: 12,
		fontWeight: "500",
		color: Colors.primary,
	},

	rightSideContainer: {
		gap: 5,
		alignItems: "flex-end",
	},
	coinValue: {},
	coinRate: {},
});
