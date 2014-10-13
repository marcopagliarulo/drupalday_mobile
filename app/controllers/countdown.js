$.logoCountdown.start();
var countDown = function(d, h, m , s, fn_tick, fn_end) {
	return {
		total_sec:d*86400+h*3600+m*60+s,
		timer:this.timer,
		set: function(d, h, m, s) {
			this.total_sec = parseInt(d)*8640+parseInt(h)*360+parseInt(m)*60+parseInt(s);
			this.time = {m:m,s:s};
			return this;
		},
		start: function() {
			var self = this;
			this.timer = setInterval( function() {
				if (self.total_sec) {
					self.total_sec--;
					self.time = { d : Math.floor(self.total_sec / 86400), h: Math.floor((self.total_sec % 86400) / 3600),  m :  Math.floor(((self.total_sec % 86400) % 3600) / 60), s:  Math.floor(((self.total_sec % 86400) % 3600) % 60) };
					fn_tick();
				}
				else {
					self.stop();
					fn_end();
				}
				}, 1000 );
			return this;
		},
		stop: function() {
			clearInterval(this.timer);
			this.time = {d: 0, h: 0, m:0,s:0};
			this.total_sec = 0;
			return this;
		},
	};
};
var startdate = new Date(Alloy.CFG.startdate).getTime();
var now = new Date().getTime();
var difference = Math.abs((startdate - now)/1000);
var my_timer = new countDown(Math.floor(difference / 86400), Math.floor((difference % 86400) / 3600),  Math.floor(((difference % 86400) % 3600) / 60), Math.floor(((difference % 86400) % 3600) % 60), 
	function()	{
		$.time.text = my_timer.time.d + " Giorni " + ("0" + my_timer.time.h).slice(-2) + ":" + ("0" + my_timer.time.m).slice(-2) + ":" + ("0" + my_timer.time.s).slice(-2);
	},
	function() {
		
	}
);
 
my_timer.start();
