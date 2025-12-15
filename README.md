# Finance Management App

A comprehensive finance management application built with React Native and Expo, featuring a dark theme design inspired by modern financial apps.

## Features

### 🏠 Dashboard
- **Balance Overview**: View total balance across all accounts
- **Account Cards**: Display multiple account balances with currency support
- **Weekly Spending Chart**: Visual representation of spending patterns
- **Recent Transactions**: Quick access to latest transactions
- **Budget Overview**: Progress bars for budget categories

### 💳 Transactions
- **Transaction Management**: Add, edit, and delete transactions
- **Category Support**: Organize transactions by categories with icons
- **Search & Filter**: Search transactions and filter by type (income/expense)
- **Transaction Details**: Detailed view of individual transactions
- **Daily Totals**: Automatic calculation of daily spending

### 💰 Budget
- **Budget Creation**: Set budgets for different categories
- **Progress Tracking**: Visual progress bars with color-coded status
- **Period Selection**: Weekly, monthly, or yearly budget periods
- **Budget Alerts**: Warnings when approaching or exceeding budget limits
- **Category Management**: Predefined categories with icons and colors

### 📊 Analytics
- **Income vs Expenses**: Line chart comparing income and expenses over time
- **Spending by Category**: Pie chart showing spending distribution
- **Weekly Spending**: Bar chart for weekly spending patterns
- **Key Insights**: Smart insights about spending habits
- **Financial Goals**: Track progress towards savings goals

### 👤 Profile
- **User Settings**: Manage account information and preferences
- **App Preferences**: Configure notifications, biometric auth, dark mode
- **Data Management**: Export data and manage app settings
- **Help & Support**: Access help resources and app information

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack and Bottom Tabs)
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons (Ionicons)
- **Storage**: AsyncStorage for data persistence
- **Styling**: React Native StyleSheet with dark theme

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run the app:
- **iOS**: Press `i` in the terminal or run `npm run ios`
- **Android**: Press `a` in the terminal or run `npm run android`
- **Web**: Press `w` in the terminal or run `npm run web`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # Main app screens
├── services/       # Data services and API calls
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Key Features Implementation

### Dark Theme Design
- Consistent dark color scheme throughout the app
- High contrast for better readability
- Modern UI with card-based layouts
- Color-coded categories and status indicators

### Data Persistence
- Local storage using AsyncStorage
- Automatic saving of transactions, budgets, and preferences
- Data validation and error handling

### Responsive Design
- Optimized for different screen sizes
- Touch-friendly interface
- Proper spacing and typography

### Charts and Analytics
- Interactive charts for financial data visualization
- Multiple chart types (Line, Bar, Pie)
- Real-time data updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.