let runningTotal = null;
let buffer = "0";
let previousOperator = null;

let lastOperator = null;
let lastNumber = null;

const previousOperation =
    document.querySelector(".previous-operation");

const currentNumber =
    document.querySelector(".current-number");


// =========================
// FORMAT ANGKA
// =========================

function formatNumber(value) {

    if (!Number.isFinite(Number(value))) {
        return "Error";
    }

    return Number(value).toLocaleString("id-ID", {
        maximumFractionDigits: 10
    });
}


// =========================
// UPDATE SCREEN
// =========================

function updateScreen() {

    currentNumber.innerText =
        formatNumber(buffer);
}


// =========================
// BUTTON CLICK
// =========================

function buttonClick(value) {

    if (!isNaN(value)) {

        handleNumber(value);

    } else {

        handleSymbol(value);
    }

    updateScreen();
}


// =========================
// NUMBER
// =========================

function handleNumber(number) {

    // Maksimal 12 digit
    if (
        buffer.replace("-", "").length >= 12
    ) {
        return;
    }


    // Kalau baru selesai "="
    if (
        previousOperator === null &&
        lastOperator !== null
    ) {

        buffer = number;

        runningTotal = null;

        lastOperator = null;

        lastNumber = null;

        previousOperation.innerText = "";

        return;
    }


    // Setelah operator
    if (
        previousOperator !== null &&
        buffer === "0"
    ) {

        buffer = number;

        return;
    }


    // Angka pertama
    if (buffer === "0") {

        buffer = number;

        return;
    }


    // Tambahkan angka
    buffer += number;
}


// =========================
// SYMBOL
// =========================

function handleSymbol(symbol) {


    // =====================
    // CLEAR
    // =====================

    if (symbol === "C") {

        buffer = "0";

        runningTotal = null;

        previousOperator = null;

        lastOperator = null;

        lastNumber = null;

        previousOperation.innerText = "";

        return;
    }


    // =====================
    // BACKSPACE
    // =====================

    if (symbol === "←") {

        if (buffer.length <= 1) {

            buffer = "0";

        } else {

            buffer =
                buffer.substring(
                    0,
                    buffer.length - 1
                );
        }

        return;
    }


    // =====================
    // OPERATOR
    // =====================

    if (
        symbol === "+" ||
        symbol === "−" ||
        symbol === "×" ||
        symbol === "÷"
    ) {

        handleOperator(symbol);

        return;
    }


    // =====================
    // EQUAL
    // =====================

    if (symbol === "=") {

        handleEquals();

        return;
    }
}


// =========================
// OPERATOR
// =========================

function handleOperator(operator) {

    const number =
        Number(buffer);


    // Belum ada total
    if (runningTotal === null) {

        runningTotal = number;

    }

    // Ada operasi sebelumnya
    else if (
        previousOperator !== null
    ) {

        runningTotal =
            calculate(
                runningTotal,
                number,
                previousOperator
            );
    }


    previousOperator = operator;

    buffer = "0";


    // Tampilkan operasi kecil
    previousOperation.innerText =
        formatNumber(runningTotal) +
        " " +
        operator;


    lastOperator = null;

    lastNumber = null;
}


// =========================
// EQUAL
// =========================

function handleEquals() {


    // =====================
    // OPERASI NORMAL
    // =====================

    if (
        runningTotal !== null &&
        previousOperator !== null
    ) {

        const number =
            Number(buffer);

        const oldTotal =
            runningTotal;

        const operator =
            previousOperator;


        runningTotal =
            calculate(
                runningTotal,
                number,
                operator
            );


        // Simpan untuk "=" berikutnya
        lastOperator = operator;

        lastNumber = number;


        // Operasi kecil
        previousOperation.innerText =
            formatNumber(oldTotal) +
            " " +
            operator +
            " " +
            formatNumber(number) +
            " =";


        buffer =
            runningTotal.toString();


        previousOperator = null;

        return;
    }


    // =====================
    // EQUAL BERULANG
    // =====================

    if (
        runningTotal !== null &&
        lastOperator !== null &&
        lastNumber !== null
    ) {

        const oldTotal =
            runningTotal;


        runningTotal =
            calculate(
                runningTotal,
                lastNumber,
                lastOperator
            );


        previousOperation.innerText =
            formatNumber(oldTotal) +
            " " +
            lastOperator +
            " " +
            formatNumber(lastNumber) +
            " =";


        buffer =
            runningTotal.toString();
    }
}


// =========================
// CALCULATE
// =========================

function calculate(
    first,
    second,
    operator
) {

    switch (operator) {

        case "+":
            return first + second;

        case "−":
            return first - second;

        case "×":
            return first * second;

        case "÷":

            if (second === 0) {
                return NaN;
            }

            return first / second;

        default:
            return second;
    }
}


// =========================
// KEYBOARD PC
// =========================

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        // ANGKA 0-9
        if (
            key >= "0" &&
            key <= "9"
        ) {

            buttonClick(key);
        }


        // TAMBAH
        else if (key === "+") {

            buttonClick("+");
        }


        // KURANG
        else if (key === "-") {

            buttonClick("−");
        }


        // KALI
        else if (key === "*") {

            buttonClick("×");
        }


        // BAGI
        else if (key === "/") {

            event.preventDefault();

            buttonClick("÷");
        }


        // ENTER
        else if (
            key === "Enter" ||
            key === "="
        ) {

            buttonClick("=");
        }


        // BACKSPACE
        else if (
            key === "Backspace"
        ) {

            buttonClick("←");
        }


        // ESC
        else if (
            key === "Escape"
        ) {

            buttonClick("C");
        }

    }
);


// =========================
// BUTTON CLICK
// =========================

document
    .querySelector(".calc-buttons")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target.tagName === "BUTTON"
            ) {

                buttonClick(
                    event.target.innerText.trim()
                );
            }

        }
    );


// =========================
// START
// =========================

updateScreen();
