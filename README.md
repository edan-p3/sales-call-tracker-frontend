# Sales Activity Tracker

A beautiful, modern, and intuitive web application for tracking daily sales activity. Built with React and Tailwind CSS.

## Features

- **Dashboard**: Track daily calls, emails, contacts, and responses.
- **Goal Tracking**: Visual progress bars and celebration when goals are met.
- **Weekly Summary**: View totals against weekly goals.
- **Data Persistence**: Automatically saves data to browser's LocalStorage.
- **Excel Export**: Export all historical data to Excel (.xlsx) for reporting.
- **Team Management**: Support for multiple sales reps (data stored locally per browser).

## Setup Instructions

1.  **Prerequisites**: Ensure you have Node.js installed.
2.  **Installation**:
    ```bash
    cd sales-tracker
    npm install
    ```
3.  **Start the App**:
    ```bash
    npm start
    ```
    The app will open at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/components`: UI components (Dashboard, Settings, ActivityGrid, etc.)
- `src/utils`: Helper functions for storage, calculations, and Excel export.
- `src/App.js`: Main application controller.

## Technologies

- React (Hooks)
- Tailwind CSS
- xlsx (Excel Export)
- date-fns (Date manipulation)

## Design

The application uses a "Midnight Blue", "Sunset Orange", and "Emerald Green" color palette for a professional yet energetic look.
