from pydantic_ai import Agent
from dotenv import load_dotenv
from datetime import datetime
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

load_dotenv()

instructions = """
# ROLE:
You are a helpful agent.
# GOAL:
Answer user questions about the time and weather in a city.
Follow the instructions provided to you.
# INSTRUCTIONS:
- use the 'get_weather' and the 'get_current_time' tools to find the weather and current time
- if the user asks about something else, say that you don't know
- if the tools return an error, inform the user 
- if the tools are successful, present the report clearly
"""
agent = Agent('google-gla:gemini-2.0-flash', system_prompt=instructions)

@agent.tool_plain
def get_weather(city: str) -> dict:
    """Retrieves the current weather report for a specified city.

    Args:
        city (str): The name of the city for which to retrieve the weather report.

    Returns:
        dict: status and result or error msg.
    """
    city_normalized = city.lower().replace(" ", "")
    city_weather_report = {
        "newyork": {
            "status": "success",
            "report": "The weather in New York is sunny with a temperature of 45 F.",
        },
        "london": {
            "status": "success",
            "report": "It's cloudy in London with a temperature of 55 F.",
        },
        "tokyo": {
            "status": "success",
            "report": "Tokyo is experiencing light rain and a temperature of 72 F.",
        },
    }    
    if city_normalized in city_weather_report:
        return city_weather_report[city_normalized]
    else:
        return {
            "status": "error",
            "error_message": f"Weather information for '{city}' is not available.",
        }

@agent.tool_plain
def get_current_time(city: str) -> dict:
    """Returns the current time in a specified city.

    Args:
        city (str): The name of the city for which to retrieve the current time.

    Returns:
        dict: status and result or error msg.
    """
    city_timezones = {
        "newyork": "America/New_York",
        "london": "Europe/London",
        "tokyo": "Asia/Tokyo",
    }
    city_normalized = city.lower().replace(" ", "")
    if city_normalized in city_timezones:
        tz_identifier = city_timezones[city_normalized]
    else:
        return {
            "status": "error",
            "error_message": (
                f"Sorry, I don't have timezone information for {city}."
            ),
        }

    tz = ZoneInfo(tz_identifier)
    now = datetime.now(tz)
    report = (
        f'The current time in {city} is {now.strftime("%Y-%m-%d %H:%M:%S %Z%z")}'
    )
    return {"status": "success", "report": report}

def main():
    message_history = []
    while True:
        current_message = input('You: ')
        if current_message == 'quit':
            break
        result = agent.run_sync(current_message, message_history=message_history)
        message_history = result.all_messages()
        print(result.output)

if __name__ == "__main__":
    main()