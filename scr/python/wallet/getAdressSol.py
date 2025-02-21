from solders.keypair import Keypair
from mnemonic import Mnemonic

mnemo = Mnemonic("english")
seed = mnemo.to_seed("syrup dawn join nurse motor shiver insane tuna link tattoo reason brown")

for i in range(1):
    path = f"m/44'/501'/{i}'/0'"
    keypair = Keypair.from_seed_and_derivation_path(seed, path)
    public_key = keypair.pubkey()
    print(f"Wallet {i+1}:")
    print(f"Public Key: {public_key}")
    print(f"Private Key: {keypair}")
