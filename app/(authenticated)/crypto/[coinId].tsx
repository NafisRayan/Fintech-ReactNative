import {
	ScrollView,
	SectionList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { allCoins, chartData } from "@/data/coinlistdata";
import { Circle, useFont } from "@shopify/react-native-skia";

import Animated, {
	SharedValue,
	useAnimatedProps,
} from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import * as Haptics from "expo-haptics";
import { format } from "date-fns";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
	return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const categories = ["Overview", "News", "Orders", "Transactions"];
const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Page = () => {
	const { coinId } = useLocalSearchParams();
	const headerHeight = useHeaderHeight();
	const [activeIndex, setActiveIndex] = useState(0);
	const [coinData, setCoinData] = useState<any>(null);

	const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
	const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

	useEffect(() => {
		console.log(isActive);
		if (isActive) Haptics.selectionAsync();
	}, [isActive]);

	useEffect(() => {
		function getCoinInfo() {
			const coin = allCoins.find((item: any) => item.uuid === coinId);
			setCoinData(coin);
		}

		getCoinInfo();
	}, [coinId]);

	const animatedText = useAnimatedProps(() => {
		return {
			text: `${state.y.price.value.value.toFixed(2)} €`,
			defaultValue: "",
		};
	});

	const animatedDateText = useAnimatedProps(() => {
		const date = new Date(state.x.value.value);
		return {
			text: `${date.toLocaleDateString()}`,
			defaultValue: "",
		};
	});

	return (
		<>
			<Stack.Screen options={{ title: " Bitcoin" }} />
			<StatusBar style="dark" />

			<SectionList
				style={{ marginTop: headerHeight }}
				contentInsetAdjustmentBehavior="automatic"
				keyExtractor={(i) => i.title}
				sections={[{ data: [{ title: "Chart" }] }]}
				renderSectionHeader={() => (
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							alignItems: "center",
							width: "100%",
							justifyContent: "space-between",
							paddingHorizontal: 16,
							paddingBottom: 8,
							backgroundColor: Colors.background,
							borderBottomColor: Colors.lightGray,
							borderBottomWidth: StyleSheet.hairlineWidth,
						}}
					>
						{categories.map((item, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => setActiveIndex(index)}
								style={
									activeIndex === index
										? styles.categoriesBtnActive
										: styles.categoriesBtn
								}
							>
								<Text
									style={
										activeIndex === index
											? styles.categoryTextActive
											: styles.categoryText
									}
								>
									{item}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
				ListHeaderComponent={() => (
					<>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginHorizontal: 16,
							}}
						>
							<Text style={styles.subtitle}>BTC</Text>
							<Image
								style={styles.coinImage}
								source={coinData?.iconUrl}
								placeholder={blurhash}
								contentFit="cover"
								transition={1000}
							/>
						</View>

						<View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
							<TouchableOpacity
								style={[
									defaultStyles.pillButtonSmall,
									{
										backgroundColor: Colors.primary,
										flexDirection: "row",
										gap: 16,
									},
								]}
							>
								<Ionicons name="add" size={24} color={"#fff"} />
								<Text
									style={[defaultStyles.buttonText, { color: "#fff" }]}
								>
									Buy
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									defaultStyles.pillButtonSmall,
									{
										backgroundColor: Colors.primaryMuted,
										flexDirection: "row",
										gap: 16,
									},
								]}
							>
								<Ionicons
									name="arrow-back"
									size={24}
									color={Colors.primary}
								/>
								<Text
									style={[
										defaultStyles.buttonText,
										{ color: Colors.primary },
									]}
								>
									Receive
								</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
				renderItem={({ item }) => (
					<>
						<View style={[defaultStyles.block, { height: 500 }]}>
							{coinData && (
								<>
									{!isActive && (
										<View>
											<Text
												style={{
													fontSize: 30,
													fontWeight: "bold",
													color: Colors.dark,
												}}
											>
												{chartData[
													chartData.length - 1
												].price.toFixed(2)}{" "}
												€
											</Text>
											<Text
												style={{ fontSize: 18, color: Colors.gray }}
											>
												Today
											</Text>
										</View>
									)}
									{isActive && (
										<View>
											<AnimatedTextInput
												editable={false}
												underlineColorAndroid={"transparent"}
												style={{
													fontSize: 30,
													fontWeight: "bold",
													color: Colors.dark,
												}}
												animatedProps={animatedText}
											></AnimatedTextInput>
											<AnimatedTextInput
												editable={false}
												underlineColorAndroid={"transparent"}
												style={{ fontSize: 18, color: Colors.gray }}
												animatedProps={animatedDateText}
											></AnimatedTextInput>
										</View>
									)}
									<CartesianChart
										//@ts-ignore
										chartPressState={state}
										axisOptions={{
											font,
											tickCount: 5,
											labelOffset: { x: -2, y: 0 },
											labelColor: Colors.gray,
											formatYLabel: (v) => `${v} €`,
											formatXLabel: (ms) =>
												format(new Date(ms), "MM/yy"),
										}}
										data={chartData!}
										xKey="timestamp"
										yKeys={["price"]}
									>
										{({ points }) => (
											<>
												<Line
													points={points.price}
													color={Colors.primary}
													strokeWidth={3}
												/>
												{isActive && (
													<ToolTip
														x={state.x.position}
														y={state.y.price.position}
													/>
												)}
											</>
										)}
									</CartesianChart>
								</>
							)}
						</View>
						{coinData && (
							<View style={[defaultStyles.block, { marginTop: 20 }]}>
								<Text style={{ color: Colors.gray }}>
									{coinData?.name} is a decentralized digital currency,
									without a central bank or single administrator, that
									can be sent from user to user on the peer-to-peer{" "}
									{coinData?.name.toLowerCase()}
									network without the need for intermediaries.
									Transactions are verified by network nodes through
									cryptography and recorded in a public distributed
									ledger called a blockchain.
								</Text>
							</View>
						)}
					</>
				)}
			></SectionList>
		</>
	);
};

export default Page;

const styles = StyleSheet.create({
	subtitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		color: Colors.gray,
	},
	categoryText: {
		fontSize: 14,
		color: Colors.gray,
	},
	categoryTextActive: {
		fontSize: 14,
		color: "#000",
	},
	categoriesBtn: {
		padding: 10,
		paddingHorizontal: 14,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},
	categoriesBtnActive: {
		padding: 10,
		paddingHorizontal: 14,

		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
	},
	coinImage: {
		width: 60,
		height: 60,
		borderRadius: 50,
		overflow: "hidden",
	},
});
