import openai
from dotenv import load_dotenv
import os 

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_speech(text):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Ти професійний суддя дебатів"},
            {"role": "user", "content": f"Проаналізуй цей спіч: {text}. Оціни його за такими критеріями: вправне формулювання тези, структурованість, послідовність і логічність висловлення думок, вагомість аргументів, дотримання теми, наявність доказів аргументів (приклади з життя, літератури і тд). В кінці визнач досвід гри в дебати користувача: Немає досвіду, Пів року, 1 рік, 1,5 і більше року."}
        ]
    )
    return response['choices'][0]['message']['content']

# speech = "..."
# analysis = analyze_speech(speech)
# print(analysis)

