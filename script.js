let runningTotal = 0;
let buffer = "0";
let previousOperator = null;

// Untuk fitur "=" berulang
let lastOperator = null;
let lastNumber = null;

const screen = document.querySelector('.screen');


// =========================
// BUTTON CLICK
// =========================

function buttonClick(value) {

    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }

    // Menampilkan angka dengan titik ribuan
    screen.innerText = Number(buffer).toLocaleString('id-ID');
}


// =========================
// HANDLE SYMBOL
// =========================

function handleSymbol(symbol) {

    switch (symbol) {

        // =========================
        // CLEAR
        // =========================

        case 'C':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            lastOperator = null;
            lastNumber = null;
            break;


        // =========================
        // EQUALS
        // =========================

        case '=':

            // Operasi pertama
            if (previousOperator !== null) {

                lastNumber = parseInt(buffer);
                lastOperator = previousOperator;

                FlushOperation(lastNumber);

                buffer = runningTotal.toString();

                // Simpan operator terakhir
                previousOperator = null;

            }

            // Jika "=" ditekan lagi
            else if (lastOperator !== null && lastNumber !== null) {

                previousOperator = lastOperator;

                FlushOperation(lastNumber);

                buffer = runningTotal.toString();

                previousOperator = null;
            }

            break;


        // =========================
        // BACKSPACE
        // =========================

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


        // =========================
        // OPERATORS
        // =========================

        case '+':
        case '−':
        case '×':
        case '÷':

            handleMath(symbol);

            break;
    }
}


// =========================
// HANDLE MATH
// =========================

function handleMath(symbol) {

    if (buffer === '0') {
        return;
    }

    const intBuffer = parseInt(buffer);


    // Angka pertama
    if (
        runningTotal === 0 &&
        previousOperator === null
    ) {

        runningTotal = intBuffer;

    }

    // Melanjutkan perhitungan
    else if (previousOperator !== null) {

        FlushOperation(intBuffer);

    }

    else {

        runningTotal = intBuffer;

    }


    // Simpan operator
    previousOperator = symbol;

    // Kosongkan buffer untuk angka berikutnya
    buffer = '0';


    // Reset "=" sebelumnya
    lastOperator = null;
    lastNumber = null;
}


// =========================
// FLUSH OPERATION
// =========================

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

        runningTotal /= intBuffer;

    }
}


// =========================
// HANDLE NUMBER
// =========================

function handleNumber(numberString) {

    if (buffer === "0") {

        buffer = numberString;

    }

    else {

        buffer += numberString;

    }
}


// =========================
// INITIALIZE CALCULATOR
// =========================

function init() {

    document
        .querySelector('.calc-buttons')
        .addEventListener('click', function (event) {

            buttonClick(event.target.innerText);

        });

}

init();
