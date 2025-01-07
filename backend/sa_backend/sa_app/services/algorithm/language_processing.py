import openai
import json
from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def read_prompts(file_name):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.readlines()
    
def filter_response(response_content):
    json_start = response_content.find('{')
    json_end = response_content.rfind('}') + 1
    json_str = response_content[json_start:json_end]
    
    # Parse JSON
    response = json.loads(json_str)
    
    if response == "ERROR OCCURED":
        return "ERROR OCCURRED DURING RESPONSE GENERATION INVALID REQUEST"
    
    return response

def parse_response(response):
    return response
    
def initialize_context():
    prompts = read_prompts('prompts.txt')
    context = [
        {"role": "system", "content": prompts[0]},
        {"role": "system", "content": prompts[1]}
    ]
    return context

def get_emotion_analysis(user_input, emotion):
    context  = initialize_context()
    
    
    user_input = user_input + f" Emotion: {emotion}"
    context.append({"role": "user", "content": user_input})

    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=context
    )

    response_content = completion.choices[0].message.content
    context.append({"role": "assistant", "content": response_content})
    print("conversation_context updated")
    
    print(response_content)
    return response_content
    

if __name__ == '__main__':
    user_input = "Analysis result: {'surprise': '9.00%', 'happy': '8.92%', 'disgust': '8.35%', 'neutral': '7.93%', 'sad': '7.08%', 'calm': '34.73%', 'fear': '22.67%', 'angry': '1.32%'}"
    user_input1 = 'Provide me with python code do sum two numbers'
    result = get_emotion_analysis(user_input, 'happy')
    parse_response(result)