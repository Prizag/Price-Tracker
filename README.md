# E-commerce Price Tracker

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The **E-commerce Price Tracker** is a web application that allows users to track and compare product prices across multiple e-commerce platforms such as Amazon. The application provides a simple and user-friendly interface for users to search for products, save their favorites, and receive updates on price changes.

## Features

- **User Authentication**: Secure sign-up and login using JsonWebTokens.
- **Product Search**: Search for products from popular e-commerce websites.
- **Web Scraping**: Automatically fetch product details, including prices and images.
- **User Dashboard**: A personalized dashboard for each user to manage their saved products.
- **Add/Delete Products**: Easily add products to your watchlist and remove them as needed.
- **Price Tracking**: Keep track of price changes over time.

## Technologies Used

- **Frontend**:
  - React.js
  - Tailwind CSS and Material UI
  - Firebase SDK
  - Axios

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (via Mongoose)
  - Json Web Tokens
  - Puppeteer (for web scraping)

## Setup Instructions

To get started with the project, follow these steps:

### Prerequisites

Make sure you have the following installed:
- Node.js (>= 14.x)
- npm (Node Package Manager)
- MongoDB (or use MongoDB Atlas)

### Clone the Repository

```bash
git clone https://github.com/05sanjaykumar/Price-Tracker
cd ecommerce-price-tracker
