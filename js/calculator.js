// We're using the global Decimal object now
// import { Decimal } from 'decimal.js';

class Calculator {
    constructor() {
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Get DOM elements
        this.display = document.getElementById('display');
        this.modeIndicator = document.getElementById('mode-indicator');
        this.nDisplay = document.getElementById('n');
        this.iyrDisplay = document.getElementById('iyr');
        this.pvDisplay = document.getElementById('pv');
        this.pmtDisplay = document.getElementById('pmt');
        this.fvDisplay = document.getElementById('fv');

        // Initialize calculator state
        this.currentValue = '0';
        this.secondaryMode = false;
        this.tertiaryMode = false;
        this.n = 0;
        this.iyr = 0;
        this.pv = 0;
        this.pmt = 0;
        this.fv = 0;
        this.paymentsPerYear = 12;
        this.beginMode = false;
        this.memory = 0;
        this.lastOperator = null;
        this.lastValue = null;
        this.newNumber = true;
        
        // Statistics
        this.stats = {
            n: 0,
            sumX: 0,
            sumY: 0,
            sumXY: 0,
            sumX2: 0,
            sumY2: 0,
            dataX: [], // Store actual data points for easier calculations
            dataY: []
        };
        
        // Bond calculation variables
        this.bond = {
            settlementDate: new Date(),
            maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
            couponRate: 5, // %
            yield: 5, // %
            faceValue: 1000,
            frequency: 2 // Semi-annual
        };
        
        // Depreciation variables
        this.depreciation = {
            cost: 1000,
            salvage: 100,
            life: 5,
            method: 'sl' // sl = straight-line, db = declining balance, soyd = sum of years digits
        };

        // Add event listeners to all buttons
        document.querySelectorAll('.key').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('data-key');
                console.log('Button clicked:', action);
                this.handleButtonPress(action);
            });
        });

        // Update display
        this.updateDisplay();
    }

    handleButtonPress(action) {
        console.log('Handling action:', action);
        
        // Handle different button actions based on mode
        if (this.secondaryMode) {
            // Handle orange mode actions
            switch(action) {
                case 'mu':
                    this.calculateMarkup();
                    break;
                case 'prc':
                    this.calculatePrice();
                    break;
                case 'cst':
                    this.calculateCost();
                    break;
                case 'mar':
                    this.calculateMargin();
                    break;
                case 'k':
                    this.straightLineDepreciation();
                    break;
                case 'percent':
                    this.decliningBalanceDepreciation();
                    break;
                case 'cfj':
                    this.sumOfYearsDigitsDepreciation();
                    break;
                case 'sum':
                    this.calculateAmortizationSchedule();
                    break;
                case '7':
                    this.calculateMeanX();
                    break;
                case '8':
                    this.calculateMeanY();
                    break;
                case '9':
                    this.calculateStandardDeviation();
                    break;
                case '4':
                    this.calculateVariance();
                    break;
                case '5':
                    this.calculateLinearRegression();
                    break;
                case '6':
                    this.calculateCorrelation();
                    break;
                default:
                    // Continue to normal handling if not special orange function
                    this.handleNormalAction(action);
                    break;
            }
            this.secondaryMode = false; // Turn off orange mode after action
            this.updateModeIndicators();
        } else if (this.tertiaryMode) {
            // Handle blue mode actions
            switch(action) {
                case 'sum':
                    this.calculateBondPrice();
                    break;
                case 'plusminus':
                    this.calculateBondYield();
                    break;
                case '7':
                    this.forecastYfromX();
                    break;
                case '8':
                    this.forecastXfromY();
                    break;
                case '9':
                    this.clearStatistics();
                    break;
                case 'n':
                    this.calculateN();
                    break;
                case 'iyr':
                    this.calculateIYR();
                    break;
                default:
                    // Continue to normal handling if not special blue function
                    this.handleNormalAction(action);
                    break;
            }
            this.tertiaryMode = false; // Turn off blue mode after action
            this.updateModeIndicators();
        } else {
            // Normal mode handling
            this.handleNormalAction(action);
        }
        
        // Update display after every action
        this.updateDisplay();
    }

    handleNormalAction(action) {
        switch(action) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                this.appendNumber(action);
                break;
            case 'decimal':
                this.appendDecimal();
                break;
            case 'plus': case 'minus': case 'multiply': case 'divide':
                this.setOperation(action);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'n': 
                this.handleRegister('n');
                break;
            case 'iyr': 
                this.handleRegister('iyr');
                break;
            case 'pv': 
                if (!this.newNumber) {
                    this.calculatePV();
                } else {
                    this.handleRegister('pv');
                }
                break;
            case 'pmt':
                if (!this.newNumber) {
                    this.calculatePMT();
                } else {
                    this.handleRegister('pmt');
                }
                break;
            case 'fv': 
                if (!this.newNumber) {
                    this.calculateFV();
                } else {
                    this.handleRegister('fv');
                }
                break;
            case 'input':
                // When input is pressed, store value in memory
                this.memory = parseFloat(this.currentValue);
                this.newNumber = true;
                break;
            case 'orange':
                this.toggleSecondaryMode();
                break;
            case 'blue':
                this.toggleTertiaryMode();
                break;
            case 'cfj':
                this.addStatisticData();
                break;
            case 'sum':
                this.calculateStatistics();
                break;
            case 'plusminus':
                this.toggleSign();
                break;
            case 'rcl':
                this.recall();
                break;
            case 'mem':
                this.storeInMemory();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                console.log('Action not implemented:', action);
        }
    }

    appendNumber(number) {
        if (this.newNumber) {
            this.currentValue = number;
            this.newNumber = false;
        } else if (this.currentValue.length < 12) {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
    }

    appendDecimal() {
        if (this.newNumber) {
            this.currentValue = '0.';
            this.newNumber = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
    }

    setOperation(operation) {
        this.lastOperator = operation;
        this.lastValue = this.currentValue;
        this.newNumber = true;
    }

    calculate() {
        if (!this.lastOperator || !this.lastValue) return;

        const a = parseFloat(this.lastValue);
        const b = parseFloat(this.currentValue);
        let result;

        switch(this.lastOperator) {
            case 'plus': result = a + b; break;
            case 'minus': result = a - b; break;
            case 'multiply': result = a * b; break;
            case 'divide': 
                if (b === 0) {
                    this.currentValue = 'Error';
                    return;
                }
                result = a / b; 
                break;
        }

        this.currentValue = this.formatNumber(result);
        this.lastOperator = null;
        this.newNumber = true;
    }

    clear() {
        this.currentValue = '0';
        this.newNumber = true;
    }

    handleRegister(register) {
        if (this.newNumber) {
            // Display the value of the register
            this.currentValue = this[register].toString();
            this.newNumber = false;
        } else {
            // Store the current value in the register
            this[register] = parseFloat(this.currentValue);
            this.newNumber = true;
        }
    }

    // Time Value of Money (TVM) Calculations
    calculatePMT() {
        // PMT = (-PV * r * (1+r)^n - FV * r) / ((1+r)^n - 1)
        try {
            const n = this.n;
            const rate = this.iyr / 100 / this.paymentsPerYear;
            const pv = this.pv;
            const fv = this.fv;

            // If interest rate is zero, simple division
            if (rate === 0) {
                this.pmt = -(pv + fv) / n;
            } else {
                const term = Math.pow(1 + rate, n);
                const numerator = pv * rate * term + fv * rate;
                const denominator = term - 1;
                this.pmt = -numerator / denominator;

                // Adjust for beginning-of-period payments
                if (this.beginMode) {
                    this.pmt = this.pmt / (1 + rate);
                }
            }
            
            this.currentValue = this.formatNumber(this.pmt);
            this.newNumber = true;
        } catch (e) {
            console.error('PMT calculation error:', e);
            this.currentValue = 'Error';
        }
    }

    calculatePV() {
        // PV = -FV / (1+r)^n - PMT * ((1 - (1+r)^-n) / r)
        try {
            const n = this.n;
            const rate = this.iyr / 100 / this.paymentsPerYear;
            const pmt = this.pmt;
            const fv = this.fv;
            
            // If interest rate is zero, simple multiplication
            if (rate === 0) {
                this.pv = -(fv + pmt * n);
            } else {
                const term = Math.pow(1 + rate, n);
                let pvPmt;
                
                // Adjust for beginning-of-period payments
                if (this.beginMode) {
                    pvPmt = pmt * (1 - 1 / term) / rate * (1 + rate);
                } else {
                    pvPmt = pmt * (1 - 1 / term) / rate;
                }
                
                this.pv = -(fv / term + pvPmt);
            }
            
            this.currentValue = this.formatNumber(this.pv);
            this.newNumber = true;
        } catch (e) {
            console.error('PV calculation error:', e);
            this.currentValue = 'Error';
        }
    }

    calculateFV() {
        // FV = -PV * (1+r)^n - PMT * ((1+r)^n - 1) / r
        try {
            const n = this.n;
            const rate = this.iyr / 100 / this.paymentsPerYear;
            const pv = this.pv;
            const pmt = this.pmt;
            
            // If interest rate is zero, simple multiplication
            if (rate === 0) {
                this.fv = -(pv + pmt * n);
            } else {
                const term = Math.pow(1 + rate, n);
                let fvPmt;
                
                // Adjust for beginning-of-period payments
                if (this.beginMode) {
                    fvPmt = pmt * (term - 1) / rate * (1 + rate);
                } else {
                    fvPmt = pmt * (term - 1) / rate;
                }
                
                this.fv = -(pv * term + fvPmt);
            }
            
            this.currentValue = this.formatNumber(this.fv);
            this.newNumber = true;
        } catch (e) {
            console.error('FV calculation error:', e);
            this.currentValue = 'Error';
        }
    }

    calculateN() {
        try {
            const rate = this.iyr / 100 / this.paymentsPerYear;
            const pv = this.pv;
            const pmt = this.pmt;
            const fv = this.fv;
            
            // If interest rate is zero, simple division
            if (rate === 0) {
                if (pmt === 0) {
                    this.currentValue = 'Error';
                    return;
                }
                this.n = -(pv + fv) / pmt;
            } else {
                // For non-zero rates, we need to use logarithms
                // This is a complex calculation that requires iteration for exact values
                // For simplicity, we'll use an approximation formula for when PMT != 0
                
                if (pmt === 0) {
                    // When PMT = 0, we can use the direct formula for compound interest
                    this.n = Math.log(-fv / pv) / Math.log(1 + rate);
                } else {
                    // When PMT != 0, we need to use numerical methods for precision
                    // This is a simplified approximation
                    const z = pmt / rate;
                    const a = z - fv;
                    const b = z + pv;
                    this.n = Math.log(a / b) / Math.log(1 + rate);
                }
            }
            
            this.currentValue = this.formatNumber(this.n);
            this.newNumber = true;
        } catch (e) {
            console.error('N calculation error:', e);
            this.currentValue = 'Error';
        }
    }

    calculateIYR() {
        try {
            const n = this.n;
            const pv = this.pv;
            const pmt = this.pmt;
            const fv = this.fv;
            
            // Interest rate calculation requires numerical methods (Newton-Raphson)
            // Initial guess - a reasonable starting point
            let rate = 0.1;
            const MAX_ITERATIONS = 20;
            const PRECISION = 1e-7;
            
            // Newton-Raphson iteration to find the rate
            for (let i = 0; i < MAX_ITERATIONS; i++) {
                // Calculate f(rate) - the present value equation
                const term = Math.pow(1 + rate, n);
                let f, fprime;
                
                if (this.beginMode) {
                    f = pv + fv / term + pmt * (1 + rate) * (1 - 1/term) / rate;
                    fprime = -n * fv / (term * (1 + rate)) + 
                            pmt * (1/rate - (n+1)/(rate*term) + n/(rate*term*(1+rate)));
                } else {
                    f = pv + fv / term + pmt * (1 - 1/term) / rate;
                    fprime = -n * fv / (term * (1 + rate)) + 
                            pmt * (1/rate - n/(rate*term) + (n-1)/(rate*term*(1+rate)));
                }
                
                // Apply Newton-Raphson formula
                const newRate = rate - f / fprime;
                
                // Check for convergence
                if (Math.abs(newRate - rate) < PRECISION) {
                    this.iyr = newRate * 100 * this.paymentsPerYear;
                    this.currentValue = this.formatNumber(this.iyr);
                    this.newNumber = true;
                    return;
                }
                
                rate = newRate;
            }
            
            // If we get here, we didn't converge
            throw new Error("Interest rate calculation did not converge");
        } catch (e) {
            console.error('I/YR calculation error:', e);
            this.currentValue = 'Error';
        }
    }

    toggleSecondaryMode() {
        this.secondaryMode = !this.secondaryMode;
        console.log('Secondary mode:', this.secondaryMode);
        this.updateModeIndicators();
    }

    toggleTertiaryMode() {
        this.tertiaryMode = !this.tertiaryMode;
        console.log('Tertiary mode:', this.tertiaryMode);
        this.updateModeIndicators();
    }

    updateModeIndicators() {
        let indicatorText = '';
        if (this.secondaryMode) indicatorText += 'O';
        if (this.tertiaryMode) indicatorText += 'B';
        this.modeIndicator.textContent = indicatorText;
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
        this.nDisplay.textContent = this.formatNumber(this.n);
        this.iyrDisplay.textContent = this.formatNumber(this.iyr);
        this.pvDisplay.textContent = this.formatNumber(this.pv);
        this.pmtDisplay.textContent = this.formatNumber(this.pmt);
        this.fvDisplay.textContent = this.formatNumber(this.fv);
    }

    formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return 'Error';
        
        if (Math.abs(num) > 1e12) return 'Overflow';
        
        // Format with appropriate precision
        if (Math.abs(num) < 0.0001 && num !== 0) {
            return num.toExponential(4);
        }
        
        // Round to 6 significant digits and format
        const result = parseFloat(num.toPrecision(6));
        
        // Check if it's a whole number
        if (Number.isInteger(result)) {
            return result.toString();
        }
        
        return result.toString();
    }

    // Markup and Margin Calculations
    calculateMarkup() {
        try {
            const cost = parseFloat(this.currentValue);
            const price = this.memory;
            
            if (cost === 0) {
                throw new Error("Cannot calculate markup with zero cost");
            }
            
            const markup = (price - cost) / cost * 100;
            this.currentValue = this.formatNumber(markup);
            this.newNumber = true;
        } catch (e) {
            console.error('Markup calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateCost() {
        try {
            const price = parseFloat(this.currentValue);
            const markup = this.memory; // markup percentage
            
            const cost = price / (1 + markup / 100);
            this.currentValue = this.formatNumber(cost);
            this.newNumber = true;
        } catch (e) {
            console.error('Cost calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculatePrice() {
        try {
            const cost = parseFloat(this.currentValue);
            const markup = this.memory; // markup percentage
            
            const price = cost * (1 + markup / 100);
            this.currentValue = this.formatNumber(price);
            this.newNumber = true;
        } catch (e) {
            console.error('Price calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateMargin() {
        try {
            const cost = parseFloat(this.currentValue);
            const price = this.memory;
            
            if (price === 0) {
                throw new Error("Cannot calculate margin with zero price");
            }
            
            const margin = (price - cost) / price * 100;
            this.currentValue = this.formatNumber(margin);
            this.newNumber = true;
        } catch (e) {
            console.error('Margin calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    // Depreciation Calculations
    straightLineDepreciation() {
        try {
            // Get the asset cost from current value
            this.depreciation.cost = parseFloat(this.currentValue);
            
            // Calculate annual depreciation using straight-line method
            const annualDepreciation = (this.depreciation.cost - this.depreciation.salvage) / this.depreciation.life;
            
            this.currentValue = this.formatNumber(annualDepreciation);
            this.newNumber = true;
        } catch (e) {
            console.error('Straight-line depreciation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    decliningBalanceDepreciation() {
        try {
            // Get the rate from current value (as a percentage)
            const rate = parseFloat(this.currentValue);
            
            // Book value starts as the cost
            let bookValue = this.depreciation.cost;
            
            // Calculate first year depreciation
            const depreciation = bookValue * (rate / 100);
            
            this.currentValue = this.formatNumber(depreciation);
            this.newNumber = true;
        } catch (e) {
            console.error('Declining balance depreciation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    sumOfYearsDigitsDepreciation() {
        try {
            // Get current year from current value
            const year = parseInt(this.currentValue);
            
            if (year < 1 || year > this.depreciation.life) {
                throw new Error("Year must be between 1 and asset life");
            }
            
            // Calculate sum of years' digits
            const sum = (this.depreciation.life * (this.depreciation.life + 1)) / 2;
            
            // Calculate depreciation for the specified year
            const yearsRemaining = this.depreciation.life - year + 1;
            const depreciation = (this.depreciation.cost - this.depreciation.salvage) * yearsRemaining / sum;
            
            this.currentValue = this.formatNumber(depreciation);
            this.newNumber = true;
        } catch (e) {
            console.error('Sum-of-years-digits depreciation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    // Bond Calculations
    calculateBondPrice() {
        try {
            // Get the yield to maturity from current value
            this.bond.yield = parseFloat(this.currentValue);
            
            // Calculate years to maturity
            const settlement = this.bond.settlementDate;
            const maturity = this.bond.maturityDate;
            const yearsToMaturity = (maturity - settlement) / (365 * 24 * 60 * 60 * 1000);
            
            if (yearsToMaturity <= 0) {
                throw new Error("Maturity date must be after settlement date");
            }
            
            // Calculate bond price
            const couponRate = this.bond.couponRate / 100;
            const yieldRate = this.bond.yield / 100;
            const frequency = this.bond.frequency;
            const periodsPerYear = frequency;
            const totalPeriods = Math.round(yearsToMaturity * periodsPerYear);
            const couponPerPeriod = (this.bond.faceValue * couponRate) / frequency;
            const yieldPerPeriod = yieldRate / frequency;
            
            // Present value of coupon payments
            let presentValueCoupons = 0;
            for (let i = 1; i <= totalPeriods; i++) {
                presentValueCoupons += couponPerPeriod / Math.pow(1 + yieldPerPeriod, i);
            }
            
            // Present value of principal (face value) at maturity
            const presentValuePrincipal = this.bond.faceValue / Math.pow(1 + yieldPerPeriod, totalPeriods);
            
            // Total bond price
            const bondPrice = presentValueCoupons + presentValuePrincipal;
            
            this.currentValue = this.formatNumber(bondPrice);
            this.newNumber = true;
        } catch (e) {
            console.error('Bond price calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateBondYield() {
        try {
            // Get the bond price from current value
            const bondPrice = parseFloat(this.currentValue);
            
            if (bondPrice <= 0) {
                throw new Error("Bond price must be positive");
            }
            
            // Calculate years to maturity
            const settlement = this.bond.settlementDate;
            const maturity = this.bond.maturityDate;
            const yearsToMaturity = (maturity - settlement) / (365 * 24 * 60 * 60 * 1000);
            
            // Newton-Raphson method to find yield
            const frequency = this.bond.frequency;
            const couponRate = this.bond.couponRate / 100;
            const couponPerPeriod = (this.bond.faceValue * couponRate) / frequency;
            const totalPeriods = Math.round(yearsToMaturity * frequency);
            
            // Initial guess - use coupon rate as starting point
            let yield1 = couponRate / frequency;
            let yield0;
            const maxIterations = 100;
            const tolerance = 1e-10;
            
            for (let i = 0; i < maxIterations; i++) {
                // Calculate price at current yield guess
                let price = 0;
                for (let j = 1; j <= totalPeriods; j++) {
                    price += couponPerPeriod / Math.pow(1 + yield1, j);
                }
                price += this.bond.faceValue / Math.pow(1 + yield1, totalPeriods);
                
                // Calculate derivative of price function
                let derivative = 0;
                for (let j = 1; j <= totalPeriods; j++) {
                    derivative -= j * couponPerPeriod / Math.pow(1 + yield1, j + 1);
                }
                derivative -= totalPeriods * this.bond.faceValue / Math.pow(1 + yield1, totalPeriods + 1);
                
                // Newton-Raphson update
                yield0 = yield1;
                yield1 = yield0 - (price - bondPrice) / derivative;
                
                // Check for convergence
                if (Math.abs(yield1 - yield0) < tolerance) {
                    break;
                }
            }
            
            // Convert to annual percentage
            const annualYield = yield1 * frequency * 100;
            
            this.currentValue = this.formatNumber(annualYield);
            this.newNumber = true;
        } catch (e) {
            console.error('Bond yield calculation error:', e);
            this.currentValue = 'Error';
        }
    }

    calculateAmortization(period) {
        try {
            if (period < 1 || period > this.n) {
                throw new Error("Period must be between 1 and n");
            }
            
            const rate = this.iyr / 100 / this.paymentsPerYear;
            const remainingPeriods = this.n - period + 1;
            
            // Calculate remaining balance (present value) after specified period
            let remainingBalance;
            
            if (rate === 0) {
                remainingBalance = this.pv * (1 - (period - 1) / this.n);
            } else {
                const term = Math.pow(1 + rate, remainingPeriods);
                const denom = term - 1;
                remainingBalance = -(this.pmt * denom / (rate * term) + this.fv / term);
            }
            
            // Calculate interest and principal for the current payment
            let interestPayment;
            let principalPayment;
            
            if (period === 1) {
                interestPayment = this.pv * rate;
            } else {
                // Calculate previous balance
                let previousBalance;
                if (rate === 0) {
                    previousBalance = this.pv * (1 - (period - 2) / this.n);
                } else {
                    const prevRemainingPeriods = this.n - period + 2;
                    const prevTerm = Math.pow(1 + rate, prevRemainingPeriods);
                    const prevDenom = prevTerm - 1;
                    previousBalance = -(this.pmt * prevDenom / (rate * prevTerm) + this.fv / prevTerm);
                }
                interestPayment = previousBalance * rate;
            }
            
            principalPayment = this.pmt - interestPayment;
            
            return {
                period,
                payment: this.pmt,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            };
        } catch (e) {
            console.error('Amortization calculation error:', e);
            return null;
        }
    }

    addStatisticData() {
        try {
            const x = parseFloat(this.currentValue);
            const y = this.memory;
            
            // Add data to arrays for easy access later
            this.stats.dataX.push(x);
            this.stats.dataY.push(y);
            
            // Update running sums
            this.stats.n++;
            this.stats.sumX += x;
            this.stats.sumY += y;
            this.stats.sumXY += x * y;
            this.stats.sumX2 += x * x;
            this.stats.sumY2 += y * y;
            
            // Display the count of data points
            this.currentValue = this.formatNumber(this.stats.n);
            this.newNumber = true;
        } catch (e) {
            console.error('Error adding statistic data:', e);
            this.currentValue = 'Error';
        }
    }

    calculateStatistics() {
        try {
            // Toggle through different statistical calculations based on the secondary/tertiary mode
            if (this.secondaryMode) {
                // Calculate mean of X
                const meanX = this.stats.sumX / this.stats.n;
                this.currentValue = this.formatNumber(meanX);
                this.secondaryMode = false;
                this.updateModeIndicators();
            } else if (this.tertiaryMode) {
                // Calculate mean of Y
                const meanY = this.stats.sumY / this.stats.n;
                this.currentValue = this.formatNumber(meanY);
                this.tertiaryMode = false;
                this.updateModeIndicators();
            } else {
                // By default, calculate standard deviation of X
                this.calculateStandardDeviation();
            }
            
            this.newNumber = true;
        } catch (e) {
            console.error('Statistics calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateStandardDeviation() {
        try {
            if (this.stats.n < 2) {
                throw new Error("Need at least 2 data points for standard deviation");
            }
            
            // Calculate standard deviation of X
            const meanX = this.stats.sumX / this.stats.n;
            
            // Use the formula: sqrt(Σ(x - meanX)² / (n - 1))
            let sumSquaredDeviations = 0;
            for (const x of this.stats.dataX) {
                sumSquaredDeviations += Math.pow(x - meanX, 2);
            }
            
            const standardDeviation = Math.sqrt(sumSquaredDeviations / (this.stats.n - 1));
            this.currentValue = this.formatNumber(standardDeviation);
        } catch (e) {
            console.error('Standard deviation calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateVariance() {
        try {
            if (this.stats.n < 2) {
                throw new Error("Need at least 2 data points for variance");
            }
            
            // Calculate variance of X
            const meanX = this.stats.sumX / this.stats.n;
            
            // Use the formula: Σ(x - meanX)² / (n - 1)
            let sumSquaredDeviations = 0;
            for (const x of this.stats.dataX) {
                sumSquaredDeviations += Math.pow(x - meanX, 2);
            }
            
            const variance = sumSquaredDeviations / (this.stats.n - 1);
            this.currentValue = this.formatNumber(variance);
        } catch (e) {
            console.error('Variance calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateLinearRegression() {
        try {
            if (this.stats.n < 2) {
                throw new Error("Need at least 2 data points for linear regression");
            }
            
            // Calculate slope and intercept for y = mx + b
            const n = this.stats.n;
            const sumX = this.stats.sumX;
            const sumY = this.stats.sumY;
            const sumXY = this.stats.sumXY;
            const sumX2 = this.stats.sumX2;
            
            // Calculate slope (m)
            const numerator = n * sumXY - sumX * sumY;
            const denominator = n * sumX2 - sumX * sumX;
            
            if (denominator === 0) {
                throw new Error("Cannot calculate regression - vertical line");
            }
            
            const slope = numerator / denominator;
            
            // Calculate intercept (b)
            const intercept = (sumY - slope * sumX) / n;
            
            // Store results for forecasting
            this.stats.regression = { slope, intercept };
            
            // Return the slope
            this.currentValue = this.formatNumber(slope);
        } catch (e) {
            console.error('Linear regression calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateCorrelation() {
        try {
            if (this.stats.n < 2) {
                throw new Error("Need at least 2 data points for correlation");
            }
            
            const n = this.stats.n;
            const sumX = this.stats.sumX;
            const sumY = this.stats.sumY;
            const sumXY = this.stats.sumXY;
            const sumX2 = this.stats.sumX2;
            const sumY2 = this.stats.sumY2;
            
            // Calculate correlation coefficient
            const numerator = n * sumXY - sumX * sumY;
            const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
            
            if (denominator === 0) {
                throw new Error("Cannot calculate correlation - perfect horizontal or vertical line");
            }
            
            const correlation = numerator / denominator;
            
            // Correlation ranges from -1 to 1
            if (correlation < -1 || correlation > 1) {
                throw new Error("Correlation calculation error - invalid result");
            }
            
            this.currentValue = this.formatNumber(correlation);
        } catch (e) {
            console.error('Correlation calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    forecastY(x) {
        try {
            if (!this.stats.regression) {
                this.calculateLinearRegression();
            }
            
            const { slope, intercept } = this.stats.regression;
            const forecastedY = slope * x + intercept;
            
            return forecastedY;
        } catch (e) {
            console.error('Forecast calculation error:', e);
            return NaN;
        }
    }
    
    forecastX(y) {
        try {
            if (!this.stats.regression) {
                this.calculateLinearRegression();
            }
            
            const { slope, intercept } = this.stats.regression;
            
            if (slope === 0) {
                throw new Error("Cannot forecast X - horizontal line");
            }
            
            const forecastedX = (y - intercept) / slope;
            
            return forecastedX;
        } catch (e) {
            console.error('Forecast calculation error:', e);
            return NaN;
        }
    }
    
    clearStatistics() {
        this.stats = {
            n: 0,
            sumX: 0,
            sumY: 0,
            sumXY: 0,
            sumX2: 0,
            sumY2: 0,
            dataX: [],
            dataY: []
        };
        
        this.currentValue = '0';
        this.newNumber = true;
    }

    // Helper methods for statistics button mapping
    calculateMeanX() {
        try {
            if (this.stats.n === 0) {
                throw new Error("No data points available");
            }
            
            const meanX = this.stats.sumX / this.stats.n;
            this.currentValue = this.formatNumber(meanX);
            this.newNumber = true;
        } catch (e) {
            console.error('Mean X calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateMeanY() {
        try {
            if (this.stats.n === 0) {
                throw new Error("No data points available");
            }
            
            const meanY = this.stats.sumY / this.stats.n;
            this.currentValue = this.formatNumber(meanY);
            this.newNumber = true;
        } catch (e) {
            console.error('Mean Y calculation error:', e);
            this.currentValue = 'Error';
        }
    }
    
    forecastYfromX() {
        try {
            const x = parseFloat(this.currentValue);
            const y = this.forecastY(x);
            
            this.currentValue = this.formatNumber(y);
            this.newNumber = true;
        } catch (e) {
            console.error('Forecast Y error:', e);
            this.currentValue = 'Error';
        }
    }
    
    forecastXfromY() {
        try {
            const y = parseFloat(this.currentValue);
            const x = this.forecastX(y);
            
            this.currentValue = this.formatNumber(x);
            this.newNumber = true;
        } catch (e) {
            console.error('Forecast X error:', e);
            this.currentValue = 'Error';
        }
    }
    
    calculateAmortizationSchedule() {
        try {
            // Get the period from current value
            const period = parseInt(this.currentValue);
            
            if (isNaN(period) || period < 1 || period > this.n) {
                throw new Error("Period must be between 1 and n");
            }
            
            const result = this.calculateAmortization(period);
            
            if (result) {
                // Display the principal portion of the payment for the given period
                this.currentValue = this.formatNumber(result.principal);
                this.newNumber = true;
            } else {
                throw new Error("Amortization calculation failed");
            }
        } catch (e) {
            console.error('Amortization schedule error:', e);
            this.currentValue = 'Error';
        }
    }

    toggleSign() {
        if (this.currentValue !== '0') {
            if (this.currentValue.startsWith('-')) {
                this.currentValue = this.currentValue.substring(1);
            } else {
                this.currentValue = '-' + this.currentValue;
            }
        }
    }
    
    recall() {
        this.currentValue = this.formatNumber(this.memory);
        this.newNumber = true;
    }
    
    storeInMemory() {
        this.memory = parseFloat(this.currentValue);
        this.newNumber = true;
    }
    
    showHelp() {
        // This would normally show a help dialog
        alert("Financial Calculator Help\n\n" +
              "Orange button: Toggle secondary functions\n" +
              "Blue button: Toggle tertiary functions\n" +
              "N, I/YR, PV, PMT, FV: Financial registers\n" +
              "Orange + 7,8,9: Statistical mean, std dev\n" +
              "Orange + 4,5,6: Variance, regression, correlation\n" +
              "Orange + MU,PRC,CST,MAR: Markup/margin calculations\n" +
              "Orange + K,%,CFj: Depreciation calculations\n" +
              "Blue + SUM,+/-: Bond calculations");
    }
}

// Create calculator instance
const calculator = new Calculator();
export default calculator; 