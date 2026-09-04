let runningTotal = 0;
let buffer = "0";
let previousOperator = null;

// Untuk menyimpan operasi terakhir
let lastOperator = null;
let lastNumber = null;

const screen = document.querySelector('.screen');


// ==============================
// BUTTON CLICK
// ==============================

function buttonClick(value) {

    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }

    // Menampilkan angka dengan titik ribuan
    screen.innerText = Number(buffer).toLocaleString('id-ID');
}


// ==============================
// HANDLE SYMBOL
// ==============================

function handleSymbol(symbol) {

    switch (symbol) {

        // CLEAR
        case 'C':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            lastOperator = null;
            lastNumber = null;
            break;


        // EQUAL
        case '=':

            // Operasi pertama
            if (previousOperator !== null) {

                lastNumber = parseInt(buffer);
                lastOperator = previousOperator;

                FlushOperation(lastNumber);

                buffer = runningTotal.toString();

                previousOperator = null;
            }

            // Tekan "=" lagi
            else if (lastOperator !== null && lastNumber !== null) {

                previousOperator = lastOperator;

                FlushOperation(lastNumber);

                buffer = runningTotal.toString();

                previousOperator = null;
            }

            break;


        // BACKSPACE
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


        // OPERATOR
        case '+':
        case '−':
        case '×':
        case '÷':

            handleMath(symbol);

            break;
    }
}


// ==============================
// HANDLE MATH
// ==============================

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

    // Melanjutkan operasi
    else if (previousOperator !== null) {

        FlushOperation(intBuffer);

    }

    else {

        runningTotal = intBuffer;

    }


    // Simpan operator
    previousOperator = symbol;

    // Kosongkan buffer
    buffer = '0';


    // Reset operasi "=" sebelumnya
    lastOperator = null;
    lastNumber = null;
}


// ==============================
// FLUSH OPERATION
// ==============================

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


// ==============================
// HANDLE NUMBER
// ==============================

function handleNumber(numberString) {

    if (buffer === "0") {

        buffer = numberString;

    } else {

        buffer += numberString;

    }
}


// ==============================
// INITIALIZE
// ==============================

function init() {

    // Tombol kalkulator
    document
        .querySelector('.calc-buttons')
        .addEventListener('click', function(event) {

            buttonClick(event.target.innerText);

        });


    // ==============================
    // KEYBOARD PC
    // ==============================

    document.addEventListener('keydown', function(event) {

        const key = event.key;


        // ANGKA 0 - 9
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


        // ESC = CLEAR
        else if (key === 'Escape') {

            buttonClick('C');

        }

    });

}


// Jalankan kalkulator
init();
