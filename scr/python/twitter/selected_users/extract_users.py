def extract_users(twitter_file, selected_users, result_file):
    # Đọc danh sách user cần lấy
    selected_set = set(selected_users)

    # Đọc nội dung twitter1.txt và lọc dữ liệu
    with open(twitter_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    filtered_lines = [line for line in lines if line.split("|")[0] in selected_set]

    # Ghi kết quả vào file mới
    with open(result_file, "w", encoding="utf-8") as f:
        f.writelines(filtered_lines)

# Danh sách user cần lấy
users_list = [
    "TrevorWils92040", "DonaldPark99861", "LeilaS23152", "eddington79655",
    "AlanHernan56275", "WebsterAbb62318", "VictoriaSm58018",
    "DeidraMcla88070", "AtchesonCh63156", "Fitzgerald60159", "BootmanJay20990",
    "bryan_loui14384", "GlendaHend57056", "RogerGilbe97915", "FosterCris45923",
    "summers_ca14744", "reginamyra75451", "NathanielC11597", "brewer_mon78524",
    "ElsaWhitne46317", "KevinFishe55964"
]

# Chạy hàm để lấy dữ liệu
extract_users("twitter1.txt", users_list, "selected_users.txt")
