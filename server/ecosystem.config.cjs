module.exports = {
  apps: [
    {
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster',
      instances: 'max',
      name: 'Urban Clean API Server',
      script: './build/src/server.js',
    },
  ],
};
