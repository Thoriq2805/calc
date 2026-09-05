let runningTotal = null;
let buffer = "0";
let previousOperator = null;

// Untuk tombol "=" berulang
let lastOperator = null;
let lastNumber = null;

// Menyimpan tulisan operasi kecil di atas
let previousOperation = "";

const screen = document.querySelector('.screen');
const previousOperationDisplay = document.querySelector('.previous-operation');
const currentNumberDisplay = document.querySelector('.current-number');


// ========================================
// FORMAT ANGKA
// ========================================

function formatNumber(number) {

    return Number(number).toLocaleString('id-ID', {
        maximumFractionDigits: 10
    });

}


// ========================================
// UPDATE SCREEN
// ========================================

function updateScreen() {

    previousOperationDisplay.innerText = previousOperation;

    currentNumberDisplay.innerText = formatNumber(buffer);

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
// HANDLE SYMBOL
// ========================================

function handleSymbol(symbol) {

    switch (symbol) {


        // ==================================
        // CLEAR
        // ==================================

        case 'C':

            buffer = '0';
            runningTotal = null;
            previousOperator = null;

            lastOperator = null;
            lastNumber = null;

            previousOperation = '';

            break;


        // ==================================
        // EQUAL
        // ==================================

        case '=':

            // Operasi pertama
            if (
                previousOperator !== null &&
                buffer !== '0'
            ) {

                lastNumber = Number(buffer);
                lastOperator = previousOperator;

                FlushOperation(lastNumber);

                previousOperation =
                    formatNumber(runningTotal - getReverseResult(
                        runningTotal,
                        lastNumber,
                        lastOperator
                    )) +
                    ' ' +
                    lastOperator +
                    ' ' +
                    formatNumber(lastNumber) +
                    ' =';

                buffer = runningTotal.toString();

                previousOperator = null;

            }


            // "=" ditekan lagi
            else if (
                lastOperator !== null &&
                lastNumber !== null
            ) {

                const oldTotal = runningTotal;

                previousOperator = lastOperator;

                FlushOperation(lastNumber);

                previousOperation =
                    formatNumber(oldTotal) +
                    ' ' +
                    lastOperator +
                    ' ' +
                    formatNumber(lastNumber) +
                    ' =';

                buffer = runningTotal.toString();

                previousOperator = null;
            }

            break;


        // ==================================
        // BACKSPACE
        // ==================================

        case '←':

            if (buffer.length === 1) {

                buffer = '0';

            } else {

                buffer = buffer.substring(
                    0,
                    buffer.length - 1
                );

            }

            break;


        // ==================================
        // OPERATOR
        // ==================================

        case '+':
        case '−':
        case '×':
        case '÷':

            handleMath(symbol);

            break;
    }

}


// ========================================
// HANDLE MATH
// ========================================

function handleMath(symbol) {

    // Kalau sedang memasukkan angka
    if (buffer !== '0') {

        const intBuffer = Number(buffer);


        // Angka pertama
        if (runningTotal === null) {

            runningTotal = intBuffer;

        }


        // Melanjutkan perhitungan
        else if (previousOperator !== null) {

            FlushOperation(intBuffer);

        }

    }


    // Kalau operator sudah dipilih sebelumnya
    // lalu memilih operator baru
    if (runningTotal !== null) {

        previousOperator = symbol;

        previousOperation =
            formatNumber(runningTotal) +
            ' ' +
            symbol;

    }


    buffer = '0';

    // Reset "=" sebelumnya
    lastOperator = null;
    lastNumber = null;

}


// ========================================
// PERHITUNGAN
// ========================================

function FlushOperation(intBuffer) {

    if (previousOperator === '+') {

        runningTotal += intBuffer;

    }

    else if (previousOperator === '−') {

        runningTotal -= intBuffer;

    }

    else if (previousOperator === '×') {

        runningTotal *= intBuffer;

    }

    else if (previousOperator === '÷') {

        if (intBuffer === 0) {

            buffer = 'Error';
            runningTotal = null;
            previousOperator = null;

            return;

        }

        runningTotal /= intBuffer;

    }

}


// ========================================
// MEMBANTU MENAMPILKAN OPERASI
// ========================================

function getReverseResult(
    result,
    number,
    operator
) {

    if (operator === '+') {

        return number;

    }

    if (operator === '−') {

        return -number;

    }

    if (operator === '×') {

        return result / number;

    }

    if (operator === '÷') {

        return result * number;

    }

    return 0;

}


// ========================================
// HANDLE NUMBER
// ========================================

function handleNumber(numberString) {

    // Maksimal 12 digit
    if (
        buffer !== 'Error' &&
        buffer.replace('-', '').length >= 12
    ) {

        return;

    }


    if (buffer === "0" || buffer === "Error") {

        buffer = numberString;

    }

    else {

        buffer += numberString;

    }

}


// ========================================
// INITIALIZE
// ========================================

function init() {


    // ==================================
    // TOMBOL KALKULATOR
    // ==================================

    document
        .querySelector('.calc-buttons')
        .addEventListener('click', function(event) {

            buttonClick(event.target.innerText);

        });


    // ==================================
    // KEYBOARD PC
    // ==================================

    document.addEventListener('keydown', function(event) {

        const key = event.key;


        // ANGKA
        if (!isNaN(key)) {

            buttonClick(key);

        }


        // TAMBAH
        else if (key === '+') {

            buttonClick('+');

        }


        // KURANG
        else if (key === '-') {

            buttonClick('−');

        }


        // KALI
        else if (key === '*') {

            buttonClick('×');

        }


        // BAGI
        else if (key === '/') {

            event.preventDefault();

            buttonClick('÷');

        }


        // ENTER / =
        else if (
            key === 'Enter' ||
            key === '='
        ) {

            buttonClick('=');

        }


        // BACKSPACE
        else if (key === 'Backspace') {

            buttonClick('←');

        }


        // ESC = C
        else if (key === 'Escape') {

            buttonClick('C');

        }

    });

}


// ========================================
// JALANKAN KALKULATOR
// ========================================

init();

updateScreen();
