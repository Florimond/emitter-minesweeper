var emitterService = function (emitterKey, baseChannel)
{
	var emitter = window.emitter.connect({	secure: true });
	//var publishChannel = "";
	var defaultHandler = null;
	var handlers = {};
	function dispatch(msg)
	{
		var msg = msg.asObject();
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
		subscribe: function(channel, handler, last=0) {
			defaultHandler = handler;
			emitter.subscribe({
				key: emitterKey,
				channel: baseChannel + "/" + channel,
				last});
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