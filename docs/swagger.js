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
  definitions: {
    User: {
      _id: 'ObjectID',
      userId: '<userId>',
      username: '<random_username> (Lazy John)',
      avatarUrl:
        'https://api.dicebear.com/8.x/open-peeps/svg?seed=<random_username>&....',
    },
    Party: {
      creator: 'ObjectID',
      partyId: '<partyId>',
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      status: 'started',
      media: {
        isCustomMedia: false,
        url: 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/high.mp4',
      },
      settings: {
        allowPlayPause: true,
        allowSeek: false,
        allowRewindForward: false,
      },
    },
  }, // by default: empty object
};

const outputFile = './swagger.json';
const routes = [
  '../functions/auth/src/index.ts',
  '../functions/party/src/index.ts',
  '../functions/video/src/index.ts',
];

swaggerAutogen()(outputFile, routes, doc);
