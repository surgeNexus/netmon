const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
// const path = require('path');
// const $ = require('jquery');

var dotenv = require('dotenv');
dotenv.config();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB);

const indexRoutes = require('./routes/index');
const settingsRoutes = require('./routes/settings');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
// app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist/')));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.use('/', indexRoutes);
app.use('/settings', settingsRoutes);
// app.use('/task',require('./routes/taskroute'));  

app.listen(process.env.PORT, () => {
  console.log(`NetMon Running on port ${process.env.PORT}`);
});