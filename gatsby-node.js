/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // adding attributes to MarkdownRemark node
  if (node.internal.type === `MarkdownRemark`) {
    // adding slug path
    const filePath = createFilePath({ node, getNode, trailingSlash: false });
    let slug = `/docs${filePath}`;
    // console.log(slug);
    createNodeField({
      name: `slug`,
      node,
      value: slug,
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const templateComponent = path.resolve(`src/templates/notes.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___title] }
        limit: 1000
      ) {
        nodes {
          frontmatter {
            title
            path
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  result.data.allMarkdownRemark.nodes.forEach(node => {
    const { frontmatter } = node;

    if (frontmatter) {
      const { path } = frontmatter;
      if (path) {
        createPage({
          path,
          component: templateComponent,
          context: {
            path,
          }, // additional data can be passed via context
        });
      }
    }
  });
};
