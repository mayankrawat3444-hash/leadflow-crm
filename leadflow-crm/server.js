require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const Database = require('better-sqlite3');
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const dbFile = path.resolve(process.env.DATABASE_FILE || './data/leadflow.sqlite');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
const db = new Database(dbFile);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS leads (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
 phone TEXT NOT NULL, company TEXT NOT NULL, source TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'New', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_name ON leads(name);`);
const SOURCES = ['Website','Referral','LinkedIn','Cold Call','Event','Other'];
const STATUSES = ['New','Contacted','Qualified','Lost'];
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function validateLead(data = {}) {
 const errors = {};
 for (const key of ['name','email','phone','company','source','status']) {
  if (typeof data[key] !== 'string' || !data[key].trim()) errors[key] = 'This field is required.';
 }
 if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter a valid email address.';
 if (data.phone && !/^[+\d][\d\s().-]{6,19}$/.test(data.phone.trim())) errors.phone = 'Enter a valid phone number.';
 if (data.source && !SOURCES.includes(data.source)) errors.source = 'Choose a valid lead source.';
 if (data.status && !STATUSES.includes(data.status)) errors.status = 'Choose a valid lead status.';
 for (const key of ['name','company']) if (data[key] && data[key].trim().length > 100) errors[key] = 'Keep this under 100 characters.';
 if (data.email && data.email.trim().length > 150) errors.email = 'Email must be under 150 characters.';
 return errors;
}
const clean = d => ({name:d.name.trim(), email:d.email.trim().toLowerCase(), phone:d.phone.trim(), company:d.company.trim(), source:d.source, status:d.status});
app.get('/api/health', (req,res) => res.json({status:'ok'}));
app.get('/api/leads', (req,res) => {
 const search = String(req.query.search || '').trim(); const status = String(req.query.status || '').trim();
 const where = []; const params = {};
 if (search) { where.push('(name LIKE @search OR company LIKE @search OR email LIKE @search)'); params.search = `%${search}%`; }
 if (STATUSES.includes(status)) { where.push('status=@status'); params.status = status; }
 const order = req.query.sort === 'oldest' ? 'created_at ASC' : 'created_at DESC';
 const leads = db.prepare(`SELECT * FROM leads ${where.length ? 'WHERE '+where.join(' AND ') : ''} ORDER BY ${order}, id DESC`).all(params);
 res.json({leads,total:leads.length});
});
app.get('/api/leads/:id', (req,res) => {
 const lead = db.prepare('SELECT * FROM leads WHERE id=?').get(Number(req.params.id));
 if (!lead) return res.status(404).json({message:'We could not find that lead.'});
 res.json({lead});
});
app.post('/api/leads', (req,res) => {
 const errors = validateLead(req.body); if (Object.keys(errors).length) return res.status(400).json({message:'Please check the highlighted fields.',errors});
 const result = db.prepare('INSERT INTO leads (name,email,phone,company,source,status) VALUES (@name,@email,@phone,@company,@source,@status)').run(clean(req.body));
 res.status(201).json({message:'Lead added successfully.',lead:db.prepare('SELECT * FROM leads WHERE id=?').get(result.lastInsertRowid)});
});
app.put('/api/leads/:id', (req,res) => {
 const id = Number(req.params.id); if (!db.prepare('SELECT id FROM leads WHERE id=?').get(id)) return res.status(404).json({message:'We could not find that lead.'});
 const errors = validateLead(req.body); if (Object.keys(errors).length) return res.status(400).json({message:'Please check the highlighted fields.',errors});
 db.prepare(`UPDATE leads SET name=@name,email=@email,phone=@phone,company=@company,source=@source,status=@status,updated_at=CURRENT_TIMESTAMP WHERE id=@id`).run({...clean(req.body),id});
 res.json({message:'Lead details updated.',lead:db.prepare('SELECT * FROM leads WHERE id=?').get(id)});
});
app.delete('/api/leads/:id', (req,res) => {
 const result = db.prepare('DELETE FROM leads WHERE id=?').run(Number(req.params.id));
 if (!result.changes) return res.status(404).json({message:'This lead may already have been removed.'});
 res.json({message:'Lead deleted.'});
});
app.get('/api/dashboard', (req,res) => {
 const counts = Object.fromEntries(STATUSES.map(s => [s,0]));
 db.prepare('SELECT status, COUNT(*) AS count FROM leads GROUP BY status').all().forEach(r => counts[r.status] = r.count);
 res.json({total:Object.values(counts).reduce((a,b)=>a+b,0),counts});
});
if (require.main === module) app.listen(PORT, () => console.log(`LeadFlow CRM running at http://localhost:${PORT}`));
module.exports = {app,db,validateLead,SOURCES,STATUSES};
