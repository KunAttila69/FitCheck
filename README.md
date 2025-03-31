# FitCheck - ReadMe

## Bevezetés
A FitCheck egy közösségi platform, amely lehetővé teszi a felhasználók számára, hogy megosszák öltözködési stílusukat és inspirációt merítsenek mások posztjaiból. A rendszer három fő komponensből áll:
- **Backend (ASP.NET Core)** - Az API és az üzleti logika kezelése.
- **Frontend (React)** - A felhasználói felület.
- **Admin felület (WPF)** - Moderációs és adminisztrációs funkciók.

---
## 1. Repository szerkezete
```
📁 FitCheck-Repo/
 ├── 📁 backend/               # ASP.NET Core Backend
 ├── 📁 frontend/              # React Frontend
 ├── 📁 desktop-app/           # WPF Admin alkalmazás
 ├── 📁 database/              # Adatbázis fájlok és migrációk
 ├── 📄 README.md              # Dokumentáció
```
---
## 2. Backend telepítése és futtatása
### **Navigáljunk a backend könyvtárba:**
```sh
cd backend
```
### **Szükséges csomagok telepítése:**
```sh
dotnet restore
```
### **A szerver első indításakor automatikusan létrejön egy alapértelmezett admin fiók:**
- **Felhasználónév:** `admin`
- **Jelszó:** `Admin@123`

Ezek az adatok módosíthatók a `program.cs` fájlban vagy az adatbázis manuális szerkesztésével.

### **Backend indítása fejlesztői módban:**
```sh
dotnet run
```
A backend alapértelmezetten a `https://localhost:5001` és `http://localhost:5000` címen érhető el.

---
## 3. Frontend (React) telepítése és futtatása
### **Navigáljunk a frontend könyvtárba:**
```sh
cd frontend
```
### **Csomagok telepítése:**
```sh
npm install
```
### **Fejlesztői szerver indítása:**
```sh
npm start
```
Az alkalmazás elérhető lesz a böngészőben: [http://localhost:5173](http://localhost:5173)

### **Backend API beállítása**
Ha az API végpont eltér az alapértelmezettől, frissítsük a `BASE_URL` változót az `interceptor.ts` fájlban:
```js
export const BASE_URL = "https://localhost:{Port, amin a backend fut}";
```

---
## 4. WPF Admin Felület telepítése és futtatása
### **Navigáljunk a WPF alkalmazás könyvtárába:**
```sh
cd desktop-app
```
### **Fordítás és futtatás:**
```sh
dotnet build
dotnet run
```
### **Telepítőcsomag létrehozása:**
```sh
dotnet publish -c Release -r win-x64 --self-contained false -o ./publish
```
Ezután a `publish` könyvtárban található `.exe` fájl futtatható.

---
## 5. Hibakeresés és karbantartás

### **Backend problémák**
- Ha a backend nem indul el, ellenőrizzük az adatbáziskapcsolatot az `appsettings.json` fájlban.
- Ha a buildelés során hiba lépett fel az adatbázissal kapcsolatban:
  I. Töröljük az adatbázis fájlt és a migrációs fájlokat.
  II. Futtassuk újra:
     ```sh
     dotnet build
     ```
  III. Figyelem: Ez töröl minden elmentett adatot!

### **Frontend problémák**
- Ha a frontend nem találja a backend API-t, ellenőrizzük a `BASE_URL` változót az `interceptor.ts` fájlban.
- Függőségi problémák esetén:
  ```sh
  npm install
  ```

### **WPF Admin alkalmazás problémák**
- Ha nem kapcsolódik az API-hoz, ellenőrizzük az API végpont beállítását a forráskódban.

### **Egyéb hibák**
- **Portfoglalás:** Ellenőrizzük, hogy nincs-e másik szolgáltatás futtatva az adott portokon.
- **Függőségi hibák:** Futtassuk újra a telepítést:
  ```sh
  dotnet restore
  npm install
  
