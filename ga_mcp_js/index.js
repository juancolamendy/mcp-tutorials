import dotenv from 'dotenv';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import pkg from '@google-analytics/data';
import { z } from 'zod';
const BetaAnalyticsDataClient = pkg.BetaAnalyticsDataClient || pkg.v1beta.BetaAnalyticsDataClient || pkg.default.BetaAnalyticsDataClient;
import { GoogleAuth } from 'google-auth-library';

// Load environment variables
dotenv.config();

let analyticsClient = null;

async function initGA4Client() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is required');
  }
  
  if (!process.env.GA4_PROPERTY_ID) {
    throw new Error('GA4_PROPERTY_ID environment variable is required');
  }

  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  analyticsClient = new BetaAnalyticsDataClient({ authClient: auth });
}

async function queryAnalytics(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { startDate, endDate, metrics, dimensions, filters } = params;
  
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    metrics: metrics.map(metric => ({ name: metric })),
    dimensions: dimensions.map(dimension => ({ name: dimension })),
    ...(filters && { dimensionFilter: filters })
  });

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function getRealtimeData(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { dimensions = ['country'], metrics = ['activeUsers'] } = params;
  
  const [response] = await analyticsClient.runRealtimeReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dimensions: dimensions.map(dimension => ({ name: dimension })),
    metrics: metrics.map(metric => ({ name: metric }))
  });

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function getTrafficSources(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { startDate, endDate } = params;
  
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
      { name: 'sessionCampaign' }
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'users' },
      { name: 'newUsers' },
      { name: 'bounceRate' }
    ]
  });

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function getUserDemographics(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { startDate, endDate } = params;
  
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'userAgeBracket' },
      { name: 'userGender' },
      { name: 'country' },
      { name: 'city' }
    ],
    metrics: [
      { name: 'users' },
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'averageSessionDuration' }
    ]
  });

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function getPagePerformance(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { startDate, endDate } = params;
  
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'uniquePageviews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'exitRate' }
    ]
  });

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function getConversionData(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { startDate, endDate } = params;
  
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'eventName' },
      { name: 'conversionEventName' }
    ],
    metrics: [
      { name: 'eventCount' },
      { name: 'conversions' },
      { name: 'conversionRate' },
      { name: 'totalRevenue' }
    ]
  });

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function getCustomReport(params) {
  if (!analyticsClient) {
    throw new Error('Google Analytics client not initialized. Please check your environment variables.');
  }
  
  const { startDate, endDate, metrics, dimensions, filters, orderBys, limit } = params;
  
  const request = {
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    metrics: metrics.map(metric => ({ name: metric })),
    dimensions: dimensions.map(dimension => ({ name: dimension })),
    ...(filters && { dimensionFilter: filters }),
    ...(orderBys && { orderBys }),
    ...(limit && { limit })
  };

  const [response] = await analyticsClient.runReport(request);

  return {
    rows: response.rows || [],
    totals: response.totals || [],
    rowCount: response.rowCount || 0
  };
}

async function initMCPServer() {
  try {
    await initGA4Client();
    
    // Create an MCP server
    const server = new McpServer({
      name: "google-analytics-mcp",
      version: "1.0.0"
    });

    // Register tools using the new pattern
    server.registerTool("query_analytics",
      {
        title: "Query Analytics",
        description: "Query Google Analytics data with custom metrics, dimensions, and filters",
        prompts: ["Show me sessions by country for last week"],
        inputSchema: {
          startDate: z.string(),
          endDate: z.string(),
          metrics: z.array(z.string()),
          dimensions: z.array(z.string()),
          filters: z.any().optional()
        }
      },
      async (params) => {
        try {
          const result = await queryAnalytics(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    server.registerTool("get_realtime_data",
      {
        title: "Get Realtime Data",
        description: "Get real-time Google Analytics data",
        prompts: ["How many users are online now?"],
        inputSchema: {
          dimensions: z.array(z.string()).optional(),
          metrics: z.array(z.string()).optional()
        }
      },
      async (params) => {
        try {
          const result = await getRealtimeData(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    server.registerTool("get_traffic_sources",
      {
        title: "Get Traffic Sources",
        description: "Get traffic source analysis data",
        prompts: ["What are my top traffic sources?"],
        inputSchema: {
          startDate: z.string(),
          endDate: z.string()
        }
      },
      async (params) => {
        try {
          const result = await getTrafficSources(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    server.registerTool("get_user_demographics",
      {
        title: "Get User Demographics",
        description: "Get user demographics data",
        prompts: ["Where are my users from?"],
        inputSchema: {
          startDate: z.string(),
          endDate: z.string()
        }
      },
      async (params) => {
        try {
          const result = await getUserDemographics(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    server.registerTool("get_page_performance",
      {
        title: "Get Page Performance",
        description: "Get page performance metrics",
        prompts: ["What are my most visited pages?"],
        inputSchema: {
          startDate: z.string(),
          endDate: z.string()
        }
      },
      async (params) => {
        try {
          const result = await getPagePerformance(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    server.registerTool("get_conversion_data",
      {
        title: "Get Conversion Data",
        description: "Get conversion and event data",
        prompts: ["Show me conversion events"],
        inputSchema: {
          startDate: z.string(),
          endDate: z.string()
        }
      },
      async (params) => {
        try {
          const result = await getConversionData(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    server.registerTool("get_custom_report",
      {
        title: "Get Custom Report",
        description: "Get custom analytics report with flexible parameters",
        prompts: ["Show me a custom report of new users by city for the last 30 days"],
        inputSchema: {
          startDate: z.string(),
          endDate: z.string(),
          metrics: z.array(z.string()),
          dimensions: z.array(z.string()),
          filters: z.any().optional(),
          orderBys: z.any().optional(),
          limit: z.number().optional()
        }
      },
      async (params) => {
        try {
          const result = await getCustomReport(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }]
          };
        }
      }
    );

    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error('Server initialization error:', error.message);
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

initMCPServer().catch((error) => {
  console.error('Unhandled error:', error.message);
  console.error('Full error:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}); 