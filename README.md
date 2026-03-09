# WEB103 Project 2 - Tarot Listicle

Submitted by: **Divya Ganesh**

About this web app: **Tarot Listicle is an interactive web app for browsing all 78 tarot cards and opening a unique detail page for each card. Users can search cards by specific attributes such as suit/arcana, name, element, astrology, and more. The app uses an Express API connected to a PostgreSQL database and a custom front end built with HTML, CSS, and vanilla JavaScript.**

Time spent: **6** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**


The following **optional** features are implemented:

- [x] The user can search for items by a specific attribute

The following **additional** features are implemented:

- [x] Unique card detail routes by slug (for example, `/cards/0-the-fool`)
- [x] Custom 404 page for undefined routes
- [x] Rich card metadata shown in detail view (meanings, symbolism, correspondences, and guidance)
- [x] Responsive card grid and detail layout

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='https://i.imgur.com/wDtoAfk.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!--
What your GIF walkthrough should include (in order):
1) Open the app and use the search UI to filter by at least one specific attribute.
2) Click a card and show the unique detail URL in the browser.
3) Show the Render dashboard page where your PostgreSQL service/database is visible and running.
4) In terminal, run psql and execute: SELECT * FROM cards;
5) Keep the table output visible long enough to confirm rows exist.
-->

<!-- Optional: Add still screenshots in README if the GIF is too small to read text clearly. -->

<!-- Replace this with whatever GIF tool you used! -->
GIF created with Cap.so
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

The API and search logic are complete and connected to PostgreSQL. The remaining checklist item above should be marked complete after the updated walkthrough clearly shows the Render dashboard and the `SELECT * FROM cards;` terminal output.

## License

Copyright [2026] [Divya Ganesh]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.