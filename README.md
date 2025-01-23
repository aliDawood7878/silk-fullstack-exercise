# Silk Fullstack Exercise

## Overview

This project is a **Fullstack** application that shows off security findings data in a nice dashboard layout. We have got:

- **Backend**: Node, TypeScript, Express, and SQLite for serving raw/grouped findings.  
- **Frontend**: React, TypeScript, Axios, and Recharts for interactive visuals.

We load both raw and grouped security findings from a local database, display them in fancy tables, and let you **expand** grouped rows to reveal their raw details. Top it off with **pie** and **bar** charts for a colorful severity breakdown.

## Tech Stack & Tools

1. **Node.js + TypeScript**: Our server powerhouse.
2. **Express**: The friendly framework for handling routes.
3. **SQLite** (`sqlite3` + `sqlite`): Local DB storing `raw_findings` and `grouped_findings`.
4. **React + TS**: For a smooth, type-safe frontend.
5. **Axios**: Easy HTTP requests to fetch data from our backend.
6. **Recharts**: Because visuals are everything (hello, pie + bar charts!).

## Features

1. **Dashboard Layout**  
   - Clearly separated sections for grouped vs. raw data.

2. **Expandable Table**  
   - Click a grouped row → see its raw findings. Gotta love that instant detail.

3. **Pie & Bar Charts**  
   - Visual severity distribution for both grouped and raw data.

4. **Simple Setup**  
   - Just clone, install, run—and you’re good to go.

## Installation & Running

1. **Clone the Repo**:
   ```bash
   git clone 
   cd silk-fullstack-exercise

2. **Backend Server Start**
cd backend
npm install
npm run build
npm start

3. **Frontend Start**

cd ../frontend
npm install
npm run dev
