import json

def summarize_with_groq(text):
    """
    Summarizes the text using the Groq API and structures it into a hierarchical multilevel knowledge graph.
    
    Args:
        text (str): The text to summarize.
    
    Returns:
        dict: The structured knowledge graph as a dictionary.
    """
    system_prompt = (
        "You are an assistant that structures data into a hierarchical multilevel knowledge graph in JSON format. "
        "The output must be a valid JSON object following this exact structure: "
        "{ \"name\": \"Root\", \"children\": [ { \"name\": \"Child 1\", \"children\": [ { \"name\": \"Grandchild 1\" }, { \"name\": \"Grandchild 2\" } ] }, { \"name\": \"Child 2\", \"children\": [ { \"name\": \"Grandchild 3\" }, { \"name\": \"Grandchild 4\" } ] } ] }. "
        "Ensure the JSON is properly formatted with correct delimiters. "
        "Do not include any explanations, code snippets, or text outside the JSON. Provide only the JSON output."
    )

    client = Groq(api_key=GROQ_API_KEY)
    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0,
            max_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
    except Exception as e:
        print(f"An error occurred while communicating with Groq API: {e}")
        return None

    summarized_output = completion.choices[0].message.content

    # Debugging: Print the summarized output to inspect its format
    print("Summarized Output:", summarized_output)
    print("Output Length:", len(summarized_output))  # Print the length of the output

    try:
        # Trim any leading/trailing whitespace
        summarized_output = summarized_output.strip()

        # Check for unexpected trailing characters
        if len(summarized_output) > 0:
            print("Last Character:", repr(summarized_output[-1]))

        # Attempt to parse the JSON string directly
        knowledge_graph = json.loads(summarized_output)
        
        # Remove any nodes with empty 'children'
        cleaned_graph = remove_empty_children(knowledge_graph)
        return cleaned_graph

    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        print("Attempting to clean the JSON output.")
        # Attempt to clean the JSON output
        cleaned_output = clean_json(summarized_output)
        try:
            knowledge_graph = json.loads(cleaned_output)
            # Remove any nodes with empty 'children'
            cleaned_graph = remove_empty_children(knowledge_graph)
            return cleaned_graph
        except json.JSONDecodeError as ex:
            print(f"Failed to decode cleaned JSON: {ex}")
            return None

def clean_json(json_str):
    """
    Cleans the JSON string by removing any trailing characters after the valid JSON ends.
    
    Args:
        json_str (str): The JSON string to clean.
    
    Returns:
        str: The cleaned JSON string.
    """
    try:
        # Find the position where the JSON ends
        open_braces = 0
        for i, char in enumerate(json_str):
            if char == '{':
                open_braces += 1
            elif char == '}':
                open_braces -= 1
                if open_braces == 0:
                    return json_str[:i+1]
        return json_str  # Return original if no imbalance is found
    except Exception as e:
        print(f"Error while cleaning JSON: {e}")
        return json_str

def remove_empty_children(node):
    """
    Recursively removes nodes with empty 'children' lists.
    
    Args:
        node (dict): The current node in the knowledge graph.
    
    Returns:
        dict or None: The cleaned node or None if the node has no children.
    """
    if 'children' in node:
        # Recursively clean child nodes
        cleaned_children = []
        for child in node['children']:
            cleaned_child = remove_empty_children(child)
            if cleaned_child:
                cleaned_children.append(cleaned_child)
        if cleaned_children:
            node['children'] = cleaned_children
            return node
        else:
            # Remove the 'children' key if it's empty
            del node['children']
            return node if 'name' in node else None
    return node
