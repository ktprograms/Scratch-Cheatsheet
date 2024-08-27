# Scratch Cheatsheet

A collection of FAQs and Mini Projects for the [Scratch programming language](https://scratch.mit.edu).

*Optional* logging of hint accesses, using GitHub issues to store logs.

The build provided in [`dist/`](dist/) is usable standalone, but without logging. See [Content Only](#content-only) for this deploy method. If you wish to configure logging to GitHub, see the instructions in [Configure & Build](#configure--build).

## Content Only

For now, this repository [ktprograms/scratch-cheatsheet](https://github.com/ktprograms/scratch-cheatsheet) is configured to serve the distribution build on [this GitHub pages link](https://ktprograms.github.io/scratch-cheatsheet/).

### Hosting Your Own

- **Locally**: Any standard web server will work.
- **On GitHub Pages**: If you Fork this repository on GitHub, the workflow will run automatically and deploy the build.

## Configure & Build

### Configuring

Provide the `CONFIG_GITHUB_AUTH_TOKEN` and `CONFIG_GITHUB_REPO` constants in [`src/main.js`](src/main.js).

### Running for development

```sh
npm install
npm run dev
```

### Building for Production & Deploying

```sh
npm run build
```

Serve the `dist/` folder with a local web server of your choice, or on a static file hosting service.

**NOTE**: You will *not* be able to use GitHub pages, because the presence of the GitHub token in the production build will get flagged by GitHub and disable the token. (If this happens, simply regenerate the token, and then host elsewhere).
