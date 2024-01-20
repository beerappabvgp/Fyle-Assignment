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
    if (items > 100) {
      items = 100;
    }
    const repositoriesData = await fetchGitHubRepos(username, reposPerPage = items, page);
    repositories.length = 0; 
    repositories.push(...repositoriesData);
    tempPage = page;
    console.log(repositories);
    displayDetails();
    showRepositories(items,repositories);
  } catch (error) {
    console.error("Failed to fetch repositories:", error.message);
  } finally {
    showLoadingIndicator(false);
  }
}

function searchRepositories() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.toLowerCase();
  
    const filteredRepositories = repositories.filter(repo => {
      const repoName = repo.name ? repo.name.toLowerCase() : '';
      const repoDescription = repo.description ? repo.description.toLowerCase() : '';
  
      return (
        repoName.includes(searchQuery) ||
        repoDescription.includes(searchQuery)
      );
    });
  
    showRepositories(tempItemsPerPage, filteredRepositories);
  }
  

function showRepositories(items,repositories) {
  const startIndex = 0;
  const endIndex = items;
  console.log(startIndex, endIndex);
  const repositoriesToShow = repositories.slice(startIndex, endIndex);

  const reposContainer = document.getElementById('reposContainer');
  reposContainer.innerHTML = '';

  repositoriesToShow.forEach(repoToShow => {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');

    const repoName = document.createElement('h1');
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
  const locationElement = document.getElementById("location");
  const twitterLinkElement = document.getElementById("twitterLink");
  const followers = document.getElementById("followers");
  const followingUrl = document.getElementById("following_url");

  const user = repositories[0].owner;
  console.log(user.avatar_url);
  profileImage.src = user.avatar_url;
  userNameElement.textContent = user.login;


  locationElement.innerHTML = "Orlando";

  const githubUrl = document.getElementById("github");
  githubUrl.href = user.html_url;
  githubUrl.innerHTML = user.html_url;
  followers.href = user.followers_url;
  followers.innerHTML = user.followers_url;
  followingUrl.href = user.following_url;
  followingUrl.innerHTML = user.following_url;
}


fetchAndStoreRepos();

function fetchAndStorePrevPageRepos() {
    if (tempPage > 1) {
      const prevPage = tempPage - 1;
  
      const cacheKey = Object.keys(repositoryCache).find(key => {
        return key === prevPage.toString();
      });
      console.log(`cacheKey`);
      if (cacheKey) {
        console.log(`entered inside cachekey, ${cacheKey}`);
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
        const cacheKey = Object.keys(repositoryCache).find(key => {
          return key === nextPage.toString();
        });
        console.log(`cacheKey`);
        if (cacheKey) {
          console.log(`entered inside cachekey, ${cacheKey}`);
          
          const tempItemsPerPage = repositoryCache[cacheKey].reposPerPage;
          fetchAndStoreRepos(parseInt(cacheKey), parseInt(tempItemsPerPage));
        }
        else {
          fetchAndStoreRepos(tempPage + 1, 10);
        }
      }
}



document.getElementById('prevPageButton').addEventListener('click', fetchAndStorePrevPageRepos);
document.getElementById('nextPageButton').addEventListener('click', fetchAndStoreNextPageRepos);
document.getElementById('older').addEventListener('click', fetchAndStorePrevPageRepos);
document.getElementById('newer').addEventListener('click', fetchAndStoreNextPageRepos);

const darkModeButtons = document.getElementById('darkModeButtons');

function toggleDarkMode(isDarkMode) {
  document.body.classList.toggle('dark-mode', isDarkMode);
}

toggleDarkMode(true);