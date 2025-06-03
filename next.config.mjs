import path from 'path';
/** @type {import('next').NextConfig} */

// Determine if the app is running on GitHub Pages
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

let assetPrefix = ''
let basePath = ''

if (isGithubActions) {
  // Replace '<repository-name>' with your repository name
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')
  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

const nextConfig = {
    output: 'export',
    // Optional: Add a trailing slash to all URLs.
    // trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
    assetPrefix: assetPrefix,
    basePath: basePath,
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
    images: {
        unoptimized: true,
    },
};
export default nextConfig;
