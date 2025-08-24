import os, re, json, requests, openai
from bs4 import BeautifulSoup

SERP_KEY = os.getenv("SERP_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

def clean_string(text):
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text.strip())
    text = text.replace("\\", "")
    text = text.replace("#", " ")
    return re.sub(r"([^\w\s])\1*", r"\1", text)

def load_data_from_url(url):
    resp = requests.get(url, timeout=10)
    soup = BeautifulSoup(resp.content, "html.parser")
    for t in soup(["nav","aside","form","header","footer","script","style"]): t.decompose()
    return clean_string(soup.get_text())

def search_from_google(keyword):
    url = "https://google.serper.dev/search"
    payload = json.dumps({"q": keyword})
    headers = {"X-API-KEY": SERP_KEY, "Content-Type": "application/json"}
    r = requests.post(url, headers=headers, data=payload)
    return [res["link"] for res in r.json().get("organic", [])]

def generate_data_file(name):
    data = "\n".join(load_data_from_url(u) for u in search_from_google(name))
    with open("data.txt","w") as f: f.write(data)
    return data

def generate_prompt_file(name):
    prompt = f"""
    Write a system prompt for {name} based on highlights and characteristics...
    """
    resp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}],
        max_tokens=500
    )
    system_text = resp["choices"][0]["message"]["content"]

    with open("system.txt","w") as f: f.write(system_text)
    with open("user.txt","w") as f: f.write("Context...\n{query}")

if __name__ == "__main__":
    generate_data_file("tim cook")
    generate_prompt_file("tim cook")
