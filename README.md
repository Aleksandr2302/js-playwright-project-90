# Task Manager Automation Project
### Purpose
Automate testing of a React-Admin task management app using Playwright, ensuring key features work correctly.

### Description

Task Manager lets users create tasks, assign performers, change statuses, and manage users, labels, and task statuses.
Tests cover creating, editing, deleting, and moving tasks, as well as user authentication and management.

### Tools & Technologies

- **Playwright** – for end-to-end UI testing  
- **JavaScript** – language used for writing tests  
- **React-Admin** – framework used for building the application  
- **Node.js / npm** – project management and dependency management  


### Test Coverage

- User authentication (login/logout)  
- Creating, editing, deleting tasks  
- Moving tasks between Kanban columns  
- Creating and editing users  
- Creating and editing labels and task statuses  



## Project Structure
```
├── .github/ 
├── fixtures/
│ ├── csvFiles/
│ ├── labels.js
│ ├── tasks.js
│ ├── tasksStatuses.js
│ ├── user.js
├── node_modules/ 
├── pages/
│ ├── labelsPage.js
│ ├── tasksPage.js
│ ├── tasksStatusesPage.js
│ ├── userPage.js
│ ├── loginPage.js
│ ├── logoutPage.js
├── playwright-report/
├── public/
├── scr/
├── test-results/
├── tests/
│ ├── e2e/ 
│ │ ├── auth.spec.js
│ │ ├── labels.spec.js
│ │ ├── tasks.spec.js
│ │ └── taskStatuses.spec.js
│ │ └── user.spec.js
├── .gitignore 
├── .eslint.config.js
├── playwright.config.js 
├── package.json
├── README.md
├── index.html
└── package-lock.json
```

## How to Run Tests

1. Install dependencies:
```
npm install
```

2. Run all tests:
```
npx playwright test
```

3. Generate test report:
```
npx playwright show-report
```

4. Run tests in a specific folder (optional):
```
npx playwright test tests/e2e/
```