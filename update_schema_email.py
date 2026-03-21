import os
import glob
import re

search_dir = r"c:\Users\Sony Vaio\Downloads\RK Institute ID"
html_files = glob.glob(os.path.join(search_dir, "*.html"))

updated_files = 0
for file in html_files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()

        # Find the <script type="application/ld+json"> ... </script> block
        pattern = re.compile(r'(<script type="application/ld\+json">)(.*?)(</script>)', re.DOTALL)
        
        def replacement(match):
            json_text = match.group(2)
            # If email is already in the JSON, we don't need to add it unless it's the wrong one
            if '"email":' not in json_text:
                # Add it after "telephone": "..."
                if '"telephone"' in json_text:
                    json_text = re.sub(r'("telephone"\s*:\s*"[^"]*",?)', r'\1\n    "email": "officialrkinstitute@gmail.com",', json_text)
                else:
                    # If there's no telephone, just add it somewhere before the closing brace
                    # Let's add it before the end
                    json_text = re.sub(r'(\s*})([\s]*)$', r',\n    "email": "officialrkinstitute@gmail.com"\1\2', json_text)
            else:
                # Replace the old email if any
                json_text = re.sub(r'"email"\s*:\s*"[^"]*"', r'"email": "officialrkinstitute@gmail.com"', json_text)
            
            return match.group(1) + json_text + match.group(3)

        new_content = pattern.sub(replacement, content)
        
        if new_content != content:
            with open(file, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated_files += 1
            print(f"Updated: {os.path.basename(file)}")
    except Exception as e:
        pass

print(f"Total schema updated: {updated_files}")
