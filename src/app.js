const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const authentication = require('./authentication');

const sequelize = require('./sequelize');

const app = feathers();

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));
// set pug as view engine
app.set('views', 'src/views');
app.set('view engine', 'pug');
// Set up Plugins and providers
app.configure(hooks());
app.configure(sequelize);
app.configure(rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);

// custom mapping for user and contacts, conversations, etc.
app.use('/users/:userId/contacts', app.service('contacts'));
app.use('/users/:userId/conversations', app.service('conversations'));
app.use(
  '/users/:userId/conversations/:conversationId/messages',
  app.service('messages')
);

//	A	hook	that	updates	`data`	with	the	route	parameter
function mapUserIdToData(hook) {
  if (hook.data && hook.params.userId) {
    hook.data.userId = hook.params.userId;
  }
}

function mapConversationIdToData(hook) {
  if (hook.data && hook.params.conversationId) {
    hook.data.conversationId = hook.params.conversationId;
  }
}

mapHookFnToService(app, 'users/:userId/contacts', mapUserIdToData);
mapHookFnToService(app, '/users/:userId/conversations', mapUserIdToData);
mapHookFnToService(
  app,
  '/users/:userId/conversations/:conversationId/messages',
  mapConversationIdToData
);

// configure routes for signup verification and password reset
app.get('/login/:type/:token', (req, res) => {
  const { type, token } = req.params;
  if (type === 'verify') {
    res.render('verifySignup', { token });
  } else if (type === 'reset') {
    res.render('resetPassword', { token });
  }
});



// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;

function mapHookFnToService(app, url, hookFn) {
  app.service(url).hooks({
    before: {
      find(hook) {
        hook.params.query.userId = hook.params.userId;
        if (hook.params && hook.params.conversationId) {
          hook.params.query.conversationId = hook.params.conversationId;
        }
      },
      create: hookFn,
      update: hookFn,
      patch: hookFn
    }
  });
}
