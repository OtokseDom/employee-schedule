# 📅 Organization-based Task Management WebApp 📊

### **A Project for managing user tasks and generate reports**

**✨ Current Features:**

-   Mobile Responsive | Modern Design | Dark Mode
-   Login and Registration with approval (if joining existing organization)
-   CRUD for all data
-   Dashboard and User specific reports
-   Calendar View and Week View of tasks per user
-   Report Filters

**🤩 Upcoming Features:**

-   Data export
-   Role Based Control

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

Dashboard
<img width="1919" height="882" alt="image" src="https://github.com/user-attachments/assets/32a2cd83-53f0-47ea-b2a8-9c285b46c1ea" />
<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/96a73441-9640-47c8-89a1-9bc3655a2b3b" />
Calendar (month view)
<img width="1919" height="875" alt="image" src="https://github.com/user-attachments/assets/fc165e3e-624b-4e2f-9098-38d95fcfdbd1" />
Calendar (week view)
<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/f8bfa2ba-b567-4131-988d-38a671f530ea" />
User Profile
<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/a715d63f-9292-4020-9be6-127ee4b66b24" />

