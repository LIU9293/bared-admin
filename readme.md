## Admin panel for bared CMS

### WIP

* [x] Basic data table to show all the contents
* [x] Basic UI to show routes created by developer
* [x] Let admin user login before anything else
* [x] CRUD method to manipulate content data (WIP)
  * [x] Create new item
  * [ ] Read items, pagination, count...
  * [x] Update item
  * [x] Delete item
* [x] Configure API URL when login
* [ ] Directly test API endpoint in UI, WIP
* [ ] Add sort, filter, search in content data table
* [ ] Store column preference for each admin user somewhere
* [ ] Errors page to read errors from server
* [ ] Homepage to show some keyfigures (DAU, MAU, requests...)

### Core packages

* Vite for build
* react 18, react-router-dom
* Strapi UIKIT
  * Storybook: https://design-system-git-develop-strapijs.vercel.app
  * Design system: https://design-system.strapi.io
* redux, redux-observable for state management
* styled-components for styling