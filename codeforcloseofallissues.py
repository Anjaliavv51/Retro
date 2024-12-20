import requests

# Replace these with your details
GITHUB_TOKEN = "your_personal_access_token"
REPO_OWNER = "Anjaliavv51"
REPO_NAME = "Retro"

# GitHub API URL
API_URL = f"https://api.github.com/repos/Anjaliavv51/Retro/issues"

# Set up headers for authentication
headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# Fetch open issues
response = requests.get(API_URL, headers=headers, params={"state": "open"})
if response.status_code == 200:
    issues = response.json()
    for issue in issues:
        issue_number = issue["number"]
        close_url = f"{API_URL}/{issue_number}"
        close_response = requests.patch(close_url, headers=headers, json={"state": "closed"})
        if close_response.status_code == 200:
            print(f"Issue #{issue_number} closed.")
        else:
            print(f"Failed to close issue #{issue_number}: {close_response.status_code}")
else:
    print(f"Failed to fetch issues: {response.status_code}")
