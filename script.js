// ===== Mengambil elemen dari HTML =====
const layarHasil = document.getElementById("hasil");
const layarRiwayat = document.getElementById("riwayat");

// ===== Variabel penyimpan keadaan kalkulator =====
let angkaSekarang = "0";     // angka yang sedang diketik (bentuk teks)
let angkaSebelumnya = null;  // angka pertama sebelum memilih operator
let operatorDipilih = null;  // + - * /
let layarPerluReset = false; // true jika angka berikutnya harus mulai baru

// ===== Memperbarui tampilan layar =====
function perbaruiLayar() {
  layarHasil.textContent = angkaSekarang;
}

// ===== Saat tombol angka (0-9) ditekan =====
function tambahAngka(angka) {
  // Jika baru selesai menghitung / memilih operator, mulai angka baru
  if (layarPerluReset) {
    angkaSekarang = angka;
    layarPerluReset = false;
  } else if (angkaSekarang === "0") {
    angkaSekarang = angka; // ganti "0" awal, bukan "07"
  } else {
    angkaSekarang += angka; // tambahkan di belakang
  }
  perbaruiLayar();
}

// ===== Saat tombol titik (.) ditekan =====
function tambahTitik() {
  if (layarPerluReset) {
    angkaSekarang = "0.";
    layarPerluReset = false;
  } else if (!angkaSekarang.includes(".")) {
    angkaSekarang += "."; // hanya boleh satu titik
  }
  perbaruiLayar();
}

// ===== Saat tombol operator (+ - × ÷) ditekan =====
function pilihOperator(operator) {
  // Jika sudah ada operator sebelumnya, hitung dulu (misal: 2 + 3 + ...)
  if (operatorDipilih !== null && !layarPerluReset) {
    hitung();
  }

  angkaSebelumnya = angkaSekarang;
  operatorDipilih = operator;
  layarPerluReset = true;

  layarRiwayat.textContent = angkaSebelumnya + " " + simbol(operator);
}

// ===== Saat tombol sama dengan (=) ditekan =====
function hitung() {
  // Jika belum ada operator, tidak ada yang dihitung
  if (operatorDipilih === null || angkaSebelumnya === null) return;

  const a = parseFloat(angkaSebelumnya);
  const b = parseFloat(angkaSekarang);
  let hasil;

  if (operatorDipilih === "+") {
    hasil = a + b;
  } else if (operatorDipilih === "-") {
    hasil = a - b;
  } else if (operatorDipilih === "*") {
    hasil = a * b;
  } else if (operatorDipilih === "/") {
    if (b === 0) {
      // Pembagian dengan nol tidak diperbolehkan
      layarRiwayat.textContent = "";
      angkaSekarang = "Error";
      perbaruiLayar();
      angkaSebelumnya = null;
      operatorDipilih = null;
      layarPerluReset = true;
      return;
    }
    hasil = a / b;
  }

  // Bulatkan agar 0.1 + 0.2 tidak jadi 0.30000000000000004
  hasil = Math.round(hasil * 1000000000) / 1000000000;

  layarRiwayat.textContent = angkaSebelumnya + " " + simbol(operatorDipilih) + " " + angkaSekarang + " =";
  angkaSekarang = String(hasil);
  angkaSebelumnya = null;
  operatorDipilih = null;
  layarPerluReset = true;
  perbaruiLayar();
}

// ===== Tombol C: hapus semuanya =====
function hapusSemua() {
  angkaSekarang = "0";
  angkaSebelumnya = null;
  operatorDipilih = null;
  layarPerluReset = false;
  layarRiwayat.textContent = "";
  perbaruiLayar();
}

// ===== Tombol ⌫: hapus satu digit terakhir =====
function hapusSatu() {
  if (layarPerluReset || angkaSekarang === "Error") {
    hapusSemua();
    return;
  }
  angkaSekarang = angkaSekarang.slice(0, -1);
  if (angkaSekarang === "" || angkaSekarang === "-") {
    angkaSekarang = "0";
  }
  perbaruiLayar();
}

// ===== Tombol %: jadikan persen (bagi 100) =====
function persen() {
  if (angkaSekarang === "Error") return;
  angkaSekarang = String(parseFloat(angkaSekarang) / 100);
  perbaruiLayar();
}

// ===== Mengubah operator menjadi simbol yang rapi =====
function simbol(operator) {
  if (operator === "*") return "×";
  if (operator === "/") return "÷";
  if (operator === "-") return "−";
  return operator; // untuk "+"
}

// ===== Bonus: dukungan keyboard =====
document.addEventListener("keydown", function (event) {
  const tombol = event.key;

  if (tombol >= "0" && tombol <= "9") tambahAngka(tombol);
  else if (tombol === ".") tambahTitik();
  else if (tombol === "+" || tombol === "-" || tombol === "*" || tombol === "/") pilihOperator(tombol);
  else if (tombol === "Enter" || tombol === "=") hitung();
  else if (tombol === "Backspace") hapusSatu();
  else if (tombol === "Escape") hapusSemua();
});