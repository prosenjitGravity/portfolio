export const environment = {
  production: true,
  enableLogging: false,
  logLevel: 'ERROR',

  // Developer Profile & Personal Details
  developer: {
    name: 'Prosenjit Paul',
    role: 'Full Stack Developer',
    headline: 'Software Developer @ SISL Infotech Pvt. Ltd. (NIC)',
    email: 'paul.prosenjitbit@gmail.com',
    location: 'Kolkata, West Bengal, India',
    focus: 'Node.js, Angular, .NET Core, Event-Driven Systems',
    experienceYears: '3+ Years',
    avatarUrl: 'public/assets/images/prosenjit_paul.jpg',
    resumeDownloadUrl: '/public/assets/files/Prosenjit_Resume.pdf',
    resumeFileName: 'Prosenjit_Resume_lts.pdf'
  },

  // Social & External Profile Links
  social: {
    github: {
      username: 'prosenjitGravity',
      profileUrl: 'https://github.com/prosenjitGravity',
      reposUrl: 'https://github.com/prosenjitGravity?tab=repositories',
      apiUrl: 'https://api.github.com/users/prosenjitGravity',
      userReposApiUrl: 'https://api.github.com/users/prosenjitGravity/repos?sort=updated&per_page=30'
    },
    linkedin: {
      profileUrl: 'https://www.linkedin.com/in/prosenjit-paul-0a82b6239',
      profileApiUrl: '/api/linkedin/profile'
    },
    competitiveProgramming: {
      leetcode: 'https://leetcode.com/u/prosenjitGravity',
      geeksforgeeks: 'https://www.geeksforgeeks.org/user/prosenjitgravity/',
      codechef: 'https://www.codechef.com/users/prosenjitgravity',
      neetcode: 'https://neetcode.io'
    }
  },

  // API Endpoints
  api: {
    githubUserUrl: 'https://api.github.com/users/prosenjitGravity',
    githubReposUrl: 'https://api.github.com/users/prosenjitGravity/repos?sort=updated&per_page=30',
    linkedinProfileApiUrl: '/api/linkedin/profile',
    ipGeoApiUrl: 'https://api.ipify.org?format=json'
  },

  // Backward compatibility pointers
  linkedinProfileApiUrl: '/api/linkedin/profile'
};
