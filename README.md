
# Data Viewer Application

This project is a data viewer application consisting of a **server** (Flask) and a **client** (React with Next.js). The server processes CSV, Excel, and PDF files and returns data, while the client visualizes it using Handsontable.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation Instructions](#installation-instructions)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Running the Application](#running-the-application)
- [Java Installation](#java-installation)
  - [For Linux](#for-linux)
  - [For macOS](#for-macos)
  - [For Windows](#for-windows)
- [Usage](#usage)
- [Screenshot](#screenshot)

---

## Project Structure
```
data-viewer/
│
├── client/            # Front-end React application
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
├── server/            # Back-end Flask application
│   ├── app.py
│   ├── requirements.txt
│   └── templates/
│
└── README.md          # This README file
```

---

## Prerequisites
1. **Python**: Version 3.8 or later.
2. **Node.js**: Version 14.x or later.
3. **npm or yarn**: For managing JavaScript dependencies.
4. **Java**: Required for `tabula-py` to process PDFs.
5. **pip**: Python package manager.

---

## Installation Instructions

### Server Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For Linux/macOS
   venv\Scripts\activate     # For Windows
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Ensure Java is installed on your system (see [Java Installation](#java-installation)).

---

### Client Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `client` directory with the following contents:
     ```
     REACT_APP_ROW_LIMIT=1000
     REACT_APP_PDF_API_URL=http://127.0.0.1:5000
     ```

4. Start the development server:
   ```bash
   npm start
   ```

---

## Running the Application

1. **Start the Flask Server**:
   - Navigate to the `server` directory and run:
     ```bash
     python app.py
     ```

2. **Start the React Client**:
   - Navigate to the `client` directory and run:
     ```bash
     npm start
     ```

3. Open the React app in your browser at `http://localhost:3000`.

---

## Java Installation
`tabula-py` requires Java to process PDFs. Follow the instructions below to install Java based on your operating system.

### For Linux
1. Update the package list:
   ```bash
   sudo apt update
   ```

2. Install the default JDK:
   ```bash
   sudo apt install default-jdk
   ```

3. Verify the installation:
   ```bash
   java -version
   ```

---

### For macOS
1. Install Homebrew if not already installed:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Java using Homebrew:
   ```bash
   brew install openjdk
   ```

3. Add Java to your PATH:
   ```bash
   echo 'export PATH="/usr/local/opt/openjdk/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. Verify the installation:
   ```bash
   java -version
   ```

---

### For Windows
1. Download the latest Java Development Kit (JDK) from [Oracle's website](https://www.oracle.com/java/technologies/javase-downloads.html).

2. Run the installer and follow the prompts.

3. Set up the environment variables:
   - Go to **Control Panel > System > Advanced System Settings > Environment Variables**.
   - Add `JAVA_HOME` pointing to your Java installation directory (e.g., `C:\Program Files\Java\jdk-XX.X`).
   - Add `%JAVA_HOME%\bin` to your `Path` environment variable.

4. Verify the installation:
   ```bash
   java -version
   ```

---

## Usage

### Uploading a File
1. Open the React app at `http://localhost:3000`.
2. Choose a file (CSV, XLS, XLSX, or PDF) using the upload dialog.
3. The file will be processed by the Flask server and displayed in a data grid.

### Pasting CSV Data
1. Paste valid CSV content into the textarea.
2. Click the **Process CSV** button.
3. The parsed data will be displayed in the grid.

---

## Screenshot
Here’s how the application looks when running:

![Application Screenshot](https://raw.githubusercontent.com/gsmart/data-viewer/refs/heads/main/client/public/demo.png)

---

## Notes
- Ensure the Flask server and React client are running on the same machine or accessible to each other.
- Modify the `REACT_APP_PDF_API_URL` in the `.env` file if the Flask server is hosted on a different machine or port.

---

## Troubleshooting
- **CORS Issues**:
  If you encounter CORS issues, ensure Flask's `CORS` is properly configured:
  ```python
  from flask_cors import CORS
  CORS(app)
  ```
- **Java Not Found**:
  Verify that Java is installed and added to the system `PATH`.

---

Enjoy working with your Data Viewer Application! 🎉
