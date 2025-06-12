import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import { Transaction, useBalanceStore } from "@/store/balanceStore";
import { defaultStyles } from "@/constants/Styles";
import TransactionInfo from "@/components/TransactionInfo";
import { useRouter } from "expo-router";

const Page = () => {
	const router = useRouter();
	const { balance, transactions, runTransaction, clearTransactions } =
		useBalanceStore();
	return (
		<ScrollView
			style={[defaultStyles.container, { flex: 1 }]}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
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
							{transactions.map((transaction: Transaction) => (
								<TransactionInfo
									transaction={transaction}
									key={transaction.id}
								/>
							))}
						</>
					)}
				</View>
			</View>
		</ScrollView>
	);
};

export default Page;

const styles = StyleSheet.create({
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
});
