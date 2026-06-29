'use client';

import { useState } from 'react';
import './templateGenerator.css'; // Importing the local CSS styles

type KontenBlok = {
  tipe: string;
  level_heading: number;
  nomor: string;
  teks: string;
};

export default function DocumentFormatter() {
  const [loading, setLoading] = useState(false);
  
  // State untuk pengaturan dokumen utama
  const [formData, setFormData] = useState({
    jenis_font: 'Times New Roman',
    ukuran_font: 12,
    jarak_spasi: 2.0,
    margin_top: 4.0,     
    margin_bottom: 3.0,  
    margin_left: 4.0,    
    margin_right: 3.0,   
    pakai_cover: true,         
    pakai_kata_pengantar: true,
    pakai_lampiran: true,
    
    number_format: 'angka',           
    include_chapter_number: true,     
    chapter_style: 'Heading 1',       
    nomor_bab_aktif: 'I',             
    separator_type: '-',              

    isi_teks: 'Kecerdasan buatan berkembang sangat pesat. Dokumen ini mendemonstrasikan bagaimana kustomisasi fitur "Page Number Format" serta "Heading Block Editor" dirender sempurna menjadi file dokumen .docx yang presisi.'
  });

  // State untuk Editor Blok Dinamis (Heading 1-4 & Paragraf)
  const [blokNaskah, setBlokNaskah] = useState<KontenBlok[]>([
    { tipe: 'heading', level_heading: 2, nomor: '2.2', teks: 'Format Penulisan Karya Ilmiah' },
    { tipe: 'heading', level_heading: 3, nomor: '2.2.3', teks: 'Penulisan Bab, Subbab, Subsubbab' },
    { tipe: 'paragraf', level_heading: 0, nomor: '', teks: 'Judul yang dicantumkan pada halaman sampul depan dan halaman judul usulan dan atau laporan penelitian semuanya ditulis dengan huruf kapital, begitu juga judul pada setiap bab. Judul usulan dan laporan penelitian ditulis simetris dengan huruf Times New Roman 16. Penulisan nomor bab harus menggunakan angka Romawi (I, II, III, dst), sedangkan setiap subbab diharapkan ditulis dengan angka arab 1.1, 1.2, 1.3, dst.' },
    { tipe: 'heading', level_heading: 4, nomor: 'a', teks: 'Pemecahan Tingkat Lanjutan' },
    { tipe: 'paragraf', level_heading: 0, nomor: '', teks: 'Jika ada pemecahan setelah tingkatan subsubbab maka digunakan huruf abjad kecil (a, b, c, dan seterusnya). Nomor dan judul bab ditulis secara simetris/ rata tengah, sedangkan subbab dan subsubbab dimulai dari batas tepi atau margin kiri ruang pengetikan dengan ditebalkan.' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: name.includes('margin') || name === 'ukuran_font' || name === 'jarak_spasi' ? Number(finalValue) : finalValue
    }));
  };

  // --- FUNGSI EDITOR BLOK ---
  const tambahBlok = (tipe: 'heading' | 'paragraf') => {
    const baru: KontenBlok = tipe === 'heading' 
      ? { tipe: 'heading', level_heading: 2, nomor: '', teks: '' }
      : { tipe: 'paragraf', level_heading: 0, nomor: '', teks: '' };
    setBlokNaskah([...blokNaskah, baru]);
  };

  const hapusBlok = (index: number) => {
    const clone = [...blokNaskah];
    clone.splice(index, 1);
    setBlokNaskah(clone);
  };

  const ubahBlok = (index: number, field: keyof KontenBlok, value: any) => {
    const clone = [...blokNaskah];
    clone[index] = { ...clone[index], [field]: value };
    setBlokNaskah(clone);
  };

  // --- FUNGSI PREVIEW PAGE NUMBER ---
  const getExampleText = () => {
    let ex1 = '1', ex2 = '2', ex3 = '3';
    if (formData.number_format === 'huruf') { ex1 = 'a'; ex2 = 'b'; ex3 = 'c'; }
    if (formData.number_format === 'romawi') { ex1 = 'i'; ex2 = 'ii'; ex3 = 'iii'; }
    
    if (formData.number_format === 'strip' && !formData.include_chapter_number) {
        return `-1-, -2-, -3-`;
    }

    if (formData.include_chapter_number) {
        const sep = formData.separator_type === 'none' ? '' : formData.separator_type;
        return `${formData.nomor_bab_aktif}${sep}${ex1}, ${formData.nomor_bab_aktif}${sep}${ex2}, ...`;
    }
    
    return `${ex1}, ${ex2}, ${ex3}, ...`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Menggabungkan formData dan array blokNaskah untuk dikirim ke backend
      const payload = { ...formData, blok_naskah: blokNaskah };
      
      const response = await fetch('http://localhost:8000/api/v1/generator/generate-font-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Gagal');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Format_Skripsi_Final.docx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container">
      <div className="settings-card">
        <h1 className="app-title">Konfigurasi Format Dokumen</h1>

        {/* 1. GRUP CEKLIS HALAMAN UTAMA */}
        <div className="options-group-container">
          <div className="cover-option-box">
            <label className="checkbox-label">
              <input type="checkbox" name="pakai_cover" checked={formData.pakai_cover} onChange={handleInputChange} className="checkbox-control" />
              <span>Sertakan Halaman Cover</span>
            </label>
          </div>
          <div className="cover-option-box accent-purple">
            <label className="checkbox-label label-purple">
              <input type="checkbox" name="pakai_kata_pengantar" checked={formData.pakai_kata_pengantar} onChange={handleInputChange} className="checkbox-control control-purple" />
              <span>Sertakan Kata Pengantar</span>
            </label>
          </div>
          <div className="cover-option-box accent-orange">
            <label className="checkbox-label label-orange">
              <input type="checkbox" name="pakai_lampiran" checked={formData.pakai_lampiran} onChange={handleInputChange} className="checkbox-control control-orange" />
              <span>Sertakan Lampiran</span>
            </label>
          </div>
        </div>

        {/* 2. PAGE NUMBER FORMAT (MS WORD CLONE) */}
        <h3 className="section-subtitle" style={{ marginTop: '20px' }}>Page Number Format (Auto Bab I s/d V)</h3>
        <div className="word-dialog-box">
          <div className="word-dialog-row">
            <label className="word-dialog-label">Number format:</label>
            <select name="number_format" value={formData.number_format} onChange={handleInputChange} className="word-select-control">
              <option value="angka">1, 2, 3, ...</option>
              <option value="huruf">a, b, c, ...</option>
              <option value="romawi">i, ii, iii, ...</option>
              <option value="strip">- 1 -, - 2 -, - 3 -</option>
            </select>
          </div>

          <div className="word-dialog-row" style={{ marginTop: '15px', marginBottom: '15px' }}>
            <label className="checkbox-label" style={{ fontWeight: 'normal', color: '#1f2937' }}>
              <input 
                type="checkbox" 
                name="include_chapter_number" 
                checked={formData.include_chapter_number} 
                onChange={handleInputChange} 
                style={{ accentColor: '#2563eb' }}
              />
              Include chapter number
            </label>
          </div>

          {formData.include_chapter_number && (
            <div className="chapter-options-panel">
              <div className="word-dialog-row">
                <label className="word-dialog-label">Chapter starts with style:</label>
                <select name="chapter_style" value={formData.chapter_style} onChange={handleInputChange} className="word-select-control">
                  <option value="Heading 1">Heading 1</option>
                  <option value="Heading 2">Heading 2</option>
                  <option value="Heading 3">Heading 3</option>
                </select>
              </div>

              <div className="word-dialog-row" style={{ display: 'none' }}>
                <input type="text" name="nomor_bab_aktif" value={formData.nomor_bab_aktif} onChange={handleInputChange} />
              </div>

              <div className="word-dialog-row">
                <label className="word-dialog-label">Use separator:</label>
                <select name="separator_type" value={formData.separator_type} onChange={handleInputChange} className="word-select-control">
                  <option value="-">- (hyphen)</option>
                  <option value=".">. (period)</option>
                  <option value=":">: (colon)</option>
                  <option value="none">(none)</option>
                </select>
              </div>
            </div>
          )}

          <div className="word-dialog-row" style={{ marginTop: '20px' }}>
            <label className="word-dialog-label">Examples:</label>
            <span className="example-text">{getExampleText()}</span>
          </div>
        </div>

        {/* 3. WORK BENCH EDITOR BLOK NASKAH (FITUR HEADING) */}
        <h3 className="section-subtitle" style={{ marginTop: '25px' }}>Struktur Lembar Kerja Isi Bab</h3>
        <div className="editor-container">
          {blokNaskah.map((blok, index) => (
            <div key={index} className={`blok-box border-${blok.tipe} level-${blok.level_heading}`}>
              <div className="blok-header">
                <span className="blok-badge">
                  {blok.tipe === 'heading' ? `HEADING ${blok.level_heading}` : 'PARAGRAF ISI'}
                </span>
                <button type="button" onClick={() => hapusBlok(index)} className="btn-delete-blok">×</button>
              </div>

              {blok.tipe === 'heading' ? (
                <div className="heading-editor-grid">
                  <div className="form-group">
                    <label>Pilih Tingkatan Heading</label>
                    <select value={blok.level_heading} onChange={(e) => ubahBlok(index, 'level_heading', Number(e.target.value))} className="select-control">
                      <option value={1}>Heading 1 (Judul Bab - Kapital & Tengah)</option>
                      <option value={2}>Heading 2 (Subbab - Contoh: 2.1)</option>
                      <option value={3}>Heading 3 (Subsubbab - Contoh: 2.1.1)</option>
                      <option value={4}>Heading 4 (Anak Subsubbab - Contoh: a, b)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nomor Urut Indeks</label>
                    <input type="text" value={blok.nomor} onChange={(e) => ubahBlok(index, 'nomor', e.target.value)} placeholder="Contoh: 2.2 / a" className="select-control" style={{padding: '8px 12px'}} />
                  </div>
                  <div className="form-group span-full">
                    <label>Teks Judul</label>
                    <input type="text" value={blok.teks} onChange={(e) => ubahBlok(index, 'teks', e.target.value)} placeholder="Ketik kalimat judul di sini..." className="select-control" style={{padding: '8px 12px'}} />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Teks Paragraf Alinea</label>
                  <textarea rows={4} value={blok.teks} onChange={(e) => ubahBlok(index, 'teks', e.target.value)} placeholder="Ketik isi kalimat alinea naskah utama..." className="select-control" />
                </div>
              )}
            </div>
          ))}

          <div className="editor-action-buttons">
            <button type="button" onClick={() => tambahBlok('heading')} className="btn-add-action +purple">+ Tambah Blok Heading (1-4)</button>
            <button type="button" onClick={() => tambahBlok('paragraf')} className="btn-add-action">+ Tambah Blok Paragraf Isi</button>
          </div>
        </div>

        {/* 4. MARGIN & FONT SETTINGS */}
        <h3 className="section-subtitle" style={{ marginTop: '25px' }}>Font & Margin Settings</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Jenis Huruf</label>
            <select name="jenis_font" value={formData.jenis_font} onChange={handleInputChange} className="select-control">
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ukuran Huruf</label>
            <select name="ukuran_font" value={formData.ukuran_font} onChange={handleInputChange} className="select-control">
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Jarak Spasi Antarbaris</label>
          <select name="jarak_spasi" value={formData.jarak_spasi} onChange={handleInputChange} className="select-control">
            <option value={1.5}>1.5</option>
            <option value={2.0}>2.0 (Dua Spasi)</option>
          </select>
        </div>

        <div className="margin-container">
          <div className="margin-column">
            <div className="form-group">
              <label>Margin Atas (Top) cm</label>
              <input type="number" name="margin_top" step="0.1" value={formData.margin_top} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Margin Kiri (Left) cm</label>
              <input type="number" name="margin_left" step="0.1" value={formData.margin_left} onChange={handleInputChange} />
            </div>
          </div>
          <div className="margin-column">
            <div className="form-group">
              <label>Margin Bawah (Bottom) cm</label>
              <input type="number" name="margin_bottom" step="0.1" value={formData.margin_bottom} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Margin Kanan (Right) cm</label>
              <input type="number" name="margin_right" step="0.1" value={formData.margin_right} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="btn-primary" style={{ marginTop: '20px' }}>
          {loading ? 'Menyusun Struktur File...' : 'Generate & Download Word (.docx)'}
        </button>
      </div>
    </main>
  );
}
