<p align="center">
    <img src="https://github.com/user-attachments/assets/4fc00e69-441f-40f4-98b1-41369ebb13a6" align="center">
</p>
<p align="center"><h1 align="center">SCHEDULO</h1></p>
<p align="center">
	<em>Time, streamlined. Events, organized. Effortlessly.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/mukundsolanki/Schedulo?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/mukundsolanki/Schedulo?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/mukundsolanki/Schedulo?style=default&color=0080ff" alt="repo-top-language">
</p>
<br>

## 🔗 Table of Contents

- [📍 Overview](#-overview)
- [📋 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [☑️ Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
- [🔰 Contributing](#-contributing)
- [🎗 License](#-license)

---

## 📍 Overview

Schedulo is a modern event scheduling platform designed to streamline the creation and management of events, interviews, and meetings. With Schedulo, users can:

- Create events (online or offline) with ease.
- Generate and share unique registration links for participants.
- Allow participants to register and select time slots based on their preferences.
- Approve or reject registrations and send confirmation emails automatically.
- Access insightful analytics, including participant statistics and event summaries, via an intuitive dashboard.

Whether you're organizing a corporate meeting, a community event, or personal interviews, Schedulo provides an efficient, user-friendly solution for all scheduling needs.

## 📋 Features

- **User-Friendly Interface**: Simplified and sleek UI for seamless event creation and management.
- **Customizable Events**: Configure events for multiple time slots and preferences.
- **Automated Emails**: Send confirmation emails to approved participants.
- **Real-Time Insights**: Access dashboards to track registrations, approvals, and participant counts.
- **Open Source**: Fully customizable and open to contributions from the community.

## 🛠 Tech Stack

Schedulo leverages modern web technologies to deliver a robust and scalable solution:

- **Frontend**:
  <img src="https://img.shields.io/badge/Next.js-000000.svg?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=flat" alt="Shadcn.ui">

- **Backend**:
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000.svg?style=flat&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Redis-DC382D.svg?style=flat&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=mongodb&logoColor=white" alt="MongoDB">

- **Email Service**:
  <img src="https://img.shields.io/badge/EmailJS-F4B400.svg?style=flat&logo=google&logoColor=white" alt="EmailJS">

---

## 📁 Project Structure

```sh
└── Schedulo/
    ├── .github
    │   ├── ISSUE_TEMPLATE
    │   └── pull_request_template.md
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── README.md
    ├── backend
    │   ├── .gcloudignore
    │   ├── .gitignore
    │   ├── app.js
    │   ├── app.yaml
    │   ├── controllers
    │   ├── db
    │   ├── middlewares
    │   ├── models
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   ├── server.js
    │   └── services
    ├── offline_template.html
    ├── online_template.html
    └── schedulo-frontend
        ├── .gitignore
        ├── README.md
        ├── components.json
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── postcss.config.mjs
        ├── public
        ├── src
        ├── tailwind.config.ts
        └── tsconfig.json
```

---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with Schedulo, ensure your runtime environment meets the following requirements:

- **Frontend env:**
    ```
        NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
        NEXT_PUBLIC_EMAILJS_SERVICE_ID=emailjs_service_id
        NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ONLINE=emailjs_online_template_id
        NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_OFFLINE=emailjs_offline_template_id
        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=emailjs_public_key
        NEXT_DEPLOYED_URL=http://localhost:3000
    ```

- **Backend env:**
    ```
        PORT=5000
        MONGO_URI=mongodb://localhost:27017
        JWT_SECRET=your_jwt_secret
    ```

---

### ⚙️ Installation

Install Schedulo locally using one of the following methods:

1. Clone the Schedulo repository:
```sh
❯ git clone https://github.com/mukundsolanki/Schedulo
```

2. Navigate to the project directory:
```sh
❯ cd Schedulo
```

3. Install dependencies for both frontend and backend:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ cd schedulo-frontend && npm install
❯ cd backend && npm install
```

4. Start the application (frontend and backend simultaneously):

```sh
❯ cd schedulo-frontend && npm start
❯ cd backend && npm start
```
---

## 🔰 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

- **💬 [Join the Discussions](https://github.com/mukundsolanki/Schedulo/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/mukundsolanki/Schedulo/issues)**: Submit bugs found or log feature requests for the `Schedulo` project.
- **💡 [Submit Pull Requests](https://github.com/mukundsolanki/Schedulo/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

## Contributors: 
<br>
<p align="left">
   <a href="https://github.com{/mukundsolanki/Schedulo/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=mukundsolanki/Schedulo">
   </a>
</p>

---

### 🎗 License

This project is protected under the [MIT LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.
