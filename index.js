const repositories = [];
const itemsPerPage = 10;
let currentPage = 1;
let tempPage = 1;
let tempItemsPerPage = 10;
const repositoryCache = {}; 
const totalPages = 9;
const loadingIndicator = document.getElementById('loadingIndicator');


async function fetchGitHubRepos(username, reposPerPage = itemsPerPage, page = currentPage) {
    console.log(`from api ${itemsPerPage}`);
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${page}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const cacheKey = `${page}_${reposPerPage}`;
  
    try {
      if (repositoryCache[page] && repositoryCache[page].reposPerPage === reposPerPage) {
        console.log(`Fetching data from cache for page ${page}`);
        return repositoryCache[page].data;
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
      repositoryCache[page] = {
        reposPerPage,
        data: repositoriesData,
      };
  
      return repositoriesData;
    } catch (error) {
      throw new Error(`Error fetching repositories: ${error.message}`);
    }
  }




const username = "johnpapa";

async function fetchAndStoreRepos(page = 1 , items) {
  try {
    showLoadingIndicator(true); 
    console.log(`from fetchAndStoreRepos , ${page}`);
    const repositoriesData = await fetchGitHubRepos(username, reposPerPage = items, page);
    repositories.length = 0; // Clear existing repositories
    repositories.push(...repositoriesData);
    tempPage = page;
    console.log(repositories);
    // html logic starts from here
    displayDetails();
    showRepositories(items);
  } catch (error) {
    console.error("Failed to fetch repositories:", error.message);
  } finally {
    showLoadingIndicator(false);
  }
}

function showRepositories(items) {
  const startIndex = 0;
  const endIndex = items;
  console.log(startIndex, endIndex);
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
}

function showLoadingIndicator(show) {
    if (show) {
      loadingIndicator.style.display = 'block';
    } else {
      loadingIndicator.style.display = 'none';
    }
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

// Initial setup
fetchAndStoreRepos();

function fetchAndStorePrevPageRepos() {
    if (tempPage > 1) {
      const prevPage = tempPage - 1;
  
      // Find matching cache key in repositoryCache
      const cacheKey = Object.keys(repositoryCache).find(key => {
        return key === prevPage.toString();
      });
      console.log(`cacheKey`);
      if (cacheKey) {
        console.log(`entered inside cachekey, ${cacheKey}`);
        // Split the cache key into pageNumber and itemsPerPage
        const tempItemsPerPage = repositoryCache[cacheKey].reposPerPage;
        fetchAndStoreRepos(parseInt(cacheKey), parseInt(tempItemsPerPage));
      }
      else {
        fetchAndStoreRepos(tempPage - 1, 10);
      }
    }
  }

function fetchAndStoreNextPageRepos() {

    if (tempPage < totalPages) {
        const nextPage = tempPage + 1;
    
        // Find matching cache key in repositoryCache
        const cacheKey = Object.keys(repositoryCache).find(key => {
          return key === nextPage.toString();
        });
        console.log(`cacheKey`);
        if (cacheKey) {
          console.log(`entered inside cachekey, ${cacheKey}`);
          // Split the cache key into pageNumber and itemsPerPage
          const tempItemsPerPage = repositoryCache[cacheKey].reposPerPage;
          fetchAndStoreRepos(parseInt(cacheKey), parseInt(tempItemsPerPage));
        }
        else {
          fetchAndStoreRepos(tempPage + 1, 10);
        }
      }
}

function fetchOlder() {

}
function fetchNewer() {

}

// Add event listeners to the hardcoded buttons
document.getElementById('prevPageButton').addEventListener('click', fetchAndStorePrevPageRepos);
document.getElementById('nextPageButton').addEventListener('click', fetchAndStoreNextPageRepos);

document.getElementById('older').addEventListener('click', fetchOlder);
document.getElementById('newer').addEventListener('click', fetchNewer);
