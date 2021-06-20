import React from "react";
import Suggestions from "./Suggestions";
import Blogs from "./Blogs";
import WriteBlog from "./WriteBlog";
const eventRoutes = [
  {
    path: "/admin/blogs/suggestions",
    name: "Suggestions",
    sidebarVisible: true,
    Component: Suggestions,
  },
  {
    path: "/admin/blogs",
    name: "Blogs",
    sidebarVisible: true,
    Component: Blogs,
  },
  {
    path: "/admin/blogs/write/",
    name: "Write a blog",
    sidebarVisible: true,
    Component: WriteBlog,
  },
];

export default eventRoutes;
