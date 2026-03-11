import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("arch_budget.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    material_type TEXT NOT NULL,
    model TEXT NOT NULL,
    price REAL NOT NULL,
    unit TEXT DEFAULT 'm²',
    supplier TEXT NOT NULL,
    rating REAL DEFAULT 4.5,
    reviews INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    characteristics TEXT,
    base_price_min REAL,
    base_price_max REAL,
    install_price_min REAL,
    install_price_max REAL
  );
`);

// Seed data if empty
const brandCount = db.prepare("SELECT count(*) as count FROM brands").get() as { count: number };
if (brandCount.count === 0) {
  const insertBrand = db.prepare("INSERT INTO brands (name, material_type, model, price, supplier, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertBrand.run("泰拉木业精品", "木地板", "北欧橡木 XL", 720, "泰拉木业", 4.9, 124);
  insertBrand.run("智木解决方案", "木地板", "北欧橡木 XL", 680, "智木科技", 4.7, 88);
  insertBrand.run("圣象地板", "木地板", "强化复合 S1", 280, "圣象集团", 4.8, 1500);
  insertBrand.run("诺贝尔瓷砖", "瓷砖", "大理石纹 800x800", 120, "诺贝尔", 4.6, 2100);
  insertBrand.run("立邦漆", "涂料", "竹炭净味 5合1", 45, "立邦中国", 4.9, 5000);
}

const materialCount = db.prepare("SELECT count(*) as count FROM materials").get() as { count: number };
if (materialCount.count === 0) {
  const insertMaterial = db.prepare("INSERT INTO materials (name, type, characteristics, base_price_min, base_price_max, install_price_min, install_price_max) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertMaterial.run("优质橡木实木复合地板", "木地板", "E0级环保, 4mm耐磨层, 防潮性能, 哑光UV漆", 580, 820, 100, 150);
  insertMaterial.run("大理石纹抛釉砖", "瓷砖", "高硬度, 易清洁, 防滑, 镜面效果", 80, 150, 60, 100);
  insertMaterial.run("乳胶漆墙面", "涂料", "净味环保, 耐擦洗, 遮盖力强", 30, 60, 20, 40);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/brands", (req, res) => {
    const type = req.query.type as string;
    let brands;
    if (type) {
      brands = db.prepare("SELECT * FROM brands WHERE material_type = ?").all(type);
    } else {
      brands = db.prepare("SELECT * FROM brands").all();
    }
    res.json(brands);
  });

  app.get("/api/materials", (req, res) => {
    const materials = db.prepare("SELECT * FROM materials").all();
    res.json(materials);
  });

  app.post("/api/brands", (req, res) => {
    const { name, material_type, model, price, supplier, rating, reviews } = req.body;
    const info = db.prepare("INSERT INTO brands (name, material_type, model, price, supplier, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(name, material_type, model, price, supplier, rating || 4.5, reviews || 0);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
