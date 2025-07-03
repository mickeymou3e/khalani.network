const path = require('path')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const { print: printSchema } = require('graphql')
const fs = require('fs')

const loadedFiles = loadFilesSync(path.join(__dirname, '../schema/**/*.graphql'))
const typeDefs = mergeTypeDefs(loadedFiles)
const printedTypeDefs = printSchema(typeDefs)

fs.writeFileSync('schema.graphql', printedTypeDefs)