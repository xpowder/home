# 🏠 Homezup Frontend

This README explains how to set up and run the **Homezup** frontend project.

---

## Prerequisites

Make sure you have installed:

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Git**

Check installations:

```bash
node -v
npm -v
git --version
```

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd homezup
```

> Replace `<repository-url>` with the actual Git URL.

---

## 2. Install Dependencies

Use the lock file to install exact versions:

```bash
npm i --legacy-peer-deps
```

> If you already have `node_modules` but face errors, run:

```bash
rm -rf node_modules
npm i --legacy-peer-deps
```

---

## 3. Run the Development Server

```bash
npm run dev
```

- Opens the project at [http://localhost:3000](http://localhost:3000)
- Hot reload is enabled, so changes refresh automatically.

---

## 4. Run in Production (Optional)

```bash
npm run build
npm run start
```

- Serves an optimized production build locally.

---

## 5. Handling @next/font Warning

If you see:

```
⚠ Your project has `@next/font` installed...
```

Run:

```bash
npx @next/codemod@latest built-in-next-font .
npm uninstall @next/font
```

---

## 6. Notes

- Always pull the latest changes:

```bash
git pull origin dev
```

- Use Next.js documentation for guidance: [Next.js Docs](https://nextjs.org/docs)
