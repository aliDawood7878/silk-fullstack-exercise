"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
// Open the DB
function openDb() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sqlite_1.open)({
            filename: './src/data/findings.db', // or correct path if different
            driver: sqlite3_1.default.Database
        });
    });
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
// Health route
app.get('/api/health', (req, res) => {
    res.send({ status: 'Server is healthy' });
});
// Return all rows from raw_findings
app.get('/api/findings/raw', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield openDb();
        const rawRows = yield db.all('SELECT * FROM raw_findings');
        res.send(rawRows);
    }
    catch (error) {
        res.status(500).send('Error fetching raw findings');
    }
}));
// Return all rows from grouped_findings
app.get('/api/findings/grouped', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield openDb();
        const groupedRows = yield db.all('SELECT * FROM grouped_findings');
        res.send(groupedRows);
    }
    catch (error) {
        res.status(500).send('Error fetching grouped findings');
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
