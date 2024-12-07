import midtransClient from 'midtrans-client';
import * as http from 'node:http';

export class MidtransService {
  static async generateSnapUrl(
    orderId: string,
    amount: number,
  ): Promise<string> {
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: Bun.env.SERVERKEY as string,
      clientKey: Bun.env.CLIENTKEY as string,
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const tx = await snap.createTransaction(parameter);
    return tx.redirect_url;
  }

  // static async verifyPayment(orderid: string): Promise<boolean> {
  //   let snap = new midtransClient.Snap({
  //     isProduction: false,
  //     serverKey: Bun.env.SERVERKEY as string,
  //     clientKey: Bun.env.CLIENTKEY as string,
  //   });
  //
  //   try {
  //     const statusResponse = await snap.t(orderid);
  //
  //     const orderId = statusResponse.order_id;
  //     const transactionStatus = statusResponse.transaction_status;
  //     const fraudStatus = statusResponse.fraud_status;
  //
  //     console.log(
  //       `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`,
  //     );
  //
  //     // Logika penanganan status transaksi
  //     if (transactionStatus === 'capture') {
  //       if (fraudStatus === 'challenge') {
  //         return false; // Transaksi dalam status 'challenge'
  //       } else if (fraudStatus === 'accept') {
  //         return true; // Transaksi berhasil
  //       }
  //     } else if (transactionStatus === 'settlement') {
  //       return true; // Transaksi berhasil
  //     } else if (transactionStatus === 'deny') {
  //       return false; // Transaksi ditolak
  //     } else if (
  //       transactionStatus === 'cancel' ||
  //       transactionStatus === 'expire'
  //     ) {
  //       return false; // Transaksi dibatalkan atau kedaluwarsa
  //     } else if (transactionStatus === 'pending') {
  //       return false; // Transaksi dalam status 'pending'
  //     }
  //
  //     // Jika tidak ada kondisi yang terpenuhi, kembalikan false secara default
  //     return false;
  //   } catch (error) {
  //     console.error('Error verifying payment:', error);
  //     throw new Error('Failed to verify payment');
  //   }
  // }
}
