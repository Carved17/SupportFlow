# SupportFlow
Customer Support Ticketing System

A lightweight full-stack ticketing system built using Node.js, Express, MongoDB, and modern HTML/CSS/JS. Designed for Agile/Scrum-based development, this project includes CI/CD, TDD modules, and SOLID design practices.

This system allows agents to create, manage, resolve, and track customer support tickets in a clean, fast, and responsive interface.

Features

Create, view, update, and resolve support tickets

Modern, responsive dashboard UI

Search, filter, and sort tickets

Priority and status workflow (Open → In Progress → Resolved)

REST API with MongoDB backend

GitHub Actions CI pipeline

Test-Driven Development (TDD) for core modules

SOLID Principles applied in backend structure

Peer review / pair programming process followed per sprint

Agile Engineering Practices Implemented
✓ 1. Test-Driven Development (TDD)

Two backend modules are developed using TDD methodology:

Ticket Model Validation Module

Ticket Status Update Module

TDD Cycle followed:

Write failing test

Write minimal code to pass

Refactor

Commit with TDD tags

Test Framework: Jest (xUnit equivalent for JS).

Test location:

'backend/tests/'


Run tests:

'npm test'

✓ 2. Continuous Integration (CI) — GitHub Actions

A complete CI pipeline is configured at:

.github/workflows/node-ci.yml


Pipeline performs:

Install dependencies

Linting placeholder

Run tests

Health check

Fails on code errors

Runs automatically on:

push to main

pull requests

✓ 3. SOLID Design + Code Review

Backend architecture follows SOLID guidelines:

S (Single Responsibility): Controllers, models, routes separated

O (Open/Closed): Controller logic extendable without modifying existing code

L (Liskov Substitution): Uniform return structures for ticket modules

I (Interface Segregation): Modular route layering

D (Dependency Inversion): Mongoose models injected into controllers

Pair programming and code review enforced once per sprint:

PR templates used

Review checklist prepared

Mandatory 1 approval before merging

Tech Stack
Frontend

HTML, CSS, JavaScript

Responsive card-based UI

Fetch API for backend communication

Backend

Node.js

Express.js

Mongoose ORM

Database

MongoDB

MongoDB Compass (GUI viewer)

DevOps

GitHub Actions CI pipeline



Project Structure
Customer_Support_System/
│
├── backend/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── tests/   ← TDD tests here
│
├── frontend/
│   ├── index.html
│   ├── assets/css/
│   └── assets/js/
│
└── .github/workflows/node-ci.yml

Installation
1. Clone
'git clone <repo-url>'
'cd Customer_Support_System'

2. Backend Setup
'cd backend'
'npm install'

3. Create .env
'PORT=5000'
'MONGO_URI=your_mongodb_connection_string'

4. Start Backend
'npm run dev'

5. Open Frontend

Open:

'frontend/index.html'
