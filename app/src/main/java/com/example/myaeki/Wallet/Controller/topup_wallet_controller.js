const topup_repo = require('../Repositories/topup_wallet_repo');

// TOP UP WALLET
exports.topUpWallet = (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount || amount <= 0) {
    return res.status(400).json({ message: 'User ID dan jumlah top-up harus valid.' });
  }

  topup_repo.getWalletByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal mengambil data customer.', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer tidak ditemukan.' });
    }

    const currentBalance = results[0].wallet || 0;
    const newBalance = parseFloat(currentBalance) + parseFloat(amount);

    topup_repo.updateWalletByUserId(user_id, newBalance, (err2, result2) => {
      if (err2) {
        return res.status(500).json({ message: 'Gagal melakukan top-up.', error: err2 });
      }

      res.status(200).json({
        message: 'Top-up berhasil.',
        topup_sebanyak: amount,
        saldo_terbaru: newBalance
      });
    });
  });
};

// Ambil saldo wallet user berdasarkan ID
exports.getWalletByUserId = (req, res) => {
  const user_id = req.params.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID tidak valid.' });
  }

  topup_repo.getWalletByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal mengambil saldo.', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    const wallet = results[0].wallet || 0;
    res.status(200).json({ wallet });
  });
};
