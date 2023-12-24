from flask import Flask, jsonify, render_template, request
from backend import generate_image, get_story_and_image_prompts, continue_story

conversation_history = {}
last_image_prompts = {}

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game', methods=['GET', 'POST'])
def game():
    user_address = request.remote_addr

    # Continue story
    if request.method == 'POST':
        selected_prompt = request.json['selectedPrompt']
        previous_story = conversation_history.get(user_address, '')

        next_story, next_image_prompt_1, next_image_prompt_2 = continue_story(previous_story, selected_prompt)

        conversation_history[user_address] = next_story

    # New story
    elif request.method == 'GET':
        next_story, next_image_prompt_1, next_image_prompt_2 = get_story_and_image_prompts()
        conversation_history[user_address] = next_story

    # Generate and show image for the prompts
    image_response1 = generate_image(next_image_prompt_1)
    image_response2 = generate_image(next_image_prompt_2)
    image_url_1 = image_response1.data[0].url
    image_url_2 = image_response2.data[0].url

    last_image_prompts[user_address] = [next_image_prompt_1, next_image_prompt_2]

    return jsonify({
        'story': next_story,
        'images': [image_url_1, image_url_2],
        'imagePrompts': [next_image_prompt_1, next_image_prompt_2]
    })

if __name__ == '__main__':
    app.run(debug=True)
