# GitHub User Activity CLI

A simple **command-line interface (CLI)** tool to fetch and display a GitHub user's recent activity in a human-readable format.

This project uses the **GitHub API** to fetch the latest events of a user and aggregates them by type for easy viewing.

---

## Project URL

[https://roadmap.sh/projects/github-user-activity](https://roadmap.sh/projects/github-user-activity)

---

## Features

- Fetches recent GitHub activity for any public user.
- Aggregates events like:
  - Pushes
  - Pull requests (opened, closed, merged)
  - Issues
  - Stars
  - Forks
  - Releases
  - Comments
- Outputs human-readable summaries in the terminal.

---

## Requirements

- Node.js >= 18
- A GitHub Personal Access Token (PAT) stored in `secrets.json`:

```json
{
  "PAT": "your_personal_access_token_here"
}
```

## Usage

```bash
# Make the script executable
chmod +x index.js

# Run the CLI with a GitHub username
./index.js <github-username>
```

**Example:**

```bash
./index.js sourav-s-b
```

**Sample Output:**

```
- Pushed 3 commits to sourav-s-b/20_MitsFits_ACM-NEXUS-26
- Opened 1 pull request in sourav-s-b/20_MitsFits_ACM-NEXUS-26
- Starred sourav-s-b/20_MitsFits_ACM-NEXUS-26 1 time
```

---

## Notes

- The GitHub API returns a **maximum of 100 events** per user.
- Only public repositories and events are accessible without additional authentication.
- This CLI aggregates events of the same type in sequence for better readability.

---

## License

This project is licensed under the GPL-3.0 License.
