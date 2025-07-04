import os
import asyncio

from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio

from dotenv import load_dotenv

load_dotenv()

# init instructions
instructions = """
# ROLE:
You are an expert SEO researcher and strategist.
# GOAL:
Answer user questions about SEO research and strategy.
Follow the instructions provided to you.
# INSTRUCTIONS:
- use DataForSEO mcp tool to get the keywords releated data such as search volume, cpc, competition, etc.
- if the user asks about something that is not related to SEO, say that you don't know
"""

# init mcp server
server = MCPServerStdio(  
    command= "npx",
    args=[
        '-y',
        'dataforseo-mcp-server'
    ],
    env={
        'DATAFORSEO_USERNAME': os.getenv('DATAFORSEO_USERNAME'),
        'DATAFORSEO_PASSWORD': os.getenv('DATAFORSEO_PASSWORD')
    }
)

agent = Agent('google-gla:gemini-2.0-flash', system_prompt=instructions, mcp_servers=[server])

# main loop
async def main():
    print('Starting agent...')
    async with agent.run_mcp_servers():
        message_history = []
        while True:
            current_message = input('You: ')
            if current_message == 'quit':
                break
            result = await agent.run(current_message, message_history=message_history)
            message_history = result.all_messages()
            print(result.output)

if __name__ == "__main__":
    asyncio.run(main())