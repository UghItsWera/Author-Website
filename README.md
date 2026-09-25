# ✦ Author Website

A full-stack author website combining **React, ASP.NET Core, PostgreSQL, and a custom admin CMS**.

The site is designed around a **Gothic Fantasy × Romantic Literature × Enchanted Forest** aesthetic, with immersive visuals, responsive layouts, light/dark themes, and subtle animations.

---

## ✧ Features

### Public Website

* Author homepage
* Book collection and individual book pages
* Series organisation
* Release dates, genres and purchase links
* Light & dark themes
* Responsive design
* Animated interactions and transitions

### Admin CMS

* Secure admin authentication
* Create, edit and delete books
* Create, edit and delete series
* Assign books to series or keep them standalone
* Manage book status, release dates, descriptions and images
* Protected admin routes

### Coming Soon

* Bonus chapters & extra content
* Expanded series pages
* Dashboard statistics
* Additional content management features

---

## ✦ Tech Stack

**Frontend**

* React
* Vite
* React Router
* SCSS
* Framer Motion
* JavaScript

**Backend**

* ASP.NET Core 9
* C#
* Entity Framework Core
* ASP.NET Core Identity
* JWT Authentication

**Database**

* PostgreSQL
* Npgsql

---

## ✧ Architecture

```text
AuthorWebsite/
│
├── client/                 # React frontend
│   └── src/
│       ├── admin/
│       ├── auth/
│       ├── layouts/
│       └── pages/
│
├── server/                 # ASP.NET Core API
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Migrations/
│   └── Services/
│
└── README.md
```

The main data relationship is:

```text
Series
  └── Books
       └── Extra Content
```

Books can also exist independently as standalone works.

---

## ✦ Getting Started

### Requirements

* Node.js & npm
* .NET 9 SDK
* PostgreSQL

### Clone

```bash
git clone https://github.com/UghItsWera/author-website.git
cd author-website
```

### Backend

```bash
cd server
dotnet ef database update
dotnet run
```

Create `appsettings.Development.json` with your PostgreSQL connection string and JWT configuration.

> `appsettings.Development.json` is excluded from version control.

### Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

---

## ✧ Current Status

* [x] React frontend
* [x] ASP.NET Core API
* [x] PostgreSQL database
* [x] Authentication & protected routes
* [x] Books CRUD
* [x] Series CRUD
* [x] Book ↔ Series relationships
* [x] Responsive design
* [x] Animations
* [x] Light/dark themes
* [ ] Extra content management
* [ ] Final polish

---

## ✦ About

This project combines my interests in **software engineering, creative writing, games, and visual design** into a single full-stack application.

**Built by Weronika Michalek**
