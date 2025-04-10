# 📅 Employee Schedule with Task Management and Reports (WIP) 📊

### **A simple Laravel-React Project for listing employee schedules in a Calendar layout.**

**✨ Current Features:**
-   Mobile Responsive
-   Modern Design
-   Registration and Login
-   CRUD for all data
-   Dark Mode
-   Master Data Management
-   User specific reports


**🤩 Upcoming Features:**
- Employees reports and leaderboards (dashboard)
- Data export
- Rules and Permissions
- More


# ⭐ How to install

## Requirements

-   Code editor (I use VS Code)
-   Latest PHP and APACHE web server (I use XAMPP)
-   Latest Node.JS
-   Latest Composer

## Steps

-   Clone this repository to your local device
-   Install requirements listed above
-   Add php directory to environment PATH
-   Open code editor and open this repository folder
-   Start Apache and MySQL in XAMPP

### Backend Setup

-   Navigate to backend directory
    > cd backend
-   Install PHP dependencies
    > composer install
-   Create the environment file
    > cp .env.example .env
-   Configure .env file to these values
    > DB_CONNECTION=mysql <br>
    > DB_HOST=127.0.0.1 <br>
    > DB_PORT=3306 <br>
    > DB_DATABASE=employee-schedule <br>
    > DB_USERNAME=root <br>
    > DB_PASSWORD= <br>
-   Generate app key
    > php artisan key:generate
-   Run migration and seeder (my custom command)
    > php artisan g <br>
    > y
-   Start Laravel server
    > php artisan serve

### Frontend Setup

-   Navigate to frontend directory in new terminal
    > cd frontend
-   Install node dependencies
    > npm install
-   Start Vite
    > npm run dev

_If problems arise, resolve them yourself_ 😝

### Open the app in your browser

-   http://localhost:3000
-   Use this credential to login
    > email: admin@demo.com <br>
    > password: admin123
