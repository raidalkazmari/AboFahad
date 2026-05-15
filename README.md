# ذاكر مع أبو فهد ☕

مساعدك الدراسي الذكي بالذكاء الاصطناعي — مجاني بالكامل!

## طريقة النشر على Vercel (مجاني)

### الخطوة ١: احصل على مفتاح Gemini API (مجاني)
1. روح على https://aistudio.google.com/apikey
2. سجّل دخول بحساب Google العادي
3. اضغط **"Create API Key"**
4. انسخ المفتاح واحفظه

### الخطوة ٢: ارفع المشروع على GitHub
1. سجّل في GitHub: https://github.com/signup
2. اضغط **"New Repository"** (الزر الأخضر +)
3. سمّه `thakr-abu-fahd`
4. اضغط **"Create repository"**
5. اضغط **"uploading an existing file"**
6. اسحب كل ملفات المشروع وأفلتها
7. اضغط **"Commit changes"**

### الخطوة ٣: انشره على Vercel
1. سجّل في Vercel: https://vercel.com/signup (بحساب GitHub)
2. روح https://vercel.com/new
3. اختر مشروع `thakr-abu-fahd`
4. **مهم!** قبل Deploy، اضغط **"Environment Variables"**
5. أضف:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: المفتاح اللي نسخته من الخطوة ١
6. اضغط **"Deploy"**

### النتيجة 🎉
موقعك بيكون جاهز خلال دقيقة على رابط مجاني:
```
https://thakr-abu-fahd.vercel.app
```

---

## التشغيل المحلي (اختياري)
```bash
npm install
cp .env.example .env.local
# عدّل .env.local وحط مفتاح Gemini
npm run dev
```
افتح http://localhost:3000
