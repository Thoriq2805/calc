let runningTotal = null;
let buffer = "0";
let previousOperator = null;

let lastOperator = null;
let lastNumber = null;

const screen = document.querySelector(".screen");
const previousOperation = document.querySelector(".previous-operation");
const currentNumber = document.querySelector(".current-number");


// ===============================
// FORMAT ANGKA
// ===============================

function formatNumber(value) {
    if (value === "Error") {
        return "Error";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return number.toLocaleString("id-ID", {
        maximumFractionDigits: 10
    });
}


// ===============================
// UPDATE LAYAR
// ===============================

function updateScreen() {
    currentNumber.innerText = formatNumber(buffer);
}


// ===============================
// KLIK TOMBOL
// ===============================

function buttonClick(value) {

    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }

    updateScreen();
}


// ===============================
// ANGKA
// ===============================

function handleNumber(number) {

    // Maksimal 12 digit
    if (buffer.replace("-", "").length >= 12) {
        return;
    }

    // Setelah operator
    if (previousOperator !== null && buffer === "0") {
        buffer = number;
    }

    // Setelah hasil
    else if (
        previousOperator === null &&
        lastOperator !== null &&
        lastNumber !== null
    ) {
        buffer = number;

        runningTotal = null;
        lastOperator = null;
        lastNumber = null;

        previousOperation.innerText = "";
    }

    // Angka pertama
    else if (buffer === "0") {
        buffer = number;
    }

    // Tambahkan angka
    else {
        buffer += number;
    }
}


// ===============================
// SIMBOL
// ===============================

function handleSymbol(symbol) {

    // CLEAR
    if (symbol === "C") {

        buffer = "0";
        runningTotal = null;
        previousOperator = null;

        lastOperator = null;
        lastNumber = null;

        previousOperation.innerText = "";

        return;
    }


    // BACKSPACE
    if (symbol === "←") {

        if (buffer.length <= 1) {
            buffer = "0";
        } else {
            buffer = buffer.slice(0, -1);
        }

        return;
    }


    // OPERATOR
    if (
        symbol === "+" ||
        symbol === "−" ||
        symbol === "×" ||
        symbol === "÷"
    ) {

        handleOperator(symbol);

        return;
    }


    // EQUAL
    if (symbol === "=") {

        handleEquals();

        return;
    }
}


// ===============================
// OPERATOR
// ===============================

function handleOperator(operator) {

    const number = Number(buffer);


    // Kalau belum ada total
    if (runningTotal === null) {

        runningTotal = number;

    }

    // Kalau ada operasi sebelumnya
    else if (previousOperator !== null) {

        runningTotal = calculate(
            runningTotal,
            number,
            previousOperator
        );

    }


    previousOperator = operator;

    buffer = "0";


    // Simpan operasi untuk ditampilkan
    previousOperation.innerText =
        formatNumber(runningTotal) +
        " " +
        operator;


    // Reset "="
    lastOperator = null;
    lastNumber = null;
}


// ===============================
// EQUAL
// ===============================

function handleEquals() {

    // Contoh:
    // 1 + 1 = 2

    if (
        runningTotal !== null &&
        previousOperator !== null
    ) {

        const number = Number(buffer);

        const oldTotal = runningTotal;
        const operator = previousOperator;


        runningTotal = calculate(
            runningTotal,
            number,
            operator
        );


        // Simpan untuk "=" berikutnya
        lastOperator = operator;
        lastNumber = number;


        // Tampilkan operasi kecil
        previousOperation.innerText =
            formatNumber(oldTotal) +
            " " +
            operator +
            " " +
            formatNumber(number) +
            " =";


        buffer = runningTotal.toString();

        previousOperator = null;

        return;
    }


    // ==========================
    // "=" BERULANG
    // ==========================

    if (
        runningTotal !== null &&
        lastOperator !== null &&
        lastNumber !== null
    ) {

        const oldTotal = runningTotal;


        runningTotal = calculate(
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


        buffer = runningTotal.toString();
    }
}


// ===============================
// PERHITUNGAN
// ===============================

function calculate(first, second, operator) {

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


// ===============================
// KEYBOARD PC
// ===============================

document.addEventListener("keydown", function(event) {

    const key = event.key;


    // ANGKA
    if (!isNaN(key)) {

        buttonClick(key);
    }


    // +
    else if (key === "+") {

        buttonClick("+");
    }


    // -
    else if (key === "-") {

        buttonClick("−");
    }


    // *
    else if (key === "*") {

        buttonClick("×");
    }


    // /
    else if (key === "/") {

        event.preventDefault();

        buttonClick("÷");
    }


    // ENTER
    else if (key === "Enter") {

        buttonClick("=");
    }


    // =
    else if (key === "=") {

        buttonClick("=");
    }


    // BACKSPACE
    else if (key === "Backspace") {

        buttonClick("←");
    }


    // ESC
    else if (key === "Escape") {

        buttonClick("C");
    }

});


// ===============================
// TOMBOL KALKULATOR
// ===============================

document
    .querySelector(".calc-buttons")
    .addEventListener("click", function(event) {

        if (event.target.tagName === "BUTTON") {

            buttonClick(event.target.innerText);
        }

    });


// ===============================
// AWAL
// ===============================

updateScreen();
