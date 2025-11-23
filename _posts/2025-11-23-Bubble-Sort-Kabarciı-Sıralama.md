---
layout: post
title:  "Kabarcık Sıralama (Bubble Sort): Yeni Başlayanlar için Rehber"
date:   2025-11-22 12:00:00 +0700
categories: [algorithms, python]
---

Kabarcık sıralama (Bubble Sort) algoritması, sıralama algoritmaları arasında en temel ve anlaşılması kolay olanlardan biridir. Bu yazıda kabarcık sıralamanın nasıl çalıştığını, zaman/alan karmaşıklığını, iyileştirme yollarını ve örnek uygulamalarını Türkçe olarak göreceksiniz.

## Kabarcık Sıralama Nedir?

Kabarcık sıralama, bitişik öğeleri karşılaştırıp gerektiğinde yer değiştirerek (swap) diziyi sıralayan basit bir karşılaştırmalı sıralama algoritmasıdır. Her geçişte en büyük (veya en küçük) öğe dizinin sonuna 'kabarcık gibi' çıkar; bu yüzden adı "kabarcık"tır.

## Algoritmanın Mantığı

1. Dizideki bitişik elemanları baştan sona doğru gez.
2. Eğer sol eleman sağ elemandan büyükse, yerlerini değiştir.
3. Bir tam geçiş (pass) tamamlandığında, en büyük eleman dizinin sonuna yerleşmiş olur.
4. Bu işlemi dizinin uzunluğu-1 kez veya sıralama bitene kadar tekrarla.

## Pseudocode

```text
function bubbleSort(A):
  n = length(A)
  for i from 0 to n-2:
    for j from 0 to n-2-i:
      if A[j] > A[j+1]:
        swap A[j] and A[j+1]
```

## Python Örneği

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Kullanım
nums = [5, 1, 4, 2, 8]
print(bubble_sort(nums))  # [1, 2, 4, 5, 8]
```

## JavaScript Örneği

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([5,1,4,2,8]));
```

## Örnek Adım Adım

Dizi: [5, 1, 4, 2, 8]

- 1. geçiş: karşılaştırmalar sonucu en büyük 8 sona gider → [1,4,2,5,8]
- 2. geçiş: en büyük ikinci öğe doğru konuma gelir → [1,2,4,5,8]

Gördüğünüz gibi ikinci geçişten sonra dizi zaten sıralı hale gelmiştir.

## İyileştirmeler (Early Exit)

Basit bir optimizasyon olarak, bir geçişte hiç swap yapılmadıysa dizi zaten sıralıdır ve döngüyü erken sonlandırabilirsiniz. Bu iyileştirme en iyi durumda zaman karmaşıklığını O(n) yapar.

Python'da erken çıkışlı sürüm:

```python
def bubble_sort_optimized(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr
```

## Karmaşıklık

- Zaman (en kötü/ortalama): O(n^2)
- Zaman (en iyi, erken çıkış ile): O(n)
- Alan: O(1) — yerinde (in-place) sıralama
- Kararlılık: Evet, aynı değere sahip öğelerin göreli sırası korunur (stable)

## Ne Zaman Kullanılmalı?

Kabarcık sıralama genellikle eğitim amaçlı ve algoritma mantığını öğretmek için kullanılır. Gerçek uygulamalarda büyük veri kümeleri için verimli değildir — bunun yerine Quicksort, Mergesort veya yerleşik kütüphane sıralamaları tercih edilir. Ancak küçük listeler veya neredeyse sıralı veriler için erken çıkışlı sürüm kabul edilebilir.

## Sonuç

Kabarcık sıralama, algoritma öğrenmeye başlayanlar için harika bir başlangıçtır: mantığı basittir, görselleştirmesi kolaydır ve temel kavramları (karşılaştırma, swap, döngüler) öğretir. Yine de performans ihtiyaçlarınız varsa daha gelişmiş sıralama algoritmalarını öğrenmeniz önerilir.
## Görsel ve Adım Adım Animasyon

Aşağıdaki görsel, kabarcık sıralama algoritmasının adımlarını görsel olarak gösterir. "Karıştır" ile rastgele bir dizi oluşturabilir, "Başlat" ile adım adım animasyonu izleyebilir ve hız ayarı ile animasyon hızını değiştirebilirsiniz.

<style>
#bubble-visual { display:flex; align-items:flex-end; gap:6px; height:220px; border:1px solid #eee; padding:12px; margin-top:12px; background:#fafafa }
.bs-bar { width:18px; background:#4aa3ff; transition:height 0.35s ease, background 0.25s; border-radius:3px; }
.bs-compare{ background:#ffca28 !important; }
.bs-swap{ background:#ff7043 !important; }
.bs-done{ background:#66bb6a !important; opacity:0.95; }
.bs-controls{ margin-top:10px; display:flex; gap:10px; align-items:center; }
.bs-controls button, .bs-controls input[type=range]{ cursor:pointer }
</style>

<div class="bs-controls">
  <button id="bs-shuffle">Karıştır</button>
  <button id="bs-start">Başlat</button>
  <label style="font-size:0.9em">Hız: <input id="bs-speed" type="range" min="50" max="800" value="200"></label>
</div>

<div id="bubble-visual" aria-label="Bubble sort visualization"></div>

<script src="{{ '/static/js/bubble-sort-visual.js' | relative_url }}"></script>


