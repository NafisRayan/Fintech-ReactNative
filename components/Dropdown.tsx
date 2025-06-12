import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as ZeegoDropdown from "zeego/dropdown-menu";
import RoundedButton from "./RoundedButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Dropdown = () => {
	const router = useRouter();

	const clearAsyncStorage = async () => {
		AsyncStorage.getAllKeys()
			.then((keys) => AsyncStorage.multiRemove(keys))
			.then(() => router.replace("/"));
	};
	return (
		<ZeegoDropdown.Root>
			<ZeegoDropdown.Trigger>
				<RoundedButton icon={"ellipsis-horizontal"} text={"More"} />
			</ZeegoDropdown.Trigger>
			<ZeegoDropdown.Content>
				<ZeegoDropdown.Item key="statement">
					<ZeegoDropdown.ItemTitle>Statement</ZeegoDropdown.ItemTitle>
					<ZeegoDropdown.ItemIcon
						ios={{
							name: "list.bullet.rectangle.fill",
							pontSize: 24,
						}}
					/>
				</ZeegoDropdown.Item>
				<ZeegoDropdown.Item key="converter">
					<ZeegoDropdown.ItemTitle>Converter</ZeegoDropdown.ItemTitle>
					<ZeegoDropdown.ItemIcon
						ios={{
							name: "coloncurrencysign.arrow.circlepath",
							pontSize: 24,
						}}
					/>
				</ZeegoDropdown.Item>
				<ZeegoDropdown.Item key="background">
					<ZeegoDropdown.ItemTitle>Background</ZeegoDropdown.ItemTitle>
					<ZeegoDropdown.ItemIcon
						ios={{
							name: "photo.fill",
							pontSize: 24,
						}}
					/>
				</ZeegoDropdown.Item>
				<ZeegoDropdown.Item
					key="account"
					onSelect={() => {
						clearAsyncStorage();
					}}
				>
					<ZeegoDropdown.ItemTitle>
						Add new account
					</ZeegoDropdown.ItemTitle>
					<ZeegoDropdown.ItemIcon
						ios={{
							name: "plus.rectangle.on.folder.fill",
							pontSize: 24,
						}}
					/>
				</ZeegoDropdown.Item>
			</ZeegoDropdown.Content>
		</ZeegoDropdown.Root>
	);
};

export default Dropdown;

const styles = StyleSheet.create({});
