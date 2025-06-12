import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Transaction } from "@/store/balanceStore";
import Colors from "@/constants/Colors";
import RoundedButton from "./RoundedButton";
import { decimalNumberWithCommas } from "@/helpers/formatNumbers";
import moment from "moment";

const TransactionInfo: FC<{ transaction: Transaction }> = ({ transaction }) => {
	return (
		<View style={styles.transactionContainer}>
			<View style={styles.transactionLeft}>
				<RoundedButton
					size="sm"
					icon={transaction.title === "Added money" ? "add" : "minus"}
				/>
				<View
					style={{
						gap: 5,
					}}
				>
					<Text style={styles.transactionTitle}>{transaction.title}</Text>
					<Text style={styles.transactionDate}>
						{moment(transaction.date).format("MMMM Do YYYY, h:mm:ss a")}
					</Text>
				</View>
			</View>
			<Text>{decimalNumberWithCommas(transaction.amount)}$</Text>
		</View>
	);
};

export default TransactionInfo;

const styles = StyleSheet.create({
	transactionContainer: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	transactionLeft: {
		flexDirection: "row",

		alignItems: "center",
		gap: 10,
	},
	transactionTitle: {
		fontSize: 16,
		fontWeight: "500",
	},
	transactionDate: {
		fontSize: 12,
		color: Colors.primary,
	},
});
