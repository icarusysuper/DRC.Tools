export default {
  "publicPath": "/static/",
  "proxy": {
    "/api": {
      "target": "http://localhost:8001",
      "changeOrigin": true,
    }
  },
}