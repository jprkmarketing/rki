import sys
import re
import os

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update <article> class
    content = content.replace('<article class="article bg-white p-4 p-md-5 rounded shadow-sm">', '<article class="article article-wrapper bg-white p-4 p-md-5 rounded shadow-sm">')

    # 2. Update Style Blocks (we'll inject the large CSS)
    new_style = """  <style>
    /* ===== Article Layout ===== */
    .article-wrapper {
      max-width: 960px;
      margin: 0 auto;
    }

    .article-main-img {
      border-radius: 12px;
      width: 100%;
      object-fit: cover;
      max-height: 460px;
    }

    .img-caption {
      font-size: 0.82rem;
      color: #8a939c;
      text-align: center;
      margin-top: 10px;
      font-style: italic;
      line-height: 1.5;
    }

    /* ===== TOC Styles ===== */
    .toc-box {
      background: linear-gradient(135deg, #f8fafc 0%, #eef3f8 100%);
      border: 1px solid #dce5ef;
      border-radius: 12px;
      padding: 0;
      margin: 32px 0;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(6, 37, 64, 0.06);
    }

    .toc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-weight: 700;
      font-size: 1rem;
      color: #062540;
      padding: 18px 24px;
      background: rgba(6, 37, 64, 0.04);
      border-bottom: 1px solid #dce5ef;
      transition: background 0.2s;
      user-select: none;
    }

    .toc-header:hover {
      background: rgba(241, 194, 50, 0.1);
    }

    .toc-header .toc-toggle-icon {
      transition: transform 0.3s ease;
      font-size: 0.9rem;
    }

    .toc-header .toc-toggle-icon.collapsed {
      transform: rotate(180deg);
    }

    .toc-body {
      padding: 16px 24px 20px;
    }

    .toc-list {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }

    .toc-list li {
      margin-bottom: 6px;
    }

    .toc-list li a {
      color: #3a4a5c;
      text-decoration: none;
      font-size: 1.05rem;
      display: inline-flex;
      align-items: baseline;
      gap: 8px;
      padding: 5px 8px;
      border-radius: 6px;
      transition: all 0.2s;
      line-height: 1.6;
    }

    .toc-list li a:hover {
      color: #062540;
      background: rgba(241, 194, 50, 0.12);
      padding-left: 14px;
    }

    .toc-list .toc-h2 a {
      font-weight: 600;
      color: #1a2e40;
    }

    .toc-list .toc-h3 {
      padding-left: 24px;
    }

    .toc-list .toc-h3 a {
      font-size: 0.88rem;
      font-weight: 400;
    }

    /* ===== Baca Juga ===== */
    .baca-juga-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(135deg, #f0f7ff 0%, #e8f1fa 100%);
      border: 1px solid #d0dde9;
      border-left: 4px solid #062540;
      border-radius: 0 10px 10px 0;
      padding: 16px 20px;
      margin: 28px 0;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .baca-juga-card:hover {
      border-left-color: #f1c232;
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(6, 37, 64, 0.1);
    }

    .baca-juga-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #062540;
      color: #f1c232;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .baca-juga-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .baca-juga-label {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #647b91;
    }

    .baca-juga-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #062540;
      margin: 0;
      line-height: 1.4;
      transition: color 0.2s;
    }

    .baca-juga-card:hover .baca-juga-title {
      color: #0056b3;
    }

    /* ===== FAQ Styles ===== */
    .faq-accordion {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #eef2f6;
      overflow: hidden;
      margin-top: 24px;
    }
    
    .faq-item {
      border-bottom: 1px solid #eef2f6;
    }
    
    .faq-item:last-child {
      border-bottom: none;
    }
    
    .faq-question {
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      padding: 22px 24px;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a2e40;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .faq-question:hover {
      background: rgba(6, 37, 64, 0.02);
      color: #062540;
    }
    
    .faq-question[aria-expanded="true"] {
      color: #0d47a1;
      background: rgba(13, 71, 161, 0.03);
    }
    
    .faq-question i {
      transition: transform 0.3s;
      color: #8a939c;
      font-size: 1.2rem;
    }
    
    .faq-question[aria-expanded="true"] i {
      transform: rotate(180deg);
      color: #0d47a1;
    }
    
    .faq-answer {
      padding: 0 24px 24px;
      font-size: 1.05rem;
      color: #4a5a6a;
      line-height: 1.75;
    }

    /* ===== Inline CTA Background ===== */
    .inline-cta {
      background: linear-gradient(135deg, #062540 0%, #15416e 100%);
      border-radius: 12px;
      padding: 30px;
      color: white;
      text-align: center;
      margin: 40px 0;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(6,37,64,0.15);
    }

    .inline-cta::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('assets/img/hero-bg.webp') center/cover;
      opacity: 0.1;
      z-index: 1;
    }

    .inline-cta .cta-content {
      position: relative;
      z-index: 2;
    }

    .content .inline-cta h4 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #ffffff;
    }

    .content .inline-cta p {
      font-size: 1.1rem;
      color: #ffffff;
      margin-bottom: 20px;
    }

    .inline-cta .btn {
      font-weight: 600;
      padding: 10px 24px;
      border-radius: 30px;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }

    /* ===== Content Typography ===== */
    .content p {
      font-size: 1.125rem;
      line-height: 1.85;
      color: #3b4b5a;
      margin-bottom: 20px;
    }

    .content li {
      font-size: 1.125rem;
      line-height: 1.85;
      color: #3b4b5a;
      margin-bottom: 12px;
    }

    .content h2 {
      font-size: 1.7rem;
      font-weight: 800;
      color: #062540;
      margin-top: 45px;
      margin-bottom: 20px;
    }

    /* Author & Share */
    .author-box {
      background: #fdfdfd;
      border: 1px solid #eee;
      padding: 25px;
      border-radius: 12px;
      margin-top: 50px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    
    .author-box img {
      border: 4px solid #f1c232;
    }

    .share-buttons button {
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 8px 16px;
      transition: transform 0.2s;
    }
    .share-buttons button:hover {
      transform: translateY(-2px);
    }

    .meta-top ul {
      font-size: 1rem;
    }
    .meta-top li i {
      color: #f1c232;
    }
  </style>"""
    content = re.sub(r'<style>.*?</style>', new_style, content, flags=re.DOTALL)

    # 3. Update TOC HTML structure
    toc_old = re.compile(r'<div class="toc-header" onclick="toggleTOC\(\)">(.*?)</div>\s*<ul class="toc-list" id="toc-list">\s*</ul>', re.DOTALL)
    toc_new = """<div class="toc-header" onclick="toggleTOC()">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-list-columns-reverse fs-5 text-warning"></i> 
                  <span>Daftar Isi Artikel</span>
                </div>
                <i class="bi bi-chevron-up toc-toggle-icon" id="toc-icon"></i>
              </div>
              <div class="toc-body">
                <ul class="toc-list" id="toc-list">
                  <!-- JS Will Generate -->
                </ul>
              </div>"""
    content = toc_old.sub(toc_new, content)

    # 4. Baca Juga regex
    baca_juga_re = re.compile(
        r'<div class="baca-juga">.*?<a href="(.*?)".*?>(.*?)</a>\s*</div>',
        re.DOTALL
    )
    def baca_juga_repl(m):
        link = m.group(1).strip()
        title = m.group(2).strip()
        return f"""<a href="{link}" class="baca-juga-card">
              <div class="baca-juga-icon">
                <i class="bi bi-journal-text"></i>
              </div>
              <div class="baca-juga-content">
                <span class="baca-juga-label">Baca Juga</span>
                <h4 class="baca-juga-title">{title}</h4>
              </div>
            </a>"""
    content = baca_juga_re.sub(baca_juga_repl, content)

    # 5. Inline CTA promo replacing GIF sections
    baca_cta_re = re.compile(
        r'<div class="text-center my-5">\s*<a href="(.*?)">\s*<img src="https://media.giphy.com/media/v1.*?".*?alt="(.*?)".*?>\s*</a>\s*</div>',
        re.DOTALL
    )
    def cta_img_repl(m):
        link = m.group(1).strip()
        alt = m.group(2).strip()
        link_str = link if link.startswith('http') else 'https://wa.me/083198002246'
        return f"""<div class="inline-cta">
              <div class="cta-content">
                <h4>Siap Mengambil Langkah Baru?</h4>
                <p>Ikuti pelatihan dan sertifikasi profesional berkualitas dari pakar industri bersama RK Institute.</p>
                <a href="{link_str}" class="btn btn-warning" target="_blank">Daftar Sekarang</a>
              </div>
            </div>"""
    content = baca_cta_re.sub(cta_img_repl, content)

    # Also second GIF type CTA
    baca_cta_re2 = re.compile(
        r'<div class="text-center my-5">\s*<a href="(.*?)">\s*<img src="https://media.giphy.com/media/3oKIPa2TdahYIGANYI.*?".*?alt="(.*?)".*?>\s*</a>\s*</div>',
        re.DOTALL
    )
    def cta_img_repl2(m):
        link = m.group(1).strip()
        alt = m.group(2).strip()
        link_str = link if link.startswith('http') else 'https://wa.me/083198002246'
        return f"""<div class="inline-cta">
              <div class="cta-content">
                <h4>Konsultasi dan Sertifikasi Bersama Ahli</h4>
                <p>Dapatkan strategi, ilmu, dan legitimasi dari para profesional di RK Institute hari ini.</p>
                <a href="{link_str}" class="btn btn-warning" target="_blank">Hubungi Kami</a>
              </div>
            </div>"""
    content = baca_cta_re2.sub(cta_img_repl2, content)

    # 6. FAQ
    if '<div class="faq-section' in content:
        # Instead of generic regex we can just brute force find faq blocks
        pass # we'll do FAQ via script custom or skip if complex, actually we can extract questions
        
    # Let's fix toggleTOC javascript
    toc_js_old = """    // FUNGSI BUKA TUTUP TOC
    function toggleTOC() {
      const tocList = document.getElementById('toc-list');
      const tocIcon = document.getElementById('toc-icon');
      if(tocList.classList.contains('collapsed')) {
        tocList.classList.remove('collapsed');
        tocIcon.classList.remove('bi-chevron-down');
        tocIcon.classList.add('bi-chevron-up');
      } else {
        tocList.classList.add('collapsed');
        tocIcon.classList.remove('bi-chevron-up');
        tocIcon.classList.add('bi-chevron-down');
      }
    }"""
    toc_js_new = """    // FUNGSI BUKA TUTUP TOC
    function toggleTOC() {
      const tocList = document.getElementById('toc-list');
      const tocBody = tocList.closest('.toc-body') || tocList;
      const tocIcon = document.getElementById('toc-icon');
      
      if (tocList.classList.contains('collapsed')) {
        tocList.classList.remove('collapsed');
        tocBody.style.display = 'block';
        tocIcon.classList.remove('bi-chevron-down', 'collapsed');
        tocIcon.classList.add('bi-chevron-up');
      } else {
        tocList.classList.add('collapsed');
        tocBody.style.display = 'none';
        tocIcon.classList.remove('bi-chevron-up');
        tocIcon.classList.add('bi-chevron-down', 'collapsed');
      }
    }"""
    
    # Also handle the variant without space
    toc_js_old2 = toc_js_old.replace("if(tocList", "if (tocList")
    if toc_js_old in content:
        content = content.replace(toc_js_old, toc_js_new)
    elif toc_js_old2 in content:
        content = content.replace(toc_js_old2, toc_js_new)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

process_file(sys.argv[1])
print("Processed", sys.argv[1])
