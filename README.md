#Delta-V — Race-Day Nutrition Planner

https://delta-v-nutrition.vercel.app/

**Same physics. Different finish line.**

Delta-V is a science-based nutrition planner for ultra-trail runners. Enter your athlete profile and race details, and get a fully personalized fueling strategy in seconds.

## 🎯 Features

- **Personalized plans** — hydration, carbs, sodium and caffeine computed for your exact race
- **Live weather** — Open-Meteo API auto-adjusts targets by temperature (graceful offline fallback)
- **Data visualization** — Recharts mini-charts for every metric
- **Brand recommendations** — Maurten, SiS, Tailwind, Naak, Liquid IV, Nuun, GU
- **Strategy comparison** — Conservative vs Balanced vs Aggressive, side by side
- **Social sharing** — export a shareable card, post to X / Instagram
- **PDF preview & export** — review, then download a clean one-page race plan
- **ISSN science-backed** — industry-standard calculation methodology

## 💻 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + glassmorphism |
| Charts | Recharts |
| PDF / image export | jsPDF + html2canvas |
| Weather | Open-Meteo API (free, no key) |
| Build / Deploy | Vite + Vercel |

## 📦 Local Setup

```bash
git clone https://github.com/grospierre/delta-v-nutrition.git
cd delta-v-nutrition
npm install
npm run dev
# → http://localhost:5173
```

## 🏃 How It Works

1. Enter athlete profile (weight, age, VO2 max, experience)
2. Enter race details (distance, elevation, duration, location)
3. Generate — live weather is fetched and the plan is computed
4. Explore brands, compare three strategies, share a card
5. Preview and download your race-day PDF

## 📊 Methodology

- **Hydration**: 8 ml/kg/h × temperature coeff × intensity coeff, clamped 400–900 ml/h
- **Carbs**: 0.6 g/kg/h × intensity × experience, capped at 90 g/h (ISSN)
- **Sodium**: 400 mg/h × temperature × experience, clamped 300–1200 mg/h
- **Caffeine**: 100 mg (< 8h) or 200 mg (≥ 8h)
- **Glucose/Fructose**: 100/0 below 60 g/h, 80/20 above (dual-transporter)

## 📄 License

MIT — see [LICENSE](./LICENSE)

## 👨‍💻 Author

**Pierre Gros** — GEM Master in Management, Finance track (Class of 2028)
[LinkedIn](https://linkedin.com/in/grospierre) · [GitHub](https://github.com/grospierre)

> Portfolio project bridging endurance-sports domain expertise with modern full-stack engineering.
