# Zero Hour

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

1. Clone the repository
2. Navigate to the project folder
3. Execute: `npm install`
4. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`

## Description

**Zero Hour** is a lightweight, zero-dependency countdown web application built with vanilla TypeScript and TailwindCSS. It displays a real-time countdown timer that ticks every second toward a target date and time, making it ideal for embedding in product launch pages, giveaway campaigns, game release announcements, or any scenario where building anticipation matters.

The UI centers on a styled card that shows the target event's full date alongside four live countdown units — Days, Hours, Minutes, and Seconds — each updating automatically as time passes. When the countdown reaches zero, the timer stops and the card transitions to an expiration message, signaling that the offer or event window has closed.

Under the hood, the app uses a generic reactive `Store<T>` class for state management, a component model based on plain TypeScript classes that return DOM elements, and a `setInterval`-driven render loop. The architecture is intentionally minimal: no frameworks, no runtime dependencies, just typed TypeScript composed into a single-page application bundled by Vite. The project also includes a full test suite with Jest, Testing Library, and 70%+ coverage enforced on every build.

## Technologies used

1. Typescript
2. TailwindCSS
3. HTML5
4. CSS3
5. Vite

## Libraries used

#### Dependencies

```
No production dependencies - Pure Vanilla TypeScript
```

#### devDependencies

```
"@eslint/js": "^9.39.2"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"autoprefixer": "^10.4.16"
"eslint": "^9.39.2"
"eslint-config-prettier": "^10.1.8"
"eslint-plugin-prettier": "^5.5.5"
"globals": "^17.3.0"
"husky": "^9.1.7"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^16.2.7"
"postcss": "^8.4.33"
"prettier": "^3.8.1"
"tailwindcss": "^3.4.1"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.54.0"
"vite": "^7.1.5"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/zero-hour`](https://www.diegolibonati.com.ar/#/project/zero-hour)

## Testing

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

## Known Issues

None at the moment.
