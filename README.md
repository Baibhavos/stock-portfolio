# Dynamic Portfolio Dashboard 📊

A modern, real-time portfolio tracking application built with Next.js that monitors Indian stock investments across NSE and BSE exchanges. The dashboard provides live price updates, sector-wise analysis, and comprehensive portfolio analytics.

## ✨ Features

- **Real-time Price Updates**: Live stock prices fetched from Yahoo Finance API
- **Portfolio Analytics**: Track total investment, current value, and P&L
- **Sector Analysis**: Group holdings by sectors with individual sector performance
- **Interactive Dashboard**: Filter and view holdings by specific sectors
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Multi-Exchange Support**: Supports both NSE and BSE listed stocks
- **Fundamental Data**: P/E ratios and latest earnings data via Google Finance scraping
- **Error Handling**: Robust error handling with toast notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.0 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with custom components
- **Data Fetching**: Axios with Yahoo Finance API integration
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications
- **Data Tables**: TanStack React Table

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-portfolio-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                     
│   ├── api/                 
│   │   ├── portfolio/        
│   │   ├── quotes/           
│   │   └── fundamentals/     
│   ├── layout.tsx           
│   └── page.tsx             
├── components/              
│   ├── molecules/           
│   ├── organisms/           
│   ├── pages/                
│   └── ui/                   
├── controllers/              
├── data/                     
│   └── portfolio.json        
├── lib/                     
│   ├── exchange.ts           
│   ├── yahoo.ts              
│   ├── google.ts             
│   └── types.ts             
└── services/       
```

## 💰 Portfolio Configuration

The portfolio data is stored in `src/data/portfolio.json`. Each holding includes:

```json
{
  "sector": "Tech Sector",
  "name": "Company Name",
  "purchasePrice": 1000.0,
  "quantity": 50,
  "investment": 50000.0,
  "portfolioPct": 0.05,
  "symbol": "SYMBOL",
  "exchange": "NSE"
}
```

### Supported Exchanges
- **NSE**: National Stock Exchange of India
- **BSE**: Bombay Stock Exchange

## 🔄 API Endpoints

### POST `/api/portfolio`
Initializes portfolio with fundamental data and current prices.

### GET `/api/quotes?symbols=SYMBOL1,SYMBOL2`
Fetches real-time quotes for specified symbols.

### GET `/api/fundamentals?symbols=SYMBOL1,SYMBOL2`
Retrieves fundamental data (P/E ratios, earnings) for symbols.

## 📊 Dashboard Features

### Portfolio Overview
- Total investment amount
- Current portfolio value
- Overall profit/loss
- Portfolio performance percentage

### Sector Analysis
- Sector-wise investment distribution
- Individual sector performance
- Interactive sector filtering
- Visual sector cards with key metrics

### Holdings Table
- Detailed view of all holdings
- Real-time price updates
- Gain/loss calculations
- Fundamental data (P/E, earnings)
- Sortable columns

## 🎨 UI Components

The application uses a component-based architecture with:

- **Atomic Design Pattern**: Organized into atoms, molecules, and organisms
- **Shadcn/ui Components**: Modern, accessible UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme switching capability

## ⚠️ Data Sources & Limitations

- **Price Data**: Yahoo Finance (unofficial API, may have delays)
- **Fundamental Data**: Google Finance scraping (subject to availability)
- **Update Frequency**: Live prices update every 15-60 seconds
- **Market Hours**: Real-time updates during market hours only
