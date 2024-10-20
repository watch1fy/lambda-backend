import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: 'json' };

const app = express();
const PORT = 8001;

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => console.log('Serving docs at port 8001'));
