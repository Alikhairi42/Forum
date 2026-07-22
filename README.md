```markdown
# Forum Backend (Node.js + Express + Prisma + MySQL)

## 📌 Khlassa dyal chno drna (Day 1)
Bninna l'asass dyal l'projet b l'architecture MVC w rbetna Node.js m3a MySQL b l'ORM "Prisma".

### 1. Initalisation dyal l'projet:
```bash
mkdir forum-backend
cd forum-backend
npm init -y
npm install express dotenv bcryptjs jsonwebtoken cors
npm install prisma@5 --save-dev
npm install nodemon --save-dev
```

### 2. Architecture MVC (Folders):
*   `controllers/` -> Fih l'logique dyal l'application (Functions).
*   `routes/` -> Fih les URLs dyal l'API (ex: `/api/auth`).
*   `models/` -> (3awdnaha b `prisma/schema.prisma`).
*   `middleware/` -> L'7imaya w security (JWT).

### 3. Setup dyal Prisma (ORM):
```bash
# Bash n-creyiw dossier prisma w .env
npx prisma init
```

### 4. Configuration:
*   **Fichier `.env`:** Fih password w saret dyal DB.
```env
DATABASE_URL="mysql://root:1234@localhost:3306/forum_db"
PORT=5000
```
*   **Fichier `prisma/schema.prisma`:** Fih ga3 les tables (User, Post, Comment, React) b syntax ssaahel blast SQL.

### 5. L'7al dyal Mochkil MySQL f Ubuntu (Access Denied):
Ila Node.js bgha ydkhol l MySQL f Ubuntu w 3tak error, dir hadchi f MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;
```

### 6. Création dyal les tables f Database (Migration):
Mli katsali ktabet `schema.prisma`, katsift code l MySQL b had l'commande:
```bash
npx prisma migrate dev --name init


npx prisma migrate dev