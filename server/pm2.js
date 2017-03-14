var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1;
var maxMemory = process.env.WEB_MEMORY;

pm2.connect(function() {
	pm2.start({
	    script    : 'server.js',
	    name      : 'recipe',      
	    exec_mode : 'cluster',    
	    instances : instances,                   
	    max_memory_restart : maxMemory + 'M',   
	    env: {                            // If needed declare some environment variables
	       "NODE_ENV": "production",
	    },
	    post_update: ["npm install"]       
  	}, function(err) {
    
	    if (err) {
	    	return console.error('err while launching pm2', err.stack || err);
	    } 
    
	    // Display logs in standard output 
	    pm2.launchBus(function(err, bus) {
       		console.log('[PM2] Log streaming started');

	       	bus.on('log:out', function(packet) {
	       		console.log('[App:%s] %s', packet.process.name, packet.data);
	       	});
	        
		    bus.on('log:err', function(packet) {
		    	console.error('[App:%s][Err] %s', packet.process.name, packet.data);
		    });
	    
	    });
   	});
});