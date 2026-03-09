# WEB103 Project 1 - Tarot Listicle

Submitted by: **Divya Ganesh**

About this web app: **Tarot Listicle is an interactive web application that showcases the complete 78-card tarot deck. Cards are organized by arcana type (Major Arcana and Minor Arcana suits) with collapsible sections for easy browsing. Users can click on any card to view detailed information including meanings, symbolism, astrological associations, love and career guidance, and more. The app features a mystical dark theme with elegant typography and a sophisticated card-based layout.**

Time spent: **4** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app displays a title**
- [x] **The web app displays at least five unique list items, each with at least three displayed attributes (such as title, text, and image)**
- [x] **The user can click on each item in the list to see a detailed view of it, including all database fields**
  - [x] **Each detail view should be a unique endpoint, such as as `localhost:3000/bosses/crystalguardian` and `localhost:3000/mantislords`**
  - [x] *Note: When showing this feature in the video walkthrough, please show the unique URL for each detailed view. We will not be able to give points if we cannot see the implementation* 
- [x] **The web app serves an appropriate 404 page when no matching route is defined**
- [x] **The web app is styled using Picocss**

The following **optional** features are implemented:

- [x] The web app displays items in a unique format, such as cards rather than lists or animated list items

The following **additional** features are implemented:

- [x] **Rich Card Details**: Each card displays extensive information including upright and reversed meanings, keywords, astrological associations, numerology, visual symbolism, career guidance, and love readings
- [x] **Organized Navigation**: Cards are intelligently grouped by Major Arcana and Minor Arcana (organized by suit: Cups, Pentacles, Swords, Wands)
- [x] **Beautiful Dark Theme**: Custom mystical styling with gradient backgrounds, elegant typography (Cinzel and Cormorant Garamond fonts), and gold accents
- [x] **Card Images**: High-quality tarot card images for all 78 cards in the deck
- [x] **Responsive Design**: Fully responsive layout that works on desktop and mobile devices

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='https://i.imgur.com/FCL37qk.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with Cap.so
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

**Project Highlights:**
- Implemented a comprehensive 78-card tarot deck database with rich metadata for each card
- Created collapsible accordion sections for intuitive card organization and navigation
- Built a custom dark-themed design with mystical aesthetics using CSS gradients and elegant fonts
- Each card has a unique detail page (e.g., `/cards/0-the-fool`) accessible via slug, allowing users to explore comprehensive information about each card
- Implemented proper 404 error handling with a custom error page
- Used Express.js server with static file serving and routing for the API endpoints
- Organized codebase with separate client and server structures for scalability

## License

Copyright [2026] [Divya Ganesh]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.