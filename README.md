# Git Commit Viewer - Code Test

I chose my usual boilerplate for this project despite shipping probably a bit more than is required for the task! I was advised not to spend too long on the task and this seemed like the quickest way to get straight into writing the app without worrying to much about architecture & framework selection.

I decided that the basic functionality should be to display all commits from the API in a list view by default, then allow the user to:
- Switch between Grid and List view
- Filter by Committers
- Search the Commits by Commiter Name, Email, Commit Message or URL

## Usage
```
git clone https://github.com/MackayAM/git-commit-viewer.git
cd git-commit-viewer
npm install
npm run dev
```

# ToDo
If I was to have spent longer on the application I would have:
- Ensured to write thorough unit tests for each component with 100% code coverage
- Improved general look & feel of the application (spent longer on UI/css!)
- Wrote and included all types & interfaces across each component
- Clean up and split components / code out into more files - Commits.tsx got a bit out of hand housing most of the core functionality!
- Add transitions / animations to make things look a little bit smoother when changing filters
- Added a nicer loading and error screen
- Included a refetch button in case of an error