# Self-Healing File Compression Tool

![GitHub release (latest by date)](https://img.shields.io/github/v/release/username/self-healing-app)
![GitHub](https://img.shields.io/github/license/username/self-healing-app)

A robust cross-platform file compression tool with built-in self-healing capabilities, designed to provide a reliable and user-friendly file compression/decompression experience.

### Option: Build from Source

If you prefer to build the application yourself:

1. Clone this repository
2. Follow the development instructions below to build the application
3. The installer will be generated in the `installer` directory after a successful build

### Option: Direct Download

You can also download the precompiled installer directly using this link:

- **Windows Installer**: [SelfHealingApp_1.0.0_Setup.exe](https://github.com/Yuanyuan5510/self-healing-app/releases/download/SelfHealingApp/SelfHealingApp_1.0.0_Setup.exe)

### Supported Languages

The application installer supports the following languages:
- English
- Simplified Chinese
- Spanish
- French
- Arabic

## 🌟 Key Features

### 🔧 Self-Healing Mechanism
- **Global Error Handling**: Comprehensive monitoring of runtime exceptions and unhandled promise rejections
- **Automatic Recovery**: Smart attempt to repair common errors (e.g., missing modules)
- **Application Restart**: Automatic restart upon successful repair
- **Fallback Mode**: Seamless switch to fallback application when repairs fail

### 🎨 Intuitive User Interface
- **Clear Layout**: Separate sections for compression and decompression functions
- **File/Directory Selection**: Easy-to-use file and directory browsing capabilities
- **Real-time Preview**: Supports folder content preview to verify operation targets
- **Progress Feedback**: Clear progress and status updates during operations
- **Splash Screen**: Elegant loading animation during startup

### 📦 Comprehensive File Operations
- **Flexible Compression**: Supports compressing single files or entire directories
- **Efficient Decompression**: Fast extraction of ZIP files to specified directories
- **Smart Path Handling**: Automatic processing of file paths and names
- **File Information Display**: Provides detailed information like file size and type

### 🌐 Multilingual Support
- **Interface Language Switching**: Users can toggle between English and Chinese interfaces
- **Localized Text**: Complete localization of all interactive elements
- **Language Preference Memory**: Remembers user's last language preference

## 🚀 Usage

### Compression
1. Click **Browse Files** to select a file or directory
2. Click **Browse** to choose an output location and specify a filename
3. Click **Compress File** to start the compression process
4. View the operation status in the output section

### Decompression
1. Click **Browse** to select a compressed ZIP file
2. Click **Browse** to choose an extraction directory
3. Click **Decompress File** to start the extraction process
4. View the operation status in the output section

### Folder Preview
- Click **Preview Folder** after selecting a directory to view its contents
- The preview dialog will display files, sizes, and last modified dates

## 🛠️ Technical Stack

- **Framework**: Electron.js
- **Runtime**: Node.js
- **UI**: HTML, CSS, JavaScript
- **Compression Library**: adm-zip
- **Build Tool**: electron-builder
- **Installer**: Inno Setup 6.5.0

## 📁 Project Structure

```
├── compatibility-app/    # Compatibility layer for different environments
├── dist/                 # Build output directory
├── fallback-app/         # Fallback application for error recovery
├── gui/                  # Graphical user interface files
│   ├── app.js            # Main UI application logic
│   ├── index.html        # Main HTML file
│   ├── lang.js           # Language configuration
│   └── renderer.js       # Renderer process code
├── installer/            # Precompiled installers
├── main-app/             # Core application logic
│   ├── bin/              # Application entry points
│   └── utils/            # Utility functions
├── shared/               # Shared components between modules
└── electron.js           # Main Electron process
```

## 💻 Development

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application in development mode:
   ```bash
   npm start
   ```
4. Package the application:
   ```bash
   npm run package
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or suggestions, please feel free to contact the project maintainer.

---

Made with ❤️ and robust error handling