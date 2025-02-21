def extract_matching_users(output_file, twitter_file, result_file):
    # Đọc danh sách username từ output.txt
    with open(output_file, "r", encoding="utf-8") as f:
        valid_users = {line.strip() for line in f if line.strip()}

    # Mở file đầu vào và file kết quả
    with open(twitter_file, "r", encoding="utf-8") as f_in, open(result_file, "w", encoding="utf-8") as f_out:
        for line in f_in:
            username = line.split("|", 1)[0]  # Lấy phần trước dấu |
            if username in valid_users:
                f_out.write(line)  # Ghi lại dòng chứa username hợp lệ

# Gọi hàm với tên file tương ứng
extract_matching_users("output.txt", "twitter1.txt", "matched_users.txt")
