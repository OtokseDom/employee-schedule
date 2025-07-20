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

Schedule Calendar
![image](https://github.com/user-attachments/assets/91c306aa-073a-4203-8cd5-bc2b46d6a10c)
Schedule Week View
![image](https://github.com/user-attachments/assets/44817ff9-d192-4abc-a615-5374fbaf2804)
Tasks Datatable
![image](https://github.com/user-attachments/assets/553f50ea-c142-4dd3-b8a7-459b426b683c)
Users Datatable
![image](https://github.com/user-attachments/assets/988a2e51-2362-41ab-9e11-365d9d37b646)
User Profile
![image](https://github.com/user-attachments/assets/388ac989-ef62-4a9e-941f-615c9a56d49a)
