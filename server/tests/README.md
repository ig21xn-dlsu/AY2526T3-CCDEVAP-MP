# Unit Tests — listingController.js

## What this covers
Unit tests for all 7 functions in `controllers/listingController.js`:
- `getListingOwner`
- `createListing`
- `returnListing`
- `updateListing`
- `deleteListing`
- `updateOccupancy`
- `updateListingAssignment`

34 test cases total, covering success paths, validation errors, ownership
checks, and not-found/conflict scenarios for each function.

## Approach
These are pure **unit tests** — no real database connection is made. The
`Listing` and `Group` Mongoose models are mocked with `jest.mock()`, so the
tests only verify the controller's own logic (input validation, status
codes, ownership checks), not Mongoose or MongoDB itself. This means running
these tests has **zero effect on the deployed app or the real database**.

## Folder placement
This file expects to sit at:

```
server/
├── controllers/
│   └── listingController.js
├── models/
│   ├── Listing.js
│   └── Group.js
├── tests/
│   ├── listingController.test.js   <- this test file
│   ├── results/
│   │   └── test-output.txt          <- saved output from a passing run
│   └── README.md                    <- this file
└── package.json
```

`../models/Listing` and `../controllers/listingController` are resolved
relative to this folder, so `tests/` must be a direct sibling of
`controllers/` and `models/` inside `server/`.

## How to run it
From inside the `server/` folder:

```bash
npm install --save-dev jest
npm test
```

Add this to `server/package.json` if it isn't there already:

```json
"scripts": {
  "test": "jest"
}
```

## Result
Last run: **34 / 34 tests passed.** See `results/test-output.txt` for the
full saved terminal output.
