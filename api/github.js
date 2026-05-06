export default async function handler(req, res) {
  const { type } = req.query;
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  const headers = {
    'Authorization': `bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Vercel-Serverless-Function'
  };

  try {
    if (type === 'heatmap') {
      const query = `
        query {
          user(login: "abhishek09827") {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      return res.status(200).json(data);
    } 
    else if (type === 'stats') {
      const response = await fetch('https://api.github.com/users/abhishek09827', { headers });
      const data = await response.json();
      return res.status(200).json(data);
    }
    else if (type === 'repos') {
      const response = await fetch('https://api.github.com/users/abhishek09827/repos?per_page=100', { headers });
      const data = await response.json();
      return res.status(200).json(data);
    }
    
    return res.status(400).json({ error: 'Invalid type parameter' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch from GitHub API' });
  }
}
