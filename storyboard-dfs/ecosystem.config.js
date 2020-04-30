const { DFS } = require("../config/pm2.config");
module.exports = {
  apps: [
    {
      name: "storyboard-dfs",
      script: "storyboard-dfs/app.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: DFS,
      ref: "origin/master",
      repo: "https://github.com/RayMoore/storyboard.git",
      path: "/home/ubuntu/app/storyboard",
      "post-deploy":
        "cd Storyboard-server/ && cnpm install && pm2 reload storyboard-dfs/ecosystem.config.js --env production",
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
