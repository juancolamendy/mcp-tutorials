# Google Analytics MCP Server (Python)

A Model Context Protocol (MCP) server that provides Google Analytics 4 data access through various tools and functions. This Python implementation offers the same functionality as the JavaScript version, allowing you to query Google Analytics data programmatically.

## Features

This MCP server provides the following tools:

- **query_analytics**: Query Google Analytics data with custom metrics, dimensions, and filters
- **get_realtime_data**: Get real-time Google Analytics data
- **get_traffic_sources**: Get traffic source analysis data
- **get_user_demographics**: Get user demographics data
- **get_page_performance**: Get page performance metrics
- **get_conversion_data**: Get conversion and event data
- **get_custom_report**: Get custom analytics report with flexible parameters

## Prerequisites

- Python 3.12 or higher
- uv
- Google Analytics 4 property
- Google Cloud service account with Analytics Data API access
- Service account JSON key file

## Installation

1. **Clone or navigate to the project directory:**
```bash
cd ga_mcp_py
```

2. **Install dependencies using uv:**
```bash
uv sync
```

3. **Create a `.env` file with your configuration:**
```bash
GOOGLE_APPLICATION_CREDENTIALS=api-calls-project-google_analytics_api_svc_acct.json
GA4_PROPERTY_ID=your-ga4-property-id
```

## Configuration

### Service Account Setup

1. **Create a Google Cloud project** (if you don't have one)
2. **Enable the Google Analytics Data API** in your Google Cloud Console
3. **Create a service account** with the following roles:
   - Analytics Data API Viewer
4. **Download the service account JSON key** and place it in the project directory
5. **Update the `.env` file** with the correct path to your service account file

### Environment Variables (.env file)

Create a `.env` file in the project directory with the following variables:

```env
GOOGLE_APPLICATION_CREDENTIALS=api-calls-project-google_analytics_api_svc_acct.json
GA4_PROPERTY_ID=your-ga4-property-id
```

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your service account JSON key file
- `GA4_PROPERTY_ID`: Your Google Analytics 4 property ID (required)

## Usage

### Running the Server

```bash
uv run main.py
```

The server will start and listen for MCP connections via stdio transport.

### Connecting to Claude Desktop

1. **Open Claude Desktop configuration:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. **Add the server configuration:**
```json
{
    "mcpServers": {
        "google-analytics": {
            "command": "uv",
            "args": [
                "--directory",
                "<path>/ga_mcp_py",
                "run",
                "main.py"
            ],
            "env": {
                "GOOGLE_APPLICATION_CREDENTIALS": "<path>/ga_mcp_js/svc_acct.json",
                "GA4_PROPERTY_ID": "12346789"
            }
        }
    }
}
```

3. **Restart Claude Desktop**

### Tool Examples


## API Reference

### Common Parameters

- **start_date/end_date**: Date range in YYYY-MM-DD format
- **metrics**: List of metric names (e.g., ["sessions", "users", "pageviews"])
- **dimensions**: List of dimension names (e.g., ["country", "city", "pagePath"])
- **filters**: Optional dimension filters for data filtering
- **order_bys**: Optional ordering configuration
- **limit**: Optional limit on number of rows returned

### Available Metrics

Common GA4 metrics include:
- `sessions`
- `users`
- `newUsers`
- `screenPageViews`
- `uniquePageviews`
- `averageSessionDuration`
- `bounceRate`
- `exitRate`
- `eventCount`
- `conversions`
- `conversionRate`
- `totalRevenue`
- `activeUsers` (real-time)

### Available Dimensions

Common GA4 dimensions include:
- `country`
- `city`
- `pagePath`
- `pageTitle`
- `sessionSource`
- `sessionMedium`
- `sessionCampaign`
- `userAgeBracket`
- `userGender`
- `eventName`
- `conversionEventName`

## Error Handling

The server returns JSON responses with error information when operations fail:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error scenarios:
- Missing service account file
- Invalid GA4 property ID
- API authentication issues
- Invalid date formats
- Unsupported metrics or dimensions

## Troubleshooting

### Service Account Issues
- Ensure the service account JSON file exists and the path in `.env` is correct
- Verify the service account has the correct permissions
- Check that the Analytics Data API is enabled

### Property ID Issues
- Verify your GA4 property ID is correct in the `.env` file
- Ensure the service account has access to the property
- Check that the property is a GA4 property (not Universal Analytics)

### Environment Configuration Issues
- Ensure the `.env` file exists in the project directory
- Check that `GOOGLE_APPLICATION_CREDENTIALS` points to a valid JSON file
- Verify `GA4_PROPERTY_ID` is set correctly
- Make sure there are no extra spaces or quotes in the `.env` file

### API Quota Issues
- Monitor your Google Cloud API quotas
- Implement rate limiting if needed
- Check the Google Cloud Console for quota usage

## Development

### Project Structure
```
ga_mcp_py/
├── main.py                          # Main MCP server implementation
├── pyproject.toml                   # Project dependencies and metadata
├── README.md                        # This file
├── .gitignore                       # Git ignore rules
├── .python-version                  # Python version specification
└── api-calls-project-google_analytics_api_svc_acct.json  # Service account key
```

### Adding New Tools

To add a new tool, use the `@mcp.tool()` decorator:

```python
@mcp.tool()
async def your_new_tool(param1: str, param2: int) -> str:
    """Description of your tool.
    
    Args:
        param1: Description of parameter 1
        param2: Description of parameter 2
    """
    # Your implementation here
    return json.dumps(result, indent=2)
```

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

This project is licensed under the same terms as the parent repository.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Google Analytics Data API documentation
3. Check MCP documentation at https://modelcontextprotocol.io/
