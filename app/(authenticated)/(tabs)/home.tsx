import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import RoundedButton from "@/components/RoundedButton";
import Dropdown from "@/components/Dropdown";
import { Transaction, useBalanceStore } from "@/store/balanceStore";
import { decimalNumberWithCommas } from "@/helpers/formatNumbers";
import TransactionInfo from "@/components/TransactionInfo";
import { useRouter } from "expo-router";

const Page = () => {
	const router = useRouter();
	const { balance, transactions, runTransaction, clearTransactions } =
		useBalanceStore();

	const addMoney = () => {
		runTransaction({
			id: Math.random().toString(),
			amount: 2000,
			date: new Date(),
			title: "Added money",
		});
	};

	const onClearTransactions = () => {
		clearTransactions();
	};

	return (
		<ScrollView
			style={[defaultStyles.container, { flex: 1 }]}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View style={styles.balanceContainer}>
				<View
					style={{ flexDirection: "row", gap: 4, alignItems: "flex-end" }}
				>
					<Text style={styles.balanceText}>
						{decimalNumberWithCommas(balance())}
					</Text>
					<Text style={styles.balanceCurrency}>$</Text>
				</View>
				<TouchableOpacity style={styles.accountButton}>
					<Text style={styles.accountText}>Accounts</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.buttonGroup}>
				<RoundedButton
					icon={"add"}
					text="Add money"
					onPress={() => {
						addMoney();
					}}
				/>
				<RoundedButton
					icon={"refresh"}
					text="Exchange"
					onPress={() => {
						onClearTransactions();
					}}
				/>
				<RoundedButton
					icon={"list"}
					text="Details"
					onPress={() => {
						console.log("Details");
					}}
				/>
				<Dropdown />
			</View>

			<View style={styles.transactionsContainer}>
				<Text style={styles.transactionsHeader}>Transactions</Text>
				<View
					style={[
						styles.transactionsList,
						transactions.length === 0
							? styles.listEmpty
							: styles.listFilled,
					]}
				>
					{transactions.length === 0 ? (
						<Text
							style={{
								fontSize: 24,
								fontWeight: "600",
							}}
						>
							No transactions
						</Text>
					) : (
						<>
							{transactions
								.slice(0, 8)
								.map((transaction: Transaction) => (
									<TransactionInfo
										transaction={transaction}
										key={transaction.id}
									/>
								))}

							{transactions.length > 8 && (
								<View
									style={{
										alignItems: "center",
										justifyContent: "center",
										marginVertical: 15,
									}}
								>
									<TouchableOpacity
										onPress={() => {
											router.push(
												"/(authenticated)/(tabs)/transfer"
											);
										}}
										style={styles.moreButton}
									>
										<Text
											style={{
												fontSize: 14,
												fontWeight: "700",
												color: "#fff",
											}}
										>
											Show more transactions
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</>
					)}
				</View>
			</View>
		</ScrollView>
	);
};

export default Page;

const styles = StyleSheet.create({
	balanceContainer: {
		width: "100%",
		height: 250,
		gap: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	balanceText: {
		fontSize: 40,
		fontWeight: "700",
	},
	balanceCurrency: {
		fontWeight: "400",
		fontSize: 20,
	},
	accountButton: {
		backgroundColor: Colors.lightGray,
		paddingHorizontal: 20,
		paddingVertical: 15,

		fontSize: 18,
		borderRadius: 50,
	},
	accountText: {
		color: Colors.dark,
		fontWeight: "500",
		fontSize: 16,
	},
	buttonGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	transactionsContainer: {
		marginTop: 30,
	},
	transactionsHeader: {
		fontSize: 20,
		fontWeight: "500",
		marginBottom: 10,
	},
	transactionsList: {
		width: "100%",
		borderRadius: 20,
		minHeight: 250,
		backgroundColor: "#fff",
	},
	listEmpty: {
		alignItems: "center",
		justifyContent: "center",
	},
	listFilled: {
		gap: 10,
		paddingVertical: 10,
	},
	moreButton: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 30,
		paddingVertical: 15,
		borderRadius: 18,
	},
});
