---
layout: post
title:  "Linux Text Processing: Komut Satırında Metin İşleme Sanatı"
date:   2025-11-09 15:30:00 +0700
categories: [linux, devops]
---

Linux ve Unix sistemlerin en güçlü özelliklerinden biri, metin işleme konusundaki zengin araç setidir. Bu yazıda, Linux komut satırında metin işleme için kullanılan temel araçları ve teknikları inceleyeceğiz.

## Neden Linux Text Processing?

Linux sistemlerde hemen hemen her şey metin tabanlıdır:
- Konfigürasyon dosyaları
- Log dosyaları  
- Sistem çıktıları
- Veri dosyaları

Bu nedenle metin işleme becerilerini geliştirmek, Linux kullanımında kritik öneme sahiptir.

## Temel Metin İşleme Araçları

### 1. `cat` - Dosya İçeriğini Görüntüleme

En basit metin görüntüleme aracı:

```bash
# Dosya içeriğini görüntüle
cat dosya.txt

# Birden fazla dosyayı birleştir
cat dosya1.txt dosya2.txt > birlesik.txt

# Satır numaralarıyla birlikte göster
cat -n dosya.txt
```

### 2. `grep` - Metin Arama

Güçlü pattern matching aracı:

```bash
# Basit arama
grep "error" log.txt

# Case-insensitive arama
grep -i "error" log.txt

# Recursive arama (tüm alt dizinlerde)
grep -r "TODO" /home/user/project/

# Satır numaralarıyla birlikte
grep -n "function" script.js

# İnvert match (eşleşmeyenleri göster)
grep -v "debug" log.txt

# Regular expressions kullanımı
grep -E "^[A-Z]+" dosya.txt
```

### 3. `sed` - Stream Editor

Metin düzenleme ve dönüştürme için:

```bash
# Basit metin değiştirme
sed 's/eski/yeni/' dosya.txt

# Tüm eşleşmeleri değiştir
sed 's/eski/yeni/g' dosya.txt

# Belirli satırları sil
sed '2d' dosya.txt          # 2. satırı sil
sed '2,5d' dosya.txt        # 2-5 arası satırları sil

# Dosyayı yerinde düzenle
sed -i 's/localhost/127.0.0.1/g' config.txt

# Çoklu işlemler
sed -e 's/foo/bar/g' -e 's/hello/hi/g' dosya.txt
```

### 4. `awk` - Text Processing Programming Language

Güçlü metin işleme dili:

```bash
# Belirli sütunu yazdır
awk '{print $1}' dosya.txt

# CSV dosyasında belirli sütun
awk -F',' '{print $2}' veri.csv

# Koşullu işlemler
awk '$3 > 100 {print $1, $3}' sayilar.txt

# Toplam hesaplama
awk '{sum += $1} END {print sum}' sayilar.txt

# Pattern matching
awk '/error/ {print NR, $0}' log.txt
```

### 5. `sort` ve `uniq` - Sıralama ve Benzersiz Değerler

```bash
# Alfabetik sıralama
sort dosya.txt

# Sayısal sıralama
sort -n sayilar.txt

# Ters sıralama
sort -r dosya.txt

# Belirli sütuna göre sıralama
sort -k2 -n veri.txt

# Benzersiz değerleri göster
sort dosya.txt | uniq

# Tekrar sayılarıyla birlikte
sort dosya.txt | uniq -c
```

### 6. `cut` - Sütun Çıkarma

```bash
# Belirli karakterleri kes
cut -c1-10 dosya.txt

# Belirli alanları ayırıcıya göre kes
cut -d',' -f1,3 veri.csv

# Tab ile ayrılmış dosyalarda
cut -f2-4 veri.tsv
```

## Gelişmiş Metin İşleme Teknikleri

### Pipe (|) ile Komut Zincirleme

```bash
# Log dosyasında en çok görülen hataları bul
grep "ERROR" app.log | awk '{print $4}' | sort | uniq -c | sort -nr

# En uzun satırları bul
cat dosya.txt | awk '{print length, $0}' | sort -nr | head -5

# IP adreslerini analiz et
grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' access.log | sort | uniq -c | sort -nr
```

### Redirection ile Dosya İşlemleri

```bash
# Çıktıyı dosyaya yönlendir
grep "error" log.txt > errors.txt

# Dosyaya ekle
grep "warning" log.txt >> errors.txt

# Hem standart çıktıyı hem hatayı yönlendir
command > output.txt 2>&1
```

## Pratik Örnekler

### 1. Log Analizi

```bash
# Apache access log analizi
# En çok ziyaret edilen sayfalar
awk '{print $7}' access.log | sort | uniq -c | sort -nr | head -10

# Benzersiz IP adresleri sayısı
awk '{print $1}' access.log | sort | uniq | wc -l

# 404 hatalarını bul
awk '$9 == 404 {print $7}' access.log | sort | uniq -c
```

### 2. Sistem Monitoring

```bash
# En çok CPU kullanan işlemleri bul
ps aux | sort -k3 -nr | head -10

# Disk kullanımını analiz et
df -h | awk '$5 > 80 {print $6, $5}'

# Bellek kullanımını göster
free -h | grep Mem | awk '{print "Used: " $3 "/" $2}'
```

### 3. Veri Temizleme

```bash
# Email adreslerini çıkar
grep -oE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' dosya.txt

# Boş satırları kaldır
sed '/^$/d' dosya.txt

# Fazla boşlukları temizle
sed 's/[[:space:]]\+/ /g' dosya.txt
```

## Regular Expressions (Regex)

### Temel Regex Kalıpları

```bash
# Sayıları bul
grep -E '[0-9]+' dosya.txt

# Email pattern
grep -E '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' dosya.txt

# IP adresi pattern
grep -E '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' dosya.txt

# Satır başında belirli kelime
grep '^ERROR' log.txt

# Satır sonunda belirli pattern
grep 'success$' log.txt
```

## Performance İpuçları

### 1. Büyük Dosyalar İçin Optimizasyon

```bash
# head ve tail kullanımı
head -1000 buyuk_dosya.txt | grep "pattern"

# Belirli satır aralığını işle
sed -n '1000,2000p' buyuk_dosya.txt

# Paralel işleme
split -l 10000 buyuk_dosya.txt chunk_
for f in chunk_*; do grep "pattern" "$f" & done
wait
```

### 2. Bellek Dostu Yaklaşımlar

```bash
# Stream processing
tail -f log.txt | grep --line-buffered "ERROR"

# Büyük dosyaları parça parça işle
while IFS= read -r line; do
    echo "$line" | sed 's/old/new/g'
done < buyuk_dosya.txt
```

## Automation ve Scripting

### Bash Script Örnekleri

```bash
#!/bin/bash
# log_analyzer.sh

LOG_FILE="$1"

echo "=== Log Analysis Report ==="
echo "Total lines: $(wc -l < "$LOG_FILE")"
echo "Error count: $(grep -c "ERROR" "$LOG_FILE")"
echo "Warning count: $(grep -c "WARNING" "$LOG_FILE")"

echo -e "\n=== Top Error Messages ==="
grep "ERROR" "$LOG_FILE" | awk '{print $4}' | sort | uniq -c | sort -nr | head -5

echo -e "\n=== Hourly Distribution ==="
awk '{print $4}' "$LOG_FILE" | cut -d: -f2 | sort | uniq -c
```

## Modern Alternatifler

### 1. `ripgrep` (rg) - Hızlı Arama

```bash
# Çok hızlı recursive arama
rg "pattern" /path/to/search/

# Sadece belirli dosya türlerinde ara
rg "function" --type js

# Context ile birlikte göster
rg -C 3 "error"
```

### 2. `jq` - JSON Processing

```bash
# JSON dosyasını pretty print
jq '.' data.json

# Belirli alanı çıkar
jq '.users[].name' users.json

# Filtreleme
jq '.users[] | select(.age > 25)' users.json
```

### 3. `fd` - Gelişmiş find

```bash
# Dosya arama
fd "pattern" /search/path/

# Dosya türüne göre filtrele
fd -e js -e ts "component"
```

## Best Practices

### 1. Güvenlik
- Kullanıcı girdilerini her zaman validate edin
- Shell injection saldırılarına dikkat edin
- Özel karakterleri escape edin

### 2. Performans
- Büyük dosyalar için streaming yaklaşımı kullanın
- Gereksiz pipe'ları minimize edin
- Uygun araçları seçin (awk vs sed vs grep)

### 3. Maintainability
- Kompleks komutları script'e dönüştürün
- Açıklayıcı değişken isimleri kullanın
- Komutları dokümante edin

## Sonuç

Linux text processing, sistem yönetimi ve veri analizi için vazgeçilmez becerilerdir. Bu araçları öğrenmek:

- **Verimlilik** artışı sağlar
- **Automation** imkanları sunar  
- **Debugging** sürecini hızlandırır
- **Data analysis** kapasitesini geliştirir

Düzenli pratik yaparak bu araçları kullanmayı alışkanlık haline getirin. Her gün karşılaştığınız metin işleme problemlerini bu araçlarla çözmeye çalışın.

---

**Faydalı Kaynaklar:**
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/)
- [Sed Tutorial](https://www.gnu.org/software/sed/manual/sed.html)
- [AWK Programming Language](https://www.gnu.org/software/gawk/manual/gawk.html)
- [Regular Expressions Guide](https://www.regular-expressions.info/)

*Bu yazıdaki örnekler GNU/Linux sistemlerinde test edilmiştir.*