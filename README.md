# Association-membership-managment-REST-API
## Installation
- create a Postgres database named "Association"
- create `.env.dev` and `.env.prod` file as same level as the gitignore file
- inside those file, replace those stars by your own value
```
JWT_KEY= ***
HOST= ***
PORT= ***
DB_NAME= Association
DB_USER= ***
DB_PASSWORD= ***
DB_PORT= ***
DB_HOST= ***
```
- run `npm run migration-run` to create column and add a default administrateur: mail= admin@test.com and password= admin1234
## Description
This API is used for managing association membership.  
Each member has: firstName, lastName, email, role, password and an inscriptionDate.  
From now, available role: **member** and **admin**

## Constraints
- `firstName`: nullable, length=<35, cannot contain number
- `lastName`: not nullable, length=<30, cannot contain number
- `mail`: not nullable, should follow mail normal form, unique for each member,
- `role`: must be 'member' or 'admin'
- `password`: not nullable, 6<=length<=20

## Routes
| method | route | query | input | action | constraint |
|--------|-------|------|-------|--------|------------|
| GET | user/ | page: number, perPage: number, sortBy: 'inscriptionDate' or 'role'or 'firstName' or 'lastName', order: 'ASC' or 'DESC', role: 'admin' or 'member' or empty for all | | get pagination system of all member | |
| POST | user/signin | | firstName, lastName, email, password | create a new simmple member of association | loged out |
| PUT | user/ | | firstName, lastName, email | modify one of those info served in those input | logged in as the user to update |
| POST | admin/add-new-admin | | same as signin | create a new admin | loged as an admin |
| POST | auth/login | | mail, password | login | loged out |
| POST | auth/logout | | | | |
| PUT | auth/change-password | | password, newPassword | change password | loged in as the user to change password |
| DELETE | auth/delete-my-account | | | delete curent account | loged in as the user to delete |