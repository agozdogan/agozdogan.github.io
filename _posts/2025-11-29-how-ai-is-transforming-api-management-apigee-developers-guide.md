---
layout: post
title: "Apigee Geliştirici Rehberi"
date: 2025-11-29 18:10:00 +0300
categories: [apigee, ai, api]
---

Bu yazıda, yapay zekânın (AI) API yönetimini nasıl dönüştürdüğünü Apigee odaklı bir perspektifle ele alıyoruz. Geliştiriciler için pratik örnekler, entegrasyon desenleri ve üretime hazır yaklaşımlar sunacağım — amaç, Apigee platformunuza AI destekli yetenekleri güvenli ve sürdürülebilir şekilde nasıl ekleyeceğinizi göstermek.

**Kime hitap ediyor:** Apigee üzerinde çalışan API geliştiricileri, platform mühendisleri ve API ürün yöneticileri.

## Neden AI + API Yönetimi?

- Ölçeklenebilir içgörüler: AI, API telemetrisinden örüntüleri ve anomalileri insan kapasitesinin ötesinde tespit edebilir.
- Otomasyon: Politika kararları (rate limiting, routing, quota) koşullara göre dinamik hale getirilebilir.
- Güvenlik: Anomali tespiti, sahtekârlık algılama ve saldırı imzalanması için AI modelleri kullanılabilir.
- Geliştirici deneyimi: Otomatik dokümantasyon, örnek kod ve akıllı hata teşhisi ile geliştirici deneyimi iyileşir.

## Temel Kullanım Senaryoları

1. Telemetri Analizi ve Anomali Tespiti
   - AI modelleri, latency, hata oranı ya da belirli path'lerdeki istek desenlerindeki sapmaları saptar.
2. Akıllı Yönlendirme ve Canary Kararları
   - Model çıktılarına göre istekleri farklı backend'lere yönlendirme (A/B testi, canary rollout).
3. Otomatik Politika Üretimi
   - Trafik profiline göre otomatik rate limit veya quota önerileri.
4. Güvenlik ve Sahtekârlık Tespiti
   - Bot trafik tespiti, credential stuffing, anormal davranışlar.
5. Geliştirici Yardımcısı
   - API istek/yanıt örnekleri, otomatik OpenAPI güncellemeleri, sorgu çeviri yardımcısı.

## Apigee ile Entegrasyon Desenleri

Apigee platformunda AI'yı entegre etmenin birkaç pratik yolu vardır:

- Edge / Proxy katmanında gerçek zamanlı çağrılar: `ServiceCallout` veya JavaScript policy ile dış AI servisine çağrı yapabilirsiniz. Dikkat: bu model G/Ç gecikmesi ve maliyet getirir, bu yüzden kritik path'lerde önbellekleme düşünün.
- Asenkron işleme: Telemetriyi (Stackdriver/Cloud Monitoring, BigQuery) gönderip orada eğitilmiş modellerle batch analizler yapın. Anormallik tespitleri için bu daha ölçeklenebilirdir.
- Hibrit yaklaşımlar: Gerçek zamanlı hafif modeller (ör. küçük ML servisleri) ile hızlı karar verip, detaylı analizleri arka planda yapan ağır modellerle tamamlayın.

## Uygulama Örnekleri

1) Gerçek Zamanlı İstek İncelemesi (ServiceCallout)

Apigee Proxy içinde, bir istek şüpheli görünüyorsa dış bir AI servisine (ör. kurum içi fraud-detector veya üçüncü taraf model) çağrı yapıp sonuç kararına göre istek reddedilebilir veya ekstra doğrulama istenebilir.

Örnek: `ServiceCallout` policy (apiproxy/xml örneği):

```xml
<ServiceCallout name="SC-AI-Score">
  <DisplayName>ServiceCallout - AI Score</DisplayName>
  <Request variable="ai.request">
    <Set>
      <FormParams>
        <FormParam name="path">{proxy.pathsuffix}</FormParam>
        <FormParam name="method">{request.verb}</FormParam>
        <FormParam name="headers">{request.headers}</FormParam>
      </FormParams>
    </Set>
  </Request>
  <HTTPTargetConnection>
    <URL>https://ai-backed.example.com/score</URL>
  </HTTPTargetConnection>
</ServiceCallout>
```

ServiceCallout yanıtını bir JavaScript policy ile işleyip karar alabilirsiniz:

```javascript
// apiproxy/resources/jsc/handle-ai-response.js
var aiResp = context.getVariable('servicecallout.response');
var score = 0;
try{
  var body = JSON.parse(aiResp);
  score = body.score || 0;
}catch(e){
  // parse hatası -> güvenli tarafında davranış
  score = 0;
}
if(score > 0.8){
  // güvenli işlem
  context.setVariable('ai.action','allow');
} else if(score > 0.5){
  context.setVariable('ai.action','challenge');
} else {
  context.setVariable('ai.action','block');
}

```

Bu karar sonucuna göre `RaiseFault` veya ek bir doğrulama (captcha, MFA) tetiklenebilir.

2) Telemetri + Batch ML (BigQuery / AutoML / Vertex)

Apigee'den gelen telemetriyi BigQuery'ye aktararak zaman serisi modellemeleri, anomali tespiti ve trend analizleri yapabilirsiniz. Bu veriden per-API öneriler (rate limit, caching) oluşturmak mümkündür.

3) Geliştirici Deneyimi: Otomatik Dokümantasyon

API şemasındaki değişiklikleri izleyip OpenAPI spec'ini otomatik güncelleyen bir pipeline kurabilirsiniz. AI, değişiklikleri doğal dilde özetleyip release notu oluşturabilir.

## Performans & Maliyet Dikkatleri

- Gerçek zamanlı ServiceCallout'lar gecikme ekler: SLA'larınızı gözden geçirin ve kritik path'leri minimumda tutun.
- Her çağrı için maliyet: dış API çağrıları hızlıca maliyetlendirir. Önbellekleme, toplu scoring ve düşük gecikmeli local modeller kullanın.

## Güvenlik ve Gizlilik

- Veri gönderirken hassas bilgileri maskalayın. PII/PHI gönderimi konusunda regülasyonları unutmayın.
- Model sonuçlarına olan güveninizi sınırlandırın; model kararlarını insan denetimi ile bağlayın.
- Kimlik doğrulama: Apigee tarafından yapılan ServiceCallout istekleri için mTLS, API key veya OAuth2 kullanın.

## İzlenebilirlik ve Geriye Dönük İnceleme

AI kararlarını, skorlarını ve tetiklenen aksiyonları telemetri olarak saklayın. Böylece neden bir isteğin bloklandığını veya yönlendirildiğini inceleyebilirsiniz.

## Örnek: Basit Apigee JavaScript + OpenAI çağrısı (örnek amaçlı)

Aşağıdaki örnek, yalnızca öğretici amaçlıdır — gerçek ortamda OpenAI gibi üçüncü parti servislerle çalışırken güvenlik/kota/maskalama önlemleri alın.

```javascript
// basit OpenAI çağrısı — apiproxy/jsc/openai-proxy.js
var payload = JSON.stringify({
  prompt: 'Is this request suspicious? path:'+context.getVariable('proxy.pathsuffix'),
  max_tokens: 10
});
var req = new XMLHttpRequest();
req.open('POST','https://api.openai.example/v1/engines/mini/completions', false);
req.setRequestHeader('Content-Type','application/json');
req.setRequestHeader('Authorization','Bearer ' + context.getVariable('env.OPENAI_KEY'));
req.send(payload);
if(req.status === 200){
  var r = JSON.parse(req.responseText);
  // r.choices[0].text gibi alanlara bakın
  context.setVariable('ai.openai.result', JSON.stringify(r));
}

```

Bu tip çözümleri prod'a alırken şunları uygulayın: yanıt zaman aşımı, circuit-breaker, lokal önbellek ve sonuçların açıklanabilirliğini sağlayacak telemetri.

## En İyi Uygulamalar

- Basitleştir: Gerçek zamanlı kararları hafif tutun; ağır analizleri arka planda çalıştırın.
- Gözle: Tüm AI kararlarını loglayın ve geri izleme imkânı sağlayın.
- Sınırla: Model çıktısına direkt otomatik blok yerine 'challenge' veya 'monitor' gibi kademeli aksiyonlar kullanın.
- Sür: Canary ile küçük trafikte test edin, sonra genişletin.
- Güvenlik: Hassas verileri maskeleyin ve iletimde şifreleme kullanın.

## Sonuç

AI, API yönetimini daha proaktif, akıllı ve otomatik hale getiriyor. Apigee gibi güçlü bir gateway üzerinde doğru entegrasyon desenleriyle; güvenlik, gözlemlenebilirlik ve geliştirici deneyiminde önemli kazanımlar elde edebilirsiniz. Ancak gecikme, maliyet ve gizlilik konularını göz önünde tutarak hibrit yaklaşımlar benimsemek genellikle en sürdürülebilir yoldur.

## Çalışır Örnek: ServiceCallout + RaiseFault (adım adım)

Aşağıda Apigee Proxy içinde doğrudan kullanabileceğiniz, basit ve çalışır halde bir örnek yer alır. Bu örnek akışı özetle şunu yapar: gelen istek için bir dış AI scoring servisine `ServiceCallout` ile çağrı yapılır; JavaScript policy sonucu parse edip skor düşükse `RaiseFault` ile isteği bloklar, orta seviyedeyse challenge/extra doğrulama tetiklenir, yüksekse istek normal şekilde devam eder.

> ÖNEMLİ: Bu örnek öğretici amaçlıdır — üretimde hassas verileri göndermeden önce maskalama, timeout yönetimi, circuit-breaker, mTLS ve uygun kimlik doğrulama uygulayın.

1) `apiproxy/proxies/default.xml` (ProxyEndpoint içinde ilgili adımların konumu):

```xml
<ProxyEndpoint name="default">
  <PreFlow>
    <Request>
      <Step>
        <Name>SC-AI-Score</Name>
      </Step>
      <Step>
        <Name>JS-Handle-AI-Response</Name>
      </Step>
      <!-- RF-AI-Block koşul ile çalıştırılacak -->
      <Step>
        <Name>RF-AI-Block</Name>
      </Step>
    </Request>
    <Response/>
  </PreFlow>
  <!-- diğer flow'lar burada -->
</ProxyEndpoint>
```

2) `apiproxy/policies/SC-AI-Score.xml` — ServiceCallout policy (dış scoring servisine POST):

```xml
<ServiceCallout name="SC-AI-Score">
  <DisplayName>ServiceCallout - AI Score</DisplayName>
  <Timeout>3000</Timeout>
  <Request variable="ai.request">
    <Set>
      <Verb>POST</Verb>
      <Headers>
        <Header name="Content-Type">application/json</Header>
        <Header name="Authorization">Bearer {env.AI_API_KEY}</Header>
      </Headers>
      <Payload>{"path":"{proxy.pathsuffix}","method":"{request.verb}","ip":"{client.ip}"}</Payload>
    </Set>
  </Request>
  <HTTPTargetConnection>
    <URL>https://ai-backend.example.com/score</URL>
  </HTTPTargetConnection>
</ServiceCallout>
```

3) `apiproxy/resources/jsc/JS-Handle-AI-Response.js` — JavaScript policy, ServiceCallout yanıtını parse eder ve karar (ai.action) değişkenini atar:

```javascript
// apiproxy/resources/jsc/JS-Handle-AI-Response.js
var scResp = context.getVariable('servicecallout.response.SC-AI-Score');
var scStatus = context.getVariable('servicecallout.status.code.SC-AI-Score');
var score = 0;
if(scStatus == '200' && scResp){
  try{
    var body = JSON.parse(scResp);
    score = Number(body.score) || 0;
  } catch(e){ score = 0; }
} else {
  // ServiceCallout başarısızsa daha güvenli davranmak için düşük skor ata
  score = 0;
}

if(score >= 0.85){
  context.setVariable('ai.action','allow');
} else if(score >= 0.5){
  context.setVariable('ai.action','challenge');
} else {
  context.setVariable('ai.action','block');
}

context.setVariable('ai.score', score);

```

4) `apiproxy/policies/RF-AI-Block.xml` — RaiseFault policy (bloklamak için):

```xml
<RaiseFault name="RF-AI-Block">
  <DisplayName>RF - AI Block</DisplayName>
  <FaultResponse>
    <Set>
      <StatusCode>403</StatusCode>
      <ReasonPhrase>Forbidden</ReasonPhrase>
      <Message>Request blocked by AI scoring</Message>
      <Headers>
        <Header name="Content-Type">application/json</Header>
      </Headers>
      <Payload>{"error":"blocked","reason":"ai.score.too_low","score":"{ai.score}"}</Payload>
    </Set>
  </FaultResponse>
</RaiseFault>
```

5) Koşullu adımlar: `default.xml` içinde RaiseFault ve challenge policy'lerini `Condition` ile çalıştırın; örnek:

```xml
<Step>
  <Name>RF-AI-Block</Name>
  <Condition>ai.action = "block"</Condition>
</Step>
<Step>
  <Name>Some-Challenge-Policy</Name>
  <Condition>ai.action = "challenge"</Condition>
</Step>
```

6) Lokal test için basit bir mock AI scoring servisi (Node.js / Express):

```javascript
// mock ai scoring server (örnek)
const express = require('express');
const app = express();
app.use(express.json());
app.post('/score',(req,res)=>{
  const p = req.body.path || '';
  let score = 0.6;
  if(p.indexOf('/sensitive') !== -1) score = 0.2;
  if(p.indexOf('/safe') !== -1) score = 0.95;
  res.json({score: score});
});
app.listen(8080, ()=>console.log('mock ai scoring on :8080'));
```

Kullanım: mock servisi çalıştırıp `SC-AI-Score` içindeki URL'yi `http://<your-host>:8080/score` yaparak deploy edilen proxy'yi test edin.

Güvenlik ve sağlamlık önerileri

- `env.AI_API_KEY` gibi anahtarları Apigee Environment variable veya KVM içinde saklayın.
- `ServiceCallout` timeout'u kısa tutun ve fallback davranışı (circuit-breaker) uygulayın.
- Telemetri: `ai.score` ve ServiceCallout statülerini loglayıp analize gönderin.
- Maliyet: dış çağrıları önbelleğe alın veya örnekleme stratejisi kullanın.

