import os
import glob

search_dir = r"c:\Users\Sony Vaio\Downloads\RK Institute ID"
html_files = glob.glob(os.path.join(search_dir, "*.html"))

targets = ["rk.institute@radarkediri.id", "marketingradarkediri@gmail.com"]
replacement = "officialrkinstitute@gmail.com"

updated_files = 0
for file in html_files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = content
        for target in targets:
            new_content = new_content.replace(target, replacement)
            
        if new_content != content:
            with open(file, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated_files += 1
            print(f"Updated: {os.path.basename(file)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file)}: {e}")

print(f"Total updated: {updated_files} files.")
