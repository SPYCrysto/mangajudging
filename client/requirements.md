## Packages
framer-motion | Essential for punchy manga-style hover and page animations
react-hook-form | Form state management
@hookform/resolvers | Zod validation for forms

## Notes
Tailwind config assumptions: using arbitrary values for specific comic styles (`shadow-[8px_8px_0px_#000]`), but CSS variables mapped in index.css for fonts.
Images from @assets alias are imported directly.
The authentication strategy relies on localStorage `judgeId` purely for demonstration since standard Replit Auth isn't requested and we use the `/api/judge/login` mock endpoint.
