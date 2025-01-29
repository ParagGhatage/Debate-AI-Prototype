# Step 1: Import the necessary library
from huggingface_hub import InferenceClient

# Step 2: Initialize the API
api_key = "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"  # Replace with your actual Hugging Face API key
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"  # You can also use "gpt2"
client = InferenceClient(token=api_key)

# Step 3: Define a function to simulate a debate
def debate(user_input, side):
    # Set the system prompt to define the role of the AI
    system_prompt = "You are a skilled debater. You will argue that technology is " + ("making our lives better." if side == 'better' else "making our lives worse.") + " Respond to the user's statement."
    
    # Prepare the input for the model
    prompt = f"{system_prompt} User: {user_input}"
    
    response = client.chat.completions.create(
        model=model_id,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message['content']

# Step 4: Test the debate function
user_input = "Is technology making our lives better or worse?"
ai_side = 'better'  # Change this to 'worse' if you want the AI to argue that side
ai_response = debate(user_input, ai_side)
print("AI Response:", ai_response)
