# Margalla Trail Co.

**CS4032 Web Programming - Assignment 02: Business Website Development Using React**

| | |
| --- | --- |
| Student name | STUDENT_NAME_PLACEHOLDER |
| Roll number | 24I-2082 |
| Section | STUDENT_SECTION_PLACEHOLDER |
| Program | BS Cyber Security, FAST-NUCES Islamabad |
| GitHub repository | https://github.com/Denarzai/margalla-trail-co |
| Deployed website | https://denarzai.github.io/margalla-trail-co/ |

## Project description

Margalla Trail Co. is a **fictional** business that runs guided hikes and outdoor day
experiences around Islamabad for university students and young professionals.
The website lets a customer browse 12 experiences, search and filter them, open a
details page, build a plan with seats, fill in a booking form, check a calculated
summary and reach a confirmation page.

This is a frontend-only React application. It uses local data. **Every booking is
simulated**: no payment is taken and nothing is sent to a server.

## Commands

You need Node.js 20 or newer.

```bash
npm install        # install the dependencies (creates node_modules)
npm run dev        # start the development server on http://localhost:5173
npm run build      # create the production build in the dist folder
npm run preview    # serve the production build locally
node --test        # run the automated business-rule tests (same as: npm test)
```

Expected test result: `tests 14`, `pass 14`, `fail 0`.

## Main routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `HomePage` | Explains the business, the three rules and links to the list |
| `/experiences` | `ExperiencesPage` | Browse, search, filter and sort all experiences |
| `/experiences/:id` | `ExperienceDetailsPage` | Full details of one experience, choose seats, add to plan |
| `/plan` | `PlanPage` | Review the plan, change seats, remove items, see the summary |
| `/checkout` | `CheckoutPage` | Booking form with validation and the calculated summary |
| `/confirmation` | `ConfirmationPage` | Result of the simulated booking |
| any other address | `NotFoundPage` | Explains the problem and links back |

## Feature summary

- 12 local experience records with stable ids (`src/data/experiences.js`).
- Search by name, location, category and summary. Category filter, "hide sold-out"
  filter and five sort options. All of them work together.
- Cards show price, duration, difficulty, minimum age and seats left.
- Plan (selection): add, change seats, remove, clear. Shared by all pages.
- The plan is saved in `localStorage` and checked again when it is restored.
- Controlled booking form with six validation rules and specific messages.
- Calculated summary: seats, subtotal, booking fee and total.
- Asynchronous mock loader with loading, failure and retry states.
- Separate empty states: empty dataset, no search matches, empty plan.
- Responsive from 390 px to 1280 px, keyboard accessible, visible focus.

## Operating rules

| # | Category | Rule | Code |
| --- | --- | --- | --- |
| 1 | Availability / capacity | A booking can hold 1 to 6 seats per experience and never more than the seats left. A sold-out experience cannot be added. | `src/rules/seatLimit.js` |
| 2 | Eligibility | The youngest participant must be at least the minimum age of every experience in the plan. | `src/rules/ageRule.js` |
| 3 | Pricing | A Rs 300 booking fee is added when the subtotal is under Rs 5,000. At Rs 5,000 or more the fee is Rs 0. | `src/rules/bookingFee.js` |

## Demo controls and how to reproduce edge cases

The footer of every page has a box called **"Demo controls (testing only)"** with
three switches. Changing a switch reloads the data. The switches reset when the
page is refreshed.

| Case | Steps | Expected result |
| --- | --- | --- |
| Loading state | Open `/experiences` or refresh any page | "Loading experiences…" for about one second |
| Loading failure | Tick **Simulate loading failure** | "Something went wrong" with a **Try again** button |
| Retry | Press **Turn off demo failure and reload** (or untick the switch and press **Try again**) | The experiences load |
| Changed availability | Add 2 seats of *Trail 5 Sunrise Hike* and 1 seat of *Khanpur Lake Kayaking Day*. Tick **Simulate changed availability** | A yellow notice appears. `/plan` explains both conflicts, blocks "Continue" and offers **Change to 1 seat** / **Remove from plan** |
| Empty dataset | Tick **Simulate empty dataset**, open `/experiences` | "No experiences are scheduled right now" |
| No search matches | On `/experiences` search for `zzqxv` | "No experiences match your search" with three buttons |
| Invalid details id | Open `/experiences/not-a-real-id` | "We could not find that experience" with links |
| Unknown address | Open `/abc/xyz` | "Page not found" with links |
| Missing image | Look at *Pir Sohawa Stargazing Evening* | A "Photo coming soon" box instead of a broken image |
| Long content | Look at the *Neela Sandh Waterfall…* card and details | The long name wraps. No horizontal scrolling |
| Missing information | Open the *Neela Sandh Waterfall…* details | "The list of included items is being finalised" |
| Invalid form input | On `/checkout` press **Confirm simulated booking** with empty fields | Five specific messages. Typed valid values stay |
| Seat limit boundary | On *Rohtas Fort Day Trip* (2 seats left) press **+** twice | 2 seats allowed. The third shows "Only 2 seats are left…" |
| Age boundary | Plan *Trail 5 Sunrise Hike* (12+). Type age 11, then 12 | 11 is blocked with a message. 12 passes |
| Fee boundary | Plan 2 seats of *Trail 5 Sunrise Hike* (Rs 5,000), then 1 seat | Rs 5,000: fee "Free". Rs 2,500: fee Rs 300 |
| Damaged saved data | In the browser console run `localStorage.setItem('margalla-trail-plan', '{bad')` and refresh | The site loads with an empty plan |
| Old saved selection | Run `localStorage.setItem('margalla-trail-plan', JSON.stringify([{id:'old-trip',seats:2},{id:'trail-3-summit',seats:99}]))` and open `/plan` | Both problems are explained with correction buttons |

## Deployment

The site is published on **GitHub Pages** by the workflow in
`.github/workflows/deploy.yml`. Every push to `main` runs the tests, builds the
site and publishes it, so the public website always matches the latest commit.

- GitHub Pages serves the site from `/margalla-trail-co/`. The workflow sets
  `BASE_PATH` for the build, `vite.config.js` reads it, and `main.jsx` passes it to
  `<BrowserRouter basename=...>`.
- The workflow copies `index.html` to `404.html`, so direct links and refreshes on
  nested routes such as `/experiences/trail-5-sunrise` open the correct page.
- `vercel.json` is included so the same repository also works on Vercel without changes.

## Simulated operations

- **Data loading** is simulated by `src/services/experienceLoader.js` (a Promise with a delay).
- **Booking** is simulated. The form data stays in the browser's memory and is never sent.
- **Payment** does not exist. The total is only displayed.
- **Seats left** go down after a simulated booking, but only until the page is refreshed.
- The business, its address and its phone details are fictional.

## Known limitations

- No backend: bookings are not stored and seat numbers reset on refresh.
- The confirmation page is empty after a refresh, because booking details are kept
  only in memory (personal details are deliberately not saved in `localStorage`).
- On GitHub Pages a direct visit to a nested route is answered through `404.html`.
  The page works, but the first HTTP response has status code 404.
- The two suggestion buttons in the empty search state are fixed in the code.
- Prices are per seat with no child discount, and each experience has one schedule.

## Folder structure

```
src/
  main.jsx            starts React and the router
  App.jsx             shared state, effects, handlers and routes
  assets/images/      original SVG illustrations
  components/         reusable interface pieces
  pages/              one component per route
  data/               local experience records
  services/           asynchronous mock loader
  rules/              the three operating rules + the test file
  utils/              filtering, plan calculations, validation, storage, formatting
  styles/             authored CSS (base, layout, components, pages)
docs/evidence/        screenshots used in DECISIONS.md
```

## Concept map

| React / JS concept | File | Component or function |
| --- | --- | --- |
| Function components, JSX | every file in `src/components` and `src/pages` | for example `ExperienceCard`, `PlanPage` |
| Imports and exports | all files | for example `export function checkSeatLimit` in `rules/seatLimit.js` |
| Props | `components/ExperienceCard.jsx` | `ExperienceCard({ experience, seatsInPlan, onSetPlanSeats })` |
| `children` prop | `components/EmptyState.jsx` | `EmptyState({ title, message, children })` |
| Callback props | `components/FilterBar.jsx`, `components/SeatStepper.jsx` | `onChange`, called by `handleSearchChange`, `handleIncrease` |
| Event handlers | `pages/CheckoutPage.jsx` | `handleInputChange`, `handleInputBlur`, `handleSubmit` |
| `preventDefault()` | `pages/CheckoutPage.jsx` | `handleSubmit` |
| `useState` | `App.jsx` | `experiences`, `loadStatus`, `planItems`, `bookingForm`, `browseFilters` |
| Lazy initial state | `App.jsx` | `useState(loadSavedPlan)` |
| Controlled inputs | `components/FormField.jsx`, `components/FilterBar.jsx` | `value={...}` with `onChange={...}` |
| Functional state updates | `App.jsx` | `handleRetryLoad`, `handleSetPlanSeats`, `handleRemoveFromPlan`, `handleFormChange` |
| Immutable object update | `App.jsx`, `components/FilterBar.jsx` | `handleFormChange` (`{ ...previousForm, [fieldName]: newValue }`), `handleSearchChange` |
| Immutable array update | `App.jsx` | `handleSetPlanSeats` (add with spread, update with `map`), `handleRemoveFromPlan` (`filter`) |
| Lists and keys | `pages/ExperiencesPage.jsx`, `pages/PlanPage.jsx` | `visibleExperiences.map(...)` with `key={experience.id}` |
| Conditional rendering | `components/LoadStatus.jsx`, `components/AvailabilityBadge.jsx`, `pages/ExperiencesPage.jsx` | loading / error, sold out / low / available, empty states |
| Shared state | `App.jsx` | `planItems` passed to home, list, details, plan and checkout pages |
| Derived values | `App.jsx`, `utils/planHelpers.js` | `planLines`, `totals`, `problemCount`, `buildPlanLines`, `calculateTotals` |
| `useEffect` | `App.jsx` | load data, save plan to `localStorage`, scroll to top |
| Effect dependencies and cleanup | `App.jsx` | data effect: `[reloadCount, demoSettings]` and `ignore = true` cleanup |
| `useEffect` for the page title | every page | `document.title = ...` |
| `map()` | `utils/planHelpers.js`, `services/experienceLoader.js` | `buildPlanLines`, `loadExperiences` |
| `filter()` | `utils/filterExperiences.js`, `utils/storage.js` | `getVisibleExperiences`, `loadSavedPlan` |
| `find()` | `pages/ExperienceDetailsPage.jsx`, `utils/planHelpers.js` | find the record for the URL id, `getSeatsInPlan` |
| `reduce()` | `utils/planHelpers.js` | `calculateTotals`, `getHighestMinAge` |
| `some()` | `App.jsx` | `handleSetPlanSeats` |
| `sort()` on a copy | `utils/filterExperiences.js` | `getVisibleExperiences` |
| Spread syntax | `App.jsx`, `utils/filterExperiences.js` | `[...previousItems, newItem]`, `[...matchingExperiences]` |
| Destructuring | `components/ExperienceCard.jsx`, `pages/CheckoutPage.jsx` | `const { id, name, ... } = experience`, `const { name, value, type, checked } = event.target` |
| Promise | `services/experienceLoader.js` | `loadExperiences` returns `new Promise(...)` |
| `async` / `await`, `try` / `catch` | `App.jsx` | `fetchExperiences` inside the data effect |
| `localStorage`, `JSON.stringify`, `JSON.parse` | `utils/storage.js` | `readStorage`, `writeStorage`, `loadSavedPlan` |
| Routes | `App.jsx`, `main.jsx` | `<Routes>`, `<Route>`, `<BrowserRouter>` |
| URL parameters | `pages/ExperienceDetailsPage.jsx` | `useParams()` |
| Links | `components/Header.jsx`, `components/ExperienceCard.jsx` | `<NavLink>`, `<Link>` |
| Programmatic navigation | `pages/CheckoutPage.jsx` | `useNavigate()` in `handleSubmit` |
| Current location | `App.jsx` | `useLocation()` |
| Business rules | `rules/seatLimit.js`, `rules/ageRule.js`, `rules/bookingFee.js` | `checkSeatLimit`, `checkAgeRule`, `calculateBookingFee` |
| Automated test | `rules/businessRules.test.js` | `node:test` and `node:assert/strict` |
| Form validation | `utils/validation.js` | `validateBookingForm` |

## Assets

All illustrations in `src/assets/images` are original SVG drawings made for this
project. No external images, templates or UI kits are used. The only libraries are
React, React DOM and React Router. All CSS is written by hand.
