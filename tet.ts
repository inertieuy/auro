async function has() {
  const hash = await Bun.password.hash('111111', 'bcrypt');
  console.log(hash);
}

async function cek() {
  const plainText = '111111';
  const hash = '$2b$10$/8WC6KPS.XZ7b9EFUWmb..S0WE8HlS.IN5KJTbw46DEvkmcZVDVlu';

  const isValid = await Bun.password.verify(plainText, hash);
  console.log('Manual verification result:', isValid);
}
has();
cek();
