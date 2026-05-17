<div align="center">
<img width="1200" height="475" alt="Kawaii Swap Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌈 Kawaii Swap

> An AI-powered bridge application combining Google Gemini AI with blockchain technology via Thirdweb

**[Live Demo](https://kawaii-swap.vercel.app)** • **[AI Studio App](https://ai.studio/apps/57a1ed1c-a92c-4d0a-82a0-ca4c0036e8d6)**

## 📋 Overview

Kawaii Swap is a modern web application that integrates:
- **AI Capabilities**: Google Gemini API for intelligent features
- **Blockchain Integration**: Thirdweb for decentralized bridge functionality
- **Modern Stack**: Built with TypeScript, React, and smart contracts in Solidity

This project serves as a template for building AI-powered decentralized applications.

## ✨ Features

- 🤖 **AI-Powered Interactions**: Leverages Google Gemini API for intelligent features
- 🔗 **Blockchain Bridge**: Thirdweb integration for cross-chain operations
- 📱 **Responsive Design**: Beautiful and intuitive user interface
- 🚀 **Production-Ready**: Deployed on Vercel with optimal performance
- 💻 **Developer-Friendly**: Well-structured TypeScript codebase

## 🛠️ Tech Stack

| Technology | Purpose | Coverage |
|-----------|---------|----------|
| **TypeScript** | Core application logic | 92.9% |
| **CSS** | Styling & design | 4.2% |
| **Solidity** | Smart contracts | 2.1% |
| **HTML** | Markup structure | 0.8% |

### Key Dependencies
- Google Gemini AI API
- Thirdweb SDK
- Node.js runtime

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/WillBillyGit/kawaii-swap.git
   cd kawaii-swap
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy or create a `.env.local` file in the project root
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

## 🌐 Deployment

The project is configured for deployment on **Vercel**:

1. Push your changes to GitHub
2. Connect the repository to Vercel
3. Add your `GEMINI_API_KEY` environment variable in Vercel settings
4. Deploy automatically or manually

**Live App**: https://kawaii-swap.vercel.app

## 📚 Project Structure

```
kawaii-swap/
├── components/       # React components
├── pages/           # Next.js pages
├── contracts/       # Solidity smart contracts
├── styles/          # CSS stylesheets
├── public/          # Static assets
├── .env.local       # Environment variables (local)
└── package.json     # Dependencies & scripts
```

## 🔐 Security

- Never commit `.env.local` files with sensitive API keys
- Use environment variables for all secrets
- Add `.env.local` to `.gitignore` (should be default)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Submit pull requests with improvements
- Suggest new features

## 📄 License

This project is open source. Check the LICENSE file for details.

## 🙋 Support

- **Issues**: Use [GitHub Issues](https://github.com/WillBillyGit/kawaii-swap/issues) for bug reports and features
- **Documentation**: Check the [Thirdweb Docs](https://docs.thirdweb.com/) and [Gemini API Docs](https://ai.google.dev/)

## 🎉 Acknowledgments

Built from the [Google AI Studio Repository Template](https://github.com/google-gemini/aistudio-repository-template)