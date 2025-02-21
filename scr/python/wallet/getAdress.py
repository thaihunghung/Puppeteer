import json
import re

# Đường dẫn file JSON đầu vào và file TXT đầu ra
input_file = r"E:\puppeteer-auto-meta-proxy\scr\data.json"
output_file = r"E:\puppeteer-auto-meta-proxy\scr\EVM_addresses.txt"

# Xác định khoảng profile cần xử lý
profile_start = 1
profile_end = 66

# Đọc dữ liệu từ file JSON
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

addresses = []

# Duyệt qua từng profile trong dữ liệu JSON
for profile_obj in data:
    profile_name = profile_obj.get("profile", "")
    
    # Sử dụng regex để lấy số thứ tự ở cuối chuỗi profile
    match = re.search(r"(\d+)$", profile_name)
    if match:
        profile_num = int(match.group(1))
        
        # Kiểm tra profile có nằm trong khoảng cần xử lý không
        if profile_start <= profile_num <= profile_end:
            # Lấy giá trị address từ đối tượng EVM nếu có
            evm = profile_obj.get("EVM", {})
            address = evm.get("address")
            if address:
                addresses.append((profile_num, address))
    else:
        print(f"Bỏ qua profile không hợp lệ: {profile_name}")

# Ghi danh sách các địa chỉ ra file TXT với profile index
with open(output_file, 'w', encoding='utf-8') as f:
    for profile_num, addr in addresses:
        f.write(f"Profile_{profile_num}: {addr}\n")

print(f"Đã ghi {len(addresses)} địa chỉ EVM vào file: {output_file}")
