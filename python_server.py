from flask import Flask, request, jsonify
from check_skills import analyze_speech

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    txt = data.get("speech", "").strip()
    if not txt:
        return jsonify({"error": "Вам необхідно промовити спіч"}), 400
    try:
        analysis = analyze_speech(txt)
        return jsonify({"analysis": analysis})
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
    print("Python server started")