import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("category/:slug", "routes/category.jsx"),
  route("search", "routes/search.jsx"),
  route("*", "routes/catchall.jsx")
];
