# DataFort Inc.
### We, DataFort Inc. are  presenting a solution to solve a major problem in the cybersecurity space.
>Our App provides a way to set up a scalable private-permissioned blockchain that helps us retain data integrity while counteracting the redundant nature of blockchains by using a local Interplanetary File System that works on the Proof of Authority consensus mechanism, keeping efficiency and speed at heart.

>We provide a seamless yet secure way for private and government enterprises to store large amounts of data while preventing unauthorized access/ modifications. We believe that this would be especially useful for law enforcement, banking and healthcare where malicious actors looking to modify data can bring about catastrophic consequences.

## Repository Structure
•**Index.js**: This file contains the main backend source code responsible for rendering all project web pages.<br/>
•**views**: This directory contains HTML, CSS, and EJS files, each responsible for a specific web page's layout and functionality.<br/>
•**assets**: Folder with images used throughout the application<br/>
•**IPFS**: This directory contains configuration and files related to InterPlanetary File System (IPFS), enabling decentralized file storage and retrieval.<br/>
•**exonum_chain**: This directory contains configuration and files related to the Exonum Private Blockchain framework, facilitating secure and efficient blockchain transactions.<br/>

## Development
Technologies integrated to make the website up and running:-<br/>
<br/>
**Frontend**<br/>
•HTML5 (Hypertext Markup Language)<br/>
•CSS3 (Cascading Style Sheets)<br/>
•Embeded Javascript (EJS)<br/>
<br/>
**Backend**<br/>
•Node.js<br/>
•Express.js<br/>
<br/>
**Database Management**<br/>
•MongoDB<br/>
**Blockchain Frameworks**<br/>
•Exonum<br/>
**Decentralized Storage**<br/>
•IPFS (InterPlanetary File System)<br/>

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your computer (preferably version 14 or higher)
- npm (Node Package Manager) installed
- ### Firewall Configuration

To set up your firewall for both IPFS and Exonum, allow the following ports:

#### IPFS Firewall Rules

**Inbound Rules:**
- **TCP:**
  - 4001 (IPFS swarm)
  - 4002 (IPFS API)
  - 5001 (IPFS gateway)
  - 8080 (Optional, for additional services)
  
- **UDP:**
  - 4001 (IPFS swarm)

**Outbound Rules:**
- **TCP:**
  - 4001
  - 4002
  - 5001
  - 8080

- **UDP:**
  - 4001

#### Exonum Firewall Rules

**Inbound Rules:**
- **TCP:**
  - 8080 (Exonum API)
  - 8000 (Exonum node service, if applicable)
  - 8001 (Exonum websocket service, if applicable)

**Outbound Rules:**
- **TCP:**
  - 8080
  - 8000
  - 8001

## Instructions
### 1.	Clone the Repository:
```bash
git clone https://github.com/2SuryaPrakash/DataFort-Inc.
```
### 2. Install requirements
Ensure that your device has **npm** and **node** installed.
If it is installed,
```bash
npm install
```
This will install all the dependencies.
```bash
node index.js
```
This will start the server and the website will work on your localhost.<br/>
To view the website, go to:
```
https://localhost:3000
```

## Important Notes

Please read the separate README files located in the **[IPFS](./IPFS/ReadMe.md)** and **[exonum_chain](./exonum_chain/ReadMe.md)** directories for detailed instructions on setting up and configuring each component. These documents provide essential information tailored to help you work with IPFS and Exonum effectively.

