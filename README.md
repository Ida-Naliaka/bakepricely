# 🍰 Bakepricely

Bakepricely is a web-based tool designed to simplify the process of pricing baked goods. It allows cake bakers and decorators to calculate the cost of cakes based on various factors, such as ingredients, labor, and overheads and profits.

## Table of Contents

- [🚀 Features](#-features)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [📋 Usage](#-usage)
- [💻 Technologies Used](#-technologies-used)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## 🚀 Features

- **User Authentication**: Secure user registration and login system.
- **Cake Cost Calculation**: Calculate the cost of baked goods based on ingredients, labor, overhead costs and profit.
- **Responsive Design**: A user-friendly, responsive interface for seamless access on various devices.
- **Database**: MongoDB database for efficient data storage and retrieval.
- **Deployment**: Easily deployable to a hosting environment for public access.

## 🏁 Getting Started

### Prerequisites

Before running the Cake Costing Application, ensure you have the following prerequisites installed:

- Node.js and npm: Make sure you have Node.js and npm (Node Package Manager) installed. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Ida-Naliaka/bakepricely.git
   ```

2. Navigate to the project directory:

   ```
   cd bakepriceely
   ```

3. Install the project dependencies:

   ```
   npm install
   ```

4. Configure Environment Variables:

   Create a `.env` file in the project root and set the necessary environment variables according to the .env.example file; including database connection details.

5. Search and replace `https://bakepricely.onrender.com` with `http://localhost:5000`

6. Start the application:

   ```
   npm run dev
   ```

7. Start backend server

   ```
   npm run start-app
   ```

8. Access the application in your web browser at `http://localhost:3000`.

## 📋 Usage

1. **User Registration**: Create an account or log in if you already have one.

2. **Cake Cost Calculation**: Input cake details, including ingredients, labor, overheads and profit to calculate the cake's cost.
3. **Folder System**: Add files to folders

4. **View or edit ingredient details**: navigate to the ingredients section and edit ingredients as desired

5. **Account Management**: Users can view their account details, change passwords or delete their accounts.

## 💻 Technologies Used

- **Frontend**:

  - Next.js: A React framework for building the user interface.
  - HTML/CSS: For structuring and styling the web pages.
  - React Hooks: For managing state and component logic.

- **Backend**:

  - Node.js: JavaScript runtime for server-side development.
  - Express.js: Web application framework for Node.js.
  - MongoDB: NoSQL database for storing user and order data.

- **Authentication**:
  - Passport.js: For user authentication and session management.

## 🤝 Contributing

We welcome contributions to improve Bakepricely. Feel free to open issues, submit pull requests, or suggest new features and enhancements.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 📄 
