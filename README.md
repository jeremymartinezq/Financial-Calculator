# 10bII Financial Calculator

A modern, cross-platform financial calculator. This calculator provides a clean, intuitive interface designed to mimic professional financial calculators.

## Current Status

The calculator is now fully functional with comprehensive financial and statistical capabilities. Recent updates include:

- **Complete Financial Calculations**:
  - Time Value of Money (TVM): PMT, PV, FV, N, I/YR calculations
  - Markup and margin calculations
  - Depreciation methods (straight-line, declining balance, sum-of-years-digits)
  - Bond pricing and yield calculations
  - Amortization schedules

- **Statistical Functions**:
  - Mean and standard deviation
  - Variance calculations
  - Linear regression and correlation
  - Forecasting capability (x from y, y from x)

- **UI Improvements**:
  - Redesigned button layout with numbers grouped on the left and operations on the right
  - Added mode indicators (orange "O" and blue "B") to show when secondary/tertiary functions are active
  - Improved visibility of text elements with optimized color scheme
  - Uniform button sizes for better visual consistency

## Features

- **Time Value of Money (TVM) Calculations**
  - Present Value (PV)
  - Future Value (FV)
  - Payment (PMT)
  - Number of Periods (N)
  - Interest Rate (I/YR)

- **Financial Math**
  - Markup/margin calculations
  - Amortization schedules
  - Bond pricing and yield
  - Depreciation calculations (SL, DB, SOYD)

- **Statistical Analysis**
  - Data entry and storage
  - Mean and standard deviation
  - Linear regression
  - Correlation coefficient
  - Forecasting

- **Memory Functions**
- **Dark Mode Support**
- **Mobile-Responsive Design**

## Running the Calculator

The calculator is a web application that can be run directly in a browser:

1. Clone the repository
2. Open the `index.html` file in a web browser
3. Alternatively, serve the files using a local web server:
   ```bash
   # Using Python
   python -m http.server
   
   # Using Node.js
   npx serve
   ```

## Development

This project uses:
- HTML/CSS/JavaScript for the core application
- Tailwind CSS for styling
- Decimal.js for precise financial calculations (via CDN)

### Project Structure

```
financial-calculator/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── calculator.js
│   └── financial.js
└── README.md
```

## Usage Instructions

### Basic Operations
- **Numbers and Operations**: Enter numbers and perform standard calculations
- **Orange Button**: Toggle secondary functions
- **Blue Button**: Toggle tertiary functions

### Financial Functions
- **N, I/YR, PV, PMT, FV**: Store or calculate time value of money values
- **Orange + MU, PRC, CST, MAR**: Markup/margin calculations
- **Orange + K, %, CFj**: Depreciation methods
- **Orange + SUM**: Amortization schedule calculations
- **Blue + SUM, +/-**: Bond pricing and yield calculations

### Statistical Functions
- **CFj**: Add data points for statistical calculations
- **Orange + 7, 8, 9**: Mean X, Mean Y, Std Deviation
- **Orange + 4, 5, 6**: Variance, Regression, Correlation
- **Blue + 7, 8**: Forecast Y from X, Forecast X from Y
- **Blue + 9**: Clear statistics

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author
Developed by Jeremy Martinez-Quinones.