[![Next](https://img.shields.io/badge/NextJS-v15.2.0-blue.svg?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-v19-teal.svg?logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-v4-lightblue.svg?logo=tailwindcss)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-v11.6.0-orange.svg?logo=firebase&logoColor=orange)](https://firebase.google.com)

---

# Plinko Game

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The Plinko Game is a fun and interactive game where players drop disks into a board filled with pegs and scoring buckets.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Game Instructions

1. Click on the game board to drop a disk into one of the columns.
2. The disk will bounce off the pegs and land in one of the scoring buckets at the bottom.
3. Each bucket has a score value, which will be added to your total score.
4. You have 10 disks to drop. The game ends when all disks have been used.
5. Your final score will be displayed at the end of the game.

## Features

- Interactive game board with physics-based mechanics using [Matter.js](https://brm.io/matter-js/).
- Randomized scoring buckets with positive and zero values.
- Responsive design that works on various screen sizes.
- Simple and intuitive user interface.

## Dependencies

### Required Dependencies

- `@radix-ui/react-slot`: ^1.1.2
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `lucide-react`: ^0.477.0
- `next`: 15.2.0
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `tailwind-merge`: ^3.0.2
- `tailwindcss-animate`: ^1.0.7

### Development Dependencies

- `@tailwindcss/postcss`: ^4
- `tailwindcss`: ^4

## Future Enhancements

### Planned Features

- **User Login**: Implement a user authentication system to allow players to create accounts and log in.
- **Shopping Cart**: Set up a shopping cart feature to allow users to add funds for gameplay.
- **Bet Value Assignment**: Assign a bet value for each disk dropped, adding a layer of strategy to the game.
- **Dynamic Scoring**: Assign dynamic values for the gold tiles based on the bet value, enhancing the gameplay experience.
- ~~**Database Integration**: Set up databases to track gameplay, player feedback and scores.~~ Completed 04/20
- ~~**Leaderboard**: Create a leaderboard to display the top-scoring players and their scores.~~ Completed 03/08
- **Share-Button**: Players will have the option to share their win on social media.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
