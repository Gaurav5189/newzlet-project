import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("category/:slug", "routes/category.jsx"),
  route("search", "routes/search.jsx"),
  route("editorial", "routes/editorial.jsx"),
  route("privacy", "routes/privacy.jsx"),
  route("terms", "routes/terms.jsx"),
  route("contact", "routes/contact.jsx"),
  route("*", "routes/catchall.jsx")
];
