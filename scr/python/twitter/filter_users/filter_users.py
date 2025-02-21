def filter_users(output_file, twitter_file, result_file):
    # Đọc danh sách user từ output.txt
    with open(output_file, "r", encoding="utf-8") as f:
        valid_users = set(line.strip() for line in f if line.strip())

    # Lọc các dòng có user không nằm trong danh sách hợp lệ
    with open(twitter_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    filtered_lines = [line for line in lines if line.split("|")[0] not in valid_users]

    # Ghi kết quả vào file mới
    with open(result_file, "w", encoding="utf-8") as f:
        f.writelines(filtered_lines)

# Sử dụng hàm với tên file đầu vào và đầu ra
filter_users("output.txt", "twitter1.txt", "filtered_twitter.txt")
