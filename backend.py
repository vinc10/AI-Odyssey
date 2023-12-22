import keys
from openai import OpenAI

client = OpenAI(api_key=keys.get_openai_key())

def generate_image(prompt):
  response = client.images.generate(
    model="dall-e-2",
    prompt=prompt,
    size="1024x1024",
    quality="standard",
    n=1,
  )
  return response

def get_story_and_image_prompts():    
    system_instruction = ( 
    "You are hosting a text adventure game. First, create a brief and exciting story. "
    "Then, ask the player to make a choice, but don't tell them what the choices are. "
    "Instead, clearly separate, provide two descriptions for images to be generated by DALL-E 3. "
    "These are the choices the player will have to make. "
    "Mark the beginning of the image descriptions with 'IMAGE PROMPT 1:' and 'IMAGE PROMPT 2:'. "
    "Make the image prompts very detailed. "
    )
    user_input = "Story about space exploration."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        #model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_input}
        ]
    )

    # Extract the content of the assistant's response
    content = response.choices[0].message.content
    print(content)
    
    # Now parse the content to extract the story and image prompts
    # Assuming the format of your response, adjust the parsing logic as needed
    story_end_idx = content.find("IMAGE PROMPT 1:")
    story = content[:story_end_idx].strip()
    
    image_prompt_1_start_idx = story_end_idx + len("IMAGE PROMPT 1:")
    image_prompt_1_end_idx = content.find("IMAGE PROMPT 2:")
    image_prompt_1 = content[image_prompt_1_start_idx:image_prompt_1_end_idx].strip()

    image_prompt_2_start_idx = image_prompt_1_end_idx + len("IMAGE PROMPT 2:")
    image_prompt_2 = content[image_prompt_2_start_idx:].strip()

    return story, image_prompt_1, image_prompt_2


def continue_story(previous_story, user_choice):
    system_instruction = ( 
    "You are hosting a text adventure game. Continue the narrative based on the user's last choice. "
    "Then, clearly separate, provide two descriptions for images to be generated by DALL-E 3 as new choices for the player. "
    "Mark the beginning of the image descriptions with 'IMAGE PROMPT 1:' and 'IMAGE PROMPT 2:'. "
    "Make the image prompts very detailed."
   )
 
    # Append the user's choice to the previous story
    updated_story = f"{previous_story}\n{user_choice}\n"

    # Call OpenAI API with the updated story
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": updated_story}
        ]
    )

    # Extract the content of the assistant's response
    content = response.choices[0].message.content

    # Parse the content to extract the next part of the story and new image prompts
    # This parsing logic will be similar to the one in get_story_and_image_prompts
    next_story_end_idx = content.find("IMAGE PROMPT 1:")
    next_story = content[:next_story_end_idx].strip()

    next_image_prompt_1_start_idx = next_story_end_idx + len("IMAGE PROMPT 1:")
    next_image_prompt_1_end_idx = content.find("IMAGE PROMPT 2:")
    next_image_prompt_1 = content[next_image_prompt_1_start_idx:next_image_prompt_1_end_idx].strip()

    next_image_prompt_2_start_idx = next_image_prompt_1_end_idx + len("IMAGE PROMPT 2:")
    next_image_prompt_2 = content[next_image_prompt_2_start_idx:].strip()

    return next_story, next_image_prompt_1, next_image_prompt_2