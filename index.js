const repositories = [];
const itemsPerPage = 10;
let currentPage = 1;
let tempPage = 1;
const repositoryCache = {}; 

async function fetchGitHubRepos(username, reposPerPage = itemsPerPage, page = currentPage) {
  const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${page}`;
  const headers = {
    "Content-Type": "application/json",
  };

  try {

    if (repositoryCache[page]) {
        console.log(`Fetching data from cache for page ${page}`);
        return repositoryCache[page];
    }
  
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repositories. Status: ${
          response.status
        }, Response: ${await response.text()}`
      );
    }

    const repositoriesData = await response.json();
    repositoryCache[page] = repositoriesData;
    return repositoriesData;
  } catch (error) {
    throw new Error(`Error fetching repositories: ${error.message}`);
  }
}

const username = "johnpapa";

async function fetchAndStoreRepos(page = 1) {
  try {
    console.log(page);
    const repositoriesData = await fetchGitHubRepos(username, itemsPerPage, page);
    repositories.length = 0; // Clear existing repositories
    repositories.push(...repositoriesData);
    tempPage = page;
    console.log(repositories);
    // html logic starts from here
    displayDetails();
    showRepositories();
  } catch (error) {
    console.error("Failed to fetch repositories:", error.message);
  }
}

function showRepositories() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  console.log(startIndex,endIndex);
//   console.log(repositories);
  const repositoriesToShow = repositories.slice(startIndex, endIndex);

  const reposContainer = document.getElementById('reposContainer');
  reposContainer.innerHTML = '';

  repositoriesToShow.forEach(repoToShow => {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');

    const repoName = document.createElement('div');
    repoName.classList.add('repo-name');
    repoName.textContent = repoToShow.name;

    const repoDescription = document.createElement('div');
    repoDescription.classList.add('repo-description');
    repoDescription.textContent = repoToShow.description || 'No description available';

    const repoTags = document.createElement('div');
    repoTags.classList.add('repo-tags');

    repoToShow.topics.forEach(tag => {
      const tagButton = document.createElement('button');
      tagButton.classList.add('tag-button');
      tagButton.textContent = tag;
      repoTags.appendChild(tagButton);
    });

    repoCard.appendChild(repoName);
    repoCard.appendChild(repoDescription);
    repoCard.appendChild(repoTags);

    reposContainer.appendChild(repoCard);
  });
//   currentPage = page;
}

function displayDetails() {
  if (repositories.length === 0) {
    console.error("No repositories available.");
    return;
  }

  const profileImage = document.getElementById("profileImage");
  const userNameElement = document.getElementById("userName");
  const bioElement = document.getElementById("bio");
  const locationElement = document.getElementById("location");
  const twitterLinkElement = document.getElementById("twitterLink");
  const githubLinkElement = document.getElementById("githubLink");

  const user = repositories[0].owner;

  profileImage.src = user.avatar_url;
  userNameElement.textContent = user.login;

  bioElement.innerHTML = "Lives in America";

  locationElement.innerHTML = "Orlando";

  const githubUrl = document.getElementById("github");
  githubUrl.href = user.html_url;
  githubUrl.innerHTML = user.html_url;
}

// function fetchAndStoreNextRepos() {
//     if (currentPage < totalPages) {
//       currentPage++;
//       fetchAndStoreRepos(currentPage);
//     }
//   }
  
//   function fetchAndStorePrevRepos() {
//     if (currentPage > 1) {
//       currentPage--;
//       fetchAndStoreRepos(currentPage);
//     }
//   }
// document.getElementById('prevPageButton').addEventListener('click', fetchAndStorePrevRepos);
// document.getElementById('nextPageButton').addEventListener('click', fetchAndStoreNextRepos);


// Initial setup
fetchAndStoreRepos();


function fetchAndStorePrevPageRepos() {
    if (currentPage > 1) {
      fetchAndStoreRepos(currentPage - 1);
    }
  }
  
  function fetchAndStoreNextPageRepos() {
    const totalPages = 10;
    if (currentPage < totalPages) {
      fetchAndStoreRepos(currentPage + 1);
    }
  }
  
  // ... (existing code)
  
  // Add event listeners to the dynamically calculated prev and next buttons
  document.getElementById('prevPageButton').addEventListener('click', fetchAndStorePrevPageRepos);
  document.getElementById('nextPageButton').addEventListener('click', fetchAndStoreNextPageRepos);
  
  // ... (existing code)