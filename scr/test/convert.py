from eth_account import Account
from loguru import logger

logger.info('Converting mnemonic phrases into private keys and addresses...')

# Kích hoạt tính năng HD Wallet chưa được kiểm tra
Account.enable_unaudited_hdwallet_features()

# Đọc danh sách mnemonic từ tệp 12kitu.txt
with open('recovery.txt', 'r') as file:
    mnemonics = file.read().splitlines()

# Mở tệp private_keys.txt và address.txt để ghi dữ liệu
with open('private_keys.txt', 'w') as private_keys_file, open('address.txt', 'w') as address_file:
    for mnemonic in mnemonics:
        # Tạo tài khoản từ mnemonic
        account = Account.from_mnemonic(mnemonic)
        
        # Lấy private key và địa chỉ ví
        private_key = account.key.hex()
        address = account.address
        
        # Ghi private key và địa chỉ ví vào tệp tương ứng
        private_keys_file.write(f'{private_key}\n')
        address_file.write(f'{address}\n')

logger.success('Successfully converted mnemonics to private keys and addresses.')
