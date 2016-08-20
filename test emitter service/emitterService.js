var emitterService = function (emitterKey, baseChannel)
{
	//var publishChannel = "";
	var defaultHandler = null;
	var handlers = {};
	function dispatch(msg)
	{
		if (msg.type in handlers)
		{
			handlers[msg.type](msg);
		}
		else
		{
			defaultHandler(msg);
		}
	}
	
	return	{
        /*setPublishChannel: function(channel){publishChannel = baseChannel + "/" + channel;},*/
		setDefaultHandler: function(handler) {defaultHandler = handler;},
		setHandler: function(msgType, handler) {
			handlers[type] = handler;
			},
		subscribe: function(channel, handler) {
			defaultHandler = handler;
			emitter.subscribe({
				key: emitterKey,
				channel: baseChannel + "/" + channel
				});
			emitter.on("message", dispatch);
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