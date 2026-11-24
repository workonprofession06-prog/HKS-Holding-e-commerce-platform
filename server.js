// HKS Holding — static site + small JSON API (orders, contact, newsletter, tracking)
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "data");
fs.mkdirSync(DATA, { recursive: true });

const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8")); } catch { return []; } };
const write = (f, v) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(v, null, 2));
const clean = (v, n = 500) => String(v ?? "").slice(0, n);

app.use(express.json({ limit: "200kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/orders", (req, res) => {
  const o = req.body || {};
  if (!/^HKS-\d{5,10}$/.test(o.id || "") || !Array.isArray(o.items) || !o.items.length)
    return res.status(400).json({ error: "Invalid order" });
  const list = read("orders.json").filter((x) => x.id !== o.id);
  list.push({ ...o, receivedAt: new Date().toISOString() });
  write("orders.json", list);
  res.status(201).json({ ok: true, id: o.id });
});

app.get("/api/orders/:id", (req, res) => {
  const o = read("orders.json").find((x) => x.id === req.params.id.toUpperCase());
  o ? res.json(o) : res.status(404).json({ error: "Not found" });
});

app.post("/api/contact", (req, res) => {
  const { name, email, msg } = req.body || {};
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email || "") || clean(msg).length < 10)
    return res.status(400).json({ error: "Invalid message" });
  const list = read("messages.json");
  list.push({ id: "MSG-" + Date.now().toString().slice(-6), name: clean(name, 100), email: clean(email, 120), msg: clean(msg, 2000), date: new Date().toISOString() });
  write("messages.json", list);
  res.status(201).json({ ok: true });
});

app.post("/api/newsletter", (req, res) => {
  const email = clean(req.body && req.body.email, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: "Invalid email" });
  const list = read("newsletter.json");
  if (!list.includes(email)) { list.push(email); write("newsletter.json", list); }
  res.status(201).json({ ok: true });
});

app.listen(PORT, () => console.log(`HKS Holding running on http://localhost:${PORT}`));
