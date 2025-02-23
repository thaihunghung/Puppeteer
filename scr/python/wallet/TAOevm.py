from eth_account import Account
from loguru import logger
import os

logger.info('Generating new private keys and addresses...')

Account.enable_unaudited_hdwallet_features()

NUM_WALLETS = 100000  

private_keys_file = 'private_keys2.txt'
address_file = 'address2.txt'

if os.path.exists(private_keys_file):
    os.remove(private_keys_file)
if os.path.exists(address_file):
    os.remove(address_file)

with open(private_keys_file, 'w', encoding='utf-8') as pk_file, open(address_file, 'w', encoding='utf-8') as addr_file:
    for _ in range(NUM_WALLETS):
        account, mnemonic = Account.create_with_mnemonic()
        
        private_key = account.key.hex()
        address = account.address
        
        pk_file.write(f'{private_key}\n')
        addr_file.write(f'{address}\n')

        logger.info(f'Generated address: {address}')

logger.success('Successfully created new wallets and saved them to files.')
