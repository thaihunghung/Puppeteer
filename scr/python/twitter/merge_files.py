def merge_files(twitter_file, keys_file, output_file):
    with open(twitter_file, 'r', encoding='utf-8') as tw_f, open(keys_file, 'r', encoding='utf-8') as key_f:
        twitter_lines = [line.strip().rstrip('|') + '|' for line in tw_f.readlines()]
        key_lines = [line.strip() for line in key_f.readlines()]
    
    if len(twitter_lines) != len(key_lines):
        raise ValueError("Số lượng dòng trong hai tệp không khớp")
    
    with open(output_file, 'w', encoding='utf-8') as out_f:
        for tw_line, key_line in zip(twitter_lines, key_lines):
            out_f.write(tw_line + key_line + '\n')

# Ví dụ sử dụng
merge_files('twitter.txt', 'private_keys.txt', 'output.txt')
