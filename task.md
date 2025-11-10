---
title: "Express on Netlify"
description: "Learn about Express on our platform. Deploy Express apps as Netlify Functions and create your own serverless REST API."
---

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Key features

These features provide important benefits for Express apps, including ones built and deployed with Netlify.

- **Routing**. Express provides a robust routing API that allows you to perform complex routing tasks. With this API, you can split code on a per-route basis and not be strictly limited by Netlify's file-based routing for Functions.
- **Middleware**. Express provides a comprehensive set of HTTP utility methods and middleware that you can use to develop a robust API for your application.

## Netlify integration

Express apps on Netlify work because of [Netlify Functions](/build/functions/overview).

When you deploy an Express app on Netlify as serverless functions, you get to leverage all of the benefits of running on-demand, server-side code without having to run a dedicated server.

## Deploy an Express app on Netlify

This section demonstrates how to deploy an Express project on Netlify - either alongside a frontend app that uses another framework, or as a standalone Express app.

### Use Express with a frontend app

Before you begin, make sure you have [Node.js](https://nodejs.org/en/download) version 18.14.0 or later installed on your machine. Then, you can start a new project using Express.

1. Install the following dependencies. If your Express project uses JavaScript, you can exclude `@netlify/functions` and `@types/express`.

   ```bash
   npm i express serverless-http @netlify/functions @types/express
   ```

2. [Create a Netlify Function file](/build/functions/get-started#create-function-file) for either TypeScript or JavaScript. For example, you might create a function file called `api.ts`.
3. In the newly created file, write the function that will import Express and create a router object to handle routing. Here is an example:

   ```ts
   // YOUR_BASE_DIRECTORY/netlify/functions/api.ts

   import express, { Router } from "express";
   import serverless from "serverless-http";

   const api = express();

   const router = Router();
   router.get("/hello", (req, res) => res.send("Hello World!"));

   api.use("/api/", router);

   export const handler = serverless(api);
   ```

4. Add the following configuration in your `netlify.toml`:

   ```toml
   [functions]
     external_node_modules = ["express"]
     node_bundler = "esbuild"
   [[redirects]]
     force = true
     from = "/api/*"
     status = 200
     to = "/.netlify/functions/api/:splat"
   ```

   In the `redirects` section is a rewrite that enables Express to parse the URLs configured in your function file. In this example, Express can now successfully parse `/api`, which we configured above with `api.use('/api/', router);`.

   If you don't wish to add the rewrite, you might have to change the configuration in your function to specify the functions path, such as `api.use('/.netlify/functions/', router);`.

5. You can now use these routes in your frontend code. In the above example, you can access the `/hello` route at `/api/hello` and any other route that you might add at `/api/<slug>`.

6. Follow the steps below to [deploy your Express app](#deploy-your-express-app-with-netlify-cli).

### Use Express without a frontend

It's possible to deploy Express apps on Netlify without a frontend. If you do this, you can access the routes from other frontend apps deployed separately, just as you would with any other API endpoints. In this case, you might have to configure CORS to allow access to the routes from other domains.

To deploy an Express app without a frontend:

1. Follow the steps [documented above](#use-express-with-a-frontend-app) to install Express, create a Netlify Function with your routing code, and create a `netlify.toml` file to register the function and redirects required.
2. In the `netlify.toml` or the Netlify UI, set a placeholder [build command](/build/configure-builds/overview#build-settings) to ensure Netlify builds your functions. For example, the command could be `echo Building Functions`.
3. Follow the steps below to [deploy your Express app](#deploy-your-express-app-with-netlify-cli).

### Deploy your Express app with Netlify CLI

Whether you use Express with a frontend or not, the steps to deploy are the same.

You can [deploy your project from the command line](/deploy/create-deploys/#netlify-cli) using [Netlify CLI](/api-and-cli-guides/cli-guides/get-started-with-cli/).

1. To ensure you have the latest version of Netlify CLI installed, run this command from any directory in your terminal:

   ```bash
   npm install netlify-cli -g
   ```

2. In the directory for your project, run the following command to create a new Netlify site:

   ```bash
   netlify init
   ```

> **Tip - Didn't initialize a Git repository?:** When you run `netlify init` without initializing a Git repository first, the CLI prompts you to connect your local directory to GitHub. Follow the steps in your terminal to link your local directory with a remote repo in order to use continuous deployment for your site.

3. Follow the prompts to create your site, select a team if necessary, and optionally create a site name. If you already initialized a Git repository, you can authorize your Git provider and set your build command and directory.

4. If you used continuous deployment, your site is now published! To learn how to manually deploy a site, check out the [manual deploy docs](/api-and-cli-guides/cli-guides/get-started-with-cli/#manual-deploys).

## Limitations

1. Since Express apps are deployed as Netlify Functions, all of the [function limitations](/build/functions/overview#default-deployment-options) apply. This includes execution and memory limits.
2. It is not recommended to deploy Express apps as background or scheduled functions.

## More resources

- [Netlify Functions](/build/functions/overview)
- [Express documentation](https://www.expressjs.com/)
