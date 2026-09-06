// ========================================
// VARIABLES
// ========================================

let runningTotal = null;

let buffer = "0";

let previousOperator = null;


// Untuk fitur "=" berulang
let lastOperator = null;

let lastNumber = null;


// Menentukan apakah kalkulator sedang
// menunggu angka baru
let waitingForOperand = false;


// ========================================
// ELEMENT
// ========================================

const currentNumberDisplay =
    document.querySelector('.current-number');

const previousOperationDisplay =
    document.querySelector('.previous-operation');


// ========================================
// FORMAT ANGKA
// ========================================

function formatNumber(value) {

    if (value === 'Error') {
        return 'Error';
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 'Error';
    }

    return number.toLocaleString('id-ID', {
        maximumFractionDigits: 10
    });
}


// ========================================
// UPDATE SCREEN
// ========================================

function updateScreen() {

    currentNumberDisplay.innerText =
        formatNumber(buffer);

    previousOperationDisplay.innerText =
        previousOperationDisplay.innerText;
}


// ========================================
// TAMPILKAN OPERASI
// ========================================

function showOperation(text) {

    previousOperationDisplay.innerText = text;

}


// ========================================
// BUTTON CLICK
// ========================================

function buttonClick(value) {

    if (isNaN(value)) {

        handleSymbol(value);

    } else {

        handleNumber(value);

    }

    updateScreen();

}


// ========================================
// HANDLE NUMBER
// ========================================

function handleNumber(numberString) {

    // Kalau sebelumnya hasil "="
    // lalu user mengetik angka baru
    if (waitingForOperand && previousOperator === null) {

        buffer = numberString;

        runningTotal = null;

        lastOperator = null;

        lastNumber = null;

        waitingForOperand = false;

        showOperation('');

        return;
    }


    // Maksimal 12 digit
    if (buffer.replace('-', '').length >= 12) {

        return;

    }


    // Kalau sedang menunggu angka
    // setelah operator
    if (waitingForOperand) {

        buffer = numberString;

        waitingForOperand = false;

        return;
    }


    // Angka pertama
    if (buffer === '0') {

        buffer = numberString;

    } else {

        buffer += numberString;

    }


    // Kalau user mengetik angka baru,
    // operasi "=" sebelumnya dibatalkan
    lastOperator = null;

    lastNumber = null;
}


// ========================================
// HANDLE SYMBOL
// ========================================

function handleSymbol(symbol) {

    // ==================================
    // CLEAR
    // ==================================

    if (symbol === 'C') {

        buffer = '0';

        runningTotal = null;

        previousOperator = null;

        lastOperator = null;

        lastNumber = null;

        waitingForOperand = false;

        showOperation('');

        return;
    }


    // ==================================
    // BACKSPACE
    // ==================================

    if (symbol === '←') {

        if (waitingForOperand) {

            return;

        }


        if (buffer.length <= 1) {

            buffer = '0';

        } else {

            buffer = buffer.substring(
                0,
                buffer.length - 1
            );

        }

        return;
    }


    // ==================================
    // EQUAL
    // ==================================

    if (symbol === '=') {

        handleEquals();

        return;
    }


    // ==================================
    // OPERATOR
    // ==================================

    if (
        symbol === '+' ||
        symbol === '−' ||
        symbol === '×' ||
        symbol === '÷'
    ) {

        handleOperator(symbol);

    }

}


// ========================================
// HANDLE OPERATOR
// ========================================

function handleOperator(symbol) {

    const currentValue = Number(buffer);


    // Kalau belum ada angka utama
    if (runningTotal === null) {

        runningTotal = currentValue;

    }


    // Kalau sudah ada operasi sebelumnya
    else if (
        previousOperator !== null &&
        !waitingForOperand
    ) {

        runningTotal =
            calculate(
                runningTotal,
                currentValue,
                previousOperator
            );

    }


    previousOperator = symbol;

    waitingForOperand = true;


    // Operator baru membatalkan
    // "=" sebelumnya
    lastOperator = null;

    lastNumber = null;


    // Tampilkan angka kecil + operator
    showOperation(
        formatNumber(runningTotal) +
        ' ' +
        symbol
    );


    buffer = '0';
}


// ========================================
// HANDLE EQUAL
// ========================================

function handleEquals() {

    // ==================================
    // Operasi pertama
    // ==================================

    if (
        previousOperator !== null &&
        runningTotal !== null
    ) {

        let operand;


        // Kalau angka sudah dimasukkan
        if (!waitingForOperand) {

            operand = Number(buffer);

            lastNumber = operand;

        }


        // Kalau langsung tekan "="
        else {

            operand = lastNumber;

        }


        // Kalau belum ada angka terakhir
        if (operand === null) {

            return;

        }


        const oldTotal = runningTotal;

        const operator = previousOperator;


        runningTotal =
            calculate(
                runningTotal,
                operand,
                operator
            );


        // Simpan untuk "=" berikutnya
        lastOperator = operator;

        lastNumber = operand;


        // Tampilkan operasi kecil
        showOperation(
            formatNumber(oldTotal) +
            ' ' +
            operator +
            ' ' +
            formatNumber(operand) +
            ' ='
        );


        buffer = runningTotal.toString();

        previousOperator = null;

        waitingForOperand = true;

        return;
    }


    // ==================================
    // "=" berulang
    // ==================================

    if (
        lastOperator !== null &&
        lastNumber !== null &&
        runningTotal !== null
    ) {

        const oldTotal = runningTotal;


        runningTotal =
            calculate(
                runningTotal,
                lastNumber,
                lastOperator
            );


        showOperation(
            formatNumber(oldTotal) +
            ' ' +
            lastOperator +
            ' ' +
            formatNumber(lastNumber) +
            ' ='
        );


        buffer = runningTotal.toString();

        waitingForOperand = true;
    }

}


// ========================================
// CALCULATE
// ========================================

function calculate(
    firstNumber,
    secondNumber,
    operator
) {

    switch (operator) {

        case '+':

            return firstNumber + secondNumber;


        case '−':

            return firstNumber - secondNumber;


        case '×':

            return firstNumber * secondNumber;


        case '÷':

            if (secondNumber === 0) {

                return NaN;

            }

            return firstNumber / secondNumber;


        default:

            return secondNumber;
    }

}


// ========================================
// KEYBOARD PC
// ========================================

function handleKeyboard(event) {

    const key = event.key;


    // ==================================
    // ANGKA
    // ==================================

    if (!isNaN(key)) {

        buttonClick(key);

        return;
    }


    // ==================================
    // TAMBAH
    // ==================================

    if (key === '+') {

        buttonClick('+');

        return;
    }


    // ==================================
    // KURANG
    // ==================================

    if (key === '-') {

        buttonClick('−');

        return;
    }


    // ==================================
    // KALI
    // ==================================

    if (key === '*') {

        buttonClick('×');

        return;
    }


    // ==================================
    // BAGI
    // ==================================

    if (key === '/') {

        event.preventDefault();

        buttonClick('÷');

        return;
    }


    // ==================================
    // ENTER
    // ==================================

    if (key === 'Enter') {

        buttonClick('=');

        return;
    }


    // ==================================
    // =
    // ==================================

    if (key === '=') {

        buttonClick('=');

        return;
    }


    // ==================================
    // BACKSPACE
    // ==================================

    if (key === 'Backspace') {

        buttonClick('←');

        return;
    }


    // ==================================
    // ESC
    // ==================================

    if (key === 'Escape') {

        buttonClick('C');

        return;
    }

}


// ========================================
// INITIALIZE
// ========================================

function init() {


    // Tombol kalkulator
    document
        .querySelector('.calc-buttons')
        .addEventListener(
            'click',
            function (event) {

                if (
                    event.target.tagName === 'BUTTON'
                ) {

                    buttonClick(
                        event.target.innerText
                    );

                }

            }
        );


    // Keyboard PC
    document.addEventListener(
        'keydown',
        handleKeyboard
    );


    // Tampilan awal
    updateScreen();

}


// ========================================
// START
// ========================================

init();
