import json
import re
from eth_account import Account
from loguru import logger

# Kích hoạt HD Wallet (tính năng chưa kiểm tra)
Account.enable_unaudited_hdwallet_features()

# Đường dẫn file JSON đầu vào và đầu ra
input_file = r"E:\puppeteer-auto-meta-proxy\scr\data.json"  # Đảm bảo đường dẫn đúng
output_file = r"E:\puppeteer-auto-meta-proxy\scr\data.json"

# Chọn khoảng profile để xử lý
profile_start = 1  # Thay đổi nếu cần
profile_end = 66   # Thay đổi nếu cần

logger.info(f'Loading mnemonics from {input_file}...')

# Đọc file JSON đầu vào
with open(input_file, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Kiểm tra định dạng dữ liệu đầu vào
if not isinstance(data, list):
    logger.error("Input JSON must be a list of profiles.")
    exit(1)

# Cập nhật thông tin EVM cho các profile trong khoảng đã chọn
for profile in data:
    try:
        profile_name = profile.get("profile", "")
        
        # Lấy số profile từ tên (loại bỏ ký tự không mong muốn)
        match = re.search(r"(\d+)$", profile_name)
        if not match:
            logger.warning(f"Skipping invalid profile name: {profile_name}")
            continue
        
        profile_number = int(match.group(1))  # Lấy số từ chuỗi
        
        if profile_start <= profile_number <= profile_end:
            mnemonic = profile.get("mnemonic", "").strip()
            if not mnemonic:
                logger.warning(f"Skipping profile {profile_name} due to missing mnemonic.")
                continue

            account = Account.from_mnemonic(mnemonic)

            # Cập nhật trường `EVM`
            profile["EVM"] = {
                "private_key": account.key.hex(),
                "address": account.address
            }

    except Exception as e:
        logger.error(f"Error processing {profile_name}: {e}")

# Ghi dữ liệu ra tệp JSON đầu ra
with open(output_file, 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)

logger.success(f'Successfully updated EVM data for profiles {profile_start} to {profile_end} and saved to {output_file}')
