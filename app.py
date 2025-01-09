from flask import Flask, render_template, request, jsonify
from math import comb

app = Flask(__name__)

def binomial_probability(n, p, k):
    """Menghitung probabilitas distribusi binomial."""
    return comb(n, k) * (p ** k) * ((1 - p) ** (n - k))

def cumulative_binomial_probability(n, p, k):
    """Menghitung probabilitas kumulatif distribusi binomial."""
    cumulative_probability = sum(binomial_probability(n, p, i) for i in range(k + 1))
    return cumulative_probability

@app.route('/')
def index():
    # Fungsi untuk merender halaman utama
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    # Mendapatkan data dari permintaan POST
    data = request.get_json()
    n = int(data['n'])  # Jumlah percobaan
    p = float(data['p'])  # Probabilitas keberhasilan per percobaan
    k = int(data['k'])  # Jumlah keberhasilan yang diharapkan
    probability = binomial_probability(n, p, k)  # Menghitung probabilitas binomial
    cumulative_probability = cumulative_binomial_probability(n, p, k)  # Menghitung probabilitas kumulatif

    # Langkah-langkah solusi
    steps = [
        f"1. Total tiket yang dijual (n) = {n}",
        f"2. Probabilitas penjualan per tiket (p) = {p}",
        f"3. Jumlah tiket yang diharapkan terjual (k) = {k}",
        f"4. Menggunakan rumus binomial: P(X=k) = C(n, k) * p^k * (1-p)^(n-k)",
        f"5. Kombinasi (C(n, k)) = {comb(n, k)}",
        f"6. Probabilitas akhir: P(X=k) = {round(probability, 5)}"
    ]

    # Mengembalikan hasil sebagai JSON
    return jsonify({
        'probability': round(probability, 5),
        'cumulative_probability': round(cumulative_probability, 5),
        'steps': steps
    })

if __name__ == '__main__':
    app.run(debug=True)