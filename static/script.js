document.getElementById('binomialForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah pengiriman form secara default

    // Mengambil nilai input dari form
    const n = document.getElementById('n').value; // Jumlah total tiket
    const p = document.getElementById('p').value; // Probabilitas penjualan per tiket
    const k = document.getElementById('k').value; // Jumlah tiket yang ingin diprediksi terjual

    // Mengirim data ke server
    const response = await fetch('/calculate', {
        method: 'POST', // Metode HTTP POST
        headers: {
            'Content-Type': 'application/json', // Jenis konten JSON
        },
        body: JSON.stringify({ n, p, k }), // Mengonversi data menjadi string JSON
    });

    const data = await response.json(); // Mendapatkan respons dari server dan mengonversi menjadi objek JavaScript

    // Menampilkan hasil dan langkah-langkah dalam satu tampilan
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Probabilitas Binomial</h2>
        <p>Probabilitas Binomial untuk: <span class="formula">n</span> = ${n}, <span class="formula">p</span> = ${p}, <span class="formula">k</span> = ${k}</p>
        <p>\\( P(X=${k}) = ${data.probability} \\)</p>
        <p>\\( P(X \\leq ${k}) = ${data.cumulative_probability} \\)</p>
        
        <h3>Solusi Langkah demi Langkah:</h3>
        <h4>Langkah 1: Memahami Fungsi Massa Probabilitas Binomial (PMF)</h4>
        <p>Probabilitas memiliki tepat <span class="formula">k</span> keberhasilan dalam <span class="formula">n</span> percobaan dihitung menggunakan rumus PMF Binomial:</p>
        <p>\\( P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k} \\)</p>

        <h4>Langkah 2: Identifikasi Nilai yang Diberikan</h4>
        <p>Dalam masalah ini, nilai yang diberikan adalah:</p>
        <ul>
            <li>Jumlah Percobaan (<span class="formula">n</span>): ${n}</li>
            <li>Probabilitas Keberhasilan (<span class="formula">p</span>): ${p}</li>
            <li>Jumlah Keberhasilan (<span class="formula">k</span>): ${k}</li>
        </ul>

        <h4>Langkah 3: Substitusikan Nilai ke dalam Rumus</h4>
        <p>\\( P(X=${k}) = \\binom{${n}}{${k}} (${p})^${k} (1-${p})^{${n}-${k}} \\)</p>

        <h4>Langkah 4: Hitung Koefisien Binomial</h4>
        <p>\\( \\binom{10}{5} = 252 \\)</p>

        <h4>Langkah 5: Hitung Probabilitas</h4>
        <p>\\( P(X=${k}) = 252 \\times (${p})^${k} \\times (1-${p})^{${n}-${k}} \\)</p>
        <p>\\( P(X=${k}) = ${data.probability} \\)</p>

        <h4>Langkah 6: Memahami Fungsi Distribusi Kumulatif Binomial (CDF)</h4>
        <p>Probabilitas kumulatif memiliki hingga <span class="formula">k</span> keberhasilan dalam <span class="formula">n</span> percobaan dihitung menggunakan rumus CDF Binomial:</p>
        <p>\\( P(X \\leq k) = \\displaystyle \\sum\\limits_{i=0}^{k} \\binom{n}{i} p^i (1-p)^{n-i} \\)</p>

        <h4>Langkah 7: Kembangkan Penjumlahan</h4>
        <p>Kita perlu menghitung jumlah probabilitas dari <span class="formula">X</span> = 0 hingga <span class="formula">X</span> = ${k}:</p>
        <p>\\( P(X \\leq ${k}) = \\displaystyle \\sum\\limits_{i=0}^{${k}} \\binom{${n}}{i} (${p})^i (1-${p})^{${n}-i} \\)</p>

        <h4>Langkah 8: Hitung Setiap Term dalam Penjumlahan</h4>
        <p>Hitung setiap term secara individual dan kemudian jumlahkan:</p>
    `;

    // Langkah 8: Hitung Setiap Term dalam Penjumlahan
    let terms = [];
    for (let i = 0; i <= k; i++) {
        let term = (factorial(n) / (factorial(i) * factorial(n - i))) * Math.pow(p, i) * Math.pow(1 - p, n - i);
        terms.push(`\\( \\binom{${n}}{${i}} (${p})^${i} (1-${p})^{${n}-${i}} = ${term} \\)`);
    }

    // Menampilkan setiap term dalam format yang diminta
    terms.forEach(term => {
        resultDiv.innerHTML += `<p>${term}</p>`;
    });

    resultDiv.innerHTML += `
        <h4>Langkah 9: Jumlahkan Semua Term untuk Mendapatkan Probabilitas Kumulatif</h4>
        <p>\\( P(X \\leq ${k}) = ${data.cumulative_probability} \\)</p>
    `;
    
    MathJax.typeset(); // Render LaTeX menggunakan MathJax
    resultDiv.style.display = 'block'; // Tampilkan elemen hasil
});

// Fungsi untuk mengisi contoh data tanpa memuat ulang halaman
function setExample(exampleNumber) {
    event.preventDefault(); // Mencegah default action dari anchor tag
    if (exampleNumber === 1) {
        document.getElementById('n').value = 10;
        document.getElementById('p').value = 0.5;
        document.getElementById('k').value = 5;
    } else if (exampleNumber === 2) {
        document.getElementById('n').value = 15;
        document.getElementById('p').value = 0.3;
        document.getElementById('k').value = 4;
    } else if (exampleNumber === 3) {
        document.getElementById('n').value = 20;
        document.getElementById('p').value = 0.7;
        document.getElementById('k').value = 14;
    }
}

// Fungsi untuk menghapus input dan hasil
document.getElementById('clearButton').addEventListener('click', () => {
    document.getElementById('binomialForm').reset(); // Mengosongkan semua input
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Menghapus konten hasil
    resultDiv.style.display = 'none'; // Sembunyikan elemen hasil
});

function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
}