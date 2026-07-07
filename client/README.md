# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.



#### JUNE 28 2026
- moved all the old HTML files 'oldHTML/' kept it for reference 
- started the react front end by using vite 
```
npm create vite@latest my-app -- --template react-ts
```

- we can now start development under client directory


#### Admin-Dashboard Development
- [July 04] developed `square statistics` a react component to formatize reusable statistic components
  - Title - the header of the statistics
  - Data - the data itself, > [!CAUTION] card does not process data
  - Message - accepts string and serves as a subtitle to the statistics. 


## Models 

## Space Listings
  Created by Space managers - viewed by all users, location sensitive. Tag Sensitive. The attributes and characters of the listing is also the tags that are used for search optimization
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

  
