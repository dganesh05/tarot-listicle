const header = document.querySelector('header');

const headerContainer = document.createElement('nav');
headerContainer.className = 'header-container';

const headerLeft = document.createElement('div');
headerLeft.className = 'header-left';

const headerTitle = document.createElement('h1');
headerTitle.textContent = 'Tarot Archetypes';

headerLeft.appendChild(headerTitle);

const headerRight = document.createElement('div');
headerRight.className = 'header-right';

// Only show home button if not on root page
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  const headerButton = document.createElement('button');
  headerButton.textContent = 'Home';
  headerButton.addEventListener('click', (event) => {
    window.location = '/';
  });
  headerRight.appendChild(headerButton);
}

headerContainer.appendChild(headerLeft);
headerContainer.appendChild(headerRight);
header.appendChild(headerContainer);