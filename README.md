# Timely Frontend

## Overview

Timely Frontend is a React-based web application designed to interact with the Timely Backend. It provides a user-friendly interface for managing employee attendance, projects, teams, and leave requests. The application leverages modern web technologies to deliver a responsive and intuitive user experience.

## Deployment

The frontend is deployed at [https://hr-app-frontend-test.up.railway.app/](https://hr-app-frontend-test.up.railway.app/). This is where you can interact with the live application.

## Key Features

- **Dashboard**: Overview of employee attendance and project statuses.
- **Employee Management**: Interface for adding, updating, and viewing employee details.
- **Project Management**: Tools to create, update, and manage project details and assignments.
- **Team Management**: Functionality to organize employees into teams and manage team information.
- **Attendance Tracking**: Capabilities to log and review attendance records for employees.
- **Leave Management**: System to handle leave requests and monitor leave balances.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and utilizes several key technologies:

- **React**: A JavaScript library for building user interfaces.
- **Material-UI**: A popular React UI framework.
- **React Router**: For navigation within the application.
- **Axios**: For HTTP communications with the backend.

### Running the Project Locally

To run the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Testing

The application includes unit and integration tests using Jest and React Testing Library.

### Running Tests

To execute tests, run:

```bash
npm test
```

## Configuration

The frontend configuration can be found in `src/config`, which includes settings for API endpoints and other operational parameters.

## Continuous Integration

The project uses GitHub Actions for continuous integration, which automates the process of testing and deployment.

## Contributing

Contributions are welcome. Please ensure to adhere to the existing coding standards and include tests for new features or changes. For major changes, please open an issue first to discuss what you would like to change.

## API Interaction

The frontend interacts with the Timely Backend, whose API documentation is available at [backend-test-7dda.up.railway.app/swagger-ui.html](https://backend-test-7dda.up.railway.app/swagger-ui.html). This documentation provides a detailed view of all backend endpoints, expected parameters, and responses.

## Links

- **Frontend Deployment**: [https://hr-app-frontend-test.up.railway.app/](https://hr-app-frontend-test.up.railway.app/)
- **Backend Repository**: [https://github.com/tobias-le/hr-app](https://github.com/tobias-le/hr-app)
- **API Documentation**: [https://backend-test-7dda.up.railway.app/swagger-ui.html](https://backend-test-7dda.up.railway.app/swagger-ui.html)
