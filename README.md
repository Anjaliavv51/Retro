<div align="center">

# 🕰️ RETRO
### *Timeless Vintage Collections & AI-Powered Retro Discovery*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-retro--vintage--two.vercel.app-7a1d2e?style=for-the-badge&logo=vercel&logoColor=white)](https://retro-vintage-two.vercel.app)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://retro-vintage-two.vercel.app)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE.txt)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

<table align="center">
    <thead align="center">
        <tr>
            <th>⭐ Stars</th>
            <th>🍴 Forks</th>
            <th>🐛 Issues</th>
            <th>🟢 Open PRs</th>
            <th>🟣 Closed PRs</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/Anjaliavv51/Retro?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/Anjaliavv51/Retro?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/Anjaliavv51/Retro?style=flat&logo=github"/></td>
            <td><img alt="Open Pull Requests" src="https://img.shields.io/github/issues-pr/Anjaliavv51/Retro?style=flat&logo=github"/></td>
            <td><img alt="Closed Pull Requests" src="https://img.shields.io/github/issues-pr-closed/Anjaliavv51/Retro?style=flat&color=critical&logo=github"/></td>
        </tr>
    </tbody>
</table>

</div>

---

## 🌐 Live Website & Demo

Experience the full platform live at:
👉 **[https://retro-vintage-two.vercel.app](https://retro-vintage-two.vercel.app)**

---

## 📖 Table of Contents

- [About Retro](#-about-retro)
- [✨ Key Features](#-key-features)
- [🧠 Retrieval-Augmented Generation (RAG) Search](#-retrieval-augmented-generation-rag-search)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start & Installation](#-quick-start--installation)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Run Frontend & Express Server](#2-run-frontend--express-server)
  - [3. Run Python RAG Search Engine](#3-run-python-rag-search-engine)
  - [4. Run Backend with MongoDB (Optional Auth)](#4-run-backend-with-mongodb-optional-auth)
- [☁️ Vercel Deployment & CI/CD](#️-vercel-deployment--cicd)
- [📂 Project Structure](#-project-structure)
- [🌟 Featured In](#-featured-in)
- [🤝 Contributing](#-contributing)
- [📜 Code of Conduct](#-code-of-conduct)
- [📄 License](#-license)

---

## 📜 About Retro

**Retro** is an e-commerce and curated catalog platform designed for lovers of antique aesthetics, vintage electronics, analog audio, historical typewriters, and timeless collectibles. 

Blending nostalgic charm from bygone eras with modern engineering, Retro brings you:
- An atmospheric, responsive vintage storefront with dark mode, animations, and interactive shopping cart.
- A **Retrieval-Augmented Generation (RAG)-based AI product search system** that understands natural language queries, historical eras, acoustic qualities, and aesthetic moods.
- Automated serverless deployment and continuous delivery on **Vercel** with **GitHub Actions**.

---

## ✨ Key Features

- **🧠 Natural Language AI Search (RAG)**: Search products using human-like queries (e.g., *"warm sound system for jazz records"*, *"gift for an old-school writer"*).
- **📻 Rich Vintage Catalog**: High-fidelity records, phonographs, 1950s rangefinder cameras, mechanical typewriters, rotary phones, and collectibles.
- **🛒 Dynamic Cart System**: Local storage persistence, live item counters, quantity management, and toast notifications.
- **🌓 Dark Mode & Nostalgic Themes**: Seamless toggle between warm vintage parchment and elegant dark mode.
- **⚡ Vercel Serverless Architecture**: Fast global CDN distribution, edge API routing, and continuous deployment.
- **📱 Progressive Web App (PWA) Ready**: Includes service workers and manifest configuration for offline-first resilience.

---

## 🧠 Retrieval-Augmented Generation (RAG) Search

Retro features an integrated **RAG-powered product recommendation & search system**. Rather than relying only on rigid keyword lookups, it interprets intent, historical period, and aesthetic tone to retrieve and explain matching artifacts.

```
┌─────────────────────────────────┐
│     User Natural Language Query │  e.g. "gift for an author who loves mechanical typewriters"
└────────────────┬────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  1. Intent Extraction & Query Parsing                  │
│     - Detected Era: 1940s-1960s                        │
│     - Detected Category: Writing & Office              │
│     - Mood/Tone: Tactile Mechanical, Author Gift       │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  2. Hybrid Semantic Retrieval (Dense + Lexical)        │
│     - TF-IDF Vector Cosine Similarity (scikit-learn)   │
│     - BM25-style Lexical N-Gram Matching               │
│     - Intent & Quality Score Reranking                 │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  3. Context Augmentation                               │
│     - Assembles top-k candidates with metadata & tags  │
│     - Computes calibrated relevance match % (55%-99%)  │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  4. Generative AI Curation Synthesis                   │
│     - Synthesizes personalized Curator Note            │
│     - Generates "Why this matches" rationales          │
│     - Provides Vintage Styling & Pairing Advice        │
│     - Generates related exploration query prompts      │
└────────────────────────────────────────────────────────┘
```

### RAG API Endpoints:
- `GET /api/search/rag?q=warm+vinyl+sound`
- `POST /api/search/rag` with JSON `{ "query": "1950s street photography camera", "limit": 4 }`
- Also aliased to `/api/rag-search` for Vercel serverless functions.

### Example Response:
```json
{
  "success": true,
  "query": "vintage mechanical typewriter for author",
  "intent": { "detected_era": "1940s", "detected_category": "Writing & Office" },
  "curator_response": {
    "summary": "To inspire your literary journey, our curation pairs historical distraction-free writing instruments...",
    "styling_tip": "Complement your typewriter with heavy cotton stationery, a brass lamp, and a leather notebook."
  },
  "recommendations": [
    {
      "id": "prod-3",
      "title": "Retro Mechanical Typewriter",
      "era": "1940s",
      "price": "$220.00",
      "relevance_percentage": 80,
      "match_reason": "Authentic 1940s design (Featured). Ideal for creative writing with Film Noir Detective charm."
    }
  ]
}
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+), Bootstrap 5, FontAwesome 6, AOS Animations |
| **AI & RAG Engine** | Python 3.10+, scikit-learn (TF-IDF Vectorizer & Cosine Similarity), NumPy, Pandas |
| **Node.js Engines** | Express.js, Node.js Hybrid Vector & Lexical Matcher (`server/ragSearchEngine.js`, `api/ragSearchEngine.cjs`) |
| **Backend & APIs** | Express.js, Node.js, Vercel Serverless Functions (`api/`), MongoDB Atlas (User Auth) |
| **Hosting & CI/CD** | Vercel Global Edge Network, GitHub Actions (`.github/workflows/vercel-deploy.yml`) |

---

## 🚀 Quick Start & Installation

### 1. Clone Repository
```bash
git clone https://github.com/Anjaliavv51/Retro.git
cd Retro
```

### 2. Run Frontend & Express Server
The project includes a built-in Express server that serves both the static frontend and the live RAG search API:

```bash
# Install dependencies
npm install

# Start the server
npm start
```
Open **`http://localhost:3000`** in your browser. Click **"AI Search"** in the navigation bar to test the RAG search system.

---

### 3. Run Python RAG Search Engine
You can test the RAG pipeline directly from the command line:

```bash
# Optional: set up python virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate # On macOS/Linux

# Install python requirements
pip install -r requirements.txt

# Run natural language query search
python python/rag_search.py "warm vinyl sound for jazz evenings"

# Output as JSON
python python/rag_search.py "gift for an old-school author" --json
```

---

### 4. Run Backend with MongoDB (Optional Auth)
If you wish to test user authentication and session management:

```bash
cd backend
npm install
```
Create a `backend/.env` file:
```env
PORT=5000
MONGODB_URL=your_mongodb_atlas_connection_string
SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```
Start the auth service:
```bash
npm start
```

---

## ☁️ Vercel Deployment & CI/CD

Retro is deployed to Vercel at **[https://retro-vintage-two.vercel.app](https://retro-vintage-two.vercel.app)**.

### Continuous Deployment on Every `git push`:
1. **GitHub <-> Vercel Integration (Recommended)**:
   - Navigate to [Vercel Project Settings > Git](https://vercel.com/anjalis-projects-a85deedf/retro-vintage/settings/git).
   - Link the repository `Anjaliavv51/Retro` to the project.
   - Every push to `main` will automatically build and deploy the latest version.

2. **GitHub Actions Workflow**:
   - The repository includes [`.github/workflows/vercel-deploy.yml`](.github/workflows/vercel-deploy.yml).
   - To trigger deployments from GitHub Actions, add your `VERCEL_TOKEN` in your GitHub repository secrets (**Settings > Secrets and variables > Actions**).

3. **Deploy Manually from Terminal**:
   ```bash
   npx vercel --prod
   ```

---

## 📂 Project Structure

```
Retro/
├── api/                             # Vercel Serverless API Functions
│   ├── index.js                     # Dynamic serverless API router
│   ├── rag-search.js                # Dedicated RAG search endpoint
│   ├── ragSearchEngine.cjs          # High-performance CommonJS hybrid RAG engine
│   ├── products.js                  # Product catalog endpoint
│   ├── contact.js                   # Contact inquiries handler
│   ├── newsletter.js                # Newsletter subscriptions
│   └── reviews.js                   # Dynamic customer reviews
├── css/                             # Stylesheets
│   ├── rag-search.css               # AI RAG modal & card aesthetics
│   ├── dark-mode.css                # Dark mode styling tokens
│   ├── navbarstyles.css             # Responsive navigation bar
│   ├── popup.css                    # Promotional popup styles
│   └── style.css                    # Global typography & layout
├── js/                              # Frontend JavaScript
│   ├── rag-search.js                # RAG modal manager, natural language handler & cart sync
│   ├── cart.js                      # Shopping cart manager & persistence
│   ├── dark-mode.js                 # Theme toggler
│   ├── menu.js                      # Product interactions & wishlist
│   └── popup.js                     # Newsletter modal trigger
├── html/                            # Web Pages
│   ├── menu.html                    # Vintage Collections & Catalog
│   ├── cart.html                    # Shopping Cart & Checkout
│   ├── about.html                   # About Retro & Heritage
│   ├── contact.html                 # Inquiry Form
│   ├── services.html                # Services & Delivery Info
│   ├── blog.html                    # Retro Stories & Articles
│   └── wishlist.html                # Saved Wishlist Items
├── python/                          # Python AI & Recommendation Services
│   ├── rag_search.py                # Retrieval-Augmented Generation core engine
│   ├── vintage_products.json        # Annotated semantic product knowledge base
│   ├── recommendation.py            # Collaborative filtering + RAG integration
│   ├── content_based_filtering.py   # TF-IDF item recommendations
│   └── requirements.txt             # Python ML dependencies
├── server/                          # Local Node.js Express Server
│   ├── server.js                    # Dev server with RAG endpoints
│   └── ragSearchEngine.js           # ES Module RAG engine
├── .github/
│   └── workflows/
│       └── vercel-deploy.yml        # Continuous deployment workflow
├── index.html                       # Homepage & Hero Showcase
├── vercel.json                      # Vercel routing & edge configuration
└── package.json                     # Node.js project configuration
```

---

## 🌟 Featured In

<table>
   <tr>
      <th>Event Logo</th>
      <th>Event Name</th>
      <th>Event Description</th>
   </tr>
   <tr>
      <td><img src="https://github.com/multiverseweb/Dataverse/blob/main/Documentation/images/SWOC.jpg" width="180" alt="SWOC"/></td>
      <td><a href="https://www.socialwinterofcode.com/">Social Winter of Code Season-5 (SWOC)</a></td>
      <td>A 2-month open-source program introducing developers to production-grade collaborative projects.</td>
   </tr>
   <tr>
      <td><img src="image/gssoc24.png" width="180" alt="GSSoC 24"/></td>
      <td>GirlScript Summer of Code 2024</td>
      <td>A 3-month open-source program fostering beginner and intermediate developer contributions.</td>
   </tr>
   <tr>
      <td><img src="image/hacktoberfest.png" width="180" alt="Hacktoberfest 2024"/></td>
      <td>Hacktoberfest 2024</td>
      <td>Worldwide month-long celebration of open-source software presented by DigitalOcean and partners.</td>
   </tr>
</table>

---

## 🤝 Contributing

We welcome community contributions! Please read our [Contributing Guidelines](Contributing.md) before submitting pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Our Contributors

<div align="center">
  <a href="https://github.com/Anjaliavv51/Retro/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=Anjaliavv51/Retro" alt="Contributors" />
  </a>
</div>

---

## 📜 Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure an inclusive, harassment-free environment for everyone.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE.txt`](LICENSE.txt) for more information.

<div align="center">
  <a href="#top"><b>▲ Back to Top</b></a>
</div>
