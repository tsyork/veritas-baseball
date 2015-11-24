/**
 * Created by timyork on 8/25/15.
 */
var plan = require('flightplan');

var username = 'deploy';
var startFile = 'app.js';

// configuration
plan.target('staging', [
  {
    host: '70.35.194.136',
    username: username,
    agent: process.env.SSH_AUTH_SOCK,
    appName: 'gcvanalytics_stg',
    foreverUid: 'stg'
  }
]);

plan.target('dev', [
  {
    host: '70.35.194.136',
    username: username,
    agent: process.env.SSH_AUTH_SOCK,
    appName: 'gcvanalytics_dev',
    foreverUid: 'dev'
  }
]);

plan.target('production', [
  {
    host: '70.35.194.136',
    username: username,
    agent: process.env.SSH_AUTH_SOCK,
    appName: 'gcvanalytics',
    foreverUid: 'prod'
  },
//add in another server if you have more than one
// {
//   host: '104.131.93.216',
//   username: username,
//   agent: process.env.SSH_AUTH_SOCK
// }
]);

// run commands on localhost
plan.local(function(local) {
  // uncomment these if you need to run a build on your machine first
  // local.log('Run build');
  // local.exec('gulp build');

  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('git ls-files', {silent: true});
  // rsync files to all the destination's hosts
  local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
  var appName = plan.runtime.options.appName;
  var foreverUid = plan.runtime.options.foreverUid;
  var tmpDir = appName+'-' + new Date().getTime();

  remote.log('Move folder to root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');
  remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {user: username});

  remote.log('Reload application');
  remote.sudo('ln -snf ~/' + tmpDir + ' ~/'+appName, {user: username});
  remote.exec('forever stop '+foreverUid, {failsafe: true});
  remote.exec('cd /home/'+username+'/'+appName+' && source .env && forever start --uid "'+foreverUid+'" --append '+startFile);
});