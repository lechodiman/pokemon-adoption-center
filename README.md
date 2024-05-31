# Pokemon Adoption Center

This project is a Pokemon Adoption Center application built with Firebase Functions and Firestore. It allows users to adopt their favorite Pokemon, with certain rules and restrictions in place to ensure fair adoption.

## Main Features

- **Adoption Requests**: Users can submit requests to adopt a Pokemon. These requests are processed and either approved or rejected based on certain criteria.
- **User Blocking**: Users who have too many consecutive rejections are automatically blocked from making further adoption requests.
- **Rate Limiting**: To prevent abuse, the application has rate limiting in place, limiting the number of requests a user can make in a certain time period.

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the Firebase emulators:

```bash
npm run serve
```

This will start the Firebase Functions and Firestore emulators, and you can interact with the application via the emulated endpoints.

## Project Structure

The main logic of the application is in the functions/src directory. Here's a brief overview of the key files and directories:

- `api/`: Contains the API endpoints for the application.
- `config/`: Contains configuration files, such as the Express app setup.
- `services/`: Contains service classes that encapsulate the business logic of the application.
- `index.ts`: The entry point of the application.

## Deployment

To deploy the functions to Firebase, use the following command:

```bash
npm deploy
```

Please note that you need to have the Firebase CLI installed and be logged in to a Firebase account that has access to this project.

## Future Roadmap

Here are some features we are planning to add in the future:

- **Accept Attachment Files**: We plan to allow users to attach files when submitting adoption requests. This could be useful for providing additional information or evidence to support the request. This could be implented using Firebase Storage.
- **Handle Pokemon Getting Sick**: We will add functionality to handle situations where a Pokemon gets sick.
- **Email Notification for Repeated Blocks**: If a user is blocked more than 3 times, we will automatically send an email to officer Jenny to inform suspicious behaviour.
- **Add Tests**: We plan to add more comprehensive tests to ensure the quality and reliability of our application.
- **Dependency Injection**: To make our application more modular and testable, we plan to implement dependency injection. This will make it easier to swap out components for testing or if we decide to change implementations in the future.
