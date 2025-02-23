import os

INPUT_FILE = "private_keys1.txt"  # File gốc chứa 100.000 dòng
OUTPUT_FILES = ["part1.txt", "part2.txt", "part3.txt", "part4.txt"]  # 4 file đầu ra

def split_file():
    try:
        # Đọc toàn bộ nội dung file
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()

        total_lines = len(lines)
        chunk_size = total_lines // 4  # Mỗi file chứa khoảng 25.000 dòng

        for i in range(4):
            start = i * chunk_size
            end = start + chunk_size if i < 3 else total_lines  # File cuối lấy hết phần còn lại

            with open(OUTPUT_FILES[i], "w", encoding="utf-8") as f:
                f.writelines(lines[start:end])

            print(f"✅ Đã tạo {OUTPUT_FILES[i]} ({len(lines[start:end])} dòng)")

        print("🎉 Chia file thành công!")

    except Exception as e:
        print(f"❌ Lỗi khi chia file: {e}")

split_file()
