var emitterService = function (emitterKey, baseChannel)
{
	var emitter = null;	
	return	{
		connect: function(username, handler, callback)
        {
			emitter = window.emitter.connect({username: username}, function() {
				callback()
				emitter.on("connect", handler)
			})//{/*host: "10.0.0.20"*//*, secure: true*/ });
		},
		me: function(handler){
			emitter.on("me", handler)
			emitter.me()
		},
		subscribe: function(channel, handler, last=0)
        {
			defaultHandler = handler;
			emitter.subscribe({
				key: emitterKey,
				channel: baseChannel + "/" + channel,
				last});
			emitter.on("message", function(msg) {console.log(msg);handler(msg.asObject());});
			//emitter.on("message", function(msg) {console.log(msg)});
		},
		unsubscribe: function(channel)
        {
			console.log("Unsubscribe from " + channel)
			emitter.unsubscribe({
				key: emitterKey,
				channel: baseChannel + "/" + channel});
		},
		publish: function(type, data, channel)
        {
			emitter.publish({
				key: emitterKey,
				channel: baseChannel + "/" + channel,
				ttl: 3600,
				message: JSON.stringify({
					type: type,
					data: data
				})
			});
		},
		presence: function(channel, handler) {
			console.log("presence init ")
			emitter.on("presence", function(msg) {handler(msg)});
			//emitter.on("presence", function(msg) {console.log(msg)})
			
			emitter.presence({
				key: emitterKey,
				channel: baseChannel + "/" + channel,
				status: true,
				changes: true
			})
		}
		
	}		
}