
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp"
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("فرمت تصویر معتبر نیست."));
    }

    cb(null, true);
  }
});

// رمز خصوصی سایت
if (process.env.SITE_PASSWORD) {
  app.use((req, res, next) => {
    if (req.path === "/health") return next();

    const auth = req.headers.authorization || "";
    const encoded = auth.startsWith("Basic ")
      ? auth.slice(6)
      : "";

    let password = "";

    try {
      password = Buffer.from(encoded, "base64")
        .toString("utf8")
        .split(":")
        .slice(1)
        .join(":");
    } catch {}

    if (password !== process.env.SITE_PASSWORD) {
      res.set(
        "WWW-Authenticate",
        'Basic realm="TradeitX Private"'
      );

      return res.status(401).send(
        "رمز ورود TradeitX را وارد کنید."
      );
    }

    next();
  });
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "TradeitX" });
});

app.post(
  "/api/analyze",
  upload.single("chart"),
  async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          error: "کلید OpenAI تنظیم نشده است."
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "تصویر نمودار انتخاب نشده است."
        });
      }

      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const imageUrl =
        `data:${req.file.mimetype};base64,` +
        req.file.buffer.toString("base64");

      const timeframe =
        (req.body.timeframe || "نامشخص").slice(0, 30);

      const notes =
        (req.body.notes || "").slice(0, 1500);

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",

        input: [{
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
تو تحلیلگر تکنیکال آموزشی XAUUSD هستی.

تایم‌فریم: ${timeframe}
توضیحات کاربر: ${notes}

تصویر نمودار را بررسی کن و به فارسی پاسخ بده:

۱. روند کلی بازار
۲. حمایت و مقاومت‌های قابل مشاهده
۳. سناریوی صعودی
۴. سناریوی نزولی
۵. نشانه‌های تأیید یا ابطال سناریوها
۶. هشدار مدیریت ریسک

اگر تصویر واضح نیست، اعلام کن.
قیمت یا اطلاعات خارج از تصویر را جعل نکن.
سیگنال قطعی یا تضمین سود نده.
این تحلیل توصیه مالی نیست.
هیچ معامله‌ای اجرا نکن.
`
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high"
            }
          ]
        }]
      });

      res.json({
        analysis: response.output_text ||
          "تحلیلی دریافت نشد."
      });

    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        error: "خطا در تحلیل تصویر. تنظیمات API را بررسی کنید."
      });
    }
  }
);

app.use((err, req, res, next) => {
  res.status(400).json({
    error: err.message || "درخواست نامعتبر است."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TradeitX running on port ${PORT}`);
});
