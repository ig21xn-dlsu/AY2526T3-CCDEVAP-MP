# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# React Migration
Moved old HTML files and refactored into react components. React components may differ from first submission html/css based components due to comments and suggestions by professor

MCO1 files are archived main branch is currently serving MCO1 output

# Models 
## Space Listings
  Created by Space managers - viewed by all users, location sensitive. Tag Sensitive. The attributes and characters of the listing is also the tags that are used for search optimization

### Components
  under 'client/src/components/ManagerDashComponents/listing-container' is a component that presents each listing in a square format with include edit, create and view inquiries

### Listing Data Structure
```JSON
{
  "id": "randomly generated data",
  "title": "upt to the user however, preferably building name and sizing",
  "description": "3,000 MAX CHAR",
  "Price": "PER MONTH LUMP SUM, up to the roomies to split",
  "STATUS": "settable by space manager occupied or available occupied will not show up in search results",
  "NEARBY CAMPUS": "impt, hardcoded campus location data will be used enum data only"
  "IMG_URL": "/uploads/{}.jpg"
}
/*
Professor allowed us to restrict scope to big four: campuses include:
1. DLSU Manila
2. UP Manila
3. UST
4. UP Diliman
5. Ateneo De Manila - Main Campus
*/
```
#### New Addition: Location Data
  User will be able to input building name: 
  metadata:
```JSON
{
  "position":[
    "longitude",
    "latitude",
  ]
}

```

  
