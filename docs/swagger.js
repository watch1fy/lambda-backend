import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '0.1.0', // by default: '1.0.0'
    title: 'Watchify Backend API Docs', // by default: 'REST API'
    description:
      'This is the docs for watchify backend API created using serverless framework and AWS lambda functions.', // by default: ''
  },
  host: 'localhost:8000', // by default: 'localhost:3000'
  basePath: '', // by default: '/'
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: '', // Tag name
      description: '', // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {}, // by default: empty object
  definitions: {}, // by default: empty object
};

const outputFile = './swagger.json';
const routes = [
  '../.build/functions/auth/src/index.js',
  '../.build/functions/party/src/index.js',
  '../.build/functions/video/src/index.js',
];

swaggerAutogen()(outputFile, routes, doc);
