{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "dist",

  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ],

  "headers": [
    {
      "source": "/assets/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
