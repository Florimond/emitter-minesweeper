var emitterService = function (emitterKey, baseChannel)
{
	var emitter = window.emitter.connect({	secure: true });	
	return	{
		subscribe: function(channel, handler, last=0) {
			defaultHandler = handler;
			emitter.subscribe({
				key: emitterKey,
				channel: baseChannel + "/" + channel,
				last});
			emitter.on("message", function(msg) {handler(msg.asObject());});
			},
		publish: function(type, data, channel) {
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
		
	}		
}