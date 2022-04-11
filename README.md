# Prova developer back-end: projectjobs
Rest API to handle simple projects and jobs on mysql database.

## Entities

### Project
- `id: number`
- `title: string`
- `jobs: Job[]`

### Job
- `id: number`
- `creationDate: string`
- `price: number`
- `status: string`

## Endpoints

### Projects

    GET /projects

Returns all projects stored in database.
    
    {
      "payload": [
        {
          "id": 1,
          "title": "project1",
          "jobs": [...]
        },
        ...
      ]
    }

***
    GET /projects/:id
Return project with specified id, http status code 404 otherwise.

    {
      "payload": {
        "id": 1,
        "title": "project1",
        "jobs": [...]
      }
    }

***
    POST /projects

Create a new project.

Example body:

    {
      "title": "project1",
      "jobs": [
        {
          "creationDate": "2022-04-11 09:00:00",
          "price": 10.23,
          "status": "in preparation"
        }
      ]
    }

Response:

    {
      "id": 1,
      "title": "project1",
      "jobs": [
        {
          "id": 3,
          "creationDate": "2022-04-11 09:00:00",
          "price": 10.23,
          "status": "in preparation"
        }
      ]
    }

***

    PATCH /projects/:id/jobs

Add a new job to an existing project.

Example body:

    {
      "creationDate": "2022-04-11 09:00:00",
      "price": 10.23,
      "status": "in preparation"
    }

Response:

    {
      "id": 1,
      "title": "project1",
      "jobs": [
        {
          "id": 3,
          "creationDate": "2022-04-11 09:00:00",
          "price": 10.23,
          "status": "in preparation"
        }
      ]
    }

### Jobs

    GET /jobs

Return all jobs.

Query parameters:
- status: returns only jobs with specified status

    `GET /jobs?status=cancelled`
- sort: return all jobs sorted by specified field (just creationDate for now)
    
    `GET /jobs?sort=+creationDate` ASC

    `GET /jobs?sort=-creationDate` DESC

***

    GET /jobs/:id

Returns job with specified id, 404 if job id does not exists

***

    PATCH /jobs/:id/status

Modify job' status

Body:

    {
      "status": "in progress"
    }

Response:

    {
      "id": 3,
      "creationDate": "2022-04-11 09:00:00",
      "price": 10.23,
      "status": "in progress"
    }

## Process start

To start the process, run the following command in project's root:

    npm run start-docker

It starts two container, a MariaDB instance, listening on port 3306, and a 
NodeJS container running the project and listening on port 3000.

Database container is initialized by docker compose with database structure and 
some random data to make some tests.
