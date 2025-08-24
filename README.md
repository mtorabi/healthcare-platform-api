# Healthcare Platform API

This project provides a backend API for managing healthcare data, including patients, claims, and prescriptions. It is built with [NestJS](https://nestjs.com/) and supports running both with and without Docker Compose.

---

## Table of Contents
- [Healthcare Platform API](#healthcare-platform-api)
  - [Table of Contents](#table-of-contents)
  - [Setup Instructions](#setup-instructions)
    - [With Docker Compose](#with-docker-compose)
    - [Without Docker Compose](#without-docker-compose)
  - [API Documentation](#api-documentation)
  - [API Usage](#api-usage)
    - [Patients](#patients)
    - [Claims](#claims)
    - [Prescriptions](#prescriptions)
  - [Running the Dashboard](#running-the-dashboard)
  - [Assumptions \& Trade-offs](#assumptions--trade-offs)

---

## Setup Instructions

### With Docker Compose
1. Ensure you have [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/) installed.
2. In the project root (`healthcare-platform-api`), run:

	```sh
	docker-compose up --build
	```

3. (Optional) To seed the database, run:
	```sh
	docker-compose run --rm seed
	```

4. The API will be available at `http://localhost:3000` (default).

### Without Docker Compose

1. Ensure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.
2. Install dependencies:

    ```sh
    npm install
    ```

3. Configure your database connection in `src/database/data-source.ts` as needed.
4. (Optional) To seed the database, run:

    ```sh
    npm run seed
    ```
5. Start the server:

    ```sh
    npm run start:dev
    ```

   The API will be available at `http://localhost:3000`.

---

## API Documentation

Interactive API documentation is available at: [http://localhost:3000/api](http://localhost:3000/api)

---

## API Usage

The API exposes endpoints for managing patients, claims, and prescriptions. Below are example requests using `curl`.

### Patients

- **Create a patient:**

  ```sh
  curl -X POST http://localhost:3000/patients \
    -H "Content-Type: application/json" \
    -d '{"name": "John Doe", "gender": "male", "dob": "1990-01-01"}'
  ```

- **Get all patients:**

  ```sh
  curl http://localhost:3000/patients
  ```

  - **Get a patient by ID:**

  ```sh
  curl http://localhost:3000/patients/1
  ```

### Claims

- **Create a claim:**

  ```sh
  curl -X POST http://localhost:3000/claims \
    -H "Content-Type: application/json" \
    -d '{"patientId": 1, "amount": 100.0, "diagnosis": "A00"}'
  ```
  
  - **Get all claims:**

  ```sh
  curl http://localhost:3000/claims
  ```

### Prescriptions

- **Create a prescription:**

  ```sh
  curl -X POST http://localhost:3000/prescriptions \
    -H "Content-Type: application/json" \
    -d '{"patientId": 1, "medication": "Drug A", "dosage": "1 tablet daily"}'

  ```

- **Get all prescriptions:**

  ```sh
  curl http://localhost:3000/prescriptions
  ```

---

## Running the Dashboard

To run the dashboard (frontend), please clone the dashboard project from git ([URL](https://github.com/mtorabi/healthcare-platform-dashboard.git)) and follow the instructions in that project's README file.

---

## Assumptions & Trade-offs

- **Database:** The API expects a running database (e.g., PostgreSQL). Connection details should be configured in `src/database/data-source.ts` or via environment variables.
- **Authentication:** No authentication is implemented for simplicity. In production, add proper auth (e.g., JWT).
- **Error Handling:** Basic error handling is provided. For production, consider more robust validation and error reporting.
- **Docker:** Docker Compose is provided for easy setup, but manual setup is also supported for flexibility.
- **Test Coverage:** The test coverage for Claims and Prescriptions services and controllers is more than 85%. For the rest of the project, to save time, the coverage has been ignored.
  