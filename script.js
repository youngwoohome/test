let display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function appendNumber(num) {
    // Prevent multiple decimal points
    if (num === '.' && currentInput.includes('.')) {
        return;
    }

    // Reset display after calculation
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    currentInput += num;
    updateDisplay();
}

function appendOperator(op) {
    // If no input, don't do anything
    if (currentInput === '' && previousInput === '') {
        return;
    }

    // If there's already an operator, calculate first
    if (operator !== null && currentInput !== '') {
        calculate();
    }

    previousInput = currentInput;
    operator = op;
    currentInput = '';
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === null || currentInput === '' || previousInput === '') {
        return;
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error: Division by zero';
                currentInput = '';
                previousInput = '';
                operator = null;
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;

    currentInput = result.toString();
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    display.value = '0';
}

function deleteLastChar() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

function toggleSign() {
    if (currentInput === '') {
        return;
    }

    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function updateDisplay() {
    if (currentInput === '') {
        display.value = '0';
    } else {
        // Format large numbers
        const num = parseFloat(currentInput);
        if (Math.abs(num) > 1e10) {
            display.value = num.toExponential(6);
        } else {
            display.value = currentInput;
        }
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        appendOperator(key);
    } else if (key === '%') {
        e.preventDefault();
        appendOperator('%');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        deleteLastChar();
    } else if (key === 'Escape') {
        e.preventDefault();
        clearDisplay();
    }
});

// Initialize display
updateDisplay();
