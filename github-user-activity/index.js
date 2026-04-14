let username = process.argv[2];

if (!username) {
  console.log("Please provide a valid username");
  process.exit(1);
}


console.log(`Fetching activity for ${username}...`);

async function getActivity(user) {
  const response = await fetch(`https://api.github.com/users/${username}/events`, {
    headers: {
      'User-Agent': 'hmmmm'
    }
  });
  if (!response.ok) {
    if (response.status === 404) {
      console.log("User not found");
    } else {
      console.error(`Error: ${response.status}${response.statusText}`);
    }
    process.exit(1);
  }
  const data = await response.json();
  return data;
}

const activity = await getActivity(username);

if (activity.length === 0) {
  console.log("No activity found");
  process.exit(0);
}
activity.forEach(event => {

  let action;
  switch (event.type) {
    case 'PushEvent':
      const hasCommits = event.payload.commits && event.payload.commits.length > 0;
      if (hasCommits) {
        action = `Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
      } else {
        action = `Pushed to ${event.repo.name}`;
      }
      break;
    case "WatchEvent":
      action = `Starred ${event.repo.name}`;
      break;
    case "PullRequestEvent":
      action = `Created a pull request ${event.repo.name}`;
      break;
    case "IssuesEvent":
      action = `Created an issue ${event.repo.name}`;
      break;
    case "IssueCommentEvent":
      action = `Commented on an issue ${event.repo.name}`;
      break;
    case "PullRequestReviewCommentEvent":
      action = `Commented on a pull request ${event.repo.name}`;
      break;
    case "ForkEvent":
      action = `Forked ${event.repo.name}`;
      break;
    case "CreateEvent":
      action = `Created ${event.repo.name}`;
      break;
    case "DeleteEvent":
      action = `Deleted ${event.repo.name}`;
      break;
    case "ReleaseEvent":
      action = `Released ${event.repo.name}`;
      break;
    case "MemberEvent":
      action = `Added a member to ${event.repo.name}`;
      break;
    case "PublicEvent":
      action = `Made ${event.repo.name} public`;
      break;
    default:
      action = `Performed ${event.type} on ${event.repo.name}`;
      break;
  }
  console.log(`- ${action}`);
});


