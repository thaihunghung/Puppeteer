def format_txt_file(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as infile:
        lines = infile.readlines()
    
    formatted_lines = [line.strip() for line in lines if line.strip()]
    
    with open(output_file, "w", encoding="utf-8") as outfile:
        outfile.write("\n".join(formatted_lines))

# Sử dụng hàm với file đầu vào và đầu ra
format_txt_file("input.txt", "output.txt")
