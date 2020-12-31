const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');

var dotenv = require('dotenv');
dotenv.config();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/netmon');

const indexRoutes = require('./routes/index');
const settingsRoutes = require('./routes/settings');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.use('/', indexRoutes);
app.use('/settings', settingsRoutes);

app.listen(process.env.PORT, () => {
  console.log('listening on *:3000');
});