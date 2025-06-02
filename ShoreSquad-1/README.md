# ShoreSquad Project

## Overview
ShoreSquad is a web application designed to promote beach cleanup activities and provide users with weather information. The application features an interactive map to display cleanup locations and a weather section to keep users informed about current conditions.

## Project Structure
```
ShoreSquad
├── css
│   └── styles.css        # Styles for the website
├── js
│   └── app.js            # JavaScript code for interactivity
├── .gitignore             # Files and directories to ignore in Git
├── index.html             # Main HTML file
├── README.md              # Project documentation
└── .vscode
    └── settings.json      # VS Code settings
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd ShoreSquad
   ```

2. **Open in VS Code**
   Open the project folder in Visual Studio Code.

3. **Install Live Server**
   If you haven't already, install the Live Server extension in VS Code for easy development.

4. **Run the Application**
   - Open `index.html` in the browser using Live Server to view the application.

## Git Setup

To push the project to Git, follow these steps:

1. Open a terminal in the project directory.
2. Initialize a Git repository if you haven't already:
   ```bash
   git init
   ```
3. Add all files to the staging area:
   ```bash
   git add .
   ```
4. Commit the changes with a message:
   ```bash
   git commit -m "Initial commit for ShoreSquad project"
   ```
5. If you have a remote repository (e.g., on GitHub), add it:
   ```bash
   git remote add origin <your-repo-url>
   ```
6. Push the changes to the remote repository:
   ```bash
   git push -u origin main
   ```

Make sure to replace `<your-repo-url>` with the actual URL of your remote repository. If you haven't created a remote repository yet, do so on a platform like GitHub, GitLab, or Bitbucket before pushing.