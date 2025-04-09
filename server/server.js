const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Create config server
const configServer = jsonServer.create();
// Create API server
const apiServer = jsonServer.create();

// Add middleware
configServer.use(cors());
apiServer.use(cors());

// Function to load all JSON files from a directory
const loadJsonFiles = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    console.warn(`Directory not found: ${directoryPath}`);
    return {};
  }

  const files = fs.readdirSync(directoryPath);
  return files.reduce((acc, file) => {
    if (path.extname(file).toLowerCase() === ".json") {
      const filePath = path.join(directoryPath, file);
      try {
        const data = require(filePath);
        return { ...acc, ...data };
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return acc;
      }
    }
    return acc;
  }, {});
};

// Function to save data back to JSON files
const saveJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving to ${filePath}:`, error);
    return false;
  }
};

// Load databases from respective directories
const configDbPath = path.join(__dirname, "config");
const apiDbPath = path.join(__dirname, "api");

const configDb = loadJsonFiles(configDbPath);
const apiDb = loadJsonFiles(apiDbPath);

// Create routers
const configRouter = jsonServer.router(configDb);
const apiRouter = jsonServer.router(apiDb);

// Add middleware to handle data persistence
configRouter.render = (req, res) => {
  // Save changes after each write operation
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Get the entity name from the URL path
    const urlParts = req.url.split('/');
    const entity = urlParts[1]; // This will get the resource name from the URL

    if (entity) {
      const db = configRouter.db.getState();
      const entityData = db[entity];
      
      if (entityData !== undefined) {
        const filePath = path.join(configDbPath, `${entity}.json`);
        saveJsonFile(filePath, { [entity]: entityData });
      }
    }
  }
  res.jsonp(res.locals.data);
};

apiRouter.render = (req, res) => {
  // Handle POST requests to ensure sequential IDs
  if (req.method === 'POST') {
    const db = apiRouter.db.getState();
    // Get the entity name from the URL path
    const urlParts = req.url.split('/');
    const entity = urlParts[1];
    
    if (entity && db[entity]) {
      const items = db[entity];
      // Filter numeric IDs and find the max
      const numericIds = items
        .map(item => parseInt(item.id))
        .filter(id => !isNaN(id));
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      
      // Set the new sequential ID
      res.locals.data.id = (maxId + 1).toString();
    }
  }

  // Save changes after each write operation
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const urlParts = req.url.split('/');
    const entity = urlParts[1];

    if (entity) {
      const db = apiRouter.db.getState();
      const entityData = db[entity];
      
      if (entityData !== undefined) {
        const filePath = path.join(apiDbPath, `${entity}.json`);
        saveJsonFile(filePath, { [entity]: entityData });
      }
    }
  }
  res.jsonp(res.locals.data);
};

// Add default middlewares
configServer.use(jsonServer.defaults());
apiServer.use(jsonServer.defaults());

// Error handling
configServer.use((err, req, res, next) => {
  console.error("Config Server Error:", err.stack);
  res.status(500).json({ error: "Internal Config Server Error" });
});

apiServer.use((err, req, res, next) => {
  console.error("API Server Error:", err.stack);
  res.status(500).json({ error: "Internal API Server Error" });
});

// Use routers
configServer.use(configRouter);
apiServer.use(apiRouter);

// Start servers
const CONFIG_PORT = 5001;
const API_PORT = 5002;

configServer.listen(CONFIG_PORT, () => {
  console.log(`Configuration server is running on port ${CONFIG_PORT}`);
  console.log(`Config files loaded from: ${configDbPath}`);
});

apiServer.listen(API_PORT, () => {
  console.log(`API server is running on port ${API_PORT}`);
  console.log(`API files loaded from: ${apiDbPath}`);
});
