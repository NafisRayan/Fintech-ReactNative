import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import CustomHeader from "@/components/CustomHeader";

const Layout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary,
				tabBarBackground: () => (
					<BlurView
						intensity={100}
						style={{
							flex: 1,
							backgroundColor: "rgba(0, 0, 0,0.05)",
						}}
					/>
				),
				tabBarStyle: {
					backgroundColor: "transparent",
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					elevation: 0,
					borderTopWidth: 0,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ size, color }) => (
						<FontAwesome color={color} name="home" size={size} />
					),
					header: () => <CustomHeader />,
				}}
			/>

			<Tabs.Screen
				name="transfer"
				options={{
					title: "Transfers",
					tabBarIcon: ({ size, color }) => (
						<FontAwesome color={color} name="exchange" size={size} />
					),
					header: () => <CustomHeader />,
				}}
			/>
			<Tabs.Screen
				name="crypto"
				options={{
					title: "Crypto",
					tabBarIcon: ({ size, color }) => (
						<FontAwesome color={color} name="bitcoin" size={size} />
					),
					header: () => <CustomHeader />,
				}}
			/>
		</Tabs>
	);
};

export default Layout;
