# Google Analytics MCP Server

A Model Context Protocol (MCP) server implementation for Google Analytics 4 data access.

## Features

- Connect to Google Analytics 4 properties
- Access analytics data through MCP protocol
- Secure authentication using Google Service Accounts
- Environment-based configuration

## Prerequisites

- Node.js 18.0.0 or higher
- Google Analytics 4 property
- Google Cloud Service Account with Analytics permissions

## Setup

- **Install dependencies:**
```bash
npm install
```

- **Enable the Google Analytics Data API:**
    - In the Google Cloud Console, navigate to APIs & Services → Library
    - Search for "Google Analytics Data API"
    - Click on "Google Analytics Data API" from the search results
    - Click the "Enable" button
    - Wait for the API to be enabled (this may take a few moments)

- **Set up Google Analytics credentials:**
   - Create a service account in Google Cloud Console
        - In Google Cloud Console, go to IAM & Admin → Service Accounts
        - Click "Create Service Account"   
        - Service account name: Enter a descriptive name (e.g., "analytics-mcp-service")
        - Service account ID: This will auto-populate (e.g., "analytics-mcp-service")
        - Description: Add a description like "Service account for MCP Google Analytics integration"
        - Click "Create and Continue"
        - For basic analytics access, you can skip this step and click "Continue"
        - If you need project-level permissions, you can add roles like:
            - Viewer: For read-only access to the project
            - Analytics Viewer: If available
        - This step is optional for most use cases
        - Click "Done" to finish creating the service account
        - Click "Continue"    
    - In the Service Accounts list, find your newly created service account
        - Click on the service account name to open its details
        - Go to the "Keys" tab
        - Click "Add Key" → "Create new key"
        - Select "JSON" as the key type
        - Click "Create"
   - Download the JSON key file

- **Grant the service account access to your GA4 property:**
  - Get Service Account Email
    - From the JSON key file, copy the client_email value
    - It will look like: analytics-mcp-service@your-project.iam.gserviceaccount.com
  - Access Google Analytics 4 Admin
    - Go to Google Analytics
    - Select your GA4 property
    - Click the Admin gear icon (bottom left)
  - Add Service Account as User
    - In the Property column, click "Property access management"
    - Click the "+" button → "Add users"
    - Enter the service account email address
    - Select permissions:
        - Viewer: Read-only access (recommended for most MCP use cases)
        - Analyst: Can create and edit reports
        - Editor: Can modify property settings
        - Admin: Full administrative access
    - Click "Add"

- **Note the GA4 Property ID (you'll need this for your MCP server)**
    - Found in Admin → Property Settings → Property details
    - Format: 123456789 (a numeric ID) (It should be the numeric ID, not the "G-" measurement ID)

- **Configure environment variables:**
   Create a `.env` file with the following variables:
```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GA4_PROPERTY_ID=your-ga4-property-id
```

## Usage

### Start mode:
```bash
npm start
```

## Project Structure

```
ga_mcp_js/
├── index.js          # Main server entry point
├── package.json      # Project dependencies and scripts
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Dependencies

- `@google-analytics/data`: Google Analytics Data API client
- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
- `dotenv`: Environment variable management
- `google-auth-library`: Google authentication library

## Usage
```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "node",
      "args": ["<path>/ga_mcp_js/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "<path>/ga_mcp_js/svc_acct.json",
        "GA4_PROPERTY_ID": "12346789"
      }
    }
  }
}
```

Using the `.env` variable approach.
```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "<path>/ga_mcp_js"
    }
  }
}
```

This way, the server will run from the `ga_mcp_js` directory and automatically pick up your `.env` file.

## Queries
```
Show me sessions by country for last week

How many users are online now?

What are my top traffic sources?

Where are my users from?

What are my most visited pages?

Show me conversion events

Use the google-analytics mcp server to give me a full breakdown of my traffic metrics for march 2025
```

## License

MIT 